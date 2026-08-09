export function ShieldLogo({ size = 72 }: { size?: number }) {
  return (
    <div className="flex items-center">
      <img
        src="/logo.png"
        alt="Shield Logo"
        className="rounded-xl object-contain"
        style={{
          height: size,
          width: "auto",
        }}
      />
    </div>
  );
}
