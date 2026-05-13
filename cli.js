#!/usr/bin/env node

/**
 * opensource-project-learning-skill CLI
 *
 * Usage:
 *   npx skills add    - Install skill to current project
 *   npx skills add -g  - Install skill globally (~/.claude/skills/)
 *   npx skills remove  - Remove skill from current project
 *   npx skills list    - Show installed skills info
 */

const fs = require("fs");
const path = require("path");

// ── helpers ──────────────────────────────────────────────────────────────────

function log(msg) {
  console.log(`[skills] ${msg}`);
}

function err(msg) {
  console.error(`[skills] ❌ ${msg}`);
}

function getSkillSourceDir() {
  // When installed via npm, skill files are next to this script
  return path.join(__dirname, ".claude", "skills", "opensource-project-learning");
}

function getLocalTargetDir() {
  return path.join(process.cwd(), ".claude", "skills", "opensource-project-learning");
}

function getGlobalTargetDir() {
  return path.join(
    process.env.HOME || process.env.USERPROFILE || "~",
    ".claude",
    "skills",
    "opensource-project-learning"
  );
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return false;

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
  return true;
}

function removeRecursive(dir) {
  if (!fs.existsSync(dir)) return;
  fs.rmSync(dir, { recursive: true, force: true });
}

// ── commands ─────────────────────────────────────────────────────────────────

function cmdAdd(global) {
  const srcDir = getSkillSourceDir();
  const targetDir = global ? getGlobalTargetDir() : getLocalTargetDir();

  if (!fs.existsSync(srcDir)) {
    err(
      "Skill source files not found. Make sure you installed this package correctly.\n" +
        `Expected: ${srcDir}`
    );
    process.exit(1);
  }

  const scope = global ? "global (~/.claude/skills/)" : "local (.claude/skills/)";

  if (fs.existsSync(targetDir)) {
    log(`Updating skill in ${scope}...`);
  } else {
    log(`Installing skill to ${scope}...`);
  }

  copyRecursive(srcDir, targetDir);

  log("✅ Skill installed successfully!");
  log(`   Location: ${targetDir}`);
  log("");

  if (global) {
    log("The skill is now available in all your Claude Code projects.");
  } else {
    log("The skill is available in this project only.");
    log("For global access, run: npx opensource-project-learning-skill add -g");
  }

  log("");
  log("Usage:");
  log("  Open Claude Code and say: '帮我学习 <project-url>'");
  log("  Or: 'I want to learn about <project-url>'");
}

function cmdRemove(global) {
  const targetDir = global ? getGlobalTargetDir() : getLocalTargetDir();
  const scope = global ? "global" : "local";

  if (!fs.existsSync(targetDir)) {
    err(`Skill not found in ${scope} location: ${targetDir}`);
    process.exit(1);
  }

  removeRecursive(targetDir);
  log(`✅ Skill removed from ${scope} location.`);
}

function cmdList() {
  const localDir = getLocalTargetDir();
  const globalDir = getGlobalTargetDir();

  log("Installed skill locations:");
  log(`  Local:  ${localDir} ${fs.existsSync(localDir) ? "✅" : "❌ not installed"}`);
  log(`  Global: ${globalDir} ${fs.existsSync(globalDir) ? "✅" : "❌ not installed"}`);

  // Try to read version from package.json in skill dir
  for (const [label, dir] of [
    ["Local", localDir],
    ["Global", globalDir],
  ]) {
    const pkgPath = path.join(dir, "package.json");
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
        log(`  ${label} version: ${pkg.version || "unknown"}`);
      } catch {
        // ignore
      }
    }
  }
}

// ── main ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const command = args[0];
const global = args.includes("-g") || args.includes("--global");

switch (command) {
  case "add":
  case "install":
    cmdAdd(global);
    break;
  case "remove":
  case "uninstall":
    cmdRemove(global);
    break;
  case "list":
  case "ls":
  case "info":
    cmdList();
    break;
  case "help":
  case "--help":
  case "-h":
    console.log(`
skills v${require("./package.json").version}

Usage:
  npx github:kongshan001/opensource-project-learning-skill add        Install skill to current project
  npx github:kongshan001/opensource-project-learning-skill add -g     Install skill globally
  npx github:kongshan001/opensource-project-learning-skill remove     Remove from current project
  npx github:kongshan001/opensource-project-learning-skill remove -g  Remove globally
  npx github:kongshan001/opensource-project-learning-skill list       Show installation status

After installation, open Claude Code and start learning any open-source project!
`);
    break;
  default:
    if (!command) {
      // Default: add locally
      cmdAdd(false);
    } else {
      err(`Unknown command: ${command}`);
      console.log('Run "npx opensource-project-learning-skill help" for usage.');
      process.exit(1);
    }
}
