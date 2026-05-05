# 学习记录系统

本模块为 opensource-project-learning skill 提供学习进度记录和归档功能。

## 架构

```
recording-system/
├── session-manager.js      # 会话管理器
├── realtime-recorder.js    # 实时记录器
├── recovery-manager.js     # 恢复管理器
└── templates/              # 文件模板
    ├── sessions.json.template
    ├── meta.json.template
    └── progress.json.template
```

## 使用示例

### 初始化会话

```javascript
const SessionManager = require('./recording-system/session-manager');
const manager = new SessionManager('/project/learning', '/project/path');

// 创建新会话
const session = manager.initializeSession('my-learning-session');
console.log(session.sessionId); // 'my-learning-session'
console.log(session.sessionPath); // '/project/learning/my-learning-session'
```

### 实时记录

```javascript
const RealtimeRecorder = require('./recording-system/realtime-recorder');
const recorder = new RealtimeRecorder('/project/learning/my-learning-session');

// 更新进度
recorder.updateProgress({
  currentStage: 'stage1',
  completedStages: ['stage0']
});

// 记录对话
recorder.appendConversation('用户', '这个问题很有意思');
recorder.appendConversation('AI', '让我解释一下...');
```

### 恢复会话

```javascript
const RecoveryManager = require('./recording-system/recovery-manager');
const recovery = new RecoveryManager('/project/learning');

// 列出所有会话
const sessions = recovery.generateSessionsSummary();
console.log(sessions);

// 生成进度报告
const report = recovery.generateProgressReport('my-learning-session');
console.log(report);
```

## 数据结构

### sessions.json

```json
{
  "sessions": [
    {
      "id": "session-name",
      "projectPath": "/path/to/project",
      "createdAt": "2026-05-05T14:30:22Z",
      "lastAccessed": "2026-05-05T16:45:10Z",
      "totalTimeMinutes": 135,
      "status": "in-progress",
      "completedStages": ["stage0", "stage1"],
      "currentStage": "stage2"
    }
  ]
}
```

### progress.json

```json
{
  "currentStage": "stage2",
  "stagesCompleted": ["stage0", "stage1"],
  "stats": {
    "totalQuestions": 12,
    "filesExplored": 5,
    "conceptsCovered": ["context-calculation", "caching"],
    "startTime": "2026-05-05T14:30:22Z",
    "lastUpdateTime": "2026-05-05T16:45:10Z",
    "totalTimeMinutes": 135
  },
  "lastTopic": "理解缓存策略",
  "nextSteps": ["探索工具追踪", "了解渲染系统"]
}
```

## 开发状态

- ✅ 会话管理器 (SessionManager)
- ✅ 实时记录器 (RealtimeRecorder)
- ✅ 恢复管理器 (RecoveryManager)
- ⏸️ 里程碑记录器 (MilestoneRecorder) - 阶段2
- ⏸️ 归档生成器 (ArchiveGenerator) - 阶段3
