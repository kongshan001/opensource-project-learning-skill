const fs = require('fs');
const path = require('path');

/**
 * SessionManager - 管理学习会话的创建、列表和加载
 */
class SessionManager {
  constructor(baseDir, projectPath) {
    this.baseDir = baseDir;
    this.projectPath = projectPath;
    this.sessionsIndexPath = path.join(baseDir, 'sessions.json');
    this.templatesDir = path.join(__dirname, 'templates');
  }

  /**
   * 初始化新的学习会话
   * @param {string} sessionId - 会话ID
   * @param {Object} options - 可选配置
   * @returns {Object} 会话信息
   */
  initializeSession(sessionId, options = {}) {
    const sessionPath = path.join(this.baseDir, sessionId);
    const metaPath = path.join(sessionPath, 'meta.json');
    const progressPath = path.join(sessionPath, 'progress.json');

    // 创建会话目录
    if (!fs.existsSync(sessionPath)) {
      fs.mkdirSync(sessionPath, { recursive: true });
    }

    // 读取并填充 meta.json 模板
    const metaTemplate = this._readTemplate('meta.json.template');
    const metaContent = this._fillTemplate(metaTemplate, {
      SESSION_ID: sessionId,
      PROJECT_NAME: options.projectName || path.basename(this.projectPath),
      PROJECT_PATH: this.projectPath,
      PROJECT_URL: options.projectUrl || '',
      CREATED_AT: new Date().toISOString(),
      LAST_MODIFIED: new Date().toISOString(),
      LEARNING_GOALS: options.learningGoals || '',
      KNOWN_TECHS: options.knownTechs || '',
      UNKNOWN_TECHS: options.unknownTechs || ''
    });
    fs.writeFileSync(metaPath, JSON.stringify(JSON.parse(metaContent), null, 2));

    // 读取并填充 progress.json 模板
    const progressTemplate = this._readTemplate('progress.json.template');
    const progressContent = this._fillTemplate(progressTemplate, {
      CURRENT_STAGE: 'stage0',
      STAGES_COMPLETED: '[]',
      TOTAL_QUESTIONS: 0,
      FILES_EXPLORED: 0,
      CONCEPTS_COVERED: '',
      START_TIME: new Date().toISOString(),
      LAST_UPDATE_TIME: new Date().toISOString(),
      TOTAL_TIME_MINUTES: 0,
      LAST_TOPIC: '',
      NEXT_STEPS: ''
    });

    // 解析填充后的内容以确保正确的数据类型
    const progressData = JSON.parse(progressContent);
    // 确保 stagesCompleted 是数组而不是字符串
    if (typeof progressData.stagesCompleted === 'string') {
      progressData.stagesCompleted = JSON.parse(progressData.stagesCompleted);
    }
    fs.writeFileSync(progressPath, JSON.stringify(progressData, null, 2));

    // 更新 sessions.json 索引
    this._updateSessionsIndex(sessionId, metaPath, progressPath);

    return {
      sessionId,
      sessionPath,
      metaPath,
      progressPath
    };
  }

  /**
   * 列出所有学习会话
   * @returns {Array} 会话列表
   */
  listSessions() {
    if (!fs.existsSync(this.sessionsIndexPath)) {
      return [];
    }

    const sessionsData = JSON.parse(fs.readFileSync(this.sessionsIndexPath, 'utf8'));
    const sessions = sessionsData.sessions || [];

    // 为每个会话添加详细信息
    return sessions.map(session => {
      const sessionPath = path.join(this.baseDir, session.sessionId);
      const progressPath = path.join(sessionPath, 'progress.json');

      let currentStage = 'unknown';
      if (fs.existsSync(progressPath)) {
        const progressData = JSON.parse(fs.readFileSync(progressPath, 'utf8'));
        currentStage = progressData.currentStage || 'unknown';
      }

      return {
        ...session,
        currentStage
      };
    });
  }

  /**
   * 加载指定会话的完整数据
   * @param {string} sessionId - 会话ID
   * @returns {Object} 会话数据
   */
  loadSession(sessionId) {
    const sessionPath = path.join(this.baseDir, sessionId);
    const metaPath = path.join(sessionPath, 'meta.json');
    const progressPath = path.join(sessionPath, 'progress.json');

    if (!fs.existsSync(sessionPath)) {
      throw new Error(`Session "${sessionId}" not found`);
    }

    if (!fs.existsSync(metaPath)) {
      throw new Error(`Meta file not found for session "${sessionId}"`);
    }

    if (!fs.existsSync(progressPath)) {
      throw new Error(`Progress file not found for session "${sessionId}"`);
    }

    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    const progress = JSON.parse(fs.readFileSync(progressPath, 'utf8'));

    return {
      sessionId,
      sessionPath,
      meta,
      progress
    };
  }

  /**
   * 更新 sessions.json 索引文件
   * @private
   */
  _updateSessionsIndex(sessionId, metaPath, progressPath) {
    let sessionsData = { sessions: [] };

    // 读取现有索引或创建新的
    if (fs.existsSync(this.sessionsIndexPath)) {
      sessionsData = JSON.parse(fs.readFileSync(this.sessionsIndexPath, 'utf8'));
    }
    // 不使用模板，直接创建空数组，避免模板中的示例数据

    // 检查会话是否已存在
    const existingIndex = sessionsData.sessions.findIndex(s => s.sessionId === sessionId);
    const sessionEntry = {
      sessionId,
      meta: `meta/${sessionId}.json`,
      progress: `progress/${sessionId}.json`,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      sessionsData.sessions[existingIndex] = sessionEntry;
    } else {
      sessionsData.sessions.push(sessionEntry);
    }

    fs.writeFileSync(this.sessionsIndexPath, JSON.stringify(sessionsData, null, 2));
  }

  /**
   * 读取模板文件
   * @private
   */
  _readTemplate(templateName) {
    const templatePath = path.join(this.templatesDir, templateName);
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template "${templateName}" not found at ${templatePath}`);
    }
    return fs.readFileSync(templatePath, 'utf8');
  }

  /**
   * 填充模板变量
   * @private
   */
  _fillTemplate(template, variables) {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      result = result.replace(new RegExp(placeholder, 'g'), value);
    }
    return result;
  }
}

module.exports = SessionManager;
