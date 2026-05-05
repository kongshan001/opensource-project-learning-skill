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

    // Initialize nextSteps as array first
    let progress = recorder.loadProgress();
    progress.nextSteps = [];
    require('fs').writeFileSync(recorder.progressPath, JSON.stringify(progress, null, 2));

    // Now we can add next steps
    recorder.addNextStep('探索代码结构');

    progress = recorder.loadProgress();
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
    expect(summary).toContain('阶段0');
    expect(summary).toContain('阶段1');

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
    expect(summary).toContain('3 个学习会话');
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
