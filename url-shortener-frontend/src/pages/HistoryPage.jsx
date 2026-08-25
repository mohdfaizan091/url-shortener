import { Link } from "react-router-dom";
import { useLinkHistory } from "../hooks/useLinkHistory";

const formatTimeAgo = (isoString) => {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const HistoryPage = () => {
  const { history, clearHistory } = useLinkHistory();

  const handleCopy = (shortUrl) => {
    navigator.clipboard.writeText(shortUrl);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <Link
        to="/"
        className="font-body text-xs text-ink-muted hover:text-ink transition-colors"
      >
        ← Back
      </Link>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl">
            All links
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {history.length} link{history.length !== 1 ? "s" : ""} shortened on this device
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="font-body text-xs text-ink-muted hover:text-error transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="mt-8">
        {history.length === 0 ? (
          <p className="text-sm text-ink-muted font-body border border-dashed border-border rounded-[10px] px-4 py-10 text-center">
            No links yet.{" "}
            <Link to="/" className="text-accent hover:underline">
              Shorten your first one →
            </Link>
          </p>
        ) : (
          <ul className="space-y-2">
            {history.map((item) => (
              <li
                key={item.shortUrl + item.createdAt}
                className="flex items-center justify-between gap-3 bg-surface
                           border border-border rounded-[10px] px-4 py-3
                           hover:border-ink-muted transition-colors"
              >
                <div className="min-w-0">
                  <a
                    href={item.shortUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-display text-sm hover:underline truncate block"
                  >
                    {item.shortUrl}
                  </a>
                  <p className="text-xs text-ink-muted truncate">
                    {item.originalUrl} · {formatTimeAgo(item.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(item.shortUrl)}
                  className="shrink-0 font-body text-xs text-ink-muted hover:text-ink transition-colors"
                >
                  Copy
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;