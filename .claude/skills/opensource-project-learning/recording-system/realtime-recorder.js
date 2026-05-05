const fs = require('fs');
const path = require('path');

/**
 * RealtimeRecorder - 实时记录学习进度
 *
 * 负责在会话进行时实时更新和记录数据：
 * - 更新进度数据（当前阶段、已完成阶段、统计数据）
 * - 追加对话条目到缓冲区
 * - 记录最后讨论的话题
 * - 管理下一步计划
 */
class RealtimeRecorder {
  constructor(sessionPath) {
    this.sessionPath = sessionPath;
    this.progressPath = path.join(sessionPath, 'progress.json');
    this.conversationBufferPath = path.join(sessionPath, 'conversation-buffer.md');
  }

  /**
   * 更新进度数据
   * @param {Object} updates - 要更新的字段
   * @param {string} [updates.currentStage] - 当前阶段
   * @param {string[]} [updates.completedStages] - 已完成的阶段列表
   * @param {Object} [updates.stats] - 统计数据更新
   * @param {number} [updates.stats.totalQuestions] - 总提问数
   * @param {string[]} [updates.stats.conceptsCovered] - 已探索的概念
   * @param {number} [updates.stats.filesExplored] - 已探索的文件数
   * @param {number} [updates.stats.commandsRun] - 运行的命令数
   */
  updateProgress(updates) {
    let progress = this.loadProgress();

    // 更新当前阶段
    if (updates.currentStage !== undefined) {
      progress.currentStage = updates.currentStage;
    }

    // 添加已完成的阶段（不重复）
    if (updates.completedStages && Array.isArray(updates.completedStages)) {
      updates.completedStages.forEach(stage => {
        if (!progress.stagesCompleted.includes(stage)) {
          progress.stagesCompleted.push(stage);
        }
      });
    }

    // 更新统计数据
    if (updates.stats) {
      if (updates.stats.totalQuestions !== undefined) {
        progress.stats.totalQuestions = updates.stats.totalQuestions;
      }
      if (updates.stats.conceptsCovered && Array.isArray(updates.stats.conceptsCovered)) {
        // 确保 conceptsCovered 是数组
        if (!Array.isArray(progress.stats.conceptsCovered)) {
          progress.stats.conceptsCovered = [];
        }
        updates.stats.conceptsCovered.forEach(concept => {
          if (!progress.stats.conceptsCovered.includes(concept)) {
            progress.stats.conceptsCovered.push(concept);
          }
        });
      }
      if (updates.stats.filesExplored !== undefined) {
        progress.stats.filesExplored = updates.stats.filesExplored;
      }
      if (updates.stats.commandsRun !== undefined) {
        progress.stats.commandsRun = updates.stats.commandsRun;
      }
    }

    // 更新最后修改时间
    progress.stats.lastUpdateTime = new Date().toISOString();

    // 保存更新后的进度
    fs.writeFileSync(this.progressPath, JSON.stringify(progress, null, 2));
  }

  /**
   * 加载进度数据
   * @returns {Object} 进度数据
   */
  loadProgress() {
    if (!fs.existsSync(this.progressPath)) {
      throw new Error('Progress file not found. Make sure session is initialized.');
    }
    const data = fs.readFileSync(this.progressPath, 'utf8');
    return JSON.parse(data);
  }

  /**
   * 追加对话条目到缓冲区
   * @param {string} role - 角色（用户、AI、系统）
   * @param {string} content - 对话内容
   */
  appendConversation(role, content) {
    const timestamp = new Date().toISOString();
    const entry = `### ${role} (${timestamp})\n\n${content}\n\n---\n\n`;

    // 追加到文件（如果不存在则创建）
    fs.appendFileSync(this.conversationBufferPath, entry);
  }

  /**
   * 更新最后讨论的话题
   * @param {string} topic - 话题描述
   */
  updateLastTopic(topic) {
    let progress = this.loadProgress();
    progress.lastTopic = topic;
    progress.stats.lastUpdateTime = new Date().toISOString();
    fs.writeFileSync(this.progressPath, JSON.stringify(progress, null, 2));
  }

  /**
   * 添加下一步计划
   * @param {string} step - 下一步描述
   */
  addNextStep(step) {
    let progress = this.loadProgress();
    progress.nextSteps.push(step);
    progress.stats.lastUpdateTime = new Date().toISOString();
    fs.writeFileSync(this.progressPath, JSON.stringify(progress, null, 2));
  }

  /**
   * 获取对话缓冲区内容
   * @returns {string} 对话缓冲区内容
   */
  getConversationBuffer() {
    if (!fs.existsSync(this.conversationBufferPath)) {
      return '';
    }
    return fs.readFileSync(this.conversationBufferPath, 'utf8');
  }

  /**
   * 清空对话缓冲区
   */
  clearConversationBuffer() {
    if (fs.existsSync(this.conversationBufferPath)) {
      fs.unlinkSync(this.conversationBufferPath);
    }
  }
}

module.exports = RealtimeRecorder;
