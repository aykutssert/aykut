---
title: "Never Hit Claude Usage Limits Ever Again"
titleTr: "Claude Kullanım Limitlerine Bir Daha Takılma"
description: "Why Claude usage limits hit hours early for some users, and the workflow changes that make them irrelevant."
date: "2026-05-25"
image: "/blog/never-hit-claude-usage-limits-ever-again.webp"
tags: ["claude", "limits", "productivity"]
---

A Max 5 subscriber hit their quota in 19 minutes. Expected: 5 hours.

A Pro user reported their limit maxed every Monday and didn't reset until Saturday - "out of 30 days I get to use Claude 12."

Anthropic acknowledged the issue. Part of it was a peak-hours quota change. Part of it was a prompt-caching bug that silently inflated costs by 10–20x. But here's the uncomfortable truth: **most of it was them.**

I know because I tracked myself.

---

## The Data Nobody Wants to See

For 90 days I logged every Claude Code session: timestamp, prompt, response, token count, model, exit reason.

**430 hours. 6 million input tokens. $1,340 in API spend.**

Then I categorized every token:

<style>
.kc { border-radius: 12px; overflow: hidden; border: 1px solid #DDDDD5; margin: 2rem 0; }
.kc-head { padding: 1rem 1.25rem; background: #EEEEE8; border-bottom: 1px solid #DDDDD5; }
.kc-label { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; }
.kc-body { padding: 1.25rem; display: flex; flex-direction: column; gap: 0.625rem; }
.kc-row-label { font-size: 0.8125rem; color: #374151; }
.kc-track { height: 6px; background: #DDDDD5; border-radius: 999px; }
.kc-track-lg { height: 8px; background: #DDDDD5; border-radius: 999px; }
.kc-fill { height: 100%; border-radius: 999px; }
.kc-footer { margin-top: 0.5rem; padding-top: 0.75rem; border-top: 1px solid #DDDDD5; }
.kc-meta { display: flex; justify-content: space-between; margin-bottom: 0.25rem; }

.kv { border-radius: 12px; border: 1px solid #DDDDD5; overflow: hidden; margin: 1.5rem 0; }
.kv-head { padding: 0.75rem 1.25rem; background: #EEEEE8; border-bottom: 1px solid #DDDDD5; }
.kv-row { display: grid; grid-template-columns: 1fr auto; padding: 0.75rem 1.25rem; border-bottom: 1px solid #E8E8E2; align-items: center; }
.kv-row-alt { background: #F4F4EE; }
.kv-cell { font-size: 0.8125rem; color: #374151; }
.kv-val { font-size: 0.8125rem; font-family: monospace; }
.kv-foot { padding: 0.75rem 1.25rem; background: #f0fdf4; border-top: 1px solid #bbf7d0; display: grid; grid-template-columns: 1fr auto; }

.kb { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 2rem 0; }
.kb-before { border-radius: 12px; border: 1px solid #fecaca; background: #fff5f5; padding: 1.25rem; }
.kb-after { border-radius: 12px; border: 1px solid #bbf7d0; background: #f0fdf4; padding: 1.25rem; }
.kb-tag { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem; }
.kb-num { font-size: 2rem; font-weight: 800; margin-bottom: 0.25rem; }
.kb-sub { font-size: 0.875rem; color: #6b7280; }
.kb-list { margin-top: 1rem; font-size: 0.8125rem; color: #374151; display: flex; flex-direction: column; gap: 0.375rem; }

.dark .kc { border-color: #2a2826; }
.dark .kc-head { background: #1E1C1A; border-color: #2a2826; }
.dark .kc-label { color: #a1a1aa; }
.dark .kc-row-label { color: #d4d4d8; }
.dark .kc-track, .dark .kc-track-lg { background: #2a2826; }
.dark .kc-footer { border-color: #2a2826; }

.dark .kv { border-color: #2a2826; }
.dark .kv-head { background: #1E1C1A; border-color: #2a2826; }
.dark .kv-row { border-color: #2a2826; }
.dark .kv-row-alt { background: #1E1C1A; }
.dark .kv-cell { color: #d4d4d8; }
.dark .kv-foot { background: rgba(22,163,74,0.12); border-color: #166534; }

.dark .kb-before { border-color: #7f1d1d; background: rgba(220,38,38,0.1); }
.dark .kb-after { border-color: #14532d; background: rgba(22,163,74,0.1); }
.dark .kb-sub { color: #a1a1aa; }
.dark .kb-list { color: #d4d4d8; }
</style>

<div class="kc">
  <div class="kc-head"><span class="kc-label">Where my tokens actually went</span></div>
  <div class="kc-body">
    <div><div class="kc-meta"><span class="kc-row-label">CLAUDE.md bloat</span><span style="font-size:0.8125rem;font-weight:600;color:#dc2626;">14%</span></div><div class="kc-track"><div class="kc-fill" style="width:14%;background:#dc2626;"></div></div></div>
    <div><div class="kc-meta"><span class="kc-row-label">Conversation history re-reads</span><span style="font-size:0.8125rem;font-weight:600;color:#dc2626;">13%</span></div><div class="kc-track"><div class="kc-fill" style="width:13%;background:#dc2626;"></div></div></div>
    <div><div class="kc-meta"><span class="kc-row-label">Hook injection waste</span><span style="font-size:0.8125rem;font-weight:600;color:#f97316;">11%</span></div><div class="kc-track"><div class="kc-fill" style="width:11%;background:#f97316;"></div></div></div>
    <div><div class="kc-meta"><span class="kc-row-label">Cache misses on session resume</span><span style="font-size:0.8125rem;font-weight:600;color:#f97316;">10%</span></div><div class="kc-track"><div class="kc-fill" style="width:10%;background:#f97316;"></div></div></div>
    <div><div class="kc-meta"><span class="kc-row-label">Irrelevant skill loading</span><span style="font-size:0.8125rem;font-weight:600;color:#eab308;">7%</span></div><div class="kc-track"><div class="kc-fill" style="width:7%;background:#eab308;"></div></div></div>
    <div><div class="kc-meta"><span class="kc-row-label">"Just in case" tool definitions</span><span style="font-size:0.8125rem;font-weight:600;color:#eab308;">6%</span></div><div class="kc-track"><div class="kc-fill" style="width:6%;background:#eab308;"></div></div></div>
    <div><div class="kc-meta"><span class="kc-row-label">Extended thinking on simple tasks</span><span style="font-size:0.8125rem;font-weight:600;color:#eab308;">5%</span></div><div class="kc-track"><div class="kc-fill" style="width:5%;background:#eab308;"></div></div></div>
    <div><div class="kc-meta"><span class="kc-row-label">Wrong-direction generation</span><span style="font-size:0.8125rem;font-weight:600;color:#84cc16;">4%</span></div><div class="kc-track"><div class="kc-fill" style="width:4%;background:#84cc16;"></div></div></div>
    <div><div class="kc-meta"><span class="kc-row-label">Plugin auto-update redundancy</span><span style="font-size:0.8125rem;font-weight:600;color:#84cc16;">3%</span></div><div class="kc-track"><div class="kc-fill" style="width:3%;background:#84cc16;"></div></div></div>
    <div class="kc-footer"><div class="kc-meta"><span style="font-size:0.8125rem;font-weight:600;color:#16a34a;">Productive tokens</span><span style="font-size:0.8125rem;font-weight:700;color:#16a34a;">27%</span></div><div class="kc-track-lg"><div class="kc-fill" style="width:27%;background:#16a34a;"></div></div></div>
  </div>
</div>

**27% productive. 73% overhead.**

Not bad prompts. Not wrong models. Overhead - invisible until you instrument it.

Every pattern below has a number behind it, a root cause, and a fix you can do in 30 seconds.

---

## The 9 Patterns

### 1. CLAUDE.md Bloat - 14% of total tokens

My `CLAUDE.md` grew to 4,800 tokens over 6 months. Every turn loaded all 4,800. Every session. Most rules were never relevant to the task at hand.

A 5,000-token CLAUDE.md costs you 5,000 tokens **before you type a single word.** Multiply by 200 turns per week: 1 million tokens a week from your CLAUDE.md alone.

**The fix:**

```bash
# Check your current size
wc -w ~/.claude/CLAUDE.md
wc -w .claude/CLAUDE.md   # project-level

# Target: combined under 1,200 words (~1,500 tokens)
```

If you're over, refactor ruthlessly:
- Move framework rules to project-level CLAUDE.md (only loads in that project)
- Extract repeated patterns into skills (loaded only when invoked)
- Delete anything you can't remember writing
- Convert "explain why" paragraphs into 3-word imperatives

I cut mine from 4,800 to 900 tokens. Same behavior. 31% reduction in baseline cost, instantly.

---

### 2. Conversation History Re-reads - 13% of total tokens

Every follow-up message re-tokenizes the entire conversation history. By message 30 in a chat, each turn is paying for messages 1–29 to be re-read. At ~500 tokens per exchange, message 30 costs **30× message 1.**

I had sessions with 60+ messages. The last message was costing 60× the first.

**The fix:**

Three rules, in order:
1. **Edit the prior message instead of follow-up.** Up-arrow → edit → re-send. The bad exchange gets replaced, not stacked.
2. **Hard cap at 20 messages.** When you cross 20, ask Claude to summarize what's been done, start a fresh chat with that summary as the first message.
3. **Use `/compact` instead of `/clear` when you need continuity.** `/compact` summarizes and restarts. `/clear` nukes everything.

I went from 60-message sessions to 15-message average. 40% drop in re-read cost.

---

### 3. Hook Injection Waste - 11% of total tokens

I had 4 plugins installed. Three of them registered `UserPromptSubmit` hooks that injected context - branch names, recent file changes, memory snippets. Combined: **6,200 tokens injected on every prompt**, before Claude even read my question.

Each hook is designed to be helpful. Together they're a wall.

**The fix:**

```bash
# See exactly what's being injected
cat ~/.claude/settings.json | jq '.hooks.UserPromptSubmit'
cat .claude/settings.json | jq '.hooks.UserPromptSubmit'

# Disable hooks you can't justify
/plugin disable <plugin-name>
```

Audit every hook. If you can't articulate *why* it fires on every prompt, kill it. I went from 4 active `UserPromptSubmit` hooks to 1 (just git branch). 5,800 tokens saved per prompt.

---

### 4. Cache Misses on Session Resume - 10% of total tokens

Anthropic's prompt cache has a 5-minute lifetime by default. Take a coffee break. Come back. First message pays full price for ~8K tokens of content that was cached 6 minutes ago.

I tracked ~640 cache misses over 90 days. Each one re-tokenized 8,000+ tokens at full price instead of 10% (cache read price).

**The fix:**

- **Fast workaround:** Bind a "ping" command to a hotkey. Send any prompt within 4 minutes before a break. Keeps the cache warm.
- **Real fix (paid plans):** Upgrade to 1-hour cache lifetime. Cache write tokens are 2× base price (one-time), cache reads are 0.1×. If you have 10+ resumes per session, it pays for itself.

I run the 1-hour cache now. Cache miss cost dropped 80%.

---

### 5. Skill Loading on Irrelevant Tasks - 7% of total tokens

I had 9 skills installed. Each one auto-invokes when Claude detects relevance - and the detection is conservative: when in doubt, load. My UI design skill was loading on backend tasks. My video generation skill was loading on text-only tasks.

Each skill `SKILL.md` is 800–2,500 tokens. Loaded "just in case." 9 skills × ~1,500 tokens = **13,500 tokens of overhead per task** that didn't need any of them.

**The fix:**

```bash
# See which skills were actually invoked
grep -h "skill_invoked" ~/.claude/logs/*.log | sort | uniq -c | sort -rn

# Disable everything not in the output
/plugin disable <skill-name>
```

Run a 7-day audit. Disable skills you didn't actually use. I went from 11 active skills to 4. 9,000+ tokens saved per task.

---

### 6. "Just in Case" Tool Definitions - 6% of total tokens

I had 12 MCP servers connected. Each one ships its tool schema to every request, regardless of whether the task involves that tool. PostgreSQL MCP tool schema alone: ~1,200 tokens.

**12 MCPs × ~600 avg tokens = 7,200 tokens per request.** I used maybe 3 of these in 80% of my work.

**The fix:**

```bash
/mcp                      # list connected servers
/mcp disable <server>     # disable for current session
```

For permanent control, edit `~/.claude/settings.json` to remove unused MCPs from the auto-load list. Re-enable per-session when you actually need them. I went from 12 to 3 always-on MCPs. 6,000 tokens saved per request.

---

### 7. Extended Thinking on Simple Questions - 5% of total tokens

I left extended thinking on globally. Claude burned 3,000+ tokens of `<thinking>` on questions like "rename this variable to camelCase."

Extended thinking is real value for architecture decisions and complex debugging. On simple tasks it's pure overhead.

**The fix:** Default extended thinking **OFF**. Toggle on per-message when you genuinely need it (`Alt+T` in Claude Code). About 80% of tasks don't need it. The 20% that do - you'll know.

---

### 8. Wrong-Direction Generation - 4% of total tokens

Claude starts writing a 400-line response. Within the first 50 lines you can see it's going the wrong way. Most people let it finish, then re-prompt. The remaining 350 lines are wasted output tokens.

Output tokens are billed. Letting Claude finish a wrong response cost me roughly 4% of my total spend. Stupid tax.

**The fix:** `Cmd+.` (Mac) / `Ctrl+.` stops generation immediately. Claude keeps what it wrote. You redirect from there.

Train yourself to use this in the first 5 seconds of any response that's drifting. For Claude Code terminal users: double-`Esc` opens a checkpoint scroller - rewind to any prior state and try a different approach without re-running everything.

---

### 9. Plugin Auto-Update Redundancy - 3% of total tokens

Every installed plugin fires a `SessionStart` hook. Several add a small "loaded successfully" notification - ~50 tokens each. Nine plugins × multiple messages = **~1,400 tokens at every session start**, just for confirmation noise you never read.

**The fix:**

```bash
# Audit SessionStart hooks
cat ~/.claude/settings.json | jq '.hooks.SessionStart'
```

Kill anything that's just a status notification. It's the smallest item on this list, but it fires before you type a single word - every session, forever.

---

## Before vs. After

<div class="kb">
  <div class="kb-before">
    <div class="kb-tag" style="color:#ef4444;">Before</div>
    <div class="kb-num" style="color:#dc2626;">27%</div>
    <div class="kb-sub">productive tokens</div>
    <div class="kb-list">
      <div>· 4,800-token CLAUDE.md</div>
      <div>· 60-message sessions</div>
      <div>· 12 MCPs always-on</div>
      <div>· Extended thinking: always on</div>
      <div>· 6,200 tokens injected per prompt</div>
    </div>
  </div>
  <div class="kb-after">
    <div class="kb-tag" style="color:#16a34a;">After</div>
    <div class="kb-num" style="color:#16a34a;">65%</div>
    <div class="kb-sub">productive tokens</div>
    <div class="kb-list">
      <div>· 900-token CLAUDE.md</div>
      <div>· 15-message sessions</div>
      <div>· 3 MCPs always-on</div>
      <div>· Extended thinking: per-task</div>
      <div>· 400 tokens injected per prompt</div>
    </div>
  </div>
</div>

Not 100% - there's an unavoidable floor of overhead. But 65% is a different category of life than 27%.

---

## What Didn't Work

Things the obvious advice recommends, that didn't move the needle:

**Switching to Haiku for "simple" tasks** - helped ~3%. The real waste isn't the model, it's context bloat. A cheaper model on a bloated context still costs more than an expensive model on a lean context.

**Aggressive `/clear` between every task** - counter-productive. Lost context I genuinely needed. Better: long-running session per project with lean CLAUDE.md and instrumented hooks.

**Disabling all skills entirely** - initially saved tokens, then I started writing the same 200-token instructions manually in every prompt. Net negative. Keep 3–4 skills you actually use, disable the rest.

**Off-peak scheduling** - worked partially. Anthropic's peak-hour quota reduction is real (~7% of users affected). For most people, the bigger lever is the patterns above, not the time of day.

**Subscription downgrade** - doesn't work. Cost per work-hour stayed the same, limits just hit more painfully.

---

## The Audit Script

Run this once. Fix what's flagged. Re-run weekly.

```bash
#!/bin/bash
# claude-audit.sh - run in your project root

echo "=== CLAUDE.md size ==="
wc -w ~/.claude/CLAUDE.md 2>/dev/null
wc -w .claude/CLAUDE.md 2>/dev/null
echo "Target: combined < 1,200 words"

echo
echo "=== Active hooks ==="
cat ~/.claude/settings.json 2>/dev/null | jq '.hooks // {} | keys'
cat .claude/settings.json 2>/dev/null | jq '.hooks // {} | keys'

echo
echo "=== UserPromptSubmit injections ==="
cat ~/.claude/settings.json 2>/dev/null | jq '.hooks.UserPromptSubmit'
cat .claude/settings.json 2>/dev/null | jq '.hooks.UserPromptSubmit'

echo
echo "=== Installed plugins ==="
ls ~/.claude/plugins/ 2>/dev/null
echo "Target: 3-5 active. Disable the rest."

echo
echo "=== Installed skills ==="
ls ~/.claude/skills/ 2>/dev/null
echo "Target: 3-5 active matching daily work."

echo
echo "=== Connected MCPs ==="
cat ~/.claude/settings.json 2>/dev/null | jq '.mcpServers // {} | keys'
echo "Target: 3 always-on. Per-session enable rest."
```

---

## The Mental Model Shift

The mistake: treating every Claude Code session as a fresh blank slate.

In reality, every session is an invoice that **pre-charges you** before you've done a single thing:

<div class="kv">
  <div class="kv-head"><span class="kc-label">Session invoice - charged before your first word</span></div>
  <div>
    <div class="kv-row"><span class="kv-cell">CLAUDE.md</span><span class="kv-val" style="color:#dc2626;">always</span></div>
    <div class="kv-row kv-row-alt"><span class="kv-cell">Active plugin hooks</span><span class="kv-val" style="color:#dc2626;">always</span></div>
    <div class="kv-row"><span class="kv-cell">Skill SKILL.md files</span><span class="kv-val" style="color:#f97316;">when relevance detected</span></div>
    <div class="kv-row kv-row-alt"><span class="kv-cell">MCP tool schemas</span><span class="kv-val" style="color:#dc2626;">always</span></div>
    <div class="kv-row"><span class="kv-cell">Conversation history</span><span class="kv-val" style="color:#dc2626;">every turn</span></div>
    <div class="kv-row kv-row-alt" style="border-bottom:none;"><span class="kv-cell">Cache miss recompilation</span><span class="kv-val" style="color:#f97316;">after 5 min idle</span></div>
  </div>
  <div class="kv-foot">
    <span style="font-size:0.8125rem;font-weight:600;color:#15803d;">Your actual question</span>
    <span style="font-size:0.8125rem;font-family:monospace;font-weight:600;color:#15803d;">what's left</span>
  </div>
</div>

Productive tokens are the **residual**. What's left after all the overhead is paid.

If you want more productive tokens - which is what "more usage from your plan" actually means - you have to attack the overhead, not just write better prompts.

Better prompts help when overhead is small. When overhead is 73%, prompts barely matter.

Most "Claude got dumber" complaints in 2026 trace back to this. The model didn't get dumber. Your overhead grew. The model has the same compute budget, but most of it is spent re-reading your bloated CLAUDE.md, your 12 hook injections, and the 4 plugins you forgot you installed.

Attack the overhead. The rest follows.
