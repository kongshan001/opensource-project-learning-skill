#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function getSkillsDir() {
  const homeDir = os.homedir();
  return path.join(homeDir, '.claude', 'skills');
}

function installSkill() {
  log('🚀 Installing Open Source Project Learning Skill...', 'blue');

  // Get paths
  const skillsDir = getSkillsDir();
  const skillSourcePath = path.join(__dirname, '..', 'SKILL.md');
  const skillTargetPath = path.join(skillsDir, 'opensource-project-learning.md');

  // Check if SKILL.md exists
  if (!fs.existsSync(skillSourcePath)) {
    log('✗ Error: SKILL.md not found in package', 'red');
    log('  This package may be corrupted. Please reinstall.', 'red');
    process.exit(1);
  }

  // Create skills directory if it doesn't exist
  if (!fs.existsSync(skillsDir)) {
    log(`📁 Creating skills directory: ${skillsDir}`, 'yellow');
    fs.mkdirSync(skillsDir, { recursive: true });
  }

  // Check if skill already exists
  if (fs.existsSync(skillTargetPath)) {
    log('⚠ Warning: Skill file already exists', 'yellow');
    log('  Overwriting existing installation...', 'yellow');
  }

  // Copy skill file
  try {
    fs.copyFileSync(skillSourcePath, skillTargetPath);
    log('✓ Skill installed successfully!', 'green');
    log('', 'reset');
    log('📝 Installation details:', 'blue');
    log(`  Source: ${skillSourcePath}`, 'reset');
    log(`  Target: ${skillTargetPath}`, 'reset');
    log('', 'reset');
    log('🎯 Next steps:', 'blue');
    log('  1. Restart your Claude Code session', 'reset');
    log('  2. Use: "Help me learn the X project"', 'reset');
    log('', 'reset');
    log('📚 For more information, visit:', 'blue');
    log('  https://github.com/kongshan001/opensource-project-learning-skill', 'reset');
  } catch (error) {
    log('✗ Error installing skill:', 'red');
    log(`  ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run installation
if (require.main === module) {
  installSkill();
}

module.exports = { installSkill, getSkillsDir };
