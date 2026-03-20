"use client";

import { useEffect, useRef } from "react";

/*
  Trading lifecycle — vertical flow for hero right side.
  Consolidated to 6 clear nodes with a diamond branch.
*/

const NODES = [
  { id: "crm", label: "Investor Relations", x: 220, y: 35 },
  { id: "data", label: "Market Data", x: 220, y: 115 },
  { id: "oms", label: "Order Management", x: 220, y: 195 },
  { id: "sor", label: "Smart Order Router", x: 90, y: 280 },
  { id: "dark", label: "Dark Pool", x: 350, y: 280 },
  { id: "match", label: "Matching Engine", x: 220, y: 365 },
  { id: "post", label: "Post-Trade", x: 220, y: 445 },
];

const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [2, 4],
  [3, 5],
  [4, 5],
  [5, 6],
];

function getEdgePath(from: (typeof NODES)[number], to: (typeof NODES)[number]) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (Math.abs(dx) > 10) {
    const cx = from.x + dx * 0.4;
    const cy = from.y + dy * 0.85;
    return `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
  }
  return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
}

export default function OrderFlow() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const dots = svg.querySelectorAll<SVGCircleElement>(".flow-dot");
    const paths = svg.querySelectorAll<SVGPathElement>(".flow-edge");
    const animations: number[] = [];

    dots.forEach((dot, i) => {
      const path = paths[i];
      if (!path) return;

      const length = path.getTotalLength();
      const duration = 2200 + Math.random() * 1000;
      const delay = i * 380;
      let start: number | null = null;

      function animate(timestamp: number) {
        if (!start) start = timestamp;
        const elapsed = (timestamp - start - delay) % (duration + 700);

        if (elapsed < 0 || elapsed > duration) {
          dot.setAttribute("opacity", "0");
        } else {
          const progress = elapsed / duration;
          const point = path.getPointAtLength(progress * length);
          dot.setAttribute("cx", String(point.x));
          dot.setAttribute("cy", String(point.y));
          dot.setAttribute("opacity", String(0.5 + 0.5 * Math.sin(progress * Math.PI)));
        }

        animations[i] = requestAnimationFrame(animate);
      }

      animations[i] = requestAnimationFrame(animate);
    });

    return () => animations.forEach(cancelAnimationFrame);
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 440 480"
      className="w-full h-full select-none"
      aria-hidden="true"
    >
      {/* Subtle radial glow behind the diagram */}
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="220" cy="240" rx="200" ry="220" fill="url(#glow)" />

      {/* Edges */}
      {EDGES.map(([from, to]) => (
        <path
          key={`edge-${from}-${to}`}
          className="flow-edge"
          d={getEdgePath(NODES[from], NODES[to])}
          stroke="#3f3f46"
          strokeWidth="1"
          fill="none"
        />
      ))}

      {/* Nodes */}
      {NODES.map((node, i) => {
        const isTerminal = i === 0 || i === NODES.length - 1;
        return (
          <g key={node.id}>
            <rect
              x={node.x - 64}
              y={node.y - 18}
              width={128}
              height={36}
              rx={4}
              fill={isTerminal ? "#1a1a1f" : "#141418"}
              stroke={isTerminal ? "#52525b" : "#3f3f46"}
              strokeWidth="1"
            />
            <text
              x={node.x}
              y={node.y + 5}
              textAnchor="middle"
              className={`text-[11px] font-mono ${isTerminal ? "fill-zinc-300" : "fill-zinc-500"}`}
            >
              {node.label}
            </text>
          </g>
        );
      })}

      {/* Flow dots */}
      {EDGES.map(([from, to]) => (
        <circle
          key={`dot-${from}-${to}`}
          className="flow-dot"
          r="4"
          fill="#fbbf24"
          opacity="0"
        />
      ))}
    </svg>
  );
}
