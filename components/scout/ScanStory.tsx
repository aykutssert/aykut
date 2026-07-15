"use client";

import { useEffect, useRef, useState } from "react";

function Spark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.5c.5 5.8 3.7 9 9.5 9.5-5.8.5-9 3.7-9.5 9.5-.5-5.8-3.7-9-9.5-9.5 5.8-.5 9-3.7 9.5-9.5Z" />
    </svg>
  );
}

function FindingCard() {
  return (
    <div className="finding-window">
      <div className="panel-top">
        <span className="window-title">scout scan</span>
        <span className="panel-state story-finding-count">1 finding shown</span>
      </div>
      <div className="finding-body">
        <div className="finding-meta">
          <span className="severity">warning</span>
          <code>next.local-server-boundary</code>
        </div>
        <h3>Client component reaches server-only code.</h3>
        <p>
          Scout follows the local import chain instead of checking a single file
          in isolation.
        </p>
        <div className="import-chain">
          <span className="story-chain story-chain-client">client component</span>
          <i className="story-connector story-connector-first" />
          <span className="story-chain story-chain-module">local module</span>
          <i className="story-connector story-connector-second" />
          <span className="danger-node story-chain story-chain-danger">
            server-only code
          </span>
        </div>
        <div className="finding-foot story-finding">
          <span>category: bug</span>
          <span>confidence: rule</span>
        </div>
      </div>
    </div>
  );
}

const JsonLine = ({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <span className={`json-line ${className}`}>{children}</span>
);

function JsonOutputCard() {
  return (
    <div className="json-window">
      <div className="json-window-top">
        <div>
          <span className="json-status" />
          <code>scout scan</code>
        </div>
        <span>JSON output</span>
      </div>
      <div className="json-summary">
        <div>
          <span>score</span>
          <strong>95</strong>
        </div>
        <div>
          <span>findings</span>
          <strong>1</strong>
        </div>
        <div>
          <span>errors</span>
          <strong>0</strong>
        </div>
        <div>
          <span>warnings</span>
          <strong className="summary-warning">1</strong>
        </div>
      </div>
      <pre className="json-code" aria-label="Scout scan JSON output">
        <span className="json-waiting" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <code>
          <JsonLine className="story-json-1">
            <span className="json-brace">{"{"}</span>
          </JsonLine>
          <JsonLine className="story-json-2">
            {"  "}<span className="json-key">&quot;summary&quot;</span>:{" "}
            <span className="json-brace">{"{"}</span>
            <span className="json-key">&quot;total&quot;</span>:{" "}
            <span className="json-number">1</span>,{" "}
            <span className="json-key">&quot;score&quot;</span>:{" "}
            <span className="json-number">95</span>
            <span className="json-brace">{"}"}</span>,
          </JsonLine>
          <JsonLine className="story-json-3">
            {"  "}<span className="json-key">&quot;findings&quot;</span>:{" "}
            <span className="json-brace">[{"{"}</span>
          </JsonLine>
          <JsonLine className="story-json-4">
            {"    "}<span className="json-key">&quot;analyzer&quot;</span>:{" "}
            <span className="json-string">&quot;next-hint&quot;</span>,
          </JsonLine>
          <JsonLine className="story-json-5">
            {"    "}<span className="json-key">&quot;rule_id&quot;</span>:{" "}
            <span className="json-string">
              &quot;next.local-server-boundary&quot;
            </span>,
          </JsonLine>
          <JsonLine className="story-json-6">
            {"    "}<span className="json-key">&quot;severity&quot;</span>:{" "}
            <span className="json-warning">&quot;warning&quot;</span>,
          </JsonLine>
          <JsonLine className="story-json-7">
            {"    "}<span className="json-key">&quot;category&quot;</span>:{" "}
            <span className="json-string">&quot;bug&quot;</span>,
          </JsonLine>
          <JsonLine className="story-json-8">
            {"    "}<span className="json-key">&quot;confidence&quot;</span>:{" "}
            <span className="json-string">&quot;rule&quot;</span>,
          </JsonLine>
          <JsonLine className="story-json-9">
            {"    "}<span className="json-key">&quot;file&quot;</span>:{" "}
            <span className="json-string">&quot;app/client.tsx&quot;</span>,
          </JsonLine>
          <JsonLine className="story-json-10">
            {"    "}<span className="json-key">&quot;line&quot;</span>:{" "}
            <span className="json-number">4</span>,
          </JsonLine>
          <JsonLine className="story-json-11">
            {"    "}<span className="json-key">&quot;message&quot;</span>:{" "}
            <span className="json-string">
              &quot;Client component imports local server-only code through
              \&quot;./db.server\&quot;; reaches app/db.server.ts.&quot;
            </span>,
          </JsonLine>
          <JsonLine className="story-json-12">
            {"    "}<span className="json-key">&quot;fix&quot;</span>:{" "}
            <span className="json-string">
              &quot;Keep server-only code in a Server Component, Server Action,
              route handler, or API layer.&quot;
            </span>
          </JsonLine>
          <JsonLine className="story-json-13">
            {"  "}<span className="json-brace">{"}]"}</span>
          </JsonLine>
          <JsonLine className="story-json-14">
            <span className="json-brace">{"}"}</span>
          </JsonLine>
        </code>
      </pre>
      <div className="json-agent-note">
        <Spark />
        <p>Piped output is structured for coding agents.</p>
      </div>
    </div>
  );
}

export function ScanStory() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.25 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => setCycle((value) => value + 1), 12_500);
    return () => clearInterval(timer);
  }, [active]);

  return (
    <div ref={ref} className="scan-story">
      <div
        key={cycle}
        className={`feature-grid scan-story-cycle${active ? " is-active" : ""}`}
      >
        <article className="feature-block finding-block">
          <div className="feature-label">
            <span>01</span>
            <p>Find what ordinary linting misses</p>
          </div>
          <FindingCard />
        </article>
        <article className="feature-block context-block">
          <div className="feature-label">
            <span>02</span>
            <p>Give the agent structured scan output</p>
          </div>
          <JsonOutputCard />
        </article>
      </div>
    </div>
  );
}
