---
name: opensource-project-learning
description: 学习开源项目的系统化方法。适用于所有类型的开源项目（Web应用、后端服务、CLI工具、插件等）。当用户想要学习、理解、探索一个新的开源项目时使用此 skill - 包括"从零开始学习 X 项目"、"如何理解 Y 项目的架构"、"这个开源项目是做什么的"、"我想学习 Z 项目的代码"等。即使项目类型不明确或用户没有明确说"学习"，只要涉及理解开源项目结构和功能，就应该使用此 skill。
---

# 开源项目学习 Skill（对话式版本）

## 📚 **Skill 概述**

这个 skill 提供了一个**对话式**的方法来学习任何开源项目。核心原则是：**每一步只给1-2个要点，然后停下来等待用户反馈**。

## 📝 学习记录功能

本技能支持自动记录学习进度，方便随时恢复和回顾。

**功能特性**：
- ✅ 自动保存学习进度（实时 + 里程碑）
- ✅ 支持多会话管理
- ✅ 智能恢复学习进度
- ✅ 生成完整学习归档

首次使用时会自动在项目目录下创建 `learning/` 目录并记录学习过程。

---

## 🎯 **适用场景**

- 用户想要学习一个新的开源项目
- 用户想要理解某个项目的架构和设计
- 用户需要快速了解项目的核心功能
- 用户想要探索项目的代码实现
- 项目类型不限（Web应用、后端服务、CLI工具、插件等）

---

## 🔄 **核心原则**

**重要：这是一个对话式 skill，不是文档式教程！**

1. **少而精**：每次只提供1-2个要点，不要一次性输出大量信息
2. **逐步推进**：每一步都要停下来，等待用户反馈或问题
3. **初步主动，深入询问**：基本信息可以主动提供，但深入分析前必须询问
4. **不主动挖掘**：除非用户明确表示兴趣，否则不要深入技术细节
5. **建议式引导**：基于项目特点给推荐选项，而不是开放式问题

---

## ❌ vs ✅ 交互示例

**❌ 错误示例（文档式 - 不要这样做）：**
```
我: [读取10个文件] 这是一个完整的项目报告，包括技术栈、架构、功能...
[输出2000字长报告，包含所有细节]
```

**✅ 正确示例（对话式 - 应该这样做）：**
```
我: [读取README] 这个项目是 Claude Code 的状态栏插件。
它的核心功能是实时显示上下文使用情况。

这听起来对你有用吗？你想先了解：
1. 它具体显示哪些信息
2. 技术实现原理
3. 其他方面

[等待用户回答]
```

---

## 📖 **对话式学习流程**

#### **前置步骤：初始化学习会话** 🆕

**[调用：会话管理器 - 初始化]**

1. 检查是否存在 `learning/sessions.json`
2. 如果存在历史记录，显示会话列表并询问用户意图
3. 如果不存在或用户选择新建，提示输入会话主题
4. 创建会话目录并初始化 `meta.json` 和 `progress.json`

**示例对话：**
```
我: 检测到这是首次学习该项目。
    
为了方便后续记录和回顾，请为这次学习会话起个主题名称。
    
例如：'claude-hud-初探'、'理解上下文计算' 等

用户: claude-hud-初探

我: [创建 learning/claude-hud-初探/ 目录]
    [初始化 meta.json 和 progress.json]
    
    记录已创建！开始学习...
```

**用户确认后，继续下面的流程...**

---

### **阶段 0: 快速上手（实践优先）**

**目标**: 先让项目跑起来，通过使用理解价值，而不是先看文档

**核心原则**: **用→理解→深入**

```
[读取 README 的安装/快速开始部分]

我: 这个项目可以通过[简单步骤]快速上手。

步骤：
1. [安装命令]
2. [运行命令]

你想：
1. 直接运行看看效果
2. 先了解它能做什么
3. 其他

[等待用户回答]
```

**为什么先运行？**
- ✅ 通过实际使用理解价值，比看文档更直观
- ✅ 看到运行效果后，更有动力了解实现原理
- ✅ 从使用问题中反推设计理念和最佳实践
- ✅ 避免"看了半天不知道干什么"的问题

#### **步骤 1: 引导用户运行项目**

**优先级：最高**

```
用户: "我想先了解它能做什么"

我: 好的，但我建议先运行看看效果，这样更容易理解。

[给出安装和运行命令]

需要我帮你检查环境或运行吗？

[等待用户回答]
```

