import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { Lock, ShieldCheck } from "lucide-react";

interface CaptchaVerifyProps {
  onVerify: (success: boolean) => void;
}

export function CaptchaVerify({ onVerify }: CaptchaVerifyProps) {
  const [isVerified, setIsVerified] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [maxDrag, setMaxDrag] = useState(150);
  const x = useMotionValue(0);

  useEffect(() => {
    if (containerRef.current) {
      const width = containerRef.current.clientWidth;
      // Subtract margins and handle width (w-10 = 40px)
      setMaxDrag(width - 48); 
    }
  }, []);

  const handleDragEnd = () => {
    if (isVerified) return;
    const currentX = x.get();
    if (currentX >= maxDrag - 12) {
      setIsVerified(true);
      animate(x, maxDrag, { type: "spring", stiffness: 350, damping: 25 });
      onVerify(true);
    } else {
      animate(x, 0, { type: "spring", stiffness: 300, damping: 25 });
    }
  };

  return (
    <div
      ref={containerRef}
      className="glass relative flex h-[52px] w-full select-none items-center overflow-hidden rounded-2xl p-1 border border-ink/10"
      style={{
        background: isVerified
          ? "color-mix(in oklab, var(--success) 6%, transparent)"
          : "color-mix(in oklab, white 4%, transparent)",
        borderColor: isVerified
          ? "color-mix(in oklab, var(--success) 30%, transparent)"
          : "color-mix(in oklab, white 10%, transparent)",
        transition: "background-color 0.3s, border-color 0.3s",
      }}
    >
      {/* Label Text */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs tracking-wider uppercase transition-opacity duration-300"
        style={{
          color: isVerified ? "var(--success)" : "var(--muted-foreground)",
          opacity: isVerified ? 0.9 : 0.6,
        }}
      >
        {isVerified ? "Scan Authorization Verified" : "Slide right to authorize scan"}
      </div>

      {/* Draggable Handle */}
      <motion.div
        drag={isVerified ? false : "x"}
        dragConstraints={{ left: 0, right: maxDrag }}
        dragElastic={0}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        className="relative z-10 flex h-10 w-10 cursor-grab items-center justify-center rounded-xl active:cursor-grabbing"
        style={{
          x,
          background: isVerified
            ? "linear-gradient(135deg, color-mix(in oklab, var(--success) 80%, white), var(--success))"
            : "linear-gradient(135deg, var(--cyan-glow), var(--cyan))",
          boxShadow: isVerified
            ? "0 4px 12px color-mix(in oklab, var(--success) 55%, transparent)"
            : "0 4px 12px color-mix(in oklab, var(--cyan) 35%, transparent)",
        }}
      >
        {isVerified ? (
          <ShieldCheck size={18} className="text-primary-foreground" />
        ) : (
          <Lock size={16} className="text-primary-foreground" />
        )}
      </motion.div>
    </div>
  );
}
