import { readFileSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import type { Metadata } from "next";
import { CommandBar } from "@/components/scout/CommandBar";
import { HeroContextGraph } from "@/components/scout/HeroContextGraph";
import { ScanStory } from "@/components/scout/ScanStory";
import "./scout.css";

export const metadata: Metadata = {
  title: "Scout - Code intelligence for AI coding agents",
  description:
    "Scout finds security, performance, correctness, and architecture issues across your codebase, then maps repository relationships for AI coding agents.",
};

const githubUrl = "https://github.com/aykutssert/scout";

const heroCardSvg = readFileSync(
  join(process.cwd(), "public", "hero-card.svg"),
  "utf8",
);

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8h9M8.5 3.5 13 8l-4.5 4.5" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.5a9.5 9.5 0 0 0-3 18.51c.48.09.65-.2.65-.46v-1.67c-2.66.58-3.22-1.13-3.22-1.13-.43-1.1-1.06-1.4-1.06-1.4-.87-.59.07-.58.07-.58.96.07 1.47.99 1.47.99.85 1.46 2.24 1.04 2.79.8.09-.62.33-1.04.61-1.28-2.13-.24-4.36-1.06-4.36-4.7 0-1.04.37-1.89.98-2.56-.1-.24-.43-1.21.09-2.52 0 0 .8-.26 2.61.98A9.1 9.1 0 0 1 12 7.16a9 9 0 0 1 2.38.32c1.81-1.24 2.6-.98 2.6-.98.52 1.31.19 2.28.1 2.52.61.67.98 1.52.98 2.56 0 3.65-2.24 4.46-4.37 4.7.34.3.65.88.65 1.77v2.5c0 .26.17.56.66.46A9.5 9.5 0 0 0 12 2.5Z" />
    </svg>
  );
}

function Brand() {
  return (
    <a className="brand" href="#top" aria-label="Scout home">
      <Image src="/scout-icon.svg" alt="" width={34} height={34} unoptimized />
      <span>scout</span>
    </a>
  );
}

function GraphVisual() {
  return (
    <div className="graph-card" aria-label="Repository relationship map">
      <div className="panel-top">
        <div className="traffic-lights" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <span>repository context</span>
        <span className="panel-state">indexed</span>
      </div>
      <div className="graph-canvas">
        <HeroContextGraph svg={heroCardSvg} />
        <div className="hero-card-legend" aria-label="Graph relationship types">
          <span className="legend-item legend-code">code structure</span>
          <span className="legend-item legend-imports">imports</span>
          <span className="legend-item legend-calls">calls</span>
          <span className="legend-item legend-scout">scout flow</span>
        </div>
      </div>
    </div>
  );
}

const capabilityCards = [
  {
    number: "01",
    title: "Security",
    body: "Find exposed secrets, unsafe data flow, missing guards, vulnerable dependencies, and framework-specific risks.",
  },
  {
    number: "02",
    title: "Performance",
    body: "Catch costly render patterns, repeated work, inefficient collection operations, and avoidable runtime allocation.",
  },
  {
    number: "03",
    title: "Correctness",
    body: "Surface broken async flows, lifecycle mistakes, unsafe boundaries, and defects that ordinary linting misses.",
  },
  {
    number: "04",
    title: "Architecture",
    body: "Inspect imports and cross-file relationships for cycles, layer violations, oversized components, and missing registrations.",
  },
];

const ecosystem = [
  "JavaScript", "TypeScript", "React", "Next.js", "Svelte",
  "Node.js", "Express", "NestJS", "Vite", "TanStack", "React Native", "Bun",
];