**如果用户选择运行**：
```
我: 让我们一步步来：

1. 先检查环境：[检查命令]
2. 安装依赖：[安装命令]
3. 运行项目：[运行命令]

每一步都要等成功后再继续。

准备好了吗？

[等待用户确认，然后一步步引导]
```

#### **步骤 2: 从使用体验中学习**

**运行成功后，通过对话引导思考**

```
我: 恭喜，项目跑起来了！🎉

刚才的运行过程中，你注意到什么了吗？

比如：
1. [观察1: 基于项目特点，比如"它实时显示了状态"]
2. [观察2: 基于项目特点，比如"配置很简单"]

想了解这些观察背后的实现原理吗？

[等待用户回答]
```

**关键点：**
- ✅ 从使用体验中提出观察
- ✅ 将观察与技术实现关联
- ✅ 让用户自己发现问题，然后解释

#### **步骤 3: 如果运行失败**

**不要直接放弃，而是引导调试**

```
我: 遇到错误了。让我们看看是什么问题。

[分析错误信息]

这个错误说明[解释原因]。

解决方法：
1. [方法1]
2. [方法2]

需要我帮你执行吗？

[等待用户回答]
```

#### **阶段完成：记录里程碑** 🆕

**[调用：实时记录器 - 保存进度]**

1. 更新 `progress.json`，标记阶段0已完成
2. 记录该阶段的关键知识点
3. 询问用户："阶段0已完成！是否查看学习记录？"

**示例对话：**
```
我: 阶段0已完成！🎉

已记录：
- 完成阶段：阶段0（快速上手）
- 探索概念：项目安装、基本使用
- 提问次数：3次

想：
1. 查看详细记录
2. 继续学习阶段1
3. 其他
```

---

### **阶段 1: 初步了解（在运行之后）**

**目标**: 在已经运行过项目的基础上，通过对话了解设计理念

**此时用户已经：**
- ✅ 看到了项目运行效果
- ✅ 有了直观的使用体验
- ✅ 可能遇到了一些问题

**这种情况下再阅读文档，效果更好**

#### **步骤 1: 从 README 开始（现在有了上下文）**

**只读 README，不要读其他文件**

```
[读取 README.md]

我: 这个项目是[一句话描述，不超过15字]。

它的核心作用是[一个关键功能，不超过20字]。

你想了解：
1. [基于项目特点的建议选项1]
2. [基于项目特点的建议选项2]
3. 其他你感兴趣的

[等待用户回答]
```

**为什么只读README？**
- README 通常包含项目的核心信息
- 避免信息过载
- 让用户引导学习方向

**响应策略：**
- **如果用户问技术细节** → 读取 package.json/Cargo.toml，**只回答用户问的**
- **如果用户问架构** → 询问想了解哪个模块，不要主动分析整个结构
- **如果用户说"继续"** → 给下一个要点，然后停

#### **步骤 2: 根据用户兴趣深入**

**只在用户明确询问时才深入**

```
用户: "它用了什么技术？"

我: [读取 package.json]

它主要用了[技术栈名称]。

有具体哪个技术你想深入了解吗？

[等待用户回答]
```

**关键点：**
- 不要列举所有依赖
- 不要主动解释每个技术的作用
- 只回答用户问的

#### **阶段完成：记录里程碑** 🆕

**[调用：实时记录器 - 保存进度]**

1. 更新 `progress.json`，标记阶段1已完成
2. 记录该阶段的关键知识点和用户兴趣点
3. 询问用户："阶段1已完成！是否查看学习记录？"

**示例对话：**
```
我: 阶段1已完成！🎉

已记录：
- 完成阶段：阶段1（初步了解）
- 学习重点：设计理念、技术栈选择
- 你的兴趣点：[用户关注的主题]

想：
1. 查看详细记录
2. 继续学习阶段2
3. 其他
```

---

### **阶段 2: 探索代码结构**

**目标**: 帮助用户理解项目组织，但不要一次性展示整个目录树

#### **步骤 1: 了解项目规模**

```
我: 项目大约有[X个文件，Y行代码]。

你想先了解：
1. [建议1: 基于项目特点，比如"入口点在哪里"]
2. [建议2: 基于项目特点，比如"主要模块有哪些"]
3. 其他

[等待用户回答]
```

