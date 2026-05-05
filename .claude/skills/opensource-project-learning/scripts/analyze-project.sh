#!/usr/bin/env bash
# 项目基本信息收集脚本
# 此脚本自动收集开源项目的基本信息，用于学习阶段1

set -euo pipefail

PROJECT_DIR="${1:-.}"

echo "📋 正在收集项目基本信息..."
echo ""

# 检查项目目录是否存在
if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ 错误: 目录 $PROJECT_DIR 不存在"
    exit 1
fi

cd "$PROJECT_DIR"

# 1. 项目名称
PROJECT_NAME=$(basename "$PWD")
echo "📦 项目名称: $PROJECT_NAME"

# 2. 项目类型检测
echo ""
echo "🔍 检测项目类型..."

if [ -f "package.json" ]; then
    PROJECT_TYPE="Node.js/JavaScript"
    echo "   ✓ 检测到 Node.js 项目"
    if grep -q "\"type\":\s*\"module\"" package.json; then
        echo "   ✓ ES Module 模式"
    fi
elif [ -f "requirements.txt" ] || [ -f "setup.py" ] || [ -f "pyproject.toml" ]; then
    PROJECT_TYPE="Python"
    echo "   ✓ 检测到 Python 项目"
elif [ -f "go.mod" ]; then
    PROJECT_TYPE="Go"
    echo "   ✓ 检测到 Go 项目"
elif [ -f "Cargo.toml" ]; then
    PROJECT_TYPE="Rust"
    echo "   ✓ 检测到 Rust 项目"
elif [ -f "pom.xml" ]; then
    PROJECT_TYPE="Java (Maven)"
    echo "   ✓ 检测到 Java Maven 项目"
elif [ -f "build.gradle" ]; then
    PROJECT_TYPE="Java (Gradle)"
    echo "   ✓ 检测到 Java Gradle 项目"
else
    PROJECT_TYPE="未知类型"
    echo "   ⚠ 无法自动检测项目类型"
fi

# 3. 项目规模统计
echo ""
echo "📊 项目规模统计..."

