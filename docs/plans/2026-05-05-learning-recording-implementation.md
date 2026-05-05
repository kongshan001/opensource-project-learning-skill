# 学习记录系统实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**目标:** 为 opensource-project-learning skill 添加学习进度记录和归档功能，实现自动保存、会话管理和智能恢复。

**架构:** 采用独立记录模块方案，在 SKILL.md 的关键位置添加记录调用点。记录系统包含会话管理器、实时记录器、里程碑记录器、归档生成器和恢复管理器五个核心组件。

**技术栈:** Node.js 文件系统操作、JSON 数据存储、Markdown 文件生成

**相关技能:** @opensource-project-learning

---

## 📋 实施范围

**本计划专注于阶段1（MVP）核心功能：**

1. 会话管理器 - 初始化、检测、创建会话
2. 实时记录器 - 更新 progress.json、对话缓冲
3. 恢复管理器 - 显示会话列表、加载进度
4. SKILL.md 集成 - 在关键位置添加记录调用

**不包含（后续阶段）：**
- 里程碑记录（阶段2）
- 归档生成器（阶段3）
- 错误处理和增强功能（阶段4）

---

## 📁 文件结构

```
.claude/skills/opensource-project-learning/
├── SKILL.md                          # 修改：添加记录调用点
├── recording-system/                 # 新增：记录系统模块
│   ├── session-manager.js            # 新增：会话管理器
│   ├── realtime-recorder.js          # 新增：实时记录器
│   ├── recovery-manager.js           # 新增：恢复管理器
│   └── templates/                    # 新增：文件模板
│       ├── sessions.json.template
│       ├── meta.json.template
│       └── progress.json.template
└── tests/                            # 新增：测试文件
    ├── session-manager.test.js
    ├── realtime-recorder.test.js
    └── recovery-manager.test.js
```

---

## Task 1: 创建记录系统目录和模板文件

**Files:**
- Create: `.claude/skills/opensource-project-learning/recording-system/`
- Create: `.claude/skills/opensource-project-learning/recording-system/templates/`
- Create: `.claude/skills/opensource-project-learning/recording-system/templates/sessions.json.template`
- Create: `.claude/skills/opensource-project-learning/recording-system/templates/meta.json.template`
- Create: `.claude/skills/opensource-project-learning/recording-system/templates/progress.json.template`

**Step 1: 创建目录结构**

```bash
mkdir -p .claude/skills/opensource-project-learning/recording-system/templates
```

**Step 2: 创建 sessions.json 模板**

```bash
cat > .claude/skills/opensource-project-learning/recording-system/templates/sessions.json.template << 'EOF'
{
  "sessions": []
}
EOF
```

**Step 3: 创建 meta.json 模板**

```bash
cat > .claude/skills/opensource-project-learning/recording-system/templates/meta.json.template << 'EOF'
{
  "sessionId": "{{SESSION_ID}}",
  "projectName": "{{PROJECT_NAME}}",
  "projectPath": "{{PROJECT_PATH}}",
  "projectUrl": "",
  "createdAt": "{{CREATED_AT}}",
  "lastModified": "{{LAST_MODIFIED}}",
  "learningGoals": [],
  "userBackground": {
    "knownTechs": [],
    "unknownTechs": []
  }
}
EOF
```

**Step 4: 创建 progress.json 模板**

```bash
cat > .claude/skills/opensource-project-learning/recording-system/templates/progress.json.template << 'EOF'
{
  "currentStage": "stage0",
  "stagesCompleted": [],
  "stats": {
    "totalQuestions": 0,
    "filesExplored": 0,
    "conceptsCovered": [],
    "startTime": "{{START_TIME}}",
    "lastUpdateTime": "{{LAST_UPDATE_TIME}}",
    "totalTimeMinutes": 0
  },
  "lastTopic": "",
  "nextSteps": []
}
EOF
```

**Step 5: 验证文件创建**

```bash
ls -la .claude/skills/opensource-project-learning/recording-system/templates/
```

Expected: 显示3个模板文件

**Step 6: Commit**

```bash
git add .claude/skills/opensource-project-learning/recording-system/
git commit -m "feat: add recording system templates and directory structure"
```

---

## Task 2: 实现会话管理器 (Session Manager)

**Files:**
- Create: `.claude/skills/opensource-project-learning/recording-system/session-manager.js`
- Create: `.claude/skills/opensource-project-learning/tests/session-manager.test.js`

**Step 1: 编写会话管理器测试**

