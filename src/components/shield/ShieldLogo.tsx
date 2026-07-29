export function ShieldLogo({ size = 32 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <img
        src="/logo.png"
        alt="Shield Logo"
        className="rounded-xl object-contain"
        style={{
          width: size,
          height: size,
        }}
      />
      <div className="flex flex-col leading-none">
        <span className="text-sm font-semibold tracking-tight text-foreground">
          Shield Identity
        </span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Shield Score
        </span>
      </div>
    </div>
  );
}
