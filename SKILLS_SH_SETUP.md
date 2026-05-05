# skills.sh Integration Guide

This guide explains how to test and publish your skill to the skills.sh ecosystem.

## 📋 Repository Structure

Your repository is now structured to work with skills.sh:

```
opensource-project-learning-skill/
├── skills/                           # Required by skills.sh
│   └── opensource-project-learning/  # Skill directory
│       ├── SKILL.md                  # Main skill file (required)
│       └── README.md                 # Skill documentation (optional)
├── skills.json                       # Skills metadata (optional)
├── README.md                         # Repository documentation
└── package.json                      # npm package config (optional)
```

## 🧪 Testing Locally

### Before Publishing

1. **Test the skill file locally:**
   ```bash
   # Test installation with skills.sh (from your repository)
   npx skills add . --list

   # Test installation
   npx skills add . --skill opensource-project-learning

   # Verify installation
   npx skills list
   ```

2. **Test after pushing to GitHub:**
   ```bash
   # Add and commit all changes
   git add .
   git commit -m "Add skills.sh support"

   # Push to GitHub
   git push origin main

   # Test installation from GitHub
   npx skills add kongshan001/opensource-project-learning-skill --list
   npx skills add kongshan001/opensource-project-learning-skill --skill opensource-project-learning
   ```

### Verification Steps

1. **Check if skill is listed:**
   ```bash
   npx skills add kongshan001/opensource-project-learning-skill --list
   ```

   Expected output:
   ```
   📦 Available skills in kongshan001/opensource-project-learning-skill:
   ✓ opensource-project-learning
   ```

2. **Install the skill:**
   ```bash
   # Interactive installation
   npx skills add kongshan001/opensource-project-learning-skill

   # Non-interactive (recommended for testing)
   npx skills add kongshan001/opensource-project-learning-skill -y
   ```

3. **Verify installation:**
   ```bash
   npx skills list
   ```

4. **Test in Claude Code:**
   - Restart your Claude Code session
   - Try: "Help me learn the X project"

## 📢 Publishing to skills.sh

### Automatic Indexing

Once your repository is on GitHub, skills.sh will automatically index it if:
- ✅ Repository is public
- ✅ Contains a `skills/` directory
- ✅ Each skill has a `SKILL.md` file

### Manual Submission

If automatic indexing doesn't work within 24 hours:

1. **Visit skills.sh**: https://skills.sh
2. **Submit your repository**: Use the submission form
3. **Provide details**:
   - Repository: `kongshan001/opensource-project-learning-skill`
   - Description: "A conversational AI skill for learning open-source projects"
   - Tags: learning, opensource, education, development

### Verification

After submission, verify your skill appears:

```bash
# Search for your skill
npx skills find opensource

# Or visit the URL directly
# https://skills.sh/kongshan001/opensource-project-learning-skill
```

## 🎯 User Installation

Once indexed, users can install with:

```bash
# Basic installation
npx skills add kongshan001/opensource-project-learning-skill

# Global installation
npx skills add kongshan001/opensource-project-learning-skill -g

# Specific agents
npx skills add kongshan001/opensource-project-learning-skill -a claude-code

# Non-interactive
npx skills add kongshan001/opensource-project-learning-skill -y
```

## 📊 Analytics

Track your skill's popularity:

```bash
# View skill details via API
curl https://skills.sh/api/v1/skills/kongshan001/opensource-project-learning-skill/opensource-project-learning
```

Or visit:
https://skills.sh/kongshan001/opensource-project-learning-skill/opensource-project-learning

## 🔧 Troubleshooting

### Skill not found

**Problem**: `npx skills add kongshan001/opensource-project-learning-skill` returns "Repository not found"

**Solutions**:
1. Verify repository is public
2. Check repository URL is correct
3. Ensure `skills/` directory exists
4. Wait 24-48 hours for automatic indexing
5. Submit manually via skills.sh website

### Installation fails

**Problem**: Installation fails or SKILL.md not found

**Solutions**:
1. Verify file structure:
   ```bash
   ls -la skills/opensource-project-learning/SKILL.md
   ```
2. Check SKILL.md has valid frontmatter
3. Test locally first: `npx skills add .`

### Skill not visible in list

**Problem**: `--list` shows no skills

**Solutions**:
1. Verify skills.json format
2. Check SKILL.md frontmatter has `name` field
3. Ensure repository structure matches requirements

## 📝 Best Practices

1. **Keep SKILL.md updated**: Main skill file should be the source of truth
2. **Use semantic versioning**: Update version in frontmatter when making changes
3. **Test thoroughly**: Always test installation before pushing changes
4. **Document changes**: Keep README.md and CHANGELOG updated
5. **Monitor analytics**: Check skills.sh dashboard for usage stats

## 🔗 Resources

- **skills.sh Documentation**: https://skills.sh/docs
- **skills.sh API**: https://skills.sh/docs/api
- **skills.sh FAQ**: https://skills.sh/docs/faq
- **Repository**: https://github.com/kongshan001/opensource-project-learning-skill

## 🆘 Support

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review skills.sh documentation
3. Open an issue: https://github.com/kongshan001/opensource-project-learning-skill/issues
4. Contact skills.sh support via their website

---

**Note**: skills.sh is a third-party service. This guide is based on current documentation and may change. Always refer to official skills.sh documentation for the most up-to-date information.
