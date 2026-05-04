# Learning Archive Extension

This file extends the base SKILL.md with automatic learning record-keeping and archival capabilities.

## 🎯 Extension Overview

**When to use**: Always active during learning sessions.

**What it does**:
1. Automatically creates learning archive at session start
2. Records key insights during conversation
3. Generates structured summaries at session end
4. Maintains searchable learning index
5. Enables "continue learning" functionality

---

## 📝 Archive Management Protocol

### 🚀 Session Start

When user begins learning a new project:

```
[Initialize Archive]

1. Create archive directory:
   ~/.claude/learning-archive/{project-name}/

2. Initialize files from templates:
   - summary.md (populate basic metadata)
   - key-points.md (create empty structure)
   - progress.json (initialize tracking)
   - conversation.md (start dialogue log)

3. Update global index:
   ~/.claude/learning-archive/index.md
   Add entry with: project name, date, github URL

4. Inform user:
   "📁 Learning archive created for {project-name}
    Your progress will be automatically saved."
```

### 🔄 During Learning Session

**When user expresses understanding ("Got it!", "Makes sense", etc.)**:
```
[Record Learning Moment]

1. Identify the concept just understood
2. Add to key-points.md under appropriate section
3. Update progress.json:
   - concepts_covered: ["{concept}"]
   - aha_moments: +1
4. Continue conversation
```

**When exploring important code**:
```
[Record Code Exploration]

1. Note file path and function name
2. Capture 1-2 key insights about the code
3. Add to key-points.md under "Implementation Details"
4. Update progress.json: files_explored: +1
```

**When user asks questions**:
```
[Record Learning Query]

1. Log question in conversation.md
2. Note what triggered the question
3. After answer, record key takeaway
4. Update progress.json: questions_asked: +1
```

### ✅ Session End / Pause

When user says "That's enough for now" or seems done:

```
[Generate Final Summary]

1. Update summary.md with all learnings
2. Update progress.json with final state
3. Generate next-steps.md:
   - Based on unfinished topics
   - Suggest natural next learning goals
4. Update global index with completion status
5. Inform user:
   "✅ Learning session archived!
    📁 Location: ~/.claude/learning-archive/{project-name}/
    📊 Progress: {stage} completed, {level} understanding
    🔄 Continue anytime: 'Resume learning {project-name}'"
```

---

## 🔄 Resume Learning Protocol

When user says "Resume learning {project-name}" or similar:

```
[Load Learning Context]

1. Read progress.json for project
2. Display current state:
   "📊 Previous Learning Session
    Project: {project-name}
    Last studied: {date}
    Progress: {stages_completed}
    Understanding: {level}

    You covered:
    ✓ {topic_1}
    ✓ {topic_2}

    Next up:
    → {next_step_1}
    → {next_step_2}

    Resume from where you left off, or start fresh?"

3. Wait for user direction
4. If resuming:
   - Update progress.json: last_accessed
   - Continue from next_steps
   - Append to existing conversation.md
```

---

## 🔍 Search & Recall Protocol

When user asks "What have I learned about {topic}?" or similar:

```
[Search Learning Archives]

1. Search all key-points.md files for {topic}
2. Return relevant entries with project context
3. Offer to:
   - Deep dive into specific project
   - Compare across projects
   - Resume learning any project

Example response:
"🔍 Found {topic} in {n} projects:

1. **{project-a}**: {brief_context}
   - Key insight: {insight}
   - Understanding: {level}

2. **{project-b}**: {brief_context}
   - Key insight: {insight}
   - Understanding: {level}

Want to:
- Deep dive into one of these?
- Compare approaches across projects?
- Resume learning one of these?"
```

---

## 📊 Progress Visualization

When user asks "Show my learning progress" or similar:

```
[Display Learning Dashboard]

📚 Learning Archive: {n} projects studied

### Recent Activity
- {project} ({date}) - {level} understanding
- {project} ({date}) - {level} understanding

### Mastery by Domain
- Backend Development: {n} projects
- Frontend: {n} projects
- DevOps: {n} projects

### Learning Stats
- Total projects: {n}
- Total time: {hours} hours
- Questions asked: {n}
- Aha moments: {n}

### Ready to Deepen
- {project} (intermediate → advanced)
- {project} (beginner → intermediate)

Explore any project or continue learning!"
```

---

## 🎯 Integration with Base Skill

### Modified Learning Flow

**Stage 0: Hands-on** (UNCHANGED)
- Run project first
- Experience value
- Observe behaviors

**NEW: After Stage 0**
```
[Archive Initial Impressions]

1. Create summary.md with first impressions
2. Record what made user curious
3. Note initial confusion points
4. Set initial learning goals
```

**Stage 1: Initial Understanding** (MODIFIED)
```
For each key point explained:
1. ✅ Explain concept (as before)
2. 📝 NEW: Record in key-points.md
3. ❓ NEW: Ask "Does this make sense?"
4. 💡 NEW: If yes, record as "aha moment"
```

**Stage 2: Deep Exploration** (MODIFIED)
```
For each code exploration:
1. ✅ Show code (as before)
2. 📝 NEW: Record file/function in archive
3. 🎯 NEW: Note why this code matters
4. 🔗 NEW: Link to related concepts
```

**Stage 3+: Advanced Topics** (NEW)
```
Based on progress.json:
1. Identify natural next steps
2. Suggest advanced topics
3. Track completion of milestones
4. Update understanding_level
```

---

## 🛠️ Archive File Operations

### Reading Archives
```bash
# Get project summary
cat ~/.claude/learning-archive/{project}/summary.md

# Get progress state
cat ~/.claude/learning-archive/{project}/progress.json

# List all projects
ls ~/.claude/learning-archive/
```

### Updating Archives
```bash
# Update progress
# (AI handles this automatically during conversation)

# Manual edits welcome
# Users can add notes, reorganize, clarify
```

---

## 🎨 Best Practices

### DO ✅
- Record insights immediately when expressed
- Keep entries concise (1-2 sentences each)
- Use consistent structure across projects
- Link related concepts
- Update progress frequently

### DON'T ❌
- Don't overwhelm with too much detail
- Don't record basics user already knows
- Don't archive until user shows understanding
- Don't create archives for casual lookups

---

## 📚 Example Archive Content

See `examples/learning-archive-example/` for a complete archive from a real learning session.

---

## 🔄 Future Enhancements

Planned features:
- Spaced repetition reminders
- Cross-project pattern recognition
- Learning path recommendations
- Progress visualizations
- Export to markdown/PDF
