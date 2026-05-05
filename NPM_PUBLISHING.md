# NPM Publishing Guide

This guide will help you publish your skill to npm for easy installation via `npx`.

## Prerequisites

1. **npm account**: Create one at https://www.npmjs.com/signup
2. **Node.js installed**: Version 14.0.0 or higher

## Publishing Steps

### 1. Login to npm

```bash
npm login
```

### 2. Verify your package.json

Ensure your `package.json` has:
- ✅ Unique package name (check if it's available first)
- ✅ Proper version number
- ✅ Correct files to include
- ✅ Bin command pointing to install script

### 3. Test locally (optional but recommended)

```bash
# Link the package locally
npm link

# Test the command
opensource-project-learning-skill

# Or test with npx from local directory
npm pack
npx ./
```

### 4. Publish to npm

```bash
# Publish to npm
npm publish

# For scoped packages (e.g., @username/package)
npm publish --access public
```

### 5. Verify publication

```bash
# Check if package is available
npm view opensource-project-learning-skill

# Test installation from npm
npx opensource-project-learning-skill
```

## Post-Publishing

### Update README badges

Add an npm version badge to your README:

```markdown
[![npm version](https://badge.fury.io/js/opensource-project-learning-skill.svg)](https://www.npmjs.com/package/opensource-project-learning-skill)
```

### Update GitHub repository

1. **Add npm topic**: Add `claude-code-skill` topic to your GitHub repository
2. **Update README**: Ensure installation instructions are clear
3. **Create a release**: Tag the version on GitHub

## Version Management

### Update version

```bash
# Update version in package.json
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0

# Publish new version
npm publish
```

### Check what will be published

```bash
# See what files will be included
npm pack --dry-run

# Create a tarball to inspect
npm pack
tar -tzf opensource-project-learning-skill-1.0.0.tgz
```

## Troubleshooting

### Package name already taken

If the package name is unavailable:
1. Choose a different name
2. Use a scoped package: `@username/opensource-project-learning-skill`
3. Update `package.json` and all references

### Publishing fails

```bash
# Check npm status
npm whoami

# Verify authentication
npm profile get

# Check for errors
npm publish --dry-run
```

### Files not included

Ensure files are listed in `package.json` `files` array or not in `.npmignore`:

```json
{
  "files": [
    "SKILL.md",
    "bin/",
    "README.md",
    "LICENSE"
  ]
}
```

## User Installation

Once published, users can install with:

```bash
npx opensource-project-learning-skill
```

No global installation needed!

## Maintenance

### Check download stats

```bash
npm view opensource-project-learning-skill
```

### Update dependencies

```bash
npm update
npm publish
```

### Handle issues

Monitor:
- GitHub Issues
- npm package comments
- Installation feedback

## Security

- Never publish sensitive data
- Review `.npmignore` carefully
- Keep dependencies updated
- Use `npm audit` regularly

## Resources

- [npm publishing docs](https://docs.npmjs.com/cli/v9/commands/npm-publish)
- [npm package best practices](https://docs.npmjs.com/cli/v9/configuring-npm/package-json)
- [Semantic versioning](https://semver.org/)
