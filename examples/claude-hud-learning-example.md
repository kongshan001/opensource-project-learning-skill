# Example: Learning the claude-hud Project

This is a real example of using the Open Source Project Learning Skill to learn a new project.

## 📚 The Project

**Claude HUD** - A Claude Code plugin that shows real-time context usage, tool activity, and agent status.

## 💬 The Dialogue

### Step 1: Initial Request

**User**: "Help me learn the claude-hud project"

**AI**: "I can help you learn claude-hud! This is a Claude Code plugin that displays a real-time multi-line statusline showing context health, tool activity, agent status, and todo progress.

Its core value is solving the problem where you can't see how much context you're using until you suddenly hit the limit.

What interests you most:
1. How to install and see it in action
2. What problems it solves and how
3. Other aspects"

### Step 2: Choose to Install

**User**: "1"

**AI**: "Great choice! Let's get it running. Here are the 3 steps:

**Step 1**: Add the marketplace
```
/plugin marketplace add jarrodwatts/claude-hud
```

**Step 2**: Install the plugin
```
/plugin install claude-hud
```

**Step 3**: Configure the statusline
```
/claude-hud:setup
```

Then restart Claude Code.

Ready to try these steps?"

### Step 3: Observe Results

**User**: *[installs and restarts]* "Done!"

**AI**: "🎉 Excellent! You should now see the HUD at the bottom of your terminal.

What did you notice? For example:
- You can see your context usage percentage
- There's a visual progress bar
- It shows which model you're using

Do you see these things?"

### Step 4: Express Interest in Implementation

**User**: "Yes! How does it calculate the context percentage?"

**AI**: "Great question! Let me show you the key code.

[Reads `src/stdin.ts`]

The calculation happens in two layers:

**Layer 1**: Prefer Claude Code's native percentage (v2.1.6+)
```typescript
const native = getNativePercent(stdin);
if (native !== null) {
  return native;  // Most accurate
}
```

**Layer 2**: Manual calculation fallback
```typescript
const totalTokens = getInputTokens() + getCacheTokens();
const percent = (totalTokens / contextWindowSize) * 100;
```

The tokens include:
- Input tokens (your conversation)
- Cache creation tokens (system prompt, tools)
- Cache read tokens (cached data)

Want to see how the progress bar is rendered?"

### Step 5: Deep Dive into Rendering

**User**: "Yes!"

**AI**: "[Reads `src/render/lines/identity.ts`]

The progress bar rendering has three smart features:

**1. Adaptive colors:**
```typescript
// < 70%: Green
// 70-85%: Yellow
// > 85%: Red
```

**2. Width adjustment:**
```typescript
const barWidth = getAdaptiveBarWidth(); // Fits your terminal
```

**3. Smart details at high usage:**
```typescript
if (percent >= 85) {
  // Show token breakdown: (in: 103k, cache: 68k)
}
```

This means you get simple info normally, but detailed breakdowns when you're near the limit.

Does this make sense?"

### Step 6: Express Satisfaction

**User**: "Perfect! I understand it now."

**AI**: "Awesome! You've learned the core value proposition and implementation of claude-hud.

Would you like to explore:
1. How it tracks tools and agents
2. How it uses caching to stay fast
3. Other aspects"

## 📊 What Made This Effective

### ✅ What Worked

1. **Started with running the project** - Immediate value
2. **Observed before explaining** - Built curiosity
3. **Short, focused explanations** - No information overload
4. **User-controlled pace** - Asked at each step
5. **Connected usage to implementation** - Saw why design decisions were made

### 🎯 Key Learning Moments

1. **"I can see my context usage!"** - Understood the value
2. **"How does it calculate percentage?"** - Natural curiosity
3. **"Smart details at high usage"** - Appreciated the design

## 💡 Lessons Learned

1. **Hands-on first** → User saw value immediately
2. **Wait for questions** → User asked what they cared about
3. **1-2 points per response** → User stayed engaged
4. **Connect to observation** → Implementation made sense

## 🚀 Result

- **Time to first value**: ~5 minutes (installation and first use)
- **Time to understanding**: ~15 minutes (complete learning cycle)
- **User satisfaction**: High (expressed "Perfect! I understand")
- **Follow-up interest**: Asked about other features

---

**This is the ideal learning flow this skill aims to create!**