#### **步骤 2: 深入具体模块**

**只在用户询问时才读取代码**

```
用户: "入口点在哪里？"

我: [读取 src/index.ts]

入口点做了这些事情：
1. [要点1]
2. [要点2]

你想深入了解哪个部分？

[等待用户回答]
```

**不要做的事情：**
- ❌ 不要主动读取10个文件然后给出总结
- ❌ 不要分析整个代码架构
- ❌ 不要给出完整的函数调用链

#### **阶段完成：记录里程碑** 🆕

**[调用：实时记录器 - 保存进度]**

1. 更新 `progress.json`，标记阶段2已完成
2. 记录该阶段探索的关键模块和代码文件
3. 询问用户："阶段2已完成！是否查看学习记录？"

**示例对话：**
```
我: 阶段2已完成！🎉

已记录：
- 完成阶段：阶段2（探索代码结构）
- 探索模块：[模块1]、[模块2]
- 查看文件：[文件列表]

想：
1. 查看详细记录
2. 继续学习阶段3
3. 其他
```

---

### **阶段 3: 运行项目（可选）**

**目标**: 帮助用户运行项目，但只在用户询问时提供

```
用户: "我能运行看看吗？"

我: 可以。根据 README，你需要：
1. [步骤1]
2. [步骤2]

需要我帮你检查环境吗？

[等待用户回答]
```

#### **阶段完成：记录里程碑** 🆕

**[调用：实时记录器 - 保存进度]**

1. 更新 `progress.json`，标记阶段3已完成
2. 记录运行过程中的观察和问题解决
3. 询问用户："阶段3已完成！是否查看学习记录？"

**示例对话：**
```
我: 阶段3已完成！🎉

已记录：
- 完成阶段：阶段3（运行项目）
- 运行结果：[成功/失败]
- 遇到问题：[问题列表]
- 解决方案：[方案列表]

想：
1. 查看详细记录
2. 生成学习归档
3. 其他
```

---

## 🎯 **从使用中学习最佳实践**

### **核心思想：用→理解→深入**

前期学习应该优先通过实际使用来理解项目价值，而不是先啃文档。

### **为什么先运行再看代码？**

| 传统方式（先看文档） | 实践优先（先运行） |
|-------------------|------------------|
| 看了半天不知道干什么 | 立即看到效果，有直观感受 |
| 不清楚为什么要这样设计 | 从使用中体验设计巧思 |
| 不知道重点在哪里 | 运行过程中自然产生疑问 |
| 容易放弃（太枯燥） | 有成就感，更有动力深入 |

### **对话式引导最佳实践**

#### **步骤 1: 运行前 → 激发兴趣**

```
我: 这个项目能解决[具体问题]。

比如，如果你遇到过[场景]，这个项目可以[解决方案]。

想试试看吗？

[等待用户回答]
```

#### **步骤 2: 运行中 → 观察和提问**

```
用户: [成功运行]

我: 太好了！🎉

你注意到什么了吗？
1. [观察点1: 基于实际输出]
2. [观察点2: 基于实际行为]

这些设计说明了[设计理念]。

[等待用户反馈]
```

#### **步骤 3: 运行后 → 总结最佳实践**

```
我: 刚才的使用过程中，我们发现了几个最佳实践：

1. **实践1**: [从使用中总结]
   - 为什么这样做：[理由]
   - 带来什么好处：[好处]

2. **实践2**: [从使用中总结]
   - 为什么这样做：[理由]
   - 带来什么好处：[好处]

想了解这些实践在代码中是如何实现的吗？

[等待用户回答]
```

### **典型对话流程示例**

**场景：学习 claude-hud 项目**

```
我: 这是一个 Claude Code 的状态栏插件。

它能解决的问题是：在使用 Claude Code 时，
你看不到上下文使用情况，可能突然就超限了。

这个插件会实时显示进度条，就像手机电池一样。

想试试看吗？

用户: 想

我: 好的，只需要3步：

1. 安装插件：/plugin install claude-hud
2. 配置状态栏：/claude-hud:setup
3. 重启 Claude Code

需要我帮你执行吗？

[用户安装并重启后]

我: 成功了！你现在应该能看到底部有状态栏了。

你注意到什么变化了吗？

用户: 多了两行，显示上下文百分比

我: 对！这就是它的核心价值。

现在你能在上下文达到 85% 之前就知道了，
而不是突然被截断。这给你更多时间调整策略。

想知道这个百分比是怎么计算出来的吗？

用户: 想

我: [才开始读取代码，解释实现原理]
```