```bash
cat > .claude/skills/opensource-project-learning/tests/session-manager.test.js << 'EOF'
const SessionManager = require('../recording-system/session-manager');
const fs = require('fs');
const path = require('path');

const TEST_DIR = path.join(__dirname, 'test-data');
const PROJECT_PATH = '/fake/project/path';

describe('SessionManager', () => {
  beforeEach(() => {
    // 清理测试目录
    if (fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true });
    }
    fs.mkdirSync(TEST_DIR, { recursive: true });
  });

  afterEach(() => {
    // 清理测试目录
    if (fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true });
    }
  });

  describe('初始化会话', () => {
    test('应该创建新的学习会话', () => {
      const manager = new SessionManager(TEST_DIR, PROJECT_PATH);
      const sessionId = 'test-session';

      const result = manager.initializeSession(sessionId);

      expect(result.sessionId).toBe(sessionId);
      expect(result.sessionPath).toContain(sessionId);
      expect(fs.existsSync(result.sessionPath)).toBe(true);
    });

    test('应该创建 sessions.json 索引文件', () => {
      const manager = new SessionManager(TEST_DIR, PROJECT_PATH);
      const sessionId = 'test-session';

      manager.initializeSession(sessionId);

      const sessionsPath = path.join(TEST_DIR, 'sessions.json');
      expect(fs.existsSync(sessionsPath)).toBe(true);

      const sessionsData = JSON.parse(fs.readFileSync(sessionsPath, 'utf8'));
      expect(sessionsData.sessions).toHaveLength(1);
      expect(sessionsData.sessions[0].id).toBe(sessionId);
    });

    test('应该创建会话元数据文件', () => {
      const manager = new SessionManager(TEST_DIR, PROJECT_PATH);
      const sessionId = 'test-session';

      const result = manager.initializeSession(sessionId);
      const metaPath = path.join(result.sessionPath, 'meta.json');

      expect(fs.existsSync(metaPath)).toBe(true);

      const metaData = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
      expect(metaData.sessionId).toBe(sessionId);
      expect(metaData.projectPath).toBe(PROJECT_PATH);
    });

    test('应该创建初始进度文件', () => {
      const manager = new SessionManager(TEST_DIR, PROJECT_PATH);
      const sessionId = 'test-session';

      const result = manager.initializeSession(sessionId);
      const progressPath = path.join(result.sessionPath, 'progress.json');

      expect(fs.existsSync(progressPath)).toBe(true);

      const progressData = JSON.parse(fs.readFileSync(progressPath, 'utf8'));
      expect(progressData.currentStage).toBe('stage0');
      expect(progressData.stagesCompleted).toEqual([]);
    });
  });

  describe('检测已有会话', () => {
    test('应该返回空数组当没有会话时', () => {
      const manager = new SessionManager(TEST_DIR, PROJECT_PATH);

      const sessions = manager.listSessions();

      expect(sessions).toEqual([]);
    });

    test('应该列出所有已存在的会话', () => {
      const manager = new SessionManager(TEST_DIR, PROJECT_PATH);

      manager.initializeSession('session-1');
      manager.initializeSession('session-2');

      const sessions = manager.listSessions();

      expect(sessions).toHaveLength(2);
      expect(sessions[0].id).toBe('session-1');
      expect(sessions[1].id).toBe('session-2');
    });

    test('应该包含会话的元数据信息', () => {
      const manager = new SessionManager(TEST_DIR, PROJECT_PATH);

      manager.initializeSession('test-session');

      const sessions = manager.listSessions();

      expect(sessions[0]).toHaveProperty('id');
      expect(sessions[0]).toHaveProperty('createdAt');
      expect(sessions[0]).toHaveProperty('status');
      expect(sessions[0]).toHaveProperty('currentStage');
    });
  });

  describe('加载会话', () => {
    test('应该加载指定会话的数据', () => {
      const manager = new SessionManager(TEST_DIR, PROJECT_PATH);
      const sessionId = 'test-session';

      manager.initializeSession(sessionId);

      const session = manager.loadSession(sessionId);

      expect(session.sessionId).toBe(sessionId);
      expect(session.meta).toBeDefined();
      expect(session.progress).toBeDefined();
    });

    test('应该抛出错误当会话不存在时', () => {
      const manager = new SessionManager(TEST_DIR, PROJECT_PATH);

      expect(() => {
        manager.loadSession('non-existent');
      }).toThrow();
    });
  });
});
EOF
```

**Step 2: 运行测试验证失败**

```bash
cd .claude/skills/opensource-project-learning
node tests/session-manager.test.js 2>&1 || true
```

Expected: Error "Cannot find module '../recording-system/session-manager'"

**Step 3: 实现会话管理器**

