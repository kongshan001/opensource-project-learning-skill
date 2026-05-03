#!/usr/bin/env bash
# 评估是否需要迭代 skill
# 分析 feedback/坑点记录.md，决定是否触发迭代流程

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(dirname "$SCRIPT_DIR")"
FEEDBACK_FILE="$SKILL_DIR/feedback/坑点记录.md"
PENDING_FILE="$SKILL_DIR/feedback/pending_issues.md"

echo "🔍 评估是否需要迭代 skill..."
echo ""

# 检查是否有新的坑点
check_new_issues() {
    if [ ! -f "$FEEDBACK_FILE" ]; then
        echo "❌ 坑点记录文件不存在: $FEEDBACK_FILE"
        return 1
    fi

    # 统计待处理的坑点数量
    pending_count=$(grep -c "🔄 待处理" "$FEEDBACK_FILE" 2>/dev/null || echo "0")

    echo "📊 当前待处理坑点数: $pending_count"

    if [ "$pending_count" -eq 0 ]; then
        echo "✅ 没有待处理的坑点，无需迭代"
        return 1
    fi

    return 0
}

# 提取待处理的坑点
extract_pending_issues() {
    echo ""
    echo "📋 待处理的坑点:"
    echo ""

    # 提取待处理的坑点标题和严重程度
    awk '/^### / {
        title = $0
        getline; if ($0 ~ /\*\*状态\*\*.*🔄 待处理/) {
            print title
        }
    }' "$FEEDBACK_FILE"

    echo ""
}

# 检查是否达到迭代阈值
should_trigger_iteration() {
    local high_count=0
    local medium_count=0
    local any_count=0

    # 统计各级别的坑点
    high_count=$(grep -c "🔴 高" "$FEEDBACK_FILE" 2>/dev/null || echo "0")
    medium_count=$(grep -c "🟡 中" "$FEEDBACK_FILE" 2>/dev/null || echo "0")
    any_count=$(grep -c "🔄 待处理" "$FEEDBACK_FILE" 2>/dev/null || echo "0")

    echo "📊 优先级分布:"
    echo "  🔴 高优先级: $high_count"
    echo "  🟡 中优先级: $medium_count"
    echo "  🟢 低优先级: $((any_count - high_count - medium_count))"
    echo ""

    # 迭代触发条件：
    # 1. 有1个或以上高优先级坑点
    # 2. 有3个或以上中优先级坑点
    # 3. 有5个或以上任何坑点
    if [ "$high_count" -ge 1 ]; then
        echo "✋ 触发迭代: 检测到高优先级坑点"
        return 0
    elif [ "$medium_count" -ge 3 ]; then
        echo "✋ 触发迭代: 检测到3个或以上中优先级坑点"
        return 0
    elif [ "$any_count" -ge 5 ]; then
        echo "✋ 触发迭代: 检测到5个或以上坑点"
        return 0
    else
        echo "⏸️ 暂不触发迭代: 坑点数量未达到阈值"
        return 1
    fi
}

# 创建迭代工作区
create_iteration_workspace() {
    local iteration_num
    iteration_num=$(find "$SKILL_DIR/iteration" -maxdepth 1 -type d -name "round-*" 2>/dev/null | wc -l)
    iteration_num=$((iteration_num + 1))

    local workspace_dir="$SKILL_DIR/iteration/round-$iteration_num"

    echo ""
    echo "📁 创建迭代工作区: round-$iteration_num"
    mkdir -p "$workspace_dir"

    # 复制待处理坑点到工作区
    awk '/^### / {
        title = $0
        in_block = 1
        content = ""
    }
    in_block {
        content = content $0 "\n"
    }
    /\*\*状态\*\*.*🔄 待处理/ {
        print content > "'"$workspace_dir"'/problems.md"
        in_block = 0
    }' "$FEEDBACK_FILE"

    echo "✓ 工作区创建完成: $workspace_dir"
    echo "$workspace_dir"
}

# 主流程
main() {
    echo "==================================="
    echo "  Skill 自迭代评估系统"
    echo "==================================="
    echo ""

    if ! check_new_issues; then
        exit 0
    fi

    extract_pending_issues

    if should_trigger_iteration; then
        workspace_dir=$(create_iteration_workspace)

        echo ""
        echo "🚀 下一步操作:"
        echo "  1. 查看问题: cat $workspace_dir/problems.md"
        echo "  2. 生成技术方案: 调用 solution-generator agent"
        echo "  3. 评估方案: 调用 solution-evaluator agent"
        echo ""

        # 输出 JSON 格式供程序调用
        echo "{"
        echo "  \"should_iterate\": true,"
        echo "  \"iteration_num\": $iteration_num,"
        echo "  \"workspace\": \"$workspace_dir\","
        echo "  \"pending_count\": $pending_count"
        echo "}"
    else
        echo ""
        echo "💡 建议: 继续收集用户反馈，等坑点数量达到阈值后再迭代"

        echo "{"
        echo "  \"should_iterate\": false,"
        echo "  \"pending_count\": $pending_count"
        echo "}"
    fi
}

main "$@"