### **从使用中发现的设计模式**

**在运行过程中，引导用户观察：**

1. **配置方式** → 理解项目的配置哲学
2. **错误处理** → 理解项目的健壮性设计
3. **输出格式** → 理解项目的用户体验考虑
4. **性能表现** → 理解项目的性能优化策略

**每次观察后，都停下来询问：**
```
你觉得为什么这样设计？

[等待用户思考，然后解释]
```

### **将使用体验与技术实现关联**

```
我: 你刚才看到的[现象]，在代码中是这样实现的：

[读取相关代码片段，1-2个要点]

关键点是：
1. [技术点1]
2. [技术点2]

这样就解释了你刚才看到的行为。

清楚了吗？

[等待用户反馈]
```

---

## 🎯 **引导式提问模板**

不要问开放式问题，要给建议性选项：

**❌ 不好的提问：**
```
"你想了解什么？"
"你想看哪部分？"
"你对什么感兴趣？"
```

**✅ 好的提问：**
```
"这个插件主要显示3类信息：上下文、工具活动、待办事项。
你想先了解哪一类？"

"这是个 TypeScript 项目。你想先了解：
1. 入口文件
2. 核心逻辑
3. 渲染系统"
```

---

## 📊 **信息粒度控制**

### **每次只给1-2个要点**

**示例：**

```
✅ 好的做法：
"它有2个核心功能：
1. 实时显示上下文使用情况
2. 追踪工具和代理活动

想了解第一个功能的实现原理吗？"

❌ 不好的做法：
"它有以下功能：1. 上下文监控 2. 工具追踪 3. 代理状态 4. 待办事项 5. Git集成 6. 使用限制..."
```

---

## 🚦 **何时停下来询问**

### **必须停下来的时候：**

1. **给完1-2个要点后** → 等待反馈
2. **准备读取新文件前** → 询问是否需要
3. **用户可能不熟悉某个技术时** → 询问是否需要解释
4. **准备深入分析前** → 确认用户兴趣

### **可以继续的时候：**

1. **用户明确说"继续"**
2. **用户说"多告诉我点"**
3. **用户问具体问题**

---

## 💡 **应对常见情况**

### **用户说"我不懂X技术"**

```
我: [技术名称]是[一句话解释，不超过20字]。

想了解：
1. 为什么项目选择它
2. 核心概念
3. 其他

[等待用户回答]
```

### **用户说"给我看代码"**

```
我: 好的。你想看：
1. [关键文件1] - [做什么]
2. [关键文件2] - [做什么]
3. 具体哪个功能

[等待用户回答]
```

### **用户说"太复杂了"**

```
我: 理解。让我们从最简单的部分开始。

[重新给一个更简单的切入点]

这样好理解了吗？

[等待用户回答]
```

---

## 🛠️ **技术栈适配指南**

当用户询问某个技术时，参考这些简短解释：