```bash
cat > .claude/skills/opensource-project-learning/recording-system/session-manager.js << 'EOF'
const fs = require('fs');
const path = require('path');

class SessionManager {
  constructor(learningDir, projectPath) {
    this.learningDir = learningDir;
    this.projectPath = projectPath;
    this.sessionsJsonPath = path.join(learningDir, 'sessions.json');
  }

  /**
   * 初始化新的学习会话
   * @param {string} sessionId - 会话ID（用户提供的主题）
   * @returns {Object} 会话信息
   */
  initializeSession(sessionId) {
    // 确保 learning 目录存在
    if (!fs.existsSync(this.learningDir)) {
      fs.mkdirSync(this.learningDir, { recursive: true });
    }

    // 创建会话目录
    const sessionPath = path.join(this.learningDir, sessionId);
    if (fs.existsSync(sessionPath)) {
      throw new Error(`会话 ${sessionId} 已存在`);
    }
    fs.mkdirSync(sessionPath, { recursive: true });

    // 获取当前时间戳
    const now = new Date().toISOString();

    // 创建 meta.json
    const meta = {
      sessionId: sessionId,
      projectName: path.basename(this.projectPath),
      projectPath: this.projectPath,
      projectUrl: '',
      createdAt: now,
      lastModified: now,
      learningGoals: [],
      userBackground: {
        knownTechs: [],
        unknownTechs: []
      }
    };
    fs.writeFileSync(
      path.join(sessionPath, 'meta.json'),
      JSON.stringify(meta, null, 2),
      'utf8'
    );

    // 创建 progress.json
    const progress = {
      currentStage: 'stage0',
      stagesCompleted: [],
      stats: {
        totalQuestions: 0,
        filesExplored: 0,
        conceptsCovered: [],
        startTime: now,
        lastUpdateTime: now,
        totalTimeMinutes: 0
      },
      lastTopic: '',
      nextSteps: []
    };
    fs.writeFileSync(
      path.join(sessionPath, 'progress.json'),
      JSON.stringify(progress, null, 2),
      'utf8'
    );

    // 更新 sessions.json 索引
    this._updateSessionsIndex({
      id: sessionId,
      projectPath: this.projectPath,
      createdAt: now,
      lastAccessed: now,
      totalTimeMinutes: 0,
      status: 'in-progress',
      completedStages: [],
      currentStage: 'stage0'
    });

    return {
      sessionId: sessionId,
      sessionPath: sessionPath,
      meta: meta,
      progress: progress
    };
  }

  /**
   * 列出所有学习会话
   * @returns {Array} 会话列表
   */
  listSessions() {
    if (!fs.existsSync(this.sessionsJsonPath)) {
      return [];
    }

    const data = JSON.parse(fs.readFileSync(this.sessionsJsonPath, 'utf8'));
    return data.sessions || [];
  }

  /**
   * 加载指定会话
   * @param {string} sessionId - 会话ID
   * @returns {Object} 会话数据
   */
  loadSession(sessionId) {
    const sessionPath = path.join(this.learningDir, sessionId);

    if (!fs.existsSync(sessionPath)) {
      throw new Error(`会话 ${sessionId} 不存在`);
    }

    const metaPath = path.join(sessionPath, 'meta.json');
    const progressPath = path.join(sessionPath, 'progress.json');

    if (!fs.existsSync(metaPath) || !fs.existsSync(progressPath)) {
      throw new Error(`会话 ${sessionId} 数据不完整`);
    }

    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    const progress = JSON.parse(fs.readFileSync(progressPath, 'utf8'));

    // 更新最后访问时间
    this._updateLastAccessed(sessionId);

    return {
      sessionId: sessionId,
      sessionPath: sessionPath,
      meta: meta,
      progress: progress
    };
  }

  /**
   * 更新 sessions.json 索引
   * @private
   */
  _updateSessionsIndex(sessionInfo) {
    let data = { sessions: [] };

    if (fs.existsSync(this.sessionsJsonPath)) {
      data = JSON.parse(fs.readFileSync(this.sessionsJsonPath, 'utf8'));
    }

    // 检查是否已存在
    const existingIndex = data.sessions.findIndex(s => s.id === sessionInfo.id);
    if (existingIndex >= 0) {
      data.sessions[existingIndex] = sessionInfo;
    } else {
      data.sessions.push(sessionInfo);
    }

    fs.writeFileSync(
      this.sessionsJsonPath,
      JSON.stringify(data, null, 2),
      'utf8'
    );
  }

  /**
   * 更新会话的最后访问时间
   * @private
   */
  _updateLastAccessed(sessionId) {
    if (!fs.existsSync(this.sessionsJsonPath)) {
      return;
    }

    const data = JSON.parse(fs.readFileSync(this.sessionsJsonPath, 'utf8'));
    const session = data.sessions.find(s => s.id === sessionId);

    if (session) {
      session.lastAccessed = new Date().toISOString();
      fs.writeFileSync(
        this.sessionsJsonPath,
        JSON.stringify(data, null, 2),
        'utf8'
      );
    }
  }
}

module.exports = SessionManager;
EOF
```

**Step 4: 安装测试依赖**

```bash
cd .claude/skills/opensource-project-learning
npm init -y
npm install --save-dev jest
```

**Step 5: 运行测试验证通过**

```bash
cd .claude/skills/opensource-project-learning
npx jest tests/session-manager.test.js --verbose
```

Expected: PASS (所有测试通过)

**Step 6: Commit**

```bash
git add .claude/skills/opensource-project-learning/recording-system/session-manager.js
git add .claude/skills/opensource-project-learning/tests/session-manager.test.js
git add .claude/skills/opensource-project-learning/package.json
git add .claude/skills/opensource-project-learning/package-lock.json
git commit -m "feat: implement session manager with tests"
```

---

## Task 3: 实现实时记录器 (Realtime Recorder)

**Files:**
- Create: `.claude/skills/opensource-project-learning/recording-system/realtime-recorder.js`
- Create: `.claude/skills/opensource-project-learning/tests/realtime-recorder.test.js`

**Step 1: 编写实时记录器测试**

