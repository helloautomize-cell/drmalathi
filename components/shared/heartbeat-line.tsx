export function HeartbeatLine({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 60"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
    >
      <path
        className="heartbeat-path"
        d="M0 30 H430 l14 -18 12 26 12 -30 12 26 12 -12 H1200"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
