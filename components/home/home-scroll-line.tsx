export function HomeScrollLine() {
  return (
    <div className="pointer-events-none fixed right-3 top-0 z-30 hidden h-screen w-8 items-center justify-center lg:flex">
      <svg
        width="16"
        height="100%"
        viewBox="0 0 16 1000"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M8 0 L8 1000"
          stroke="rgba(138, 151, 170, 0.35)"
          strokeWidth="2"
          fill="none"
        />
        <path
          className="home-scroll-line-path"
          d="M8 0 L8 1000"
          stroke="#2563EB"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
