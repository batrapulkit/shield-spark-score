export function ShieldLogo({ size = 72 }: { size?: number }) {
  return (
    <div className="flex items-center gap-4">
      <img
        src="/logo.png"
        alt="Shield Logo"
        className="rounded-xl object-contain"
        style={{
          height: size,
          width: "auto",
        }}
      />
      <div className="h-[40%] w-px bg-border my-auto opacity-50" />
      <img
        src="/bbotlogo/bbt logo.png"
        alt="BBT Logo"
        className="object-contain"
        style={{
          height: size * 0.9,
          width: "auto",
        }}
      />
      <div className="h-[40%] w-px bg-border my-auto opacity-50" />
      <img
        src="/securebrampton.png"
        alt="Secure Brampton Logo"
        className="object-contain"
        style={{
          height: size * 1.2,
          width: "auto",
        }}
      />
    </div>
  );
}
