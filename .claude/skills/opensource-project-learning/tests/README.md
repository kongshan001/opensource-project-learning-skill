# 学习记录系统测试

本目录包含学习记录系统的单元测试。

## 运行测试

```bash
cd .claude/skills/opensource-project-learning
npm test
```

## 测试覆盖

- `session-manager.test.js` - 会话管理器测试
  - 初始化会话
  - 列出会话
  - 加载会话

- `realtime-recorder.test.js` - 实时记录器测试
  - 更新进度
  - 记录对话
  - 更新话题

- `recovery-manager.test.js` - 恢复管理器测试
  - 生成会话摘要
  - 生成进度报告

## 测试数据

测试使用临时目录 `tests/test-data/`，每次测试后自动清理。
