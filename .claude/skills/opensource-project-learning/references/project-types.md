# 开源项目类型识别指南

这个指南帮助你快速识别不同类型的开源项目及其特点。

## 🌐 Web 应用项目

### 前端框架
**识别特征**:
- `package.json` 包含 React/Vue/Angular 等框架
- `src/components/` 或 `src/app/` 目录
- `public/` 静态资源目录
- 配置文件：`vite.config.js`, `next.config.js`, `webpack.config.js`

**主要目录结构**:
```
src/
├── components/     # 可复用组件
├── pages/         # 页面组件
├── hooks/         # 自定义 Hooks
├── utils/         # 工具函数
├── api/           # API 调用
├── store/         # 状态管理
└── types/         # TypeScript 类型定义
```

**学习重点**:
1. 组件层次结构和数据流
2. 状态管理策略
3. 路由配置
4. API 集成方式
5. 构建和部署流程

---

## 🔧 后端服务项目

### Node.js 后端
**识别特征**:
- `package.json` 包含 Express/Fastify/NestJS
- `src/routes/` 或 `src/controllers/` 目录
- 中间件模式
- REST 或 GraphQL API

**主要目录结构**:
```
src/
├── controllers/    # 控制器层
├── services/       # 业务逻辑
├── models/         # 数据模型
├── middleware/     # 中间件
├── routes/         # 路由定义
├── utils/          # 工具函数
└── config/         # 配置文件
```

### Python 后端
**识别特征**:
- `requirements.txt` 或 `pyproject.toml`
- Django/Flask/FastAPI 框架
- `manage.py` (Django)
- `app/` 或 `src/` 目录

**主要目录结构**:
```
src/
├── api/            # API 端点
├── models/         # 数据模型
├── services/       # 业务逻辑
├── schemas/        # 数据验证模式
├── utils/          # 工具函数
└── config/         # 配置
```

**学习重点**:
1. API 设计和路由结构
2. 数据库交互（ORM）
3. 认证和授权机制
4. 错误处理策略
5. 中间件/拦截器链

---

## 🛠️ CLI 工具项目

### Node.js CLI
**识别特征**:
- `package.json` 中有 `"bin"` 字段
- Commander.js/Yargs/Oclif 框架
- `src/commands/` 或 `src/cli/` 目录

**主要目录结构**:
```
src/
├── commands/       # 命令定义
├── utils/          # 共享工具
├── config/         # 配置处理
└── cli/            # CLI 入口
```

### Go CLI
**识别特征**:
- `cmd/` 目录，每个子目录是一个命令
- `pkg/` 库代码
- Cobra 框架（常用）

**主要目录结构**:
```
cmd/
├── root.go         # 根命令
├── command1.go     # 子命令
└── command2.go     # 子命令
pkg/
├── cmdutil/        # 命令工具
└── utils/          # 通用工具
```

**学习重点**:
1. 命令解析和参数处理
2. 子命令组织方式
3. 输出格式和用户体验
4. 配置文件处理
5. 插件/扩展机制

---

## 🔌 插件系统项目

### VS Code 扩展
**识别特征**:
- `package.json` 包含 `"activationEvents"` 和 `"contributes"`
- `src/extension.ts` 入口文件
- `@types/vscode` 依赖

**主要目录结构**:
```
src/
├── extension.ts    # 扩展入口
├── commands/       # 命令注册
├── providers/      # 功能提供者
└── utils/          # 工具函数
```

### Claude Code 插件
**识别特征**:
- `.claude-plugin/` 目录
- `plugin.json` 配置
- `commands/` 命令目录
- statusline 或 MCP 工具

**主要目录结构**:
```
.claude-plugin/
├── plugin.json     # 插件元数据
commands/
├── command-name/   # 命令目录
└── ...
src/
├── index.ts        # 主入口
└── ...
```

**学习重点**:
1. 插件生命周期和初始化
2. 命令注册和处理
3. 与宿主环境的 API 交互
4. 配置和状态管理
5. 错误处理和用户反馈

---

## 📦 库/框架项目

### JavaScript/TypeScript 库
**识别特征**:
- `package.json` 中 `"main"` 字段指向库入口
- 通常没有 CLI，只提供 API
- `dist/` 编译输出目录

**主要目录结构**:
```
src/
├── index.ts        # 库入口
├── core/           # 核心功能
├── utils/          # 工具函数
└── types/          # 类型定义
```

**学习重点**:
1. 公共 API 设计
2. 内部模块组织
3. 导出策略
4. 依赖管理
5. 文档和示例