### **JavaScript/TypeScript**
- **package.json**: 依赖和脚本配置
- **tsconfig.json**: TypeScript 编译配置
- **src/**: 源代码目录

### **Python**
- **requirements.txt**: 依赖列表
- **setup.py**: 项目配置
- **package_name/**: 主要代码

### **Go**
- **go.mod**: 依赖管理
- **cmd/**: 命令行入口
- **pkg/**: 库代码

### **Rust**
- **Cargo.toml**: 项目配置
- **src/**: 源代码

**只解释用户问的部分，不要主动展开。**

---

## 🎓 **学习策略**

### **快速模式（用户时间有限）**
```
我: 想要快速了解还是深入学习？

快速的话，我会给你核心要点（5分钟）。
深入的话，我们会逐步探索每个模块（30分钟）。

[等待用户选择]
```

### **问题导向**
```
用户: "我想知道它是怎么做到X的"

我: 好的，让我们从这个问题开始。

[从问题反向追踪到相关代码]

这解释了X的实现过程。清楚了吗？

[等待用户反馈]
```

---

## ✅ **检查清单**

在应用此 skill 时，确保：

### **前期学习（阶段0）**
- ✅ **优先引导用户运行项目**，而不是先看文档
- ✅ 通过实际使用理解项目价值
- ✅ 从使用体验中总结最佳实践
- ✅ 将观察到的现象与技术实现关联

### **对话交互**
- ✅ 每次只给1-2个要点
- ✅ 每一步都停下来等待用户反馈
- ✅ 不主动深入技术细节
- ✅ 给建议性选项而不是开放式问题
- ✅ 只在用户询问时读取新文件
- ✅ 基于用户反馈调整信息粒度

### **学习路径**
```
阶段0: 快速上手 → 运行项目 → 使用体验
   ↓
阶段1: 初步了解 → README → 设计理念
   ↓
阶段2: 深入探索 → 代码实现 → 架构理解
```

**优先级：** 阶段0 > 阶段1 > 阶段2

---

## 📚 **与其他 skill 结合**

- **gitnexus-exploring**: 用于代码库深度分析（当用户明确要求时）
- **debugging**: 当运行项目遇到问题时
- **test-driven-development**: 当想要为项目添加功能时

---

## 💡 **注意事项**

1. **用户偏好** - 有些用户喜欢详细，有些喜欢简洁，根据反馈调整
2. **项目状态** - 已废弃的项目需要特别说明
3. **时间限制** - 根据用户可用时间调整深度
4. **语言障碍** - 非英文文档可以提供翻译
5. **安全性** - 不信任的项目建议在沙箱运行

---

## 🔄 **持续改进**

这个 skill 会根据实际使用情况不断优化。如果发现某个模式效果好，可以记录下来作为最佳实践。

**关键指标：**
- 用户是否持续参与对话
- 用户是否主动提问
- 用户是否表示"理解了"
- 用户是否要求更多细节

如果用户长时间不回复或表示"太复杂"，说明信息粒度可能需要调整。

---

## 📝 学习记录系统（独立模块）

### **系统架构**

学习记录系统由4个独立模块组成，可选择性调用：

```
learning/
├── sessions.json           # 会话索引（会话管理器）
├── [会话名称]/
│   ├── meta.json          # 会话元数据（会话管理器）
│   ├── progress.json      # 学习进度（实时记录器）
│   ├── timeline.jsonl     # 时间线日志（实时记录器）
│   ├── qa.jsonl           # 问答记录（实时记录器）
│   └── archive.md         # 学习归档（归档生成器）
```

### **模块 1: 会话管理器**

#### **功能**
- 创建新学习会话
- 列出历史会话
- 恢复已有会话
- 管理会话元数据

#### **触发时机**
- 用户开始学习新项目时
- 用户中断后重新学习时

#### **操作流程**

**1. 初始化（首次学习）**
```json
// learning/sessions.json
{
  "sessions": [
    {
      "id": "claude-hud-初探",
      "project": "claude-hud",
      "created_at": "2026-05-05T10:00:00Z",
      "last_updated": "2026-05-05T10:00:00Z",
      "status": "active",
      "stage": 0,
      "total_questions": 0
    }
  ]
}

// learning/claude-hud-初探/meta.json
{
  "session_id": "claude-hud-初探",
  "project": "claude-hud",
  "project_url": "https://github.com/anthropics/claude-hud",
  "created_at": "2026-05-05T10:00:00Z",
  "last_updated": "2026-05-05T10:00:00Z",
  "status": "active",
  "stage": 0,
  "total_questions": 0,
  "user_goals": [],
  "notes": ""
}
```

**2. 恢复会话（已有历史记录）**
```
我: 检测到你之前学习过这个项目。

历史会话：
1. claude-hud-初探（2026-05-05，完成到阶段1）
2. 理解上下文计算（2026-05-03，完成到阶段2）

想：
1. 继续某个会话
2. 创建新会话

用户: 继续 claude-hud-初探

我: 好的，恢复会话...

上次学习进度：
- 完成阶段：阶段1（初步了解）
- 学习重点：设计理念、技术栈选择
- 提问次数：5次

继续学习吗？
```

#### **关键函数**

**创建会话**
```python
def create_session(project_name: str, session_name: str, project_url: str = "") -> dict:
    """创建新学习会话"""
    session_id = f"{project_name}-{session_name}"
    timestamp = datetime.now().isoformat()

    meta = {
        "session_id": session_id,
        "project": project_name,
        "project_url": project_url,
        "created_at": timestamp,
        "last_updated": timestamp,
        "status": "active",
        "stage": 0,
        "total_questions": 0,
        "user_goals": [],
        "notes": ""
    }

    # 创建目录和文件
    os.makedirs(f"learning/{session_id}", exist_ok=True)

    with open(f"learning/{session_id}/meta.json", "w") as f:
        json.dump(meta, f, indent=2)

    # 更新会话索引
    update_sessions_index(meta)

    return meta
```

**列出会话**
```python
def list_sessions(project_name: str = None) -> list:
    """列出历史会话"""
    if not os.path.exists("learning/sessions.json"):
        return []

    with open("learning/sessions.json", "r") as f:
        data = json.load(f)

    sessions = data.get("sessions", [])

    if project_name:
        sessions = [s for s in sessions if s["project"] == project_name]

    return sorted(sessions, key=lambda x: x["last_updated"], reverse=True)
```

**恢复会话**
```python
def resume_session(session_id: str) -> dict:
    """恢复学习会话"""
    meta_path = f"learning/{session_id}/meta.json"

    if not os.path.exists(meta_path):
        raise FileNotFoundError(f"会话不存在: {session_id}")

    with open(meta_path, "r") as f:
        meta = json.load(f)

    # 读取进度信息
    progress_path = f"learning/{session_id}/progress.json"
    if os.path.exists(progress_path):
        with open(progress_path, "r") as f:
            progress = json.load(f)
    else:
        progress = {"stage": 0, "completed_stages": []}

    return {
        "meta": meta,
        "progress": progress
    }
```

### **模块 2: 实时记录器**

#### **功能**
- 记录学习进度
- 记录问答历史
- 记录关键知识点
- 生成时间线日志

#### **触发时机**
- 每个阶段完成后
- 用户提出问题时
- 用户表示理解时
- 发现重要知识点时

#### **数据结构**

**progress.json**
```json
{
  "stage": 1,
  "completed_stages": [0],
  "key_concepts": [
    {
      "stage": 0,
      "concept": "上下文计算",
      "understanding": "Claude使用token计算上下文使用量",
      "timestamp": "2026-05-05T10:15:00Z"
    }
  ],
  "user_interests": [
    "状态栏渲染",
    "性能优化"
  ],
  "questions_count": 5
}
```

**qa.jsonl（问答记录）**
```json
{"timestamp": "2026-05-05T10:15:00Z", "stage": 0, "question": "这个项目是做什么的？", "answer": "实时显示Claude Code的上下文使用情况"}
{"timestamp": "2026-05-05T10:20:00Z", "stage": 1, "question": "它怎么计算上下文的？", "answer": "通过监听API响应和token使用情况"}
```

**timeline.jsonl（时间线日志）**
```json
{"timestamp": "2026-05-05T10:00:00Z", "event": "session_start", "stage": 0}
{"timestamp": "2026-05-05T10:15:00Z", "event": "question", "stage": 0, "content": "这个项目是做什么的？"}
{"timestamp": "2026-05-05T10:30:00Z", "event": "stage_complete", "stage": 0, "duration": "30min"}
```

#### **关键函数**

**记录阶段完成**
```python
def record_stage_complete(session_id: str, stage: int, key_concepts: list) -> dict:
    """记录阶段完成"""
    progress_path = f"learning/{session_id}/progress.json"

    if os.path.exists(progress_path):
        with open(progress_path, "r") as f:
            progress = json.load(f)
    else:
        progress = {
            "stage": stage,
            "completed_stages": [],
            "key_concepts": [],
            "user_interests": [],
            "questions_count": 0
        }

    # 更新进度
    progress["stage"] = stage + 1
    progress["completed_stages"].append(stage)

    # 添加关键概念
    for concept in key_concepts:
        progress["key_concepts"].append({
            "stage": stage,
            "concept": concept["name"],
            "understanding": concept["description"],
            "timestamp": datetime.now().isoformat()
        })

    with open(progress_path, "w") as f:
        json.dump(progress, f, indent=2)

    # 记录到时间线
    add_timeline_event(session_id, "stage_complete", {
        "stage": stage,
        "concepts_count": len(key_concepts)
    })

    return progress
```

**记录问答**
```python
def record_qa(session_id: str, stage: int, question: str, answer: str):
    """记录问答"""
    qa_path = f"learning/{session_id}/qa.jsonl"

    entry = {
        "timestamp": datetime.now().isoformat(),
        "stage": stage,
        "question": question,
        "answer": answer
    }

    with open(qa_path, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")

    # 更新问题计数
    progress_path = f"learning/{session_id}/progress.json"
    with open(progress_path, "r") as f:
        progress = json.load(f)

    progress["questions_count"] += 1

    with open(progress_path, "w") as f:
        json.dump(progress, f, indent=2)

    # 记录到时间线
    add_timeline_event(session_id, "question", {
        "stage": stage,
        "content": question
    })
```

**添加时间线事件**
```python
def add_timeline_event(session_id: str, event_type: str, data: dict):
    """添加时间线事件"""
    timeline_path = f"learning/{session_id}/timeline.jsonl"

    entry = {
        "timestamp": datetime.now().isoformat(),
        "event": event_type,
        **data
    }

    with open(timeline_path, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")
```

### **模块 3: 归档生成器**

#### **功能**
- 生成学习总结报告
- 整理关键知识点
- 生成可分享的学习归档

#### **触发时机**
- 用户完成所有学习阶段
- 用户主动请求生成归档
- 用户想要分享学习成果

#### **归档格式**

**archive.md**
```markdown
# claude-hud 学习归档

**学习时间**: 2026-05-05
**学习会话**: claude-hud-初探
**完成阶段**: 阶段0-2

## 📊 学习统计

- **学习时长**: 2小时
- **完成阶段**: 3个（阶段0、1、2）
- **提问次数**: 8次
- **探索文件**: 5个

## 🎯 关键知识点

### 阶段0：快速上手
- **上下文计算**: Claude使用token计算上下文使用量
- **状态栏显示**: 实时显示上下文百分比

### 阶段1：初步了解
- **技术栈**: TypeScript + Node.js
- **设计理念**: 简单、实时、可视化

### 阶段2：代码结构
- **入口文件**: src/index.ts
- **核心模块**: context-tracker、hud-renderer

## 💬 学习问答

**Q: 这个项目是做什么的？**
A: 实时显示Claude Code的上下文使用情况

**Q: 它怎么计算上下文的？**
A: 通过监听API响应和token使用情况

## 📝 学习笔记

[用户添加的笔记]

## 🚀 下一步

- [ ] 深入学习状态栏渲染原理
- [ ] 尝试修改配置
- [ ] 贡献代码

---
*由 Claude Code 学习记录系统自动生成*
```

#### **关键函数**

**生成归档**
```python
def generate_archive(session_id: str) -> str:
    """生成学习归档"""
    # 读取元数据
    with open(f"learning/{session_id}/meta.json", "r") as f:
        meta = json.load(f)

    # 读取进度
    with open(f"learning/{session_id}/progress.json", "r") as f:
        progress = json.load(f)

    # 读取问答
    qa_entries = []
    qa_path = f"learning/{session_id}/qa.jsonl"
    if os.path.exists(qa_path):
        with open(qa_path, "r", encoding="utf-8") as f:
            for line in f:
                qa_entries.append(json.loads(line))

    # 读取时间线
    timeline_entries = []
    timeline_path = f"learning/{session_id}/timeline.jsonl"
    if os.path.exists(timeline_path):
        with open(timeline_path, "r", encoding="utf-8") as f:
            for line in f:
                timeline_entries.append(json.loads(line))

    # 计算学习时长
    duration = calculate_duration(timeline_entries)

    # 生成Markdown
    archive = f"""# {meta['project']} 学习归档

**学习时间**: {meta['created_at'][:10]}
**学习会话**: {session_id}
**完成阶段**: {', '.join(f'阶段{s}' for s in progress['completed_stages'])}

## 📊 学习统计

- **学习时长**: {duration}
- **完成阶段**: {len(progress['completed_stages'])}个
- **提问次数**: {progress['questions_count']}次
- **探索文件**: {len([e for e in timeline_entries if e.get('event') == 'file_read'])}个

## 🎯 关键知识点
"""

    # 按阶段分组知识点
    concepts_by_stage = {}
    for concept in progress['key_concepts']:
        stage = concept['stage']
        if stage not in concepts_by_stage:
            concepts_by_stage[stage] = []
        concepts_by_stage[stage].append(concept)

    for stage, concepts in concepts_by_stage.items():
        archive += f"\n### 阶段{stage}：{get_stage_name(stage)}\n"
        for concept in concepts:
            archive += f"- **{concept['concept']}**: {concept['understanding']}\n"

    # 添加问答
    archive += "\n## 💬 学习问答\n\n"
    for qa in qa_entries[:10]:  # 最多显示10个
        archive += f"**Q: {qa['question']}**\n"
        archive += f"A: {qa['answer']}\n\n"

    # 添加笔记
    if meta.get('notes'):
        archive += f"## 📝 学习笔记\n\n{meta['notes']}\n\n"

    # 添加下一步
    if progress.get('user_interests'):
        archive += "## 🚀 下一步\n\n"
        for interest in progress['user_interests']:
            archive += f"- [ ] {interest}\n"

    archive += "\n---\n*由 Claude Code 学习记录系统自动生成*\n"

    # 保存归档
    archive_path = f"learning/{session_id}/archive.md"
    with open(archive_path, "w", encoding="utf-8") as f:
        f.write(archive)

    return archive_path
```

### **模块 4: 工具函数**

#### **计算学习时长**
```python
def calculate_duration(timeline_entries: list) -> str:
    """计算学习时长"""
    if not timeline_entries:
        return "0分钟"

    start_time = datetime.fromisoformat(timeline_entries[0]['timestamp'])
    end_time = datetime.fromisoformat(timeline_entries[-1]['timestamp'])

    duration = end_time - start_time
    total_minutes = int(duration.total_seconds() / 60)

    if total_minutes < 60:
        return f"{total_minutes}分钟"
    else:
        hours = total_minutes // 60
        minutes = total_minutes % 60
        return f"{hours}小时{minutes}分钟"
```

#### **获取阶段名称**
```python
def get_stage_name(stage: int) -> str:
    """获取阶段名称"""
    stage_names = {
        0: "快速上手",
        1: "初步了解",
        2: "探索代码结构",
        3: "运行项目"
    }
    return stage_names.get(stage, f"阶段{stage}")
```

### **使用示例**

#### **完整流程**
```
用户: 我想学习 claude-hud 项目

我: [调用会话管理器]
    检测到这是首次学习该项目。
    
    为了方便后续记录和回顾，请为这次学习会话起个主题名称。
    
    例如：'claude-hud-初探'、'理解上下文计算' 等

用户: claude-hud-初探

我: [创建会话目录和文件]
    记录已创建！开始学习...
    
    [开始阶段0学习...]

[阶段0完成后...]

我: [调用实时记录器 - 保存进度]
    阶段0已完成！🎉
    
    已记录：
    - 完成阶段：阶段0（快速上手）
    - 探索概念：项目安装、基本使用
    - 提问次数：3次
    
    想：
    1. 查看详细记录
    2. 继续学习阶段1
    3. 其他

用户: 继续

[继续学习阶段1、2、3...]

[所有阶段完成后...]

我: [调用归档生成器]
    恭喜！你已完成所有学习阶段！🎉
    
    正在生成学习归档...
    
    [生成 archive.md]
    
    归档已生成！包含：
    - 学习统计
    - 关键知识点
    - 学习问答
    - 你的笔记
    
    可以分享给他人或作为学习笔记保存。
```

---

通过这个对话式 skill，用户可以按照自己的节奏和兴趣方向学习开源项目，而不是被大量信息淹没。

---

## 🌐 浏览器交互式学习

除了对话式学习，本 skill 还支持通过浏览器进行交互式学习。

### 启动 Web 学习平台

在项目目录下运行：

```bash
node .claude/skills/opensource-project-learning/web/server.js
```

可选参数：
- `-p, --port <port>` — 指定端口（默认 3456）
- `-d, --dir <path>` — 指定学习数据目录（默认 ./learning）

然后在浏览器打开 `http://localhost:3456` 即可。

### Web 学习平台功能

1. **阶段导航** — 侧栏显示 4 个学习阶段，点击切换
2. **对话交互** — 底部输入框提问，AI 导师实时回答
3. **进度追踪** — 自动保存学习进度，支持断点续学
4. **会话管理** — 支持多个学习会话，可随时切换

### 集成方式

也可以在代码中引用 WebServer：

```javascript
const WebServer = require('./web/server');

const server = new WebServer({
  port: 3456,
  learningDir: './learning',
  projectPath: '/path/to/project'
});

server.start();
```