export default function ScoutPage() {
  return (
    <div className="scout-page">
        <main id="top">
          <div className="kernel-strip">
            <a href="https://kernelgallery.com" className="kernel-strip-link">
              <Image src="/kernel-logo.svg" alt="" width={16} height={16} unoptimized />
              kernelgallery.com
            </a>
          </div>

          <header className="site-header">
            <Brand />
            <nav aria-label="Main navigation">
              <a href="#capabilities">Capabilities</a>
              <a href="#context">Context</a>
              <a href="#workflow">How it works</a>
            </nav>
            <a className="github-link" href={githubUrl}>
              <GithubIcon />
              <span>GitHub</span>
            </a>
          </header>

          <section className="hero section-shell">
            <div className="hero-copy">
              <p className="eyebrow">
                <span />
                Code intelligence for AI coding agents
              </p>
              <h1>
                If your agent writes
                <br />
                bad code. <em>This catches it.</em>
              </h1>
              <p className="hero-intro">
                Scout finds security, performance, correctness, and architecture
                issues across your codebase. Then it maps repository relationships
                so your coding agent can make changes with the right context.
              </p>
              <div className="hero-actions">
                <a className="primary-button" href={githubUrl}>
                  View on GitHub
                  <ArrowIcon />
                </a>
                <CommandBar command="npm install -g @aykutss/scout" />
              </div>
              <p className="hero-footnote">
                One command. Works with Claude Code, Codex, Cursor, and other coding
                agents.
              </p>
            </div>
            <GraphVisual />
          </section>

          <section className="proof-strip" aria-label="Scout workflow summary">
            <div>
              <span className="strip-index">01</span>
              <strong>Scan the repository</strong>
              <p>Rules, AST analysis, dependencies, history.</p>
            </div>
            <div>
              <span className="strip-index">02</span>
              <strong>Map the relationships</strong>
              <p>Imports, calls, symbols, exports.</p>
            </div>
            <div>
              <span className="strip-index">03</span>
              <strong>Feed the agent context</strong>
              <p>Structured findings and targeted code.</p>
            </div>
          </section>

          <section className="dual-feature section-shell" id="context">
            <div className="section-copy">
              <p className="eyebrow">
                <span />
                Two jobs. One system.
              </p>
              <h2>Catch the defect. Show the surrounding code.</h2>
              <p>
                A finding without context leaves the agent guessing. Scout combines
                repository-wide analysis with a structural context tree, so the
                agent sees both the problem and how the codebase fits together.
              </p>
            </div>
            <ScanStory />
          </section>

          <section className="capabilities section-shell" id="capabilities">
            <div className="section-heading-row">
              <div>
                <p className="eyebrow">
                  <span />
                  What Scout checks
                </p>
                <h2>More than another linter.</h2>
              </div>
              <p>
                Scout wraps proven analyzers and adds custom Semgrep and tree-sitter
                rules for the gaps between files, frameworks, and layers.
              </p>
            </div>
            <div className="capability-grid">
              {capabilityCards.map((card) => (
                <article key={card.title}>
                  <span>{card.number}</span>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="ecosystem">
            <div className="section-shell ecosystem-inner">
              <div className="ecosystem-copy">
                <p className="eyebrow light">
                  <span />
                  JavaScript ecosystem
                </p>
                <h2>Framework-aware from the start.</h2>
                <p>
                  Scout detects the project it is running in and enables relevant
                  analyzers instead of applying every rule everywhere.
                </p>
              </div>
              <div className="ecosystem-list">
                {ecosystem.map((item, index) => (
                  <span key={item}>
                    <i>{String(index + 1).padStart(2, "0")}</i>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="workflow section-shell" id="workflow">
            <div className="workflow-intro">
              <p className="eyebrow">
                <span />
                From install to useful output
              </p>
              <h2>Built for the way coding agents work.</h2>
            </div>
            <div className="workflow-steps">
              <article>
                <span className="step-number">01</span>
                <h3>Install once</h3>
                <p>
                  The npm package installs the Scout command and its skill for
                  detected coding agents.
                </p>
                <CommandBar command="npm install -g @aykutss/scout" />
              </article>
              <article>
                <span className="step-number">02</span>
                <h3>Run from the agent</h3>
                <p>
                  Use one skill to scan the repository and another to build its
                  complete structural context tree.
                </p>
                <div className="skill-commands">
                  <div className="slash-command">
                    <code>/scout</code>
                    <span>scan</span>
                  </div>
                  <div className="slash-command">
                    <code>/scout-context</code>
                    <span>context tree</span>
                  </div>
                </div>
              </article>
              <article>
                <span className="step-number">03</span>
                <h3>Use it anywhere</h3>
                <p>
                  Skills drive coding agents. The same capabilities are available
                  directly from the terminal.
                </p>
                <div className="terminal-commands">
                  <code>$ scout scan</code>
                  <code>$ scout context</code>
                </div>
              </article>
            </div>
          </section>

          <section className="final-cta">
            <div className="section-shell final-cta-inner">
              <Image src="/scout-icon.svg" alt="" width={55} height={55} unoptimized />
              <p>Give your coding agent a second set of eyes.</p>
              <h2>If it writes bad code, Scout should catch it.</h2>
              <div className="final-actions">
                <a className="primary-button dark" href={githubUrl}>
                  View on GitHub
                  <ArrowIcon />
                </a>
                <CommandBar command="npm install -g @aykutss/scout" />
              </div>
            </div>
          </section>

          <footer className="site-footer section-shell">
            <Brand />
            <p>Code intelligence for AI coding agents.</p>
            <div>
              <a href={githubUrl}>GitHub</a>
              <a href="#top">Back to top</a>
            </div>
          </footer>
        </main>
    </div>
  );
}
