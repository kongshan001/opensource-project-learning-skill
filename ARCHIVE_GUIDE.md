# Learning Archive System - User Guide

## 🎯 Overview

The Learning Archive System automatically tracks your learning journey, making it easy to recall insights and continue learning anytime.

## 🚀 Getting Started

### Automatic Archiving

Archiving happens automatically during learning sessions:

```
You: "Help me learn the next.js project"
AI: "📁 Learning archive created for next.js
     Your progress will be automatically saved."
```

**What gets saved:**
- ✅ Every key insight you understand
- ✅ Code you explore and why it matters
- ✅ Questions you ask and answers
- ✅ Your learning progress and milestones
- ✅ Personalized next steps

## 📂 Archive Structure

Each project gets its own archive directory:

```
~/.claude/learning-archive/
├── next.js/
│   ├── summary.md          # Quick overview
│   ├── key-points.md       # Organized knowledge
│   ├── conversation.md     # Full dialogue
│   ├── progress.json       # Progress state
│   └── next-steps.md       # Next learning goals
└── index.md                # Global index
```

## 🔍 Common Use Cases

### 1. Resume Learning

**Scenario**: You learned about a project 2 weeks ago, want to continue.

```
You: "Resume learning next.js"
AI: "📊 Previous Learning Session
     Project: next.js
     Last studied: 2 weeks ago
     Progress: Stage 2 (deep exploration)

     You covered: routing, data fetching, SSR
     Next up: API routes, middleware, deployment

     Resume from where you left off, or start fresh?"

You: "Resume where I left off"
AI: "Great! Let's continue with API routes..."
```

### 2. Quick Recall

**Scenario**: You remember learning about "caching" but can't recall which project.

```
You: "What have I learned about caching?"
AI: "🔍 Found 'caching' in 3 projects:

     1. **claude-hud**: File-based caching strategy
        - 99%+ cache hit rate
        - Invalidates on file change (mtime + size)
        - Understanding: Intermediate

     2. **react**: Memoization techniques
        - React.memo, useMemo, useCallback
        - Understanding: Advanced

     3. **next.js**: ISR and revalidation
        - Incremental Static Regeneration
        - Understanding: Intermediate

     Deep dive into any, or compare approaches?"

You: "Compare claude-hud and next.js caching"
AI: "Great question! Both use caching but for different goals..."
```

### 3. Track Progress

**Scenario**: See what you've learned over time.

```
You: "Show my learning progress"
AI: "📚 Learning Archive: 12 projects studied

     ### Recent Activity
     - next.js (2 days ago) - Intermediate
     - claude-hud (1 week ago) - Intermediate
     - react (2 weeks ago) - Advanced

     ### Mastery by Domain
     - Frontend: 5 projects
     - Backend: 4 projects
     - DevOps: 2 projects
     - ML/AI: 1 project

     ### Learning Stats
     - Total projects: 12
     - Total time: 18 hours
     - Questions asked: 89
     - Aha moments: 34

     ### Ready to Deepen
     - next.js (intermediate → advanced)
     - typescript (beginner → intermediate)

     Explore any project or continue learning!"
```

### 4. Find Next Steps

**Scenario**: You have 30 minutes, want quick learning session.

```
You: "What should I learn next?"
AI: "Based on your archives, here are targeted next steps:

     🎯 Quick Wins (15-30 min):
     1. **next.js**: Complete API routes (15 min remaining)
     2. **typescript**: Explore type inference (20 min)

     🚀 Deep Dives (1-2 hours):
     1. **react**: Advanced patterns (HOCs, render props)
     2. **node.js**: Event loop internals

     💡 New Directions:
     1. **rust**: Ownership system (new language)
     2. **kubernetes**: Orchestration concepts

     What sounds interesting?"
```

## 📊 Understanding Levels

Archives track your depth of understanding:

| Level | Description | Example |
|-------|-------------|---------|
| **Beginner** | Just started, basic awareness | "I know React is for UIs" |
| **Intermediate** | Grasp core concepts | "I understand hooks and components" |
| **Advanced** | Deep technical understanding | "I can explain fiber reconciliation" |
| **Expert** | Could contribute or teach | "I could submit a PR to React" |

