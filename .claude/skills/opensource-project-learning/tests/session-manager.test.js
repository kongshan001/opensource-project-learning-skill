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
      expect(sessionsData.sessions[0].sessionId).toBe(sessionId);
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
      expect(sessions[0].sessionId).toBe('session-1');
      expect(sessions[1].sessionId).toBe('session-2');
    });

    test('应该包含会话的元数据信息', () => {
      const manager = new SessionManager(TEST_DIR, PROJECT_PATH);

      manager.initializeSession('test-session');

      const sessions = manager.listSessions();

      expect(sessions[0]).toHaveProperty('sessionId');
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
