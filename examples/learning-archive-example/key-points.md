# Key Knowledge Points: claude-hud

## 🏗️ Architecture & Design

### Core Design Patterns
- **Statusline polling**: Claude Code invokes the plugin every ~300ms
  - **Where used**: Entry point (`src/index.ts`)
  - **Why**: Real-time updates without blocking Claude Code

- **Two-stage parsing**: stdin (native data) + transcript (activity)
  - **Where used**: `src/stdin.ts` and `src/transcript.ts`
  - **Why**: Native data is accurate, transcript provides rich activity context

- **Cache-first strategy**: Parse once, cache forever until file changes
  - **Where used**: `src/transcript.ts` (lines 173-209)
  - **Why**: Transcript files can be MBs; re-parsing every 300ms would be too slow

### Data Flow
```
1. Claude Code → stdin JSON (model, context, tokens, transcript_path)
2. Read transcript JSONL → Parse for tools/agents/todos
3. Combine data → Render multi-line output
4. stdout → Claude Code displays in terminal
```

### Key Components
1. **stdin.ts**: Parses Claude Code's JSON input, extracts native token data
2. **transcript.ts**: Parses JSONL transcript, tracks tool/agent activity, manages cache
3. **render/**: Converts data to colored terminal output with adaptive layouts
4. **config.ts**: Loads and validates user configuration

## 🔧 Implementation Details

### Critical Code Sections

#### src/stdin.ts: getContextPercent()
```typescript
// Layer 1: Prefer Claude Code's native percentage (v2.1.6+)
const native = getNativePercent(stdin);
if (native !== null) {
  return native;  // Most accurate, matches /context command
}

// Layer 2: Manual calculation fallback
const totalTokens = getInputTokens() + getCacheTokens();
const percent = (totalTokens / contextWindowSize) * 100;
```
**Why it matters**: Ensures accuracy across Claude Code versions while maintaining backward compatibility.

#### src/transcript.ts: processEntry()
```typescript
if (block.type === 'tool_use' && block.id && block.name) {
  const toolEntry: ToolEntry = {
    id: block.id,
    name: block.name,
    target: extractTarget(block.name, block.input),
    status: 'running',
    startTime: timestamp,
  };
  toolMap.set(block.id, toolEntry);
}

if (block.type === 'tool_result' && block.tool_use_id) {
  const tool = toolMap.get(block.tool_use_id);
  if (tool) {
    tool.status = 'completed';
    tool.endTime = timestamp;
  }
}
```
**Why it matters**: Shows the pairing algorithm—`tool_use` creates entry, `tool_result` completes it. Only entries with `status: 'running'` are displayed.

#### src/transcript.ts: readTranscriptCache()
```typescript
if (
  parsed.version !== TRANSCRIPT_CACHE_VERSION ||
  parsed.transcriptState?.mtimeMs !== state.mtimeMs ||
  parsed.transcriptState?.size !== state.size
) {
  return null;  // Cache invalid, re-parse
}
```
**Why it matters**: Cache invalidation strategy—only re-parse when file actually changes.

### Smart Design Choices
1. **Use Map for tool tracking**: O(1) lookup by tool_id instead of array searching
2. **Serialize dates as ISO strings**: Cache files remain valid across process restarts
3. **SHA256 for cache paths**: Avoids filesystem collisions, handles long paths
4. **Graceful degradation**: If transcript is missing/invalid, return empty data (don't crash)

## 💡 Best Practices Observed

### Code Quality
- ✅ **Type safety**: Comprehensive TypeScript interfaces for all data structures
- ✅ **Error handling**: Try-catch around file I/O, fallback to defaults
- ✅ **Separation of concerns**: stdin, transcript, config, and render are separate modules

### UX/Design
- ✅ **Progressive disclosure**: Simple info normally, details only when needed (≥85% context)
- ✅ **Color as meaning**: Green/yellow/red conveys urgency without words
- ✅ **Adaptive width**: Progress bars scale to terminal size

### Performance
- ✅ **Cache-first**: 99%+ hit rate, ~1ms response vs ~100ms parse time
- ✅ **Lazy evaluation**: Only parse transcript when needed for tools/agents/todos
- ✅ **Streaming JSONL**: Use readline interface instead of loading entire file

## ⚠️ Gotchas & Lessons Learned

### Common Pitfalls
- ❌ **Token counting isn't just input**: Must include cache_creation and cache_read tokens
- ❌ **Context percentage isn't linear**: Buffer scales with usage, not fixed amount
- ❌ **Transcript can be huge**: Don't load entire file into memory, stream it

### Debugging Tips
- 🐛 **Progress not updating?**: Check if transcript_path is valid
- 🐛 **Colors not working?**: Verify terminal supports ANSI codes
- 🐛 **Cache not invalidating?**: Ensure you're comparing resolved paths, not relative

## 🎯 Domain-Specific Insights

### Real-time Terminal UIs
- **Key insight**: Update frequency (300ms) is fast enough for perceived real-time, slow enough to not overwhelm CPU
- **Why it matters**: Balances responsiveness with resource usage—could easily burn CPU at 60fps

### Token Accounting
- **Key insight**: Cache tokens have two types—creation (expensive, one-time) and read (cheap, per-request)
- **Why it matters**: Explains why initial prompt is expensive but subsequent prompts are cheaper

### Subagent Tracking
- **Key insight**: Tool Use blocks with `name: 'Task'` or `'Agent'` are subagents, not regular tools
- **Why it matters**: Distinguishes between "Claude is editing files" vs "Claude spawned a specialized agent"

## 📚 Related Concepts

- **LLM context windows**: This project visualizes what's usually invisible—context token usage
- **Progressive enhancement**: Works with basic stdin data, adds richness when transcript available
- **Statusline APIs**: Uses Claude Code's native statusline feature, not a separate window/tmux
- **JSONL format**: Transcript is JSON Lines (one JSON object per line), not a single JSON array

---

*Organized during Stage 2 deep exploration. Key focus was understanding how context calculation and tool tracking work.*
