# 自迭代机制使用指南

这个 skill 包含一个自动迭代改进系统，能够根据用户反馈持续优化。

## 🚀 快速开始

### 1. 记录坑点

当用户在学习过程中遇到问题时，记录到 `feedback/坑点记录.md`：

```bash
# 编辑坑点记录
vim feedback/坑点记录.md
```

按照文件中的模板格式添加新的坑点记录。

### 2. 评估是否需要迭代

```bash
# 运行评估脚本
bash scripts/evaluate-iteration.sh
```

脚本会输出：
- 当前待处理坑点数
- 是否达到迭代阈值
- 如果触发，创建迭代工作区

### 3. 生成技术方案（如需迭代）

如果评估触发迭代，使用 solution-generator agent：

```bash
# 在 Claude Code 中执行
/skill
```

然后说：
```
"使用 solution-generator agent 为 iteration/round-1 生成技术方案"
```

### 4. 评估方案

使用 solution-evaluator agent 评估方案：

```
"使用 solution-evaluator agent 评估 iteration/round-1/solution.md"
```

## 📋 迭代工作流程

```
用户学习 → 遇到问题 → 记录坑点
                ↓
          定期评估触发条件
                ↓
        [达到阈值] → 是
                ↓
         生成技术方案
                ↓
         评估方案质量
                ↓
    ┌───────────┴───────────┐
    ↓                       ↓
[≥9.0分]              [<9.0分]
    ↓                       ↓
实施改进              完善方案 (最多3轮)
    ↓                       ↓
更新文档              ┌─────┴─────┐
测试验证              ↓           ↓
记录历史          [3轮后]    [达标]
                    ↓           ↓
               人工决策       进入实施
```

## 📁 目录结构

```
opensource-project-learning/
├── SKILL.md                      # 主要 skill 文档
├── feedback/                      # 反馈目录
│   ├── 坑点记录.md                # 坑点记录文件
│   ├── 迭代历史.md                # 迭代历史记录
│   └── pending_issues.md         # 待处理问题列表
├── agents/                        # Agent 指令
│   ├── solution-generator.md      # 技术方案生成 agent
│   └── solution-evaluator.md      # 方案评估 agent
├── iteration/                     # 迭代工作区
│   └── round-N/                   # 第N轮迭代
│       ├── problems.md            # 本轮问题
│       ├── solution.md            # 技术方案
│       └── evaluation.md          # 评估结果
└── scripts/
    ├── evaluate-iteration.sh     # 评估脚本
    └── ...
```

## 🎯 迭代触发条件

自动迭代会在以下情况触发：

- **🔴 紧急迭代**: 高优先级坑点 ≥1个
- **🟡 常规迭代**: 中优先级坑点 ≥3个
- **🟢 累积迭代**: 任何级别坑点 ≥5个

## 📊 方案评分标准

方案评估采用5个维度，总分 0-10分：

| 维度 | 权重 | 说明 |
|------|------|------|
| 问题覆盖度 | 20% | 是否覆盖所有待处理坑点 |
| 方案具体性 | 25% | 方案是否足够具体，可直接实施 |
| 可行性 | 20% | 技术上是否可行 |
| 预期效果 | 20% | 能否有效解决问题 |
| 风险评估 | 15% | 是否有潜在风险 |

**通过标准**: 总分 ≥ 9.0分

## 🔧 手动操作

### 手动触发迭代

即使未达到自动触发条件，也可以手动触发：

```bash
# 1. 创建迭代工作区
mkdir -p iteration/round-manual-$(date +%Y%m%d)

# 2. 复制当前待处理问题
cp feedback/坑点记录.md iteration/round-manual-$(date +%Y%m%d)/problems.md

# 3. 调用 solution-generator agent
# (在 Claude Code 中)
```

### 查看迭代历史

```bash
# 查看完整的迭代历史
cat feedback/迭代历史.md

# 查看某轮迭代的详细记录
ls -la iteration/round-1/
cat iteration/round-1/solution.md
cat iteration/round-1/evaluation.md
```

### 导出迭代报告

```bash
# 生成迭代报告（TODO: 实现脚本）
bash scripts/generate-iteration-report.sh
```

## 💡 最佳实践

### 记录坑点的时机

1. **立即记录**: 发现问题后立即记录，不要等待
2. **详细描述**: 包含足够的上下文信息
3. **客观描述**: 描述事实，避免主观臆断
4. **分类归档**: 正确设置严重程度和影响范围

### 生成方案的建议

1. **针对性**: 方案应该直接针对具体问题
2. **可操作**: 方案应该具体到可以直接实施
3. **可验证**: 方案实施后应该能验证效果
4. **向后兼容**: 不应该破坏现有功能

### 评估方案的要点

1. **客观公正**: 基于方案本身的质量评估
2. **用户视角**: 从用户角度考虑是否解决问题
3. **实际可行**: 理论不如实践
4. **持续改进**: 即使通过也可提出优化建议

## 🚨 注意事项

1. **不要过度迭代**: 避免为了迭代而迭代，确保每次迭代都有实际价值
2. **保持简洁**: 不要让 skill 变得过于复杂
3. **测试验证**: 每次改进后都要运行测试用例
4. **用户参与**: 复杂问题需要人工决策，不要完全依赖自动化

## 📞 获取帮助

如果遇到问题：

1. 查看本指南
2. 检查 `feedback/迭代历史.md` 了解之前的迭代
3. 查看具体的评估报告 `iteration/round-N/evaluation.md`
4. 如果3轮评估仍未达标，需要人工介入

---

*自迭代机制让 skill 能够持续进化，提供更好的用户体验。*
