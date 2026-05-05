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
