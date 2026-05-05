#!/usr/bin/env bash
# 项目结构分析脚本
# 此脚本生成项目的目录结构报告

set -euo pipefail

PROJECT_DIR="${1:-.}"
MAX_DEPTH="${2:-2}"

echo "🏗️ 正在分析项目结构..."
echo ""

# 检查项目目录是否存在
if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ 错误: 目录 $PROJECT_DIR 不存在"
    exit 1
fi

cd "$PROJECT_DIR"

echo "📁 项目目录结构（深度 $MAX_DEPTH）:"
echo ""

# 生成目录树（如果 tree 命令可用）
if command -v tree >/dev/null 2>&1; then
    tree -L "$MAX_DEPTH" -I 'node_modules|dist|build|.git|__pycache__|venv' --dirsfirst
else
    # fallback: 使用 find 命令
    find . -maxdepth "$MAX_DEPTH" -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/dist/*" -not -path "*/build/*" | sort | sed 's|[^/]*/| |g'
fi

echo ""
echo "📊 主要目录分析:"
echo ""

# 分析主要目录
for dir in src lib app cmd pkg internal docs tests test config public; do
    if [ -d "$dir" ]; then
        FILE_COUNT=$(find "$dir" -type f | wc -l)
        DIR_COUNT=$(find "$dir" -type d | wc -l)
        echo "📂 $dir/"
        echo "   文件数: $FILE_COUNT"
        echo "   子目录数: $DIR_COUNT"

        # 显示目录中的主要文件类型
        if [ "$FILE_COUNT" -gt 0 ]; then
            echo "   主要文件类型:"
            find "$dir" -type f | sed 's/.*\.//' | sort | uniq -c | sort -rn | head -5 | while read count ext; do
                echo "      .$ext: $count"
            done
        fi
        echo ""
    fi
done

echo "🔍 关键文件:"
echo ""

# 列出关键配置文件
CONFIG_FILES=(
    "package.json"
    "package-lock.json"
    "yarn.lock"
    "tsconfig.json"
    "webpack.config.js"
    "vite.config.js"
    "requirements.txt"
    "setup.py"
    "pyproject.toml"
    "go.mod"
    "go.sum"
    "Cargo.toml"
    "Cargo.lock"
    "pom.xml"
    "build.gradle"
    "Makefile"
    "Dockerfile"
    "docker-compose.yml"
    ".gitignore"
    ".env.example"
    ".eslintrc"
    ".prettierrc"
)

for file in "${CONFIG_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✓ $file"
    fi
done

echo ""
echo "📚 文档文件:"
echo ""

DOC_FILES=(
    "README.md"
    "README.rst"
    "CONTRIBUTING.md"
    "CHANGELOG.md"
    "AUTHORS.md"
    "LICENSE"
    "LICENSE.txt"
    "docs/"
    "examples/"
)

for item in "${DOC_FILES[@]}"; do
    if [ -e "$item" ]; then
        echo "✓ $item"
    fi
done

echo ""
echo "✅ 项目结构分析完成！"
echo ""
echo "💡 下一步建议："
echo "   1. 探索主要源代码目录（src/, lib/, app/ 等）"
echo "   2. 查看配置文件了解项目设置"
echo "   3. 阅读文档文件获取更多上下文"
echo ""