```bash
cat > .claude/skills/opensource-project-learning/tests/realtime-recorder.test.js << 'EOF'
const RealtimeRecorder = require('../recording-system/realtime-recorder');
const SessionManager = require('../recording-system/session-manager');
const fs = require('fs');
const path = require('path');

const TEST_DIR = path.join(__dirname, 'test-data');
const PROJECT_PATH = '/fake/project/path';

describe('RealtimeRecorder', () => {
  let manager;
  let sessionId;
  let sessionPath;

  beforeEach(() => {
    if (fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true });
    }
    fs.mkdirSync(TEST_DIR, { recursive: true });

    manager = new SessionManager(TEST_DIR, PROJECT_PATH);
    sessionId = 'test-session';
    const result = manager.initializeSession(sessionId);
    sessionPath = result.sessionPath;
  });

  afterEach(() => {
    if (fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true });
    }
  });

  describe('更新进度', () => {
    test('应该更新当前阶段', () => {
      const recorder = new RealtimeRecorder(sessionPath);

      recorder.updateProgress({ currentStage: 'stage1' });

      const progress = recorder.loadProgress();
      expect(progress.currentStage).toBe('stage1');
    });

    test('应该添加已完成的阶段', () => {
      const recorder = new RealtimeRecorder(sessionPath);

      recorder.updateProgress({
        currentStage: 'stage1',
        completedStages: ['stage0']
      });

      const progress = recorder.loadProgress();
      expect(progress.stagesCompleted).toContain('stage0');
    });

    test('应该增加提问计数', () => {
      const recorder = new RealtimeRecorder(sessionPath);

      recorder.updateProgress({
        stats: {
          totalQuestions: 5
        }
      });

      const progress = recorder.loadProgress();
      expect(progress.stats.totalQuestions).toBe(5);
    });

    test('应该添加探索的概念', () => {
      const recorder = new RealtimeRecorder(sessionPath);

      recorder.updateProgress({
        stats: {
          conceptsCovered: ['context-calculation', 'caching']
        }
      });

      const progress = recorder.loadProgress();
      expect(progress.stats.conceptsCovered).toContain('context-calculation');
      expect(progress.stats.conceptsCovered).toContain('caching');
    });

    test('应该更新最后修改时间', () => {
      const recorder = new RealtimeRecorder(sessionPath);
      const before = new Date();

      recorder.updateProgress({ currentStage: 'stage1' });

      const progress = recorder.loadProgress();
      const lastUpdate = new Date(progress.stats.lastUpdateTime);
      expect(lastUpdate.getTime()).toBeGreaterThanOrEqual(before.getTime());
    });
  });

  describe('记录对话', () => {
    test('应该创建对话缓冲区文件', () => {
      const recorder = new RealtimeRecorder(sessionPath);

      recorder.appendConversation('用户', '帮我学习这个项目');

      const bufferPath = path.join(sessionPath, 'conversation-buffer.md');
      expect(fs.existsSync(bufferPath)).toBe(true);
    });

    test('应该追加对话内容', () => {
      const recorder = new RealtimeRecorder(sessionPath);

      recorder.appendConversation('用户', '帮我学习这个项目');
      recorder.appendConversation('AI', '好的！让我们开始...');

      const bufferPath = path.join(sessionPath, 'conversation-buffer.md');
      const content = fs.readFileSync(bufferPath, 'utf8');

      expect(content).toContain('帮我学习这个项目');
      expect(content).toContain('好的！让我们开始...');
    });

    test('应该使用正确的格式记录对话', () => {
      const recorder = new RealtimeRecorder(sessionPath);

      recorder.appendConversation('用户', '测试消息');

      const bufferPath = path.join(sessionPath, 'conversation-buffer.md');
      const content = fs.readFileSync(bufferPath, 'utf8');

      expect(content).toMatch(/### 用户/);
      expect(content).toMatch(/测试消息/);
    });
  });

  describe('记录最后话题', () => {
    test('应该更新最后话题', () => {
      const recorder = new RealtimeRecorder(sessionPath);

      recorder.updateLastTopic('理解上下文计算');

      const progress = recorder.loadProgress();
      expect(progress.lastTopic).toBe('理解上下文计算');
    });
  });
});
EOF
```

**Step 2: 运行测试验证失败**

```bash
cd .claude/skills/opensource-project-learning
npx jest tests/realtime-recorder.test.js --verbose 2>&1 || true
```

Expected: Error "Cannot find module '../recording-system/realtime-recorder'"

**Step 3: 实现实时记录器**

```bash
cat > .claude/skills/opensource-project-learning/recording-system/realtime-recorder.js << 'EOF'
const fs = require('fs');
const path = require('path');

class RealtimeRecorder {
  constructor(sessionPath) {
    this.sessionPath = sessionPath;
    this.progressPath = path.join(sessionPath, 'progress.json');
    this.bufferPath = path.join(sessionPath, 'conversation-buffer.md');
  }

  /**
   * 更新进度数据
   * @param {Object} updates - 要更新的字段
   */
  updateProgress(updates) {
    if (!fs.existsSync(this.progressPath)) {
      throw new Error('progress.json 不存在');
    }

    const progress = JSON.parse(fs.readFileSync(this.progressPath, 'utf8'));
    const now = new Date().toISOString();

    // 更新字段
    if (updates.currentStage) {
      progress.currentStage = updates.currentStage;
    }

    if (updates.completedStages) {
      progress.stagesCompleted = updates.completedStages;
    }

    if (updates.stats) {
      if (updates.stats.totalQuestions !== undefined) {
        progress.stats.totalQuestions = updates.stats.totalQuestions;
      }
      if (updates.stats.filesExplored !== undefined) {
        progress.stats.filesExplored = updates.stats.filesExplored;
      }
      if (updates.stats.conceptsCovered) {
        progress.stats.conceptsCovered = updates.stats.conceptsCovered;
      }
    }

    // 更新时间戳
    progress.stats.lastUpdateTime = now;

    fs.writeFileSync(
      this.progressPath,
      JSON.stringify(progress, null, 2),
      'utf8'
    );
  }

  /**
   * 追加对话到缓冲区
   * @param {string} role - 角色（用户/AI）
   * @param {string} content - 对话内容
   */
  appendConversation(role, content) {
    const timestamp = new Date().toLocaleString('zh-CN');
    const entry = `\n### ${role}\n${role}: ${content}\n`;

    fs.appendFileSync(this.bufferPath, entry, 'utf8');
  }

  /**
   * 更新最后讨论的话题
   * @param {string} topic - 话题描述
   */
  updateLastTopic(topic) {
    this.updateProgress({ lastTopic: topic });
  }

  /**
   * 添加下一步行动
   * @param {Array} steps - 步骤列表
   */
  addNextSteps(steps) {
    const progress = this.loadProgress();
    progress.nextSteps = steps;

    fs.writeFileSync(
      this.progressPath,
      JSON.stringify(progress, null, 2),
      'utf8'
    );
  }

  /**
   * 加载进度数据
   * @returns {Object} 进度数据
   */
  loadProgress() {
    if (!fs.existsSync(this.progressPath)) {
      throw new Error('progress.json 不存在');
    }

    return JSON.parse(fs.readFileSync(this.progressPath, 'utf8'));
  }
}

