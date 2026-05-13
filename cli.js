#!/usr/bin/env node

/**
 * skills CLI — Install Claude Code skills from GitHub repos
 *
 * Usage:
 *   npx skills add <owner/repo>     Install skill from GitHub
 *   npx skills add <owner/repo> -g  Install globally
 *   npx skills list                 List installed skills
 *   npx skills remove <name>        Remove a skill
 *   npx skills remove <name> -g     Remove global skill
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// ── helpers ──────────────────────────────────────────────────────────────────

function log(msg) {
  console.log(`[skills] ${msg}`);
}

function err(msg) {
  console.error(`[skills] ❌ ${msg}`);
}

function getCwd() {
  return process.cwd();
}

function getHome() {
  return process.env.HOME || process.env.USERPROFILE || "~";
}

function getLocalSkillsDir() {
  return path.join(getCwd(), ".claude", "skills");
}

function getGlobalSkillsDir() {
  return path.join(getHome(), ".claude", "skills");
}

function findSkillDir(repoName, global) {
  // repoName like "opensource-project-learning-skill"
  // skill dir could be exact name or a subdir inside .claude/skills/
  const skillsDir = global ? getGlobalSkillsDir() : getLocalSkillsDir();
  if (!fs.existsSync(skillsDir)) return null;

  // Direct match
  if (fs.existsSync(path.join(skillsDir, repoName))) {
    return path.join(skillsDir, repoName);
  }

  // Try finding a single subdirectory (common pattern: .claude/skills/<skill-name>/)
  const entries = fs.readdirSync(skillsDir, { withFileTypes: true });
  const dirs = entries.filter((e) => e.isDirectory());
  if (dirs.length === 1) {
    return path.join(skillsDir, dirs[0].name);
  }

  return null;
}

// ── add command ──────────────────────────────────────────────────────────────

function cmdAdd(repoArg, global) {
  if (!repoArg) {
    err("Missing repo argument. Usage: npx skills add <owner/repo>");
    process.exit(1);
  }

  // Parse owner/repo
  const parts = repoArg.split("/");
  if (parts.length < 2) {
    err(
      `Invalid repo format: "${repoArg}". Use <owner/repo> format, e.g. kongshan001/opensource-project-learning-skill`
    );
    process.exit(1);
  }

  const owner = parts[0];
  const repo = parts[parts.length - 1];
  const githubUrl = `https://github.com/${owner}/${repo}`;
  const skillsDir = global ? getGlobalSkillsDir() : getLocalSkillsDir();

  log(`Installing skill from ${githubUrl}...`);

  // Clone to temp dir
  const tmpDir = path.join(
    require("os").tmpdir(),
    `skills-${repo}-${Date.now()}`
  );

  try {
    execSync(`git clone --depth 1 ${githubUrl} ${tmpDir}`, {
      stdio: "pipe",
    });
  } catch (e) {
    err(`Failed to clone ${githubUrl}. Check that the repo exists and is public.`);
    process.exit(1);
  }

  // Find skill files: look for .claude/skills/*/SKILL.md
  const possibleSkillDir = path.join(tmpDir, ".claude", "skills");
  let skillSourceDir = null;
  let skillName = null;

  if (fs.existsSync(possibleSkillDir)) {
    const entries = fs.readdirSync(possibleSkillDir, { withFileTypes: true });
    const skillDirs = entries.filter(
      (e) =>
        e.isDirectory() &&
        fs.existsSync(path.join(possibleSkillDir, e.name, "SKILL.md"))
    );

    if (skillDirs.length === 1) {
      skillSourceDir = path.join(possibleSkillDir, skillDirs[0].name);
      skillName = skillDirs[0].name;
    } else if (skillDirs.length > 1) {
      // Multiple skills found, pick the first one or match repo name
      const matched = skillDirs.find((d) =>
        repo.toLowerCase().includes(d.name.toLowerCase().replace(/-/g, ""))
      );
      skillSourceDir = path.join(
        possibleSkillDir,
        matched ? matched.name : skillDirs[0].name
      );
      skillName = matched ? matched.name : skillDirs[0].name;
    }
  }

  // Fallback: use repo root if it has SKILL.md
  if (!skillSourceDir && fs.existsSync(path.join(tmpDir, "SKILL.md"))) {
    skillSourceDir = tmpDir;
    skillName = repo;
  }

  // Fallback: use .claude/skills/ dir even without SKILL.md
  if (!skillSourceDir && fs.existsSync(possibleSkillDir)) {
    const entries = fs.readdirSync(possibleSkillDir, { withFileTypes: true });
    const dirs = entries.filter((e) => e.isDirectory());
    if (dirs.length >= 1) {
      skillSourceDir = path.join(possibleSkillDir, dirs[0].name);
      skillName = dirs[0].name;
    }
  }

  if (!skillSourceDir) {
    err(`No skill found in ${githubUrl}. Expected .claude/skills/<name>/SKILL.md`);
    execSync(`rm -rf ${tmpDir}`, { stdio: "pipe" });
    process.exit(1);
  }

  // Copy to target
  const targetDir = path.join(skillsDir, skillName);
  const scope = global ? "global" : "local";

  fs.mkdirSync(skillsDir, { recursive: true });
  copyRecursive(skillSourceDir, targetDir);

  // Cleanup
  execSync(`rm -rf ${tmpDir}`, { stdio: "pipe" });

  log(`✅ Installed skill "${skillName}" (${scope})`);
  log(`   ${targetDir}`);

  if (!global) {
    log(`   Tip: add -g for global install`);
  }
}

