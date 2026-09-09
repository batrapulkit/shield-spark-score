export function ShieldLogo({ size = 72, className = "" }: { size?: number; className?: string }) {
  return (
    <div className={`flex items-center gap-2 sm:gap-3 md:gap-4 max-w-full ${className}`}>
      <img
        src="/logo.png"
        alt="Shield Logo"
        className="rounded-xl object-contain shrink min-w-0"
        style={{
          height: size,
          maxHeight: "100%",
          width: "auto",
        }}
      />
      <div className="h-[40%] w-px bg-border my-auto opacity-50 shrink-0" />
      <img
        src="/bbotlogo/bbt logo.png"
        alt="BBT Logo"
        className="object-contain shrink min-w-0"
        style={{
          height: size * 0.9,
          maxHeight: "100%",
          width: "auto",
        }}
      />
      <div className="h-[40%] w-px bg-border my-auto opacity-50 shrink-0" />
      <img
        src="/securebrampton.png"
        alt="Secure Brampton Logo"
        className="object-contain shrink min-w-0"
        style={{
          height: size * 1.2,
          maxHeight: "100%",
          width: "auto",
        }}
      />
    </div>
  );
}

