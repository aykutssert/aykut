const sequence = [
  { path: "M400 416.8H257.7", delay: 0 },
  { path: "M257.7 406.7H32.8V73.3", delay: 1.08 },
  { path: "M145.3 35.3H226.5V102.1", delay: 2.16 },
  { path: "M226.4 176.3V228.4", delay: 3.24 },
  { path: "M308.9 135.8H394.4V36.8H426.4", delay: 4.32 },
  { path: "M498.7 73.4V136.9", delay: 5.4 },
  { path: "M308.9 261.9H394.4V174H426.4", delay: 6.48 },
  { path: "M257.7 394.3H400", delay: 7.56 },
] as const;

const cycleDuration = 10.04;
const activeRatio = 0.0896;

function addFlowSignals(svg: string) {
  const signals = sequence
    .map(
      ({ path, delay }) => `
<circle class="graph-flow-signal" r="3.2">
  <animateMotion
    path="${path}"
    begin="${delay}s"
    dur="${cycleDuration}s"
    repeatCount="indefinite"
    keyPoints="0;1;1"
    keyTimes="0;${activeRatio};1"
    calcMode="linear"
  />
  <animate
    attributeName="opacity"
    values="0;1;1;0;0"
    keyTimes="0;0.001;${activeRatio};0.11;1"
    begin="${delay}s"
    dur="${cycleDuration}s"
    repeatCount="indefinite"
  />
</circle>`,
    )
    .join("");

  return svg.replace("</svg>", `${signals}</svg>`);
}

export function HeroContextGraph({ svg }: { svg: string }) {
  return (
    <div
      className="hero-context-graph"
      role="img"
      aria-label="Scout repository context graph showing code relationships and the coding agent flow"
      dangerouslySetInnerHTML={{ __html: addFlowSignals(svg) }}
    />
  );
}
