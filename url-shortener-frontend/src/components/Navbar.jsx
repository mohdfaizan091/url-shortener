import { useEffect, useState } from "react";
import { checkHealth } from "../api/url";

const Navbar = () => {
  const [status, setStatus] = useState("checking"); // checking | up | down

  useEffect(() => {
    const ping = async () => {
      try {
        await checkHealth();
        setStatus("up");
      } catch {
        setStatus("down");
      }
    };
    ping();
    const interval = setInterval(ping, 30000); // re-check every 30s
    return () => clearInterval(interval);
  }, []);

  const statusColor =
    status === "up" ? "bg-green-500" : status === "down" ? "bg-error" : "bg-ink-muted";
  const statusLabel =
    status === "up" ? "operational" : status === "down" ? "down" : "checking…";

  return (
    <header className="border-b border-border">
      <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
        <span className="font-display font-bold text-lg tracking-tight">
          lnk<span className="text-accent">/</span>
        </span>

        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${statusColor}`} />
          <span className="font-display text-xs text-ink-muted">{statusLabel}</span>
        </div>

        <nav className="flex items-center gap-3">
          <button
            disabled
            title="Coming soon"
            className="font-body text-sm text-ink-muted cursor-not-allowed"
          >
            Log in
          </button>
          <button
            disabled
            title="Coming soon"
            className="font-body text-sm font-medium bg-ink-muted/20 text-ink-muted
                       px-4 py-2 rounded-[8px] cursor-not-allowed"
          >
            Sign up
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;