module.exports = RealtimeRecorder;
EOF
```

**Step 4: 运行测试验证通过**

```bash
cd .claude/skills/opensource-project-learning
npx jest tests/realtime-recorder.test.js --verbose
```

Expected: PASS (所有测试通过)

**Step 5: Commit**

```bash
git add .claude/skills/opensource-project-learning/recording-system/realtime-recorder.js
git add .claude/skills/opensource-project-learning/tests/realtime-recorder.test.js
git commit -m "feat: implement realtime recorder with tests"
```

---

## Task 4: 实现恢复管理器 (Recovery Manager)

**Files:**
- Create: `.claude/skills/opensource-project-learning/recording-system/recovery-manager.js`
- Create: `.claude/skills/opensource-project-learning/tests/recovery-manager.test.js`

**Step 1: 编写恢复管理器测试**

```bash
cat > .claude/skills/opensource-project-learning/tests/recovery-manager.test.js << 'EOF'
const RecoveryManager = require('../recording-system/recovery-manager');
const SessionManager = require('../recording-system/session-manager');
const fs = require('fs');
const path = require('path');

const TEST_DIR = path.join(__dirname, 'test-data');
const PROJECT_PATH = '/fake/project/path';

describe('RecoveryManager', () => {
  let manager;

  beforeEach(() => {
    if (fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true });
    }
    fs.mkdirSync(TEST_DIR, { recursive: true });

    manager = new SessionManager(TEST_DIR, PROJECT_PATH);
  });

  afterEach(() => {
    if (fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true });
    }
  });

  describe('生成会话摘要', () => {
    test('应该生成空列表当没有会话时', () => {
      const recovery = new RecoveryManager(TEST_DIR);

      const summary = recovery.generateSessionsSummary();

      expect(summary).toContain('没有找到学习记录');
    });

    test('应该生成会话列表摘要', () => {
      const recovery = new RecoveryManager(TEST_DIR);

      manager.initializeSession('session-1');
      manager.initializeSession('session-2');

      const summary = recovery.generateSessionsSummary();

      expect(summary).toContain('session-1');
      expect(summary).toContain('session-2');
    });

    test('应该包含会话的进度信息', () => {
      const recovery = new RecoveryManager(TEST_DIR);

      const result = manager.initializeSession('test-session');
      const recorder = require('../recording-system/realtime-recorder');
      const rtRecorder = new recorder(result.sessionPath);
      rtRecorder.updateProgress({
        currentStage: 'stage1',
        completedStages: ['stage0']
      });

      const summary = recovery.generateSessionsSummary();

      expect(summary).toContain('阶段0');
      expect(summary).toContain('阶段1');
    });
  });

  describe('生成进度报告', () => {
    test('应该生成详细的进度报告', () => {
      const recovery = new RecoveryManager(TEST_DIR);

      const result = manager.initializeSession('test-session');
      const recorder = require('../recording-system/realtime-recorder');
      const rtRecorder = new recorder(result.sessionPath);
      rtRecorder.updateProgress({
        currentStage: 'stage2',
        completedStages: ['stage0', 'stage1'],
        stats: {
          totalQuestions: 10,
          filesExplored: 5
        }
      });

      const report = recovery.generateProgressReport('test-session');

      expect(report).toContain('test-session');
      expect(report).toContain('已完成阶段：');
      expect(report).toContain('当前阶段：');
      expect(report).toContain('10');
      expect(report).toContain('5');
    });
  });
});
EOF
```

**Step 2: 运行测试验证失败**

```bash
cd .claude/skills/opensource-project-learning
npx jest tests/recovery-manager.test.js --verbose 2>&1 || true
```

Expected: Error "Cannot find module '../recording-system/recovery-manager'"

**Step 3: 实现恢复管理器**

```bash
cat > .claude/skills/opensource-project-learning/recording-system/recovery-manager.js << 'EOF'
const fs = require('fs');
const path = require('path');
const SessionManager = require('./session-manager');

class RecoveryManager {
  constructor(learningDir) {
    this.learningDir = learningDir;
    this.sessionManager = new SessionManager(learningDir, '');
  }

  /**
   * 生成会话列表摘要（中文）
   * @returns {string} 会话摘要
   */
  generateSessionsSummary() {
    const sessions = this.sessionManager.listSessions();

    if (sessions.length === 0) {
      return '没有找到学习记录。';
    }

    let summary = `检测到你之前有 ${sessions.length} 个学习记录：\n\n`;

    sessions.forEach((session, index) => {
      const date = new Date(session.lastAccessed).toLocaleDateString('zh-CN');
      const status = session.status === 'in-progress' ? '进行中' : '已完成';

      summary += `${index + 1}. ${session.id}\n`;
      summary += `   时间：${date}\n`;
      summary += `   状态：${status}\n`;

      if (session.completedStages.length > 0) {
        const stageNames = this._translateStageNames(session.completedStages);
        summary += `   已完成：${stageNames.join('、')}\n`;
      }

      summary += '\n';
    });

    return summary;
  }

  /**
   * 生成详细进度报告（中文）
   * @param {string} sessionId - 会话ID
   * @returns {string} 进度报告
   */
  generateProgressReport(sessionId) {
    const session = this.sessionManager.loadSession(sessionId);
    const progress = session.progress;

    let report = `欢迎回来！👋\n\n`;
    report += `你在 '${session.meta.sessionId}' 中的进度：\n\n`;

    // 已完成的阶段
    if (progress.stagesCompleted.length > 0) {
      const completedNames = this._translateStageNames(progress.stagesCompleted);
      report += `✅ 已完成阶段：${completedNames.join('、')}\n`;
    } else {
      report += `✅ 已完成阶段：无\n`;
    }

    // 当前阶段
    report += `🔄 当前阶段：${this._translateStageName(progress.currentStage)}\n`;

    // 未开始的阶段
    const allStages = ['stage0', 'stage1', 'stage2', 'stage3'];
    const remaining = allStages.filter(s => !progress.stagesCompleted.includes(s) && s !== progress.currentStage);
    if (remaining.length > 0) {
      const remainingNames = this._translateStageNames(remaining);
      report += `⏸️ 未开始：${remainingNames.join('、')}\n`;
    }

    report += '\n';

    // 最后话题
    if (progress.lastTopic) {
      report += `上次学习停在：${progress.lastTopic}\n\n`;
    }

    // 统计信息
    report += `学习统计：\n`;
    report += `- 提问次数：${progress.stats.totalQuestions}\n`;
    report += `- 探索文件：${progress.stats.filesExplored}\n`;
    report += `- 学习时长：${progress.stats.totalTimeMinutes} 分钟\n`;

    return report;
  }

