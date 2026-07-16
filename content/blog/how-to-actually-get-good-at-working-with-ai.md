---
title: "How to Actually Get Good at Working with AI"
titleTr: "AI ile Çalışmada Gerçekten İyi Olmak"
description: "Working with AI tools is a skill. The habits that separate developers who fight their tools from those who ship four times more."
date: "2026-05-25"
image: "/blog/how-to-actually-get-good-at-working-with-ai.webp"
tags: ["ai", "workflow", "habits"]
---

Nobody tells you this upfront: working with AI tools is a skill. Not prompting - that's a small part of it. The actual skill is knowing how to structure your sessions, how to feed context, when to slow down, and when to let it run.

A developer on Reddit tracked his Claude Code usage for two months. He was hitting his daily limit before noon, every day. His prompts were fine. His habits were the problem. He fixed the habits. Same tool, same plan, four times the output.

These are the habits that made the biggest difference. They work across Claude, ChatGPT, Cursor, Windsurf, or whatever tool you're using today.

---

## 1. A Memory File is Useless Unless the AI Reads It Every Time

The most common advice is "keep a memory file in your project." Good advice. But incomplete.

Here's what actually happens: you create `memory.md`, write your stack, your decisions, your constraints. Then three sessions later the AI generates a direct database query from inside the API handler - exactly the pattern your service layer was designed to prevent. Because it never looked at the file.

The file existing is not enough. The AI needs to be told to read it.

Fix this in your `CLAUDE.md`, `AGENTS.md`, or `.cursorrules`:

```text
Before every response, read memory.md. If something important changed in this session, update it.
```

Now it's a reflex, not a suggestion. The AI checks it without you asking. And it updates it when it learns something new about your project.

What goes in `memory.md`:

<style>
.mv { border-radius: 8px; border: 1px solid #DDDDD5; overflow: hidden; margin: 1.5rem 0; }
.mv-head { padding: 0.6rem 1rem; background: #EEEEE8; border-bottom: 1px solid #DDDDD5; }
.mv-label { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; }
.mv-row { display: grid; grid-template-columns: 180px 1fr; padding: 0.6rem 1rem; border-bottom: 1px solid #E8E8E2; font-size: 0.8125rem; gap: 1rem; }
.mv-row:last-child { border-bottom: none; }
.mv-key { color: #6b7280; font-family: monospace; }
.mv-val { color: #374151; }

.dark .mv { border-color: #2a2826; }
.dark .mv-head { background: #1E1C1A; border-color: #2a2826; }
.dark .mv-label { color: #a1a1aa; }
.dark .mv-row { border-color: #2a2826; }
.dark .mv-key { color: #a1a1aa; }
.dark .mv-val { color: #d4d4d8; }
</style>

<div class="mv">
  <div class="mv-head"><span class="mv-label">memory.md - what actually belongs here</span></div>
  <div class="mv-row"><span class="mv-key">environments</span><span class="mv-val">dev / staging / prod. Never touch prod directly. All changes go through staging first.</span></div>
  <div class="mv-row"><span class="mv-key">stack</span><span class="mv-val">Node 20, PostgreSQL 15, Redis 7. Internal auth via OAuth2 - no third-party session libs.</span></div>
  <div class="mv-row"><span class="mv-key">decisions</span><span class="mv-val">Event-driven architecture. No direct DB calls from API layer - go through service layer.</span></div>
  <div class="mv-row"><span class="mv-key">constraints</span><span class="mv-val">No new dependencies without team review. No schema changes without a migration file.</span></div>
  <div class="mv-row"><span class="mv-key">known issues</span><span class="mv-val">Distributed lock on order processor breaks under high concurrency. Fix tracked in JIRA-2847.</span></div>
</div>

Not your full spec. Not your README. Just the things the AI keeps getting wrong.

---

## 2. Proof of Concept First, Always

This is the most expensive mistake in agentic coding: jumping straight to the full implementation.

You describe a feature. The AI writes 400 lines across 6 files. You look at it and realize the approach is wrong. Now you're either accepting bad code or starting over. Both are expensive.

Someone in the Cursor Discord put it well: "I lost four hours because I didn't ask for a PoC first. The AI built the entire auth system using a pattern I explicitly didn't want. My fault, not the AI's."

The fix is simple: ask for the smallest possible version first.

New API endpoint? Ask for the handler stub with no validation, no error handling, no tests. Does the contract and routing look right? Then build out.

Refactoring a service? Ask for the interface change only, not the implementation. Does the shape make sense to the rest of the codebase? Then continue.

Debugging? Ask for the minimal reproduction case first, not the full fix. Confirm you're looking at the right problem before touching anything.

This is not about being cautious. It's about the cost of wrong direction being much higher than the cost of one extra step. A 50-line PoC that shows you the approach is wrong saves you hours.

---

## 3. Clone the Repos Your Project Depends On

AI tools hallucinate APIs. They confidently write code for a method that doesn't exist, or for a version that's three major releases old.

The fix: clone the actual source code of the libraries you use and tell the AI where to find it.

```bash
# Clone into a sibling directory
git clone https://github.com/stripe/stripe-node ~/sources/stripe-node
```

Then reference it in your `AGENTS.md` or `CLAUDE.md`:

```text
When you need to understand how the Stripe SDK works, read the source at ~/sources/stripe-node.
Don't guess the API surface. Read it.
```

This sounds like extra work. It saves hours of debugging phantom methods - especially for SDKs with breaking changes between major versions, libraries your team uses in non-standard ways, or internal packages that aren't indexed anywhere the model has seen.

The AI reads the actual code and gives you answers that match reality.

---

## 4. Break the Task Before Running It

One of the highest-leverage habits: before asking the AI to do something, ask it to explain what it's going to do.

```text
Don't write anything yet. Tell me how you'd approach this.
```

This takes 30 seconds. It catches wrong assumptions before they become wrong code. The AI often reveals a misunderstanding in its plan that would have cost you 20 minutes to untangle after the fact.

Once you approve the plan, let it run. The directional cost is paid once, not after.

---

## 5. Tell It What You Don't Want

Most prompts describe what you want. Few describe what you don't want.

These are not the same thing. "Add dark mode support" and "Add dark mode support without touching the existing CSS variables" produce very different results.

Negative constraints are cheap to write and expensive to discover after the fact.

Before any significant change, add a line or two:

```text
Don't add new dependencies.
Don't modify the auth logic.
Don't change the database schema.
Keep the existing file structure.
```

The AI treats hard constraints seriously. Use them.

---

## 6. Commit at Every Checkpoint

Agentic sessions are long. The AI makes a change that works, then makes another that breaks something earlier. Without commits, you're debugging a moving target.

A common story: two hours into a session, something breaks that was working at the start. No commits means no rollback point. You spend another hour untangling changes instead of moving forward.

Commit every time something works. Not when the feature is done. When anything works.

The cost of an extra commit is zero. The cost of untangling 90 minutes of changes with no rollback point is real. Don't learn this one the hard way.

---

## The Pattern Underneath All of This

Each of these habits solves the same problem: AI tools start fresh every session and drift over long ones.

Memory file - prevents context drift between sessions. PoC first - prevents directional drift at the start. Repo clones - prevents hallucination drift on APIs. Task breakdown - catches drift before it starts. Negative constraints - bounds the drift space. Commits - lets you recover from drift.

You're not just prompting. You're managing context over time. The better you get at that, the better the output gets.

The tools keep improving. The habits matter more than the tool.
