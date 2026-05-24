#!/bin/bash
# 一键发布到 GitHub Pages
# 用法：./publish.sh "改动说明"
# 不传参数就用默认信息

cd "$(dirname "$0")"

MSG="${1:-update: 内容更新}"

echo "📦 [1/3] 添加改动..."
git add -A

echo "📝 [2/3] 提交：$MSG"
git commit -m "$MSG" || { echo "⚠️  没有新改动，跳过"; exit 0; }

echo "🚀 [3/3] 推送到 GitHub..."
git push origin main

echo ""
echo "✅ 发布完成！"
echo "🌐 30~60秒后访问：https://yuliayqliu.github.io/beauty-creative-sop/"