  /**
   * 翻译阶段名称（中文）
   * @private
   */
  _translateStageName(stage) {
    const stageMap = {
      'stage0': '阶段0（快速上手）',
      'stage1': '阶段1（初步了解）',
      'stage2': '阶段2（深入探索）',
      'stage3': '阶段3（实践应用）'
    };
    return stageMap[stage] || stage;
  }

  /**
   * 批量翻译阶段名称
   * @private
   */
  _translateStageNames(stages) {
    return stages.map(s => this._translateStageName(s));
  }
}

module.exports = RecoveryManager;
EOF
```

**Step 4: 运行测试验证通过**

```bash
cd .claude/skills/opensource-project-learning
npx jest tests/recovery-manager.test.js --verbose
```

Expected: PASS (所有测试通过)

**Step 5: Commit**

```bash
git add .claude/skills/opensource-project-learning/recording-system/recovery-manager.js
git add .claude/skills/opensource-project-learning/tests/recovery-manager.test.js
git commit -m "feat: implement recovery manager with tests"
```

---

## Task 5: 在 SKILL.md 中集成记录系统

**Files:**
- Modify: `.claude/skills/opensource-project-learning/SKILL.md`

**Step 1: 在 SKILL.md 开头添加功能说明**

在 `## 📚 **Skill 概述**` 之后添加：

```markdown
## 📝 学习记录功能

本技能支持自动记录学习进度，方便随时恢复和回顾。

**功能特性**：
- ✅ 自动保存学习进度（实时 + 里程碑）
- ✅ 支持多会话管理
- ✅ 智能恢复学习进度
- ✅ 生成完整学习归档

首次使用时会自动在项目目录下创建 `learning/` 目录并记录学习过程。

---
```

**Step 2: 在"阶段 0"开头添加初始化调用**

在 `### **阶段 0: 快速上手（实践优先）**` 之后，`**核心原则**: **用→理解→深入**` 之前添加：

```markdown
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
```

**Step 3: 在每个阶段末尾添加记录调用**

在每个阶段的末尾添加（以阶段0为例）：

```markdown

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
```

**Step 4: 在 SKILL.md 末尾添加独立章节**

在文件末尾添加：

```markdown
---

## 🗂️ **学习记录系统（独立模块）**

### **记录器调用接口**

#### 1. 初始化学习会话

**使用场景**: 技能启动时

**输入**: 项目路径

**输出**: 会话ID、会话目录路径

**动作**:
- 检测已有会话（读取 `learning/sessions.json`）
- 创建/加载会话
- 更新 `sessions.json`

**示例实现**:
```javascript
const SessionManager = require('./recording-system/session-manager');
const learningDir = path.join(projectPath, 'learning');
const manager = new SessionManager(learningDir, projectPath);

// 检查已有会话
const sessions = manager.listSessions();
if (sessions.length > 0) {
  // 显示会话列表让用户选择
  // 选项：查看记录、继续会话、新建会话
} else {
  // 创建新会话
  const sessionId = await askUser("请输入会话主题名称");
  const session = manager.initializeSession(sessionId);
}
```

---

#### 2. 实时更新进度

**使用场景**: 每次用户交互后

**输入**: 会话ID、进度数据

**输出**: 无

**动作**:
- 更新 `progress.json`
- 追加到 `conversation-buffer.md`

**示例实现**:
```javascript
const RealtimeRecorder = require('./recording-system/realtime-recorder');
const recorder = new RealtimeRecorder(sessionPath);

// 更新当前阶段
recorder.updateProgress({ currentStage: 'stage1' });

// 记录对话
recorder.appendConversation('用户', userMessage);
recorder.appendConversation('AI', aiResponse);
```

---

#### 3. 保存阶段记录

**使用场景**: 完成学习阶段时

**输入**: 会话ID、阶段编号、对话内容

**输出**: 归档文件路径

**动作**:
- 创建 `stageX/` 目录
- 生成 `conversation.md`
- 提取 `key-points.md`
- 更新 `progress.json`

**注意**: 此功能在阶段2实施，当前MVP版本暂不实现。

---

#### 4. 恢复学习会话

**使用场景**: 用户说"继续学习"

**输入**: 项目路径

**输出**: 会话历史、进度摘要

**动作**:
- 读取 `sessions.json`
- 显示会话列表
- 加载选定会话

**示例实现**:
```javascript
const RecoveryManager = require('./recording-system/recovery-manager');
const learningDir = path.join(projectPath, 'learning');
const recovery = new RecoveryManager(learningDir);

// 生成会话摘要
const summary = recovery.generateSessionsSummary();
console.log(summary);

// 询问用户选择
const choice = await askUser("你想：1. 查看记录 2. 继续会话 3. 新建会话");

if (choice === '2') {
  const sessionId = await askUser("输入要继续的会话ID");
  const report = recovery.generateProgressReport(sessionId);
  console.log(report);
}
```

---

#### 5. 生成最终归档

**使用场景**: 学习完成时

**输入**: 会话ID

**输出**: 归档目录路径

**动作**:
- 汇总所有阶段
- 生成 `final/` 的5个文件
- 更新 `sessions.json` 状态

**注意**: 此功能在阶段3实施，当前MVP版本暂不实现。

---

### **文件结构参考**

```
项目根目录/
└── learning/
    ├── sessions.json                    # 会话索引
    ├── {用户主题}/                      # 会话目录
    │   ├── meta.json                    # 元数据
    │   ├── progress.json                # 实时进度
    │   ├── conversation-buffer.md       # 对话缓冲
    │   └── stageX/                      # 阶段记录（阶段2实施）
    │       ├── conversation.md
    │       └── key-points.md
    └── final/                           # 最终归档（阶段3实施）
        ├── summary.md
        ├── key-points.md
        ├── next-steps.md
        ├── progress.json
        └── conversation.md
