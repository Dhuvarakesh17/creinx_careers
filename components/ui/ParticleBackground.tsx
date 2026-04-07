type Particle = {
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
};

const particles: Particle[] = Array.from({ length: 28 }, () => ({
  left: Math.random() * 100,
  size: 4 + Math.random() * 8,
  duration: 8 + Math.random() * 4,
  delay: Math.random() * 12,
  opacity: 0.18 + Math.random() * 0.24,
}));

export function ParticleBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden bg-[#0F1C3F]"
    >
      {particles.map((particle, index) => (
        <span
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          className="particle-square"
          style={{
            left: `${particle.left}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `-${particle.delay}s`,
            opacity: particle.opacity,
          }}
        />
      ))}
    </div>
  );
}
