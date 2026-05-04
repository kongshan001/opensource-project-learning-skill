# Project Summary: claude-hud

> Learning started: 2026-05-04
> Last updated: 2026-05-04
> Time spent: 45 minutes
> Understanding level: intermediate

## 🎯 What This Project Does

A Claude Code plugin that displays a real-time multi-line statusline showing context usage, tool activity, agent status, and todo progress.

## 💡 Core Value Proposition

Solves the problem where you can't see how much context you're using until you suddenly hit the limit. Provides visual progress bar like a phone battery, giving you time to adjust strategy before being cut off.

## 🏗️ Architecture Overview

```
Claude Code → stdin JSON → claude-hud → stdout → displayed in terminal
           ↘ transcript_path → parse JSONL → tools/agents/todos
```

**Key insight**: The statusline is invoked every ~300ms by Claude Code. Each invocation receives fresh JSON via stdin and parses the transcript file for activity.

## 🛠️ Tech Stack

- **Language**: TypeScript
- **Runtime**: Node.js 18+ or Bun
- **Target**: ES2022 with NodeNext modules
- **Key Dependencies**: None (uses native fs, readline, crypto)

## 🎓 Key Learnings

### Most Important Concepts
1. **Two-layer context calculation**: Prefer Claude Code's native percentage, fall back to manual calculation
2. **Tool/agent pairing**: Track `tool_use` and `tool_result` blocks to identify running tools
3. **Caching strategy**: File-level caching based on path + mtime + size to avoid re-parsing large transcripts
4. **Adaptive UI**: Show simple info normally, detailed breakdowns at high usage (85%+)

### "Aha!" Moments
- **Progress bars aren't linear**: They scale buffer by raw usage (no buffer at ≤5%, full buffer at ≥50%)
- **Transcript parsing is expensive**: That's why caching is critical—99%+ cache hit rate
- **Colors convey urgency**: Green (<70%) → Yellow (70-85%) → Red (>85%) creates natural anxiety curve
- **Token counting includes cache**: Input + cache_creation + cache_read, not just input tokens

## 📊 Learning Progress

- ✅ Stage 0: Hands-on experience
- ✅ Stage 1: Initial understanding
- ✅ Stage 2: Deep exploration (partial)
- ⏸️ Stage 3: Advanced topics (pending)

### Covered Topics
- Context calculation logic
- Progress bar rendering
- Tool/agent tracking algorithm
- Caching optimization

### Not Yet Covered
- Usage rate limits integration
- Git status tracking
- Todo state management
- Performance profiling

## 🚀 Next Steps

1. **Complete Stage 2**: Explore remaining subsystems (usage, git, todos)
2. **Stage 3**: Study advanced topics (performance optimization, extensibility)
3. **Potential contribution**: Add a new display mode or improve documentation

---

*This summary reflects learning after one 45-minute session. Update as understanding grows.*