---

## 🎨 设计系统/UI 组件库

**识别特征**:
- Storybook 配置
- `src/components/` 组件目录
- 主题和样式系统

**主要目录结构**:
```
src/
├── components/     # UI 组件
│   ├── Button/
│   ├── Input/
│   └── ...
├── themes/         # 主题定义
├── utils/          # 样式工具
└── index.ts        # 导出入口
```

**学习重点**:
1. 组件设计原则
2. 样式架构（CSS-in-JS, Tailwind 等）
3. 主题系统实现
4. 组件测试策略
5. 文档和示例

---

## 🔄 数据处理/ETL 项目

**识别特征**:
- Python/R 语言
- pandas, numpy 等数据科学库
- Jupyter notebooks
- `data/`, `notebooks/` 目录

**主要目录结构**:
```
src/
├── data/           # 数据处理逻辑
├── models/         # 数据模型
├── pipelines/      # 处理管道
└── utils/          # 工具函数
notebooks/          # Jupyter notebooks
data/               # 数据文件
```

**学习重点**:
1. 数据流和转换逻辑
2. 管道和任务编排
3. 错误处理和重试机制
4. 性能优化策略
5. 数据验证和清洗

---

## 🧪 测试框架项目

**识别特征**:
- 名称包含 "test", "spec", "mock"
- 提供 testing utilities
- 断言库、mock 库

**主要目录结构**:
```
src/
├── assertions/     # 断言函数
├── mocks/          # Mock 实现
├── reporters/      # 测试报告
└── utils/          # 测试工具
```

---

## 🔀 项目类型判断决策树

```
开始
  │
  ├─ 有 package.json？
  │   ├─ 有 "bin" 字段？
  │   │   └─ → Node.js CLI 工具
  │   ├─ 有 .claude-plugin/？
  │   │   └─ → Claude Code 插件
  │   ├─ 有 "activationEvents"？
  │   │   └─ → VS Code 扩展
  │   ├─ src/components/ 或 src/app/？
  │   │   └─ → Web 前端应用
  │   ├─ src/routes/ 或 src/controllers/？
  │   │   └─ → Node.js 后端服务
  │   └─ 只有 API 导出？
  │       └─ → JavaScript/TypeScript 库
  │
  ├─ 有 requirements.txt 或 pyproject.toml？
  │   ├─ 有 manage.py？
  │   │   └─ → Django 项目
  │   ├─ 有 app/ 或 src/routes/？
  │   │   └─ → Python 后端服务
  │   └─ 有 data/ 或 notebooks/？
  │       └─ → 数据科学项目
  │
  ├─ 有 go.mod？
  │   ├─ 有 cmd/ 目录？
  │   │   └─ → Go CLI 工具
  │   └─ 有 pkg/ 或 internal/？
  │       └─ → Go 库或服务
  │
  ├─ 有 Cargo.toml？
  │   └─ → Rust 项目
  │
  └─ 有 pom.xml 或 build.gradle？
      └─ → Java 项目
```

---

## 💡 学习策略建议

### 对于初学者
1. **从简单项目开始** - CLI 工具 > 小型库 > Web 应用
2. **优先阅读测试** - 测试展示了如何使用代码
3. **运行项目** - 看到实际运行有助于理解
4. **画架构图** - 可视化项目结构

### 对于有经验的开发者
1. **快速浏览 README 和文档**
2. **查看 package.json/requirements.txt** 了解技术栈
3. **找到入口点** - 从 main 函数或 index 文件开始
4. **追踪数据流** - 理解请求/响应的生命周期
5. **查看 git 历史** - 了解最近的开发方向

### 特定项目类型的关注点

| 项目类型 | 核心关注点 | 学习路径 |
|---------|----------|----------|
| Web 前端 | 组件通信、状态管理 | 路由配置 → 主页面 → 组件层次 |
| 后端服务 | API 设计、数据流 | 路由定义 → 控制器 → 服务层 → 数据层 |
| CLI 工具 | 命令解析、用户体验 | 主命令 → 子命令 → 参数处理 |
| 插件系统 | 生命周期、API 交互 | 入口点 → 命令注册 → 功能实现 |
| 数据处理 | 数据转换、管道 | 输入源 → 转换逻辑 → 输出目标 |

---

## 🔗 相关资源

- **Understanding Source Code**: https://stackoverflow.com/questions/216657/
- **How to Read Code**: https://www.youtube.com/watch?v=UflmkQ3H4TM
- **Architecture Decision Records**: https://adr.github.io/
