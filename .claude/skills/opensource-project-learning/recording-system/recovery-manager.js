const SessionManager = require('./session-manager');
const fs = require('fs');
const path = require('path');

/**
 * RecoveryManager - 负责生成学习会话的摘要和详细报告
 * 帮助用户恢复之前的学习进度
 */
class RecoveryManager {
  constructor(dataDir) {
    this.dataDir = dataDir;
    this.sessionManager = new SessionManager(dataDir);
  }

  /**
   * 阶段名称翻译（英文 -> 中文）
   */
  translateStageName(stageName) {
    const stageMap = {
      'stage0': '阶段0：项目概览',
      'stage1': '阶段1：目录结构',
      'stage2': '阶段2：核心模块',
      'stage3': '阶段3：深入分析',
      'stage4': '阶段4：实践应用'
    };

    return stageMap[stageName] || stageName;
  }

  /**
   * 生成所有会话的摘要
   */
  generateSessionsSummary() {
    const sessions = this.sessionManager.listSessions();

    if (sessions.length === 0) {
      return '📚 没有找到学习记录\n\n请先使用 SessionManager 创建一个学习会话。';
    }

    let summary = '📚 学习会话列表\n';
    summary += '=' .repeat(50) + '\n\n';

    sessions.forEach((session, index) => {
      const sessionName = session.sessionId;
      const sessionPath = path.join(this.dataDir, sessionName);
      const progressPath = path.join(sessionPath, 'progress.json');

      summary += `${index + 1}. 📖 ${sessionName}\n`;

      if (fs.existsSync(progressPath)) {
        try {
          const progress = JSON.parse(fs.readFileSync(progressPath, 'utf-8'));

          if (progress.currentStage) {
            summary += `   当前：${this.translateStageName(progress.currentStage)}\n`;
          }

          if (progress.stagesCompleted && progress.stagesCompleted.length > 0) {
            const completed = progress.stagesCompleted.map(s =>
              this.translateStageName(s)
            ).join('、');
            summary += `   已完成：${completed}\n`;
          }

          if (progress.stats) {
            summary += `   探索文件：${progress.stats.filesExplored || 0} 个\n`;
            summary += `   提问数量：${progress.stats.totalQuestions || 0} 个\n`;
          }
        } catch (error) {
          summary += `   ⚠️  无法读取进度信息\n`;
        }
      }

      summary += '\n';
    });

    summary += '='.repeat(50) + '\n';
    summary += `总计：${sessions.length} 个学习会话\n`;

    return summary;
  }

  /**
   * 生成指定会话的详细进度报告
   */
  generateProgressReport(sessionName) {
    const sessionPath = path.join(this.dataDir, sessionName);

    if (!fs.existsSync(sessionPath)) {
      return `❌ 找不到会话：${sessionName}\n\n请使用 listSessions() 查看所有可用的会话。`;
    }

    let report = '📊 学习进度详细报告\n';
    report += '='.repeat(50) + '\n\n';
    report += `会话名称：${sessionName}\n`;

    // 读取元数据
    const metadataPath = path.join(sessionPath, 'meta.json');
    if (fs.existsSync(metadataPath)) {
      try {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
        report += `项目路径：${metadata.projectPath || '未知'}\n`;
        if (metadata.createdAt) {
          const createdDate = new Date(metadata.createdAt);
          report += `创建时间：${createdDate.toLocaleString('zh-CN')}\n`;
        }
      } catch (error) {
        report += `⚠️  无法读取元数据\n`;
      }
    }

    report += '\n';

    // 读取进度
    const progressPath = path.join(sessionPath, 'progress.json');
    if (fs.existsSync(progressPath)) {
      try {
        const progress = JSON.parse(fs.readFileSync(progressPath, 'utf-8'));

        report += '📍 学习进度\n';
        report += '-'.repeat(30) + '\n';

        if (progress.currentStage) {
          report += `当前阶段：${this.translateStageName(progress.currentStage)}\n`;
        }

        if (progress.stagesCompleted && progress.stagesCompleted.length > 0) {
          report += '已完成阶段：\n';
          progress.stagesCompleted.forEach(stage => {
            report += `  ✓ ${this.translateStageName(stage)}\n`;
          });
        }

        report += '\n';

        if (progress.stats) {
          report += '📈 统计信息\n';
          report += '-'.repeat(30) + '\n';
          report += `探索文件数：${progress.stats.filesExplored || 0} 个\n`;
          report += `提问总数：${progress.stats.totalQuestions || 0} 个\n`;
          report += '\n';
        }

        if (progress.stats && progress.stats.lastUpdateTime) {
          const updateDate = new Date(progress.stats.lastUpdateTime);
          report += `最后更新：${updateDate.toLocaleString('zh-CN')}\n`;
        }
      } catch (error) {
        report += `⚠️  无法读取进度信息\n`;
      }
    } else {
      report += '尚未开始学习\n';
    }

    report += '\n' + '='.repeat(50) + '\n';

    return report;
  }
}

module.exports = RecoveryManager;
