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