## 🎨 Archive Contents

### summary.md
Quick reference for the project:
```
# Project Summary: next.js

## What It Does
React framework for full-stack web apps

## Core Value
Simplifies React with built-in routing, SSR, API routes

## Tech Stack
- React, TypeScript, Node.js
- Webpack, Turbopack
- Vercel deployment

## Key Learnings
1. File-based routing
2. Server-side rendering
3. API routes
```

### key-points.md
Organized knowledge by category:
```
## Architecture & Design
### Data Flow
```
Request → Middleware → Routing → Handler → Response
```

## Implementation Details
### src/render.tsx: render()
```typescript
// Server-side rendering logic
```
**Why it matters**: Core of SSR
```

### progress.json
Machine-readable progress tracking:
```json
{
  "understanding_level": "intermediate",
  "stages_completed": ["stage0", "stage1"],
  "concepts_covered": ["routing", "ssr", "data-fetching"],
  "next_steps": ["api-routes", "middleware"]
}
```

## 🔧 Advanced Features

### Manual Archive Editing

You can manually edit your archives:

```bash
# Add your own notes
vim ~/.claude/learning-archive/next.js/key-points.md

# Update progress
vim ~/.claude/learning-archive/next.js/progress.json
```

### Archive Search

Search across all archives:

```bash
# Find all mentions of "routing"
grep -r "routing" ~/.claude/learning-archive/

# Find advanced-level projects
grep -l '"understanding_level": "advanced"' ~/.claude/learning-archive/*/progress.json
```

### Export Archives

Share your learning:

```bash
# Export a project archive
cp -r ~/.claude/learning-archive/next.js ~/my-learning-docs/

# Create a backup
tar -czf learning-archive-backup.tar.gz ~/.claude/learning-archive/
```

## 📱 Integration with Learning Flow

### During Stage 0 (Hands-on)

```
AI: "📁 Archive created for next.js
     Recording your first impressions..."
```

**What's archived:**
- Initial observations
- What intrigued you
- First confusion points

### During Stage 1 (Initial Understanding)

```
AI: "Got it! Recording insight about file-based routing..."
```

**What's archived:**
- Each concept you understand
- "Aha!" moments
- Connections to previous knowledge

### During Stage 2 (Deep Exploration)

```
AI: "Exploring render logic... saved to key-points.md"
```

**What's archived:**
- Code locations and why they matter
- Design choices and rationale
- Performance insights

### Session End

```
AI: "✅ Learning session archived!
     Summary: 5 key insights, 3 files explored
     Progress: Stage 2 (65% complete)
     Next: API routes, middleware
     📁 ~/.claude/learning-archive/next.js/"
```

## 💡 Best Practices

### DO ✅
- **Review archives before resuming** - Refresh your context
- **Update next-steps.md** - Keep it current with your interests
- **Link related concepts** - Build knowledge graph across projects
- **Add your own insights** - Archives are living documents

### DON'T ❌
- **Don't obsess over completeness** - Imperfect archives are better than none
- **Don't archive basics** - Focus on non-obvious insights
- **Don't archive casual lookups** - Only substantial learning sessions
- **Don't let archives pile up** - Review and consolidate periodically

## 🔄 Archive Maintenance

### Monthly Review

Once a month, review your archives:

```bash
# See what you've learned
ls ~/.claude/learning-archive/

# Check for stale projects
find ~/.claude/learning-archive/ -name "progress.json" -mtime +30

# Consolidate related learnings
# Merge similar projects, remove duplicates
```

### Archive Cleanup

Remove or consolidate archives:

```bash
# Delete a project you no longer care about
rm -rf ~/.claude/learning-archive/old-project/

# Merge two related projects
# Manually edit archives, delete one
```

## 🚀 Next Steps

1. **Start learning** - Archives create automatically
2. **Review regularly** - Check your progress dashboard
3. **Resume learning** - Use "Resume learning X" command
4. **Share insights** - Export archives to share knowledge

---

**Happy learning, and happy archiving! 📚✨**