```

---

### **使用示例**

#### 示例 1: 首次学习项目

```
用户: "帮我学习 claude-hud"

AI: "检测到这是首次学习该项目。

为了方便后续记录和回顾，请为这次学习会话起个主题名称。

例如：'claude-hud-初探'、'理解上下文计算' 等"

用户: "claude-hud-初探"

AI: "[创建记录] 学习会话已创建！开始学习...

[... 学习过程 ...]

AI: "阶段0已完成！已记录：
- 完成阶段：阶段0（快速上手）
- 探索概念：3个
- 提问次数：5次

想继续学习阶段1吗？"
```

#### 示例 2: 继续之前的学习

```
用户: "继续学习 claude-hud"

AI: "检测到你之前有学习记录：

1. claude-hud-初探 (2026-05-04，阶段0-1已完成)
2. 深入理解缓存 (2026-05-03，进行中)

你想：
1. 查看某个会话的详细记录
2. 继续之前的会话
3. 创建新的学习会话"

用户: "2"

AI: "请选择要继续的会话：1 或 2"

用户: "1"

AI: "欢迎回来！👋

你在 'claude-hud-初探' 中的进度：
✅ 已完成阶段：阶段0（快速上手）、阶段1（初步了解）
🔄 当前阶段：阶段2（深入探索）
⏸️ 未开始：阶段3（实践应用）

上次学习停在：理解上下文计算原理

你想：
1. 查看上次的学习记录
2. 直接从阶段2继续
3. 其他"
```

---

**注意**: 当前实施计划为阶段1（MVP），包含基本会话管理、实时记录和恢复功能。阶段归档和最终归档将在后续阶段实施。
```

**Step 5: 验证修改**

```bash
cd .claude/skills/opensource-project-learning
grep -n "学习记录功能" SKILL.md
grep -n "初始化学习会话" SKILL.md
grep -n "记录里程碑" SKILL.md
```

Expected: 显示新增的章节标题

**Step 6: Commit**

```bash
git add .claude/skills/opensource-project-learning/SKILL.md
git commit -m "feat: integrate recording system into SKILL.md"
```

---

## Task 6: 添加测试脚本和文档

**Files:**
- Create: `.claude/skills/opensource-project-learning/tests/README.md`
- Create: `.claude/skills/opensource-project-learning/recording-system/README.md`
- Modify: `.claude/skills/opensource-project-learning/package.json`

**Step 1: 创建测试文档**

```bash
cat > .claude/skills/opensource-project-learning/tests/README.md << 'EOF'
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
EOF
```

**Step 2: 创建记录系统文档**

```bash
cat > .claude/skills/opensource-project-learning/recording-system/README.md << 'EOF'
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
EOF
```

**Step 3: 更新 package.json 添加测试脚本**

```bash
cd .claude/skills/opensource-project-learning
npm pkg set scripts.test="jest"
```

**Step 4: 运行所有测试验证**

```bash
cd .claude/skills/opensource-project-learning
npm test
```

Expected: 所有测试通过

**Step 5: Commit**

```bash
git add .claude/skills/opensource-project-learning/tests/README.md
git add .claude/skills/opensource-project-learning/recording-system/README.md
git add .claude/skills/opensource-project-learning/package.json
git commit -m "docs: add test documentation and recording system README"
```

---

## Task 7: 创建集成测试

**Files:**
- Create: `.claude/skills/opensource-project-learning/tests/integration.test.js`

**Step 1: 编写集成测试**

