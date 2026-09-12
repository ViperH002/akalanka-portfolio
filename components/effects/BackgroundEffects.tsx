export function BackgroundEffects() {
  return (
    <>
      {/* Background Grid Pattern */}
      <div className="bg-grid" aria-hidden="true" />

      {/* Floating Glowing Orbs */}
      <div className="bg-orbs" aria-hidden="true">
        <div className="orb orb-1 animate-orb1" />
        <div className="orb orb-2 animate-orb2" />
        <div className="orb orb-3 animate-orb3" />
      </div>
    </>
  );
}
