export const LandingBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    <div className="absolute inset-0 bg-slate-50 dark:bg-[#02040c]" />

    <div className="absolute inset-0 opacity-10 dark:opacity-40">
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.12)_0%,transparent_70%)] blur-[140px]" />
      <div className="absolute top-[10%] right-[-20%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_center,rgba(100,116,139,0.05)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)] blur-[120px]" />
      <div className="absolute bottom-[-20%] left-[10%] w-[80%] h-[80%] bg-[radial-gradient(circle_at_center,rgba(148,163,184,0.04)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(29,78,216,0.08)_0%,transparent_70%)] blur-[160px]" />
    </div>

    <div className="absolute inset-0 bg-[radial-gradient(50%_45%_at_50%_0%,rgba(59,130,246,0.15)_0%,transparent_100%)] dark:bg-[radial-gradient(50%_45%_at_50%_0%,rgba(59,130,246,0.18)_0%,transparent_100%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_-15%,rgba(37,99,235,0.1)_0%,transparent_100%)] dark:bg-[radial-gradient(ellipse_70%_60%_at_50%_-15%,rgba(37,99,235,0.12)_0%,transparent_100%)]" />

    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.01)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[6rem_6rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

    <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
  </div>
);