```bash
cat > .claude/skills/opensource-project-learning/tests/integration.test.js << 'EOF'
const SessionManager = require('../recording-system/session-manager');
const RealtimeRecorder = require('../recording-system/realtime-recorder');
const RecoveryManager = require('../recording-system/recovery-manager');
const fs = require('fs');
const path = require('path');

const TEST_DIR = path.join(__dirname, 'test-data');
const PROJECT_PATH = '/fake/project/path';

describe('学习记录系统集成测试', () => {
  beforeEach(() => {
    if (fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true });
    }
    fs.mkdirSync(TEST_DIR, { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true });
    }
  });

  test('完整的学习流程', () => {
    // 1. 初始化会话
    const manager = new SessionManager(TEST_DIR, PROJECT_PATH);
    const sessionId = 'test-learning-session';
    const session = manager.initializeSession(sessionId);

    expect(session.sessionId).toBe(sessionId);
    expect(fs.existsSync(session.sessionPath)).toBe(true);

    // 2. 实时记录学习过程
    const recorder = new RealtimeRecorder(session.sessionPath);

    recorder.updateProgress({ currentStage: 'stage1' });
    recorder.appendConversation('用户', '这个项目是做什么的？');
    recorder.appendConversation('AI', '这是一个 Claude Code 插件...');
    recorder.updateLastTopic('理解项目功能');
    recorder.addNextSteps(['探索代码结构', '了解实现原理']);

    let progress = recorder.loadProgress();
    expect(progress.currentStage).toBe('stage1');
    expect(progress.lastTopic).toBe('理解项目功能');
    expect(progress.nextSteps).toContain('探索代码结构');

    // 3. 完成阶段
    recorder.updateProgress({
      currentStage: 'stage2',
      completedStages: ['stage0', 'stage1']
    });

    progress = recorder.loadProgress();
    expect(progress.stagesCompleted).toHaveLength(2);

    // 4. 恢复会话
    const recovery = new RecoveryManager(TEST_DIR);
    const summary = recovery.generateSessionsSummary();

    expect(summary).toContain(sessionId);
    expect(summary).toContain('stage0');
    expect(summary).toContain('stage1');

    const report = recovery.generateProgressReport(sessionId);
    expect(report).toContain(sessionId);
    expect(report).toContain('已完成阶段');
  });

  test('多会话管理', () => {
    const manager = new SessionManager(TEST_DIR, PROJECT_PATH);

    // 创建多个会话
    manager.initializeSession('session-1');
    manager.initializeSession('session-2');
    manager.initializeSession('session-3');

    const recovery = new RecoveryManager(TEST_DIR);
    const summary = recovery.generateSessionsSummary();

    expect(summary).toContain('session-1');
    expect(summary).toContain('session-2');
    expect(summary).toContain('session-3');
    expect(summary).toContain('3 个学习记录');
  });

  test('会话持久化', () => {
    const sessionId = 'persistent-session';

    // 创建并更新会话
    let manager = new SessionManager(TEST_DIR, PROJECT_PATH);
    const session = manager.initializeSession(sessionId);
    const recorder = new RealtimeRecorder(session.sessionPath);

    recorder.updateProgress({
      currentStage: 'stage1',
      stats: { totalQuestions: 10 }
    });

    // 重新加载会话
    manager = new SessionManager(TEST_DIR, PROJECT_PATH);
    const loaded = manager.loadSession(sessionId);

    expect(loaded.progress.currentStage).toBe('stage1');
    expect(loaded.progress.stats.totalQuestions).toBe(10);
  });
});
EOF
```

**Step 2: 运行集成测试**

```bash
cd .claude/skills/opensource-project-learning
npx jest tests/integration.test.js --verbose
```

Expected: PASS (所有集成测试通过)

**Step 3: Commit**

```bash
git add .claude/skills/opensource-project-learning/tests/integration.test.js
git commit -m "test: add integration tests for recording system"
```

---

## Task 8: 更新技能文档

**Files:**
- Modify: `.claude/skills/opensource-project-learning/README.md`

**Step 1: 更新 README 添加新功能说明**

在适当位置添加：

```markdown
## 🆕 学习记录功能（阶段1 MVP）

从 v2.0.0 开始，本技能支持自动记录学习进度！

### 功能特性

- ✅ **自动保存** - 实时记录学习进度，不怕丢失
- ✅ **多会话管理** - 支持多个学习会话，灵活切换
- ✅ **智能恢复** - 随时继续之前的学习进度
- ✅ **完整归档** - 学习完成后生成结构化档案

### 使用方法

首次学习项目时，技能会自动创建 `learning/` 目录并记录学习过程。

```bash
# 首次学习
用户: "帮我学习 claude-hud"
AI: "请输入会话主题名称..."
用户: "claude-hud-初探"
AI: "[创建记录] 开始学习..."

# 后续继续
用户: "继续学习 claude-hud"
AI: "检测到之前的会话：claude-hud-初探
     你想：1. 查看记录 2. 继续学习 3. 新建会话"
```

### 文件结构

```
项目根目录/
└── learning/
    ├── sessions.json                    # 会话索引
    ├── claude-hud-初探/                 # 你的学习会话
    │   ├── meta.json                    # 元数据
    │   ├── progress.json                # 学习进度
    │   └── conversation-buffer.md       # 对话记录
```

### 实施状态

- ✅ 阶段1（MVP）：会话管理、实时记录、恢复功能
- ⏸️ 阶段2：里程碑记录、阶段归档
- ⏸️ 阶段3：最终归档生成
- ⏸️ 阶段4：错误处理、增强功能

查看详细设计：[docs/plans/2026-05-05-learning-recording-system-design.md](../../../docs/plans/2026-05-05-learning-recording-system-design.md)
```

**Step 2: Commit**

```bash
git add .claude/skills/opensource-project-learning/README.md
git commit -m "docs: update README with recording system feature"
```

---

## 🎯 完成标准

实施完成后，应该满足以下标准：

### 功能验收

- [ ] 用户首次学习项目时，能够自动创建学习会话
- [ ] 用户能够输入会话主题名称
- [ ] 每次对话后能够自动更新 progress.json
- [ ] 对话内容能够追加到 conversation-buffer.md
- [ ] 用户说"继续学习"时能够显示历史会话列表
- [ ] 用户能够选择继续之前的会话或创建新会话
- [ ] 会话摘要和进度报告使用中文显示
- [ ] 所有测试通过（单元测试 + 集成测试）

### 质量验收

- [ ] 代码有完整的单元测试覆盖
- [ ] 记录系统模块化，便于维护和扩展
- [ ] SKILL.md 的修改最小化，使用调用点集成
- [ ] 有完整的文档（README、测试文档）
- [ ] 文件结构清晰，易于理解

### 技术债务

- [ ] 无已知的严重bug
- [ ] 无 TODO 或 FIXME 注释（除非有明确的后续计划）
- [ ] 代码符合 DRY 原则
- [ ] Git 提交历史清晰，每个 commit 有明确目的

---

## 📝 备注

- 本实施计划专注于**阶段1 MVP**功能
- 使用 **TDD 方法**：先写测试，再实现功能
- **频繁提交**：每个 Task 完成后立即 commit
- **YAGNI 原则**：只实现当前需要的功能，不过度设计
- 所有文件内容**完整写在计划中**，不是"添加验证"之类的描述

---

**实施计划版本**: 1.0
**最后更新**: 2026-05-05
**预计时间**: 2-3小时（阶段1 MVP）
