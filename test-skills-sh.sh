#!/bin/bash

# Quick test script for skills.sh integration
# This script validates that your repository is correctly structured for skills.sh

set -e

echo "🧪 Testing skills.sh Integration"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test functions
test_pass() {
    echo -e "${GREEN}✓${NC} $1"
}

test_fail() {
    echo -e "${RED}✗${NC} $1"
    exit 1
}

test_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check repository structure
echo "📁 Checking repository structure..."

if [ -d "skills" ]; then
    test_pass "skills/ directory exists"
else
    test_fail "skills/ directory not found"
fi

if [ -f "skills/opensource-project-learning/SKILL.md" ]; then
    test_pass "SKILL.md found in skills/opensource-project-learning/"
else
    test_fail "SKILL.md not found in skills/opensource-project-learning/"
fi

if [ -f "skills.json" ]; then
    test_pass "skills.json exists"
else
    test_warn "skills.json not found (optional but recommended)"
fi

echo ""

# Check SKILL.md frontmatter
echo "📄 Checking SKILL.md format..."

if grep -q "^---" "skills/opensource-project-learning/SKILL.md"; then
    test_pass "SKILL.md has frontmatter delimiter"
else
    test_fail "SKILL.md missing frontmatter delimiter (---)"
fi

if grep -q "^name:" "skills/opensource-project-learning/SKILL.md"; then
    test_pass "SKILL.md has 'name' field"
else
    test_fail "SKILL.md missing 'name' field in frontmatter"
fi

if grep -q "^description:" "skills/opensource-project-learning/SKILL.md"; then
    test_pass "SKILL.md has 'description' field"
else
    test_fail "SKILL.md missing 'description' field in frontmatter"
fi

echo ""

# Check README
echo "📚 Checking documentation..."

if [ -f "README.md" ]; then
    test_pass "README.md exists"
else
    test_warn "README.md not found (recommended)"
fi

if [ -f "skills/opensource-project-learning/README.md" ]; then
    test_pass "Skill-specific README exists"
else
    test_warn "Skill-specific README not found (optional)"
fi

echo ""

# Test with skills.sh CLI
echo "🔧 Testing with skills.sh CLI..."

if command -v npx &> /dev/null; then
    test_pass "npx is available"

    echo ""
    echo "Testing 'npx skills add . --list'..."
    if npx skills add . --list 2>&1 | grep -q "opensource-project-learning"; then
        test_pass "Skill is discoverable by skills.sh"
    else
        test_warn "Skill not found by skills.sh (may need to push to GitHub first)"
    fi
else
    test_warn "npx not found - skipping CLI tests"
fi

echo ""
echo "================================"
echo -e "${GREEN}✓ All checks passed!${NC}"
echo ""
echo "Next steps:"
echo "1. Commit and push changes to GitHub"
echo "2. Test with: npx skills add kongshan001/opensource-project-learning-skill --list"
echo "3. Install with: npx skills add kongshan001/opensource-project-learning-skill"
echo ""
echo "For detailed instructions, see SKILLS_SH_SETUP.md"
