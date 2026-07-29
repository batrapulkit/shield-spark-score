import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

interface Props {
  value: number; // 0..100
  size?: number;
  band: string;
  label?: string;
}

export function ScoreGauge({ value, size = 260, band, label }: Props) {
  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) => Math.round(v));
  useEffect(() => {
    const controls = animate(mv, value, { duration: 1.6, ease: "easeOut" });
    return () => controls.stop();
  }, [value, mv]);

  const radius = (size - 24) / 2;
  const circ = 2 * Math.PI * radius;
  const strokeColor =
    value <= 40
      ? "var(--danger)"
      : value <= 70
        ? "var(--warning)"
        : "var(--success)";

  const dash = useTransform(mv, (v) => circ - (circ * v) / 100);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--cyan-glow)" />
            <stop offset="100%" stopColor={strokeColor} />
          </linearGradient>
          <filter id="gaugeGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="oklch(0.32 0.07 285 / 0.15)"
          strokeWidth={14}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gaugeGrad)"
          strokeWidth={14}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circ}
          style={{ strokeDashoffset: dash, filter: "url(#gaugeGlow)" }}
        />
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-6xl font-semibold tracking-tight text-foreground"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          <motion.span>{display}</motion.span>
        </motion.span>
        <span className="mt-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">
          {label ?? "Shield Score"}
        </span>
        <span
          className="mt-3 rounded-full px-3 py-1 text-xs font-medium"
          style={{
            background: `color-mix(in oklab, ${strokeColor} 20%, transparent)`,
            color: strokeColor,
            border: `1px solid color-mix(in oklab, ${strokeColor} 40%, transparent)`,
          }}
        >
          {band}
        </span>
      </div>
    </div>
  );
}
