---
title: "Cut Your AI Token Usage by 75% With One Command"
titleTr: "Tek Komutla AI Token Kullanımını %75 Azalt"
description: "Most AI responses are padding. One command strips the filler and cuts your token usage by around 75 percent."
date: "2026-05-25"
image: "/blog/cut-your-ai-token-usage-by-75-with-one-command.webp"
tags: ["claude-code", "tokens", "productivity"]
---

You open Claude Code. You ask it to fix a bug. It responds with four paragraphs.

First paragraph: what it understood. Second: what it's going to do. Third: the actual fix. Fourth: a summary of what it just did.

You read paragraph three. You ignore the rest. But you already paid for all four.

That's the problem Caveman solves.

---

## First, what even is a token?

If you've never thought about this: AI models don't read words, they read tokens. A token is roughly 3-4 characters. The word "button" is one token. "backgroundColor" is two. A typical response from Claude is 200-500 tokens.

Why does this matter? Because:

- Claude has a **context limit** - once you hit it, the session resets
- Claude Pro and Max have **usage limits** - once you hit them, you wait
- Claude API costs **money per token** - input and output

The more an AI talks, the faster you burn through all three.

<style>
.cv { border-radius: 12px; overflow: hidden; border: 1px solid #DDDDD5; margin: 2rem 0; }
.cv-head { padding: 1rem 1.25rem; background: #EEEEE8; border-bottom: 1px solid #DDDDD5; }
.cv-label { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; }
.cv-body { padding: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; }
.cv-row { display: flex; justify-content: space-between; align-items: center; font-size: 0.8125rem; }
.cv-name { color: #374151; }
.cv-val { font-family: monospace; font-weight: 600; }

.cb { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 2rem 0; }
.cb-before { border-radius: 12px; border: 1px solid #fecaca; background: #fff5f5; padding: 1.25rem; }
.cb-after { border-radius: 12px; border: 1px solid #bbf7d0; background: #f0fdf4; padding: 1.25rem; }
.cb-tag { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem; }
.cb-tag-red { color: #dc2626; }
.cb-tag-green { color: #16a34a; }
.cb-num { font-size: 1.75rem; font-weight: 800; margin-bottom: 0.25rem; line-height: 1; }
.cb-sub { font-size: 0.8125rem; color: #6b7280; margin-bottom: 0.75rem; }
.cb-text { font-size: 0.8125rem; color: #374151; line-height: 1.6; font-style: italic; border-left: 3px solid #e5e7eb; padding-left: 0.75rem; }

.cs { border-radius: 12px; border: 1px solid #DDDDD5; overflow: hidden; margin: 2rem 0; }
.cs-head { padding: 0.75rem 1.25rem; background: #EEEEE8; border-bottom: 1px solid #DDDDD5; }
.cs-row { display: grid; grid-template-columns: 1fr auto auto; gap: 1rem; padding: 0.75rem 1.25rem; border-bottom: 1px solid #E8E8E2; align-items: center; }
.cs-row:last-child { border-bottom: none; }
.cs-row-alt { background: #F4F4EE; }
.cs-cmd { font-family: monospace; font-size: 0.8125rem; color: #374151; }
.cs-desc { font-size: 0.8125rem; color: #6b7280; }
.cs-save { font-size: 0.8125rem; font-weight: 600; color: #16a34a; font-family: monospace; }

.ci { border-radius: 12px; border: 1px solid #DDDDD5; overflow: hidden; margin: 2rem 0; }
.ci-head { padding: 0.75rem 1.25rem; background: #EEEEE8; border-bottom: 1px solid #DDDDD5; display: flex; align-items: center; gap: 0.5rem; }
.ci-dot { width: 8px; height: 8px; border-radius: 50%; }
.ci-title { font-size: 0.75rem; font-weight: 600; color: #6b7280; letter-spacing: 0.05em; text-transform: uppercase; }
.ci-body { padding: 1.25rem; font-family: monospace; font-size: 0.8125rem; color: #374151; line-height: 1.8; }
.ci-comment { color: #6b7280; }
.ci-cmd { color: #0284c7; }
.ci-out { color: #16a34a; }

.ct { border-radius: 12px; border: 1px solid #DDDDD5; overflow: hidden; margin: 2rem 0; }
.ct-head { padding: 0.75rem 1.25rem; background: #EEEEE8; border-bottom: 1px solid #DDDDD5; }
.ct-row { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 0.5rem; padding: 0.75rem 1.25rem; border-bottom: 1px solid #E8E8E2; align-items: center; font-size: 0.8125rem; }
.ct-row:last-child { border-bottom: none; }
.ct-row-alt { background: #F4F4EE; }
.ct-head-row { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; }
.ct-task { color: #374151; }
.ct-before { font-family: monospace; color: #6b7280; }
.ct-after { font-family: monospace; color: #16a34a; font-weight: 600; }
.ct-save { font-family: monospace; color: #dc2626; font-weight: 700; }

.dark .cv { border-color: #2a2826; }
.dark .cv-head { background: #1E1C1A; border-color: #2a2826; }
.dark .cv-label { color: #a1a1aa; }
.dark .cv-name { color: #d4d4d8; }

.dark .cb-before { border-color: #7f1d1d; background: rgba(220,38,38,0.1); }
.dark .cb-after { border-color: #14532d; background: rgba(22,163,74,0.1); }
.dark .cb-sub { color: #a1a1aa; }
.dark .cb-text { color: #d4d4d8; border-color: #2a2826; }

.dark .cs { border-color: #2a2826; }
.dark .cs-head { background: #1E1C1A; border-color: #2a2826; }
.dark .cs-row { border-color: #2a2826; }
.dark .cs-row-alt { background: #1E1C1A; }
.dark .cs-cmd { color: #d4d4d8; }
.dark .cs-desc { color: #71717a; }

.dark .ci { border-color: #2a2826; }
.dark .ci-head { background: #1E1C1A; border-color: #2a2826; }
.dark .ci-body { color: #d4d4d8; }
.dark .ci-comment { color: #71717a; }

.dark .ct { border-color: #2a2826; }
.dark .ct-head { background: #1E1C1A; border-color: #2a2826; }
.dark .ct-row { border-color: #2a2826; }
.dark .ct-row-alt { background: #1E1C1A; }
.dark .ct-task { color: #d4d4d8; }
.dark .ct-before { color: #71717a; }

.cb-ultra { border-radius: 12px; border: 1px solid #bfdbfe; background: #eff6ff; padding: 1.25rem; }
.cb-tag-blue { color: #1d4ed8; }
.dark .cb-ultra { border-color: #1e3a5f; background: rgba(29,78,216,0.1); }
</style>

<div class="cv">
  <div class="cv-head"><span class="cv-label">Where tokens actually go in a typical session</span></div>
  <div class="cv-body">
    <div class="cv-row"><span class="cv-name">Preamble ("I understand what you're asking...")</span><span class="cv-val" style="color:#dc2626;">~30 tokens</span></div>
    <div class="cv-row"><span class="cv-name">The actual answer</span><span class="cv-val" style="color:#16a34a;">~20 tokens</span></div>
    <div class="cv-row"><span class="cv-name">Recap ("In summary, I've fixed the bug by...")</span><span class="cv-val" style="color:#dc2626;">~25 tokens</span></div>
    <div class="cv-row"><span class="cv-name">Offers to help further</span><span class="cv-val" style="color:#dc2626;">~10 tokens</span></div>
  </div>
</div>

Out of 85 tokens in that exchange, only 20 were useful. You paid for the rest.

---

## Caveman

Caveman is a plugin for AI coding agents - Claude Code, Codex, Gemini CLI - that forces the model to communicate like a cave person. No preamble. No recap. No filler. Just the answer.

The philosophy, straight from the project:

> "Why use many token when few do trick"

It doesn't make the AI dumber. It doesn't change how the model thinks. It only changes how the model talks. The reasoning happens the same way - you just stop paying for words that add nothing.

---

## Before and after

This is a real example from the Caveman docs. Same bug, same fix, same model.

<div class="cb" style="grid-template-columns: 1fr 1fr 1fr;">
  <div class="cb-before">
    <div class="cb-tag cb-tag-red">Without Caveman - 69 tokens</div>
    <div class="cb-text">"The React component is re-rendering because a new object reference is being created on every render. I'd recommend wrapping the object in a useMemo hook to stabilize the reference and prevent unnecessary re-renders."</div>
  </div>
  <div class="cb-after">
    <div class="cb-tag cb-tag-green">/caveman (full) - 19 tokens</div>
    <div class="cb-text">"Inline object prop = new ref = re-render. Wrap with useMemo."</div>
  </div>
  <div class="cb-ultra">
    <div class="cb-tag cb-tag-blue">/caveman ultra - 12 tokens</div>
    <div class="cb-text">"Inline obj prop → new ref → re-render. useMemo."</div>
  </div>
</div>

Same fix. Same correctness. Far less to read.

---

## Installing it

One command. That's it.

<div class="ci">
  <div class="ci-head">
    <div class="ci-dot" style="background:#ef4444;"></div>
    <div class="ci-dot" style="background:#f59e0b;"></div>
    <div class="ci-dot" style="background:#22c55e;"></div>
    <span class="ci-title" style="margin-left:0.5rem;">terminal</span>
  </div>
  <div class="ci-body">
    <span class="ci-comment"># macOS / Linux / WSL</span><br>
    <span class="ci-cmd">curl -fsSL https://raw.githubusercontent.com/JuliusBrussee/caveman/main/install.sh | bash</span><br>
    <br>
    <span class="ci-comment"># Windows (PowerShell)</span><br>
    <span class="ci-cmd">irm https://raw.githubusercontent.com/JuliusBrussee/caveman/main/install.ps1 | iex</span>
  </div>
</div>

Takes about 30 seconds. Requires Node 18 or newer.

The installer detects every supported agent and sets up Caveman for all of them. If you only want it in one place:

<div class="ci">
  <div class="ci-head">
    <div class="ci-dot" style="background:#ef4444;"></div>
    <div class="ci-dot" style="background:#f59e0b;"></div>
    <div class="ci-dot" style="background:#22c55e;"></div>
    <span class="ci-title" style="margin-left:0.5rem;">selective install</span>
  </div>
  <div class="ci-body">
    <span class="ci-comment"># Claude Code only</span><br>
    <span class="ci-cmd">claude plugin marketplace add JuliusBrussee/caveman</span><br>
    <span class="ci-cmd">claude plugin install caveman@caveman</span><br>
    <br>
    <span class="ci-comment"># Gemini CLI only</span><br>
    <span class="ci-cmd">gemini extensions install https://github.com/JuliusBrussee/caveman</span><br>
    <br>
    <span class="ci-comment"># Cursor / Windsurf / Cline / Copilot</span><br>
    <span class="ci-cmd">npx skills add JuliusBrussee/caveman -a cursor</span><br>
    <span class="ci-out"># replace cursor with: windsurf, cline, github-copilot</span>
  </div>
</div>

After that, open Claude Code and type `/caveman`. Done. To go back to normal, type "normal mode".

---

## The commands

<div class="cs">
  <div class="cs-head"><span class="cv-label">Available commands</span></div>
  <div class="cs-row cs-row-alt">
    <span class="cs-cmd">/caveman</span>
    <span class="cs-desc">Activate default cave mode</span>
    <span class="cs-save">-65% output</span>
  </div>
  <div class="cs-row">
    <span class="cs-cmd">/caveman lite</span>
    <span class="cs-desc">Only removes filler words, keeps full sentences</span>
    <span class="cs-save">-30% output</span>
  </div>
  <div class="cs-row cs-row-alt">
    <span class="cs-cmd">/caveman ultra</span>
    <span class="cs-desc">Telegraphic - almost no grammar</span>
    <span class="cs-save">-80% output</span>
  </div>
  <div class="cs-row">
    <span class="cs-cmd">/caveman-commit</span>
    <span class="cs-desc">Generates conventional commit messages under 50 chars</span>
    <span class="cs-save">shorter commits</span>
  </div>
  <div class="cs-row cs-row-alt">
    <span class="cs-cmd">/caveman-compress</span>
    <span class="cs-desc">Shrinks your CLAUDE.md and memory files</span>
    <span class="cs-save">-46% input</span>
  </div>
  <div class="cs-row cs-row-alt">
    <span class="cs-cmd">/caveman-stats</span>
    <span class="cs-desc">Shows how many tokens you've saved this session</span>
    <span class="cs-save">insight</span>
  </div>
  <div class="cs-row">
    <span class="cs-cmd">/cavecrew</span>
    <span class="cs-desc">Spawns a compressed subagent for a subtask — result comes back ~60% smaller than inline</span>
    <span class="cs-save">-60% context</span>
  </div>
</div>

`/cavecrew` is useful for investigation tasks - "where is X defined", "what calls Y". Instead of Claude reading and reporting back in full paragraphs, it spawns a subagent that returns a compressed table of file:line results. Same information, fraction of the context.

`/caveman-compress` is interesting because it targets the other side of the equation. Your CLAUDE.md and memory files are read at the start of every session - that's input tokens. Compressing them once saves tokens on every future session, permanently.

---

## Real numbers

Measured across 10 tasks:

<div class="ct">
  <div class="ct-head">
    <div class="ct-row ct-head-row">
      <span>Task</span>
      <span>Before</span>
      <span>After</span>
      <span>Saved</span>
    </div>
  </div>
  <div class="ct-row ct-row-alt">
    <span class="ct-task">Explain React re-render bug</span>
    <span class="ct-before">69 tok</span>
    <span class="ct-after">19 tok</span>
    <span class="ct-save">-73%</span>
  </div>
  <div class="ct-row">
    <span class="ct-task">Fix auth middleware</span>
    <span class="ct-before">112 tok</span>
    <span class="ct-after">19 tok</span>
    <span class="ct-save">-83%</span>
  </div>
  <div class="ct-row ct-row-alt">
    <span class="ct-task">Debug PostgreSQL pool</span>
    <span class="ct-before">94 tok</span>
    <span class="ct-after">15 tok</span>
    <span class="ct-save">-84%</span>
  </div>
  <div class="ct-row">
    <span class="ct-task">PR security review</span>
    <span class="ct-before">180 tok</span>
    <span class="ct-after">106 tok</span>
    <span class="ct-save">-41%</span>
  </div>
  <div class="ct-row ct-row-alt">
    <span class="ct-task">Average across all tasks</span>
    <span class="ct-before">-</span>
    <span class="ct-after">-</span>
    <span class="ct-save">-65%</span>
  </div>
</div>

The bigger the explanation, the more you save. Simple one-liners see less benefit. Long debugging sessions see the most.

---

## One thing to understand

Caveman only affects output tokens - what the AI writes back to you.

It does not affect thinking tokens. When Claude works through a problem internally, that process is unchanged. You're not making the AI less capable. You're just cutting the part where it restates everything in four different ways before giving you the answer.

The project puts it better: "Caveman no make brain smaller."

One more thing worth knowing: if you're running Claude with extended thinking enabled, Caveman's impact shrinks. Thinking tokens can represent 80-90% of total token usage - and Caveman doesn't touch those. In a thinking-heavy session, the actual bill reduction is closer to 5-15%. The savings are real, but concentrated in conversational and explanation-heavy workflows. Debug sessions, code reviews, architecture questions - that's where it earns its keep.

---

## One install, every tool

The installer detects what you have and sets up Caveman everywhere at once. Run the single curl command and it automatically wires into Claude Code, Cursor, Windsurf, and Gemini CLI - whatever is installed on your machine.

```
installed:
  • claude
  • claude-hooks
  • caveman-shrink
  • gemini
  • cursor
  • windsurf
```

You don't pick which tool gets it. They all get it. If you switch between Cursor during the day and Claude Code at night, both are running lean. You activate once, forget about it.

---

## Who this is for

- You use Claude Code, Cursor, Windsurf, or Gemini CLI regularly
- You've hit usage limits and wondered where all the tokens went
- You're paying API costs and want them lower
- You find long AI responses annoying

If any of those are true, the install takes 30 seconds and the first `/caveman` is free. You'll know immediately whether it fits how you work.

Source: [github.com/JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman)
