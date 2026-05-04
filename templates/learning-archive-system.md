# Learning Archive System

This directory contains templates and tools for maintaining structured learning archives during project exploration.

## 📁 Archive Structure

Each learned project gets its own archive directory:

```
~/.claude/learning-archive/
├── project-name/
│   ├── summary.md              # Executive summary
│   ├── key-points.md           # Key knowledge points
│   ├── conversation.md         # Full dialogue history
│   ├── progress.json           # Learning progress state
│   └── next-steps.md           # Recommended next steps
└── index.md                    # Global learning index
```

## 🎯 File Templates

### 1. summary.md
Quick reference for what the project does and its core value.

### 2. key-points.md
Organized by categories:
- Architecture & Design
- Implementation Details
- Best Practices
- Gotchas & Lessons Learned

### 3. progress.json
Machine-readable progress tracking:
```json
{
  "project": "project-name",
  "started_at": "2026-05-04T12:00:00Z",
  "last_accessed": "2026-05-04T14:30:00Z",
  "stages_completed": ["stage0", "stage1"],
  "current_stage": "stage2",
  "total_time_minutes": 45,
  "key_topics_covered": ["context-calculation", "progress-rendering"],
  "questions_asked": 8,
  "understanding_level": "intermediate"
}
```

## 🔄 Usage Integration

The learning skill automatically:
1. Creates archive at session start
2. Updates during key learning moments
3. Saves final summary at session end
4. Maintains searchable index

## 📊 Progress Tracking

### Understanding Levels
- `beginner` - Just started, basic awareness
- `intermediate` - Grasps core concepts
- `advanced` - Deep technical understanding
- `expert` - Could contribute or teach

### Learning Stages
- `stage0` - Quick hands-on experience
- `stage1` - Initial understanding (README, design)
- `stage2` - Deep exploration (implementation)
- `stage3` - Advanced topics (architecture, patterns)
