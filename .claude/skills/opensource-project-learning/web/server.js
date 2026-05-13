const http = require("http");
const fs = require("fs");
const path = require("path");

/**
 * WebServer - 浏览器交互式学习服务器
 *
 * 提供一个 Web UI 让用户通过浏览器学习开源项目，
 * 支持阶段导航、问答交互、进度追踪。
 */
class WebServer {
  constructor(options = {}) {
    this.port = options.port || 3456;
    this.learningDir = options.learningDir || path.join(process.cwd(), "learning");
    this.projectPath = options.projectPath || process.cwd();
    this.webDir = path.join(__dirname);
    this.server = null;
    this.sessions = {}; // active learning sessions state
  }

  start() {
    this.server = http.createServer((req, res) => this._handleRequest(req, res));
    this.server.listen(this.port, () => {
      console.log(`\n🎓 开源项目学习平台已启动！`);
      console.log(`   打开浏览器访问: http://localhost:${this.port}\n`);
    });
  }

  stop() {
    if (this.server) {
      this.server.close();
      this.server = null;
    }
  }

  async _handleRequest(req, res) {
    const url = new URL(req.url, `http://localhost:${this.port}`);
    const pathname = url.pathname;

    // CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    try {
      // API routes
      if (pathname.startsWith("/api/")) {
        await this._handleAPI(pathname, req, res, url);
        return;
      }

      // Static files
      this._serveStatic(pathname, res);
    } catch (e) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: e.message }));
    }
  }

  // ── API Routes ─────────────────────────────────────────────────────────────

  async _handleAPI(pathname, req, res, url) {
    const send = (data, status = 200) => {
      res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify(data));
    };

    // GET /api/status - 服务器状态
    if (pathname === "/api/status" && req.method === "GET") {
      send({ status: "ok", version: "1.0.0", learningDir: this.learningDir });
      return;
    }

    // GET /api/sessions - 列出所有会话
    if (pathname === "/api/sessions" && req.method === "GET") {
      send(this._listSessions());
      return;
    }

    // POST /api/sessions - 创建新会话
    if (pathname === "/api/sessions" && req.method === "POST") {
      const body = await this._readBody(req);
      const data = JSON.parse(body);
      send(this._createSession(data));
      return;
    }

    // GET /api/sessions/:id - 获取会话详情
    const sessionMatch = pathname.match(/^\/api\/sessions\/([^/]+)$/);
    if (sessionMatch && req.method === "GET") {
      send(this._getSession(sessionMatch[1]));
      return;
    }

    // POST /api/sessions/:id/stage - 推进阶段
    const stageMatch = pathname.match(/^\/api\/sessions\/([^/]+)\/stage$/);
    if (stageMatch && req.method === "POST") {
      const body = await this._readBody(req);
      const data = JSON.parse(body);
      send(this._advanceStage(stageMatch[1], data));
      return;
    }

    // POST /api/sessions/:id/chat - 问答交互
    const chatMatch = pathname.match(/^\/api\/sessions\/([^/]+)\/chat$/);
    if (chatMatch && req.method === "POST") {
      const body = await this._readBody(req);
      const data = JSON.parse(body);
      send(this._chat(chatMatch[1], data));
      return;
    }

    // GET /api/sessions/:id/archive - 获取归档
    const archiveMatch = pathname.match(/^\/api\/sessions\/([^/]+)\/archive$/);
    if (archiveMatch && req.method === "GET") {
      send(this._getArchive(archiveMatch[1]));
      return;
    }

    // GET /api/project - 获取项目信息
    if (pathname === "/api/project" && req.method === "GET") {
      send(this._getProjectInfo());
      return;
    }

    send({ error: "Not found" }, 404);
  }

  // ── Session Logic ──────────────────────────────────────────────────────────

  _listSessions() {
    const indexPath = path.join(this.learningDir, "sessions.json");
    if (!fs.existsSync(indexPath)) {
      return { sessions: [] };
    }
    try {
      return JSON.parse(fs.readFileSync(indexPath, "utf-8"));
    } catch {
      return { sessions: [] };
    }
  }

  _createSession(data) {
    const { projectName, sessionName, projectUrl } = data;
    const sessionId = sessionName || `${projectName}-学习`;
    const sessionDir = path.join(this.learningDir, sessionId);

    fs.mkdirSync(sessionDir, { recursive: true });

    // meta.json
    const meta = {
      session_id: sessionId,
      project: projectName,
      project_url: projectUrl || "",
      created_at: new Date().toISOString(),
      last_updated: new Date().toISOString(),
      status: "active",
      stage: 0,
      total_questions: 0,
      user_goals: [],
      notes: "",
    };
    fs.writeFileSync(path.join(sessionDir, "meta.json"), JSON.stringify(meta, null, 2));

    // progress.json
    const progress = {
      stage: 0,
      completed_stages: [],
      key_concepts: [],
      user_interests: [],
      questions_count: 0,
      stage_progress: {
        0: { started: true, steps_completed: [] },
      },
    };
    fs.writeFileSync(path.join(sessionDir, "progress.json"), JSON.stringify(progress, null, 2));

    // Update sessions index
    const sessionsData = this._listSessions();
    sessionsData.sessions.push({
      id: sessionId,
      project: projectName,
      created_at: meta.created_at,
      last_updated: meta.last_updated,
      status: "active",
      stage: 0,
      total_questions: 0,
    });
    fs.mkdirSync(this.learningDir, { recursive: true });
    fs.writeFileSync(
      path.join(this.learningDir, "sessions.json"),
      JSON.stringify(sessionsData, null, 2)
    );

    return { success: true, session: meta };
  }

  _getSession(sessionId) {
    const safeId = this._sanitize(sessionId);
    const sessionDir = path.join(this.learningDir, safeId);
    if (!fs.existsSync(sessionDir)) {
      return { error: "Session not found", session_id: sessionId };
    }

    const meta = JSON.parse(fs.readFileSync(path.join(sessionDir, "meta.json"), "utf-8"));
    const progressPath = path.join(sessionDir, "progress.json");
    const progress = fs.existsSync(progressPath)
      ? JSON.parse(fs.readFileSync(progressPath, "utf-8"))
      : {};

    // Read Q&A history
    const qaPath = path.join(sessionDir, "qa.jsonl");
    const qa = [];
    if (fs.existsSync(qaPath)) {
      fs.readFileSync(qaPath, "utf-8")
        .split("\n")
        .filter(Boolean)
        .forEach((line) => {
          try { qa.push(JSON.parse(line)); } catch {}
        });
    }

    return { meta, progress, qa };
  }

  _advanceStage(sessionId, data) {
    const safeId = this._sanitize(sessionId);
    const sessionDir = path.join(this.learningDir, safeId);
    if (!fs.existsSync(sessionDir)) {
      return { error: "Session not found" };
    }

    const progressPath = path.join(sessionDir, "progress.json");
    const progress = JSON.parse(fs.readFileSync(progressPath, "utf-8"));

    const currentStage = progress.stage;
    progress.completed_stages.push(currentStage);
    if (data.concepts) {
      for (const c of data.concepts) {
        progress.key_concepts.push({
          stage: currentStage,
          concept: c.name,
          understanding: c.description,
          timestamp: new Date().toISOString(),
        });
      }
    }
    progress.stage = currentStage + 1;
    progress.stage_progress[progress.stage] = { started: true, steps_completed: [] };

    fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2));

    // Update meta
    const metaPath = path.join(sessionDir, "meta.json");
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
    meta.stage = progress.stage;
    meta.last_updated = new Date().toISOString();
    fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));

    // Timeline
    this._appendTimeline(sessionDir, "stage_complete", {
      stage: currentStage,
      concepts_count: data.concepts ? data.concepts.length : 0,
    });

    return { success: true, newStage: progress.stage };
  }

  _chat(sessionId, data) {
    const safeId = this._sanitize(sessionId);
    const sessionDir = path.join(this.learningDir, safeId);
    if (!fs.existsSync(sessionDir)) {
      return { error: "Session not found" };
    }

    const { question, answer } = data;

    // Append to qa.jsonl
    const qaPath = path.join(sessionDir, "qa.jsonl");
    const entry = {
      timestamp: new Date().toISOString(),
      question,
      answer: answer || "",
    };
    fs.appendFileSync(qaPath, JSON.stringify(entry, null, 0) + "\n");

    // Update question count
    const progressPath = path.join(sessionDir, "progress.json");
    const progress = JSON.parse(fs.readFileSync(progressPath, "utf-8"));
    progress.questions_count = (progress.questions_count || 0) + 1;
    fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2));

    // Timeline
    this._appendTimeline(sessionDir, "question", { content: question });

    return { success: true };
  }

  _getArchive(sessionId) {
    const safeId = this._sanitize(sessionId);
    const archivePath = path.join(this.learningDir, safeId, "archive.md");
    if (fs.existsSync(archivePath)) {
      return { exists: true, content: fs.readFileSync(archivePath, "utf-8") };
    }
    return { exists: false };
  }

  _getProjectInfo() {
    const readmePath = path.join(this.projectPath, "README.md");
    let readme = "";
    if (fs.existsSync(readmePath)) {
      readme = fs.readFileSync(readmePath, "utf-8");
    }

    const pkgPath = path.join(this.projectPath, "package.json");
    let pkg = {};
    if (fs.existsSync(pkgPath)) {
      try { pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8")); } catch {}
    }

    // Count files
    let fileCount = 0;
    try {
      const { execSync } = require("child_process");
      fileCount = parseInt(
        execSync(`find ${this.projectPath} -type f -not -path '*/node_modules/*' -not -path '*/.git/*' | wc -l`)
          .toString()
          .trim()
      );
    } catch {
      fileCount = 0;
    }

    return {
      name: pkg.name || path.basename(this.projectPath),
      version: pkg.version || "unknown",
      description: pkg.description || readme.split("\n")[0] || "",
      fileCount,
      readme: readme.substring(0, 5000),
    };
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  _appendTimeline(sessionDir, event, data) {
    const tlPath = path.join(sessionDir, "timeline.jsonl");
    const entry = { timestamp: new Date().toISOString(), event, ...data };
    fs.appendFileSync(tlPath, JSON.stringify(entry, null, 0) + "\n");
  }

  _sanitize(id) {
    return id.replace(/[^a-zA-Z0-9\u4e00-\u9fff_-]/g, "");
  }

  async _readBody(req) {
    return new Promise((resolve, reject) => {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => resolve(body));
      req.on("error", reject);
    });
  }

  _serveStatic(pathname, res) {
    let filePath;
    if (pathname === "/" || pathname === "/index.html") {
      filePath = path.join(this.webDir, "index.html");
    } else {
      // Security: only serve from web dir
      const resolved = path.resolve(this.webDir, pathname.substring(1));
      if (!resolved.startsWith(this.webDir)) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
      }
      filePath = resolved;
    }

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      // SPA fallback
      filePath = path.join(this.webDir, "index.html");
    }

    const ext = path.extname(filePath);
    const types = {
      ".html": "text/html; charset=utf-8",
      ".css": "text/css; charset=utf-8",
      ".js": "application/javascript; charset=utf-8",
      ".json": "application/json; charset=utf-8",
      ".png": "image/png",
      ".svg": "image/svg+xml",
    };

    res.writeHead(200, { "Content-Type": types[ext] || "application/octet-stream" });
    fs.createReadStream(filePath).pipe(res);
  }
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const portArg = args.findIndex((a) => a === "-p" || a === "--port");
  const port = portArg >= 0 ? parseInt(args[portArg + 1]) : 3456;

  const dirArg = args.findIndex((a) => a === "-d" || a === "--dir");
  const learningDir = dirArg >= 0 ? args[dirArg + 1] : undefined;

  const server = new WebServer({ port, learningDir });
  server.start();

  process.on("SIGINT", () => {
    server.stop();
    process.exit(0);
  });
}

module.exports = WebServer;
