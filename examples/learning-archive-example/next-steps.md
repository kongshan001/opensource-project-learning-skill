# Next Steps: claude-hud

> Based on learning progress as of 2026-05-04

## 🎯 Where You Left Off

**Current Understanding**: Intermediate
**Current Stage**: Stage 2 (Deep Exploration) - 65% complete
**Last Studied**: Caching optimization in transcript parsing

### ✅ What You've Mastered
- Context calculation logic (native + fallback)
- Progress bar rendering system
- Tool/agent tracking algorithm
- Caching strategy and performance

### 🔍 What's Next in Stage 2

#### 1. Usage Rate Limits Integration
**File to explore**: `src/stdin.ts` (lines 271-309)

**Key questions**:
- How does it parse `rate_limits` from stdin?
- What happens when user is on Bedrock/Vertex (no limits)?
- How does it calculate reset times?

**Why it matters**: You saw usage displayed in your HUD, but don't know how it works.

---

#### 2. Git Status Tracking
**File to explore**: `src/git.ts`

**Key questions**:
- How does it detect git repository?
- What commands does it run to get branch/status?
- How does it handle dirty/ahead/behind/file stats?

**Why it matters**: Git status is displayed in your HUD, but implementation is unexplored.

---

#### 3. Todo State Management
**File to explore**: `src/transcript.ts` (lines 367-437)

**Key questions**:
- How does it parse `TodoWrite` calls?
- How does it track task status changes?
- What's the `taskIdToIndex` Map for?

**Why it matters**: Todo tracking is a key feature, but you haven't explored it yet.

---

## 🚀 Stage 3: Advanced Topics (Future)

### 1. Performance Optimization
**Areas to explore**:
- Profiling the hot paths
- Memory usage patterns
- Terminal rendering performance
- Potential bottlenecks

**Questions**:
- What's the CPU usage impact of 300ms polling?
- Could the cache be optimized further?
- How does it handle very large transcripts (100k+ lines)?

---

### 2. Extensibility & Plugin Architecture
**Areas to explore**:
- How to add custom display elements
- How to create custom line renderers
- How to hook into the data pipeline

**Questions**:
- What's the plugin API design?
- Could users add their own metrics?
- How does configuration affect rendering?

---

### 3. Testing & Quality Assurance
**Areas to explore**:
- Test coverage and strategies
- Mock data generation
- Integration testing approach

**Questions**:
- How do they test real-time updates?
- What about cross-platform compatibility?
- How to test with different Claude Code versions?

---

## 💡 Potential Contributions

Based on your current understanding level (intermediate), these are realistic contributions:

### Beginner-Friendly
1. **Documentation improvements**
   - Add more examples to README
   - Create troubleshooting guide
   - Document configuration options

2. **Bug fixes**
   - Look for good-first-bug issues
   - Edge case handling
   - Cross-platform compatibility

### Intermediate-Level
1. **New display modes**
   - Compact mode improvements
   - Custom line layouts
   - Color scheme presets

2. **Performance enhancements**
   - Cache optimization
   - Reduce memory footprint
   - Faster parsing strategies

### Advanced
1. **New features**
   - Custom metrics support
   - Plugin API
   - Export/import functionality

---

## 📚 Learning Path Recommendations

### If you want to contribute soon:
1. ✅ Finish Stage 2 (remaining subsystems)
2. ✅ Read CONTRIBUTING.md
3. ✅ Set up development environment
4. ✅ Find a good-first-issue
5. ⏸️ Skip Stage 3 initially

### If you want deep understanding first:
1. ✅ Finish Stage 2 completely
2. ✅ Complete Stage 3 (advanced topics)
3. ✅ Read through entire codebase
4. ⏸️ Then consider contributions

### If you want to apply learnings elsewhere:
1. ✅ Finish core concepts (you're mostly there!)
2. ⏸️ Skip remaining Stage 2 topics
3. ✅ Build your own statusline plugin
4. ✅ Apply patterns to other projects

---

## 🔄 Resume Learning Commands

When ready to continue, use any of these:

- **"Resume learning claude-hud"** - Continue where you left off
- **"Continue Stage 2 of claude-hud"** - Jump back into deep exploration
- **"Show my claude-hud learning progress"** - See dashboard
- **"What did I learn about claude-hud?"** - Quick recap

---

## 📊 Progress Tracking

**Target**: Complete Stage 2 by [DATE] or after 2 more sessions
**Milestone**: Ready to contribute by completing Stage 3
**Goal**: Advanced understanding within 1 month

**Current Velocity**: ~65% of Stage 2 in 43 minutes
**Estimated Time to Stage 3**: 2-3 more hours of focused learning

---

*This document is updated as you progress. Revisit after each learning session to adjust priorities.*