if command -v find >/dev/null 2>&1; then
    TOTAL_FILES=$(find . -type f -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/dist/*" -not -path "*/build/*" | wc -l)
    echo "   总文件数: $TOTAL_FILES"

    if command -v wc >/dev/null 2>&1; then
        # 根据项目类型统计代码行数
        case "$PROJECT_TYPE" in
            "Node.js/JavaScript"|"Node.js/TypeScript")
                CODE_LINES=$(find . -type f \( -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" \) -not -path "*/node_modules/*" -not -path "*/dist/*" | xargs wc -l 2>/dev/null | tail -1 | awk '{print $1}' || echo "N/A")
                ;;
            "Python")
                CODE_LINES=$(find . -type f -name "*.py" -not -path "*/venv/*" -not -path "*/__pycache__/*" | xargs wc -l 2>/dev/null | tail -1 | awk '{print $1}' || echo "N/A")
                ;;
            "Go")
                CODE_LINES=$(find . -type f -name "*.go" | xargs wc -l 2>/dev/null | tail -1 | awk '{print $1}' || echo "N/A")
                ;;
            "Rust")
                CODE_LINES=$(find . -type f -name "*.rs" | xargs wc -l 2>/dev/null | tail -1 | awk '{print $1}' || echo "N/A")
                ;;
            *)
                CODE_LINES="N/A"
                ;;
        esac
        echo "   代码行数: $CODE_LINES"
    fi
fi

# 4. Git 信息
echo ""
echo "🔄 Git 信息..."

if [ -d ".git" ]; then
    if command -v git >/dev/null 2>&1; then
        GIT_REMOTE=$(git remote get-url origin 2>/dev/null || echo "无远程仓库")
        echo "   远程仓库: $GIT_REMOTE"

        GIT_BRANCH=$(git branch --show-current 2>/dev/null || echo "未知")
        echo "   当前分支: $GIT_BRANCH"

        GIT_COMMITS=$(git rev-list --count HEAD 2>/dev/null || echo "N/A")
        echo "   总提交数: $GIT_COMMITS"

        GIT_CONTRIBUTORS=$(git shortlog -sn 2>/dev/null | wc -l)
        echo "   贡献者数: $GIT_CONTRIBUTORS"
    fi
else
    echo "   ⚠ 不是 Git 仓库"
fi

# 5. 依赖信息
echo ""
echo "📦 依赖信息..."

case "$PROJECT_TYPE" in
    "Node.js/JavaScript"|"Node.js/TypeScript")
        if [ -f "package.json" ]; then
            DEPS=$(grep -c '\"' package.json || echo "0")
            echo "   依赖数量: 约 $DEPS 个"
        fi
        ;;
    "Python")
        if [ -f "requirements.txt" ]; then
            DEPS=$(grep -v "^#" requirements.txt | grep -v "^$" | wc -l)
            echo "   依赖数量: $DEPS 个"
        fi
        ;;
    "Go")
        if [ -f "go.mod" ]; then
            DEPS=$(grep -c "^require" go.mod || echo "0")
            echo "   依赖数量: $DEPS 个"
        fi
        ;;
esac

# 6. 文档检查
echo ""
echo "📚 文档检查..."

DOCS_FOUND=false

if [ -f "README.md" ] || [ -f "README.rst" ] || [ -f "README.txt" ]; then
    echo "   ✓ README 文件存在"
    DOCS_FOUND=true
fi

if [ -f "CONTRIBUTING.md" ]; then
    echo "   ✓ 贡献指南存在"
    DOCS_FOUND=true
fi

if [ -d "docs" ]; then
    echo "   ✓ 文档目录存在"
    DOCS_FOUND=true
fi

if [ "$DOCS_FOUND" = false ]; then
    echo "   ⚠ 未找到文档文件"
fi

# 7. 测试检查
echo ""
echo "🧪 测试检查..."

TESTS_FOUND=false

if [ -d "tests" ] || [ -d "test" ] || [ -d "__tests__" ]; then
    echo "   ✓ 测试目录存在"
    TESTS_FOUND=true
fi

case "$PROJECT_TYPE" in
    "Node.js/JavaScript"|"Node.js/TypeScript")
        if grep -q "\"test\"" package.json; then
            echo "   ✓ 测试脚本已配置"
            TESTS_FOUND=true
        fi
        ;;
    "Python")
        if [ -f "pytest.ini" ] || [ -f "setup.py" ] || grep -q "pytest" requirements.txt 2>/dev/null; then
            echo "   ✓ pytest 配置存在"
            TESTS_FOUND=true
        fi
        ;;
esac

if [ "$TESTS_FOUND" = false ]; then
    echo "   ⚠ 未发现测试配置"
fi

# 8. CI/CD 检查
echo ""
echo "🔄 CI/CD 检查..."

if [ -d ".github" ] || [ -f ".gitlab-ci.yml" ] || [ -f "Jenkinsfile" ]; then
    echo "   ✓ CI/CD 配置存在"
else
    echo "   ⚠ 未发现 CI/CD 配置"
fi

# 9. 许可证
echo ""
echo "⚖️ 许可证..."

if [ -f "LICENSE" ] || [ -f "LICENSE.txt" ] || [ -f "COPYING" ]; then
    LICENSE_FILE=$(ls | grep -i license | head -1)
    if [ -n "$LICENSE_FILE" ]; then
        LICENSE_TYPE=$(head -5 "$LICENSE_FILE" | grep -i "MIT\|Apache\|GPL\|BSD" | head -1 || echo "自定义")
        echo "   ✓ 许可证文件: $LICENSE_FILE"
        echo "   类型: $LICENSE_TYPE"
    fi
else
    echo "   ⚠ 未找到许可证文件"
fi

echo ""
echo "✅ 项目信息收集完成！"
echo ""
echo "💡 下一步建议："
echo "   1. 阅读 README.md 了解项目概述"
echo "   2. 查看 package.json/requirements.txt 等配置文件"
echo "   3. 探索 src/ 或主要源代码目录"
echo "   4. 运行项目（如果支持）"
echo ""