// ── remove command ───────────────────────────────────────────────────────────

function cmdRemove(nameArg, global) {
  if (!nameArg) {
    err("Missing skill name. Usage: npx skills remove <skill-name>");
    process.exit(1);
  }

  const skillsDir = global ? getGlobalSkillsDir() : getLocalSkillsDir();
  const targetDir = path.join(skillsDir, nameArg);
  const scope = global ? "global" : "local";

  if (!fs.existsSync(targetDir)) {
    err(`Skill "${nameArg}" not found in ${scope} location.`);
    process.exit(1);
  }

  fs.rmSync(targetDir, { recursive: true, force: true });
  log(`✅ Removed skill "${nameArg}" (${scope})`);
}

// ── list command ─────────────────────────────────────────────────────────────

function cmdList() {
  for (const [label, dir] of [
    ["Local", getLocalSkillsDir()],
    ["Global", getGlobalSkillsDir()],
  ]) {
    log(`${label}: ${dir}`);
    if (!fs.existsSync(dir)) {
      log(`  (empty)`);
      continue;
    }
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const skillDirs = entries.filter((e) => e.isDirectory());
    if (skillDirs.length === 0) {
      log(`  (empty)`);
    } else {
      for (const d of skillDirs) {
        const hasSkill = fs.existsSync(path.join(dir, d.name, "SKILL.md"));
        log(`  ${d.name} ${hasSkill ? "✅" : "⚠️ no SKILL.md"}`);
      }
    }
  }
}

// ── utils ────────────────────────────────────────────────────────────────────

function copyRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// ── main ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const command = args[0];
const global = args.includes("-g") || args.includes("--global");
// Get the non-flag arg after the command
const target = args.find((a, i) => i > 0 && !a.startsWith("-"));

switch (command) {
  case "add":
  case "install":
    cmdAdd(target, global);
    break;
  case "remove":
  case "uninstall":
  case "rm":
    cmdRemove(target, global);
    break;
  case "list":
  case "ls":
    cmdList();
    break;
  case "help":
  case "--help":
  case "-h":
  default:
    console.log(`
skills — Claude Code skill installer

Usage:
  npx skills add <owner/repo>          Install skill from GitHub
  npx skills add <owner/repo> -g       Install globally (~/.claude/skills/)
  npx skills remove <skill-name>       Remove skill
  npx skills remove <skill-name> -g    Remove global skill
  npx skills list                      List installed skills

Examples:
  npx skills add kongshan001/opensource-project-learning-skill
  npx skills add kongshan001/opensource-project-learning-skill -g
  npx skills list
  npx skills remove opensource-project-learning
`);
    break;
}
