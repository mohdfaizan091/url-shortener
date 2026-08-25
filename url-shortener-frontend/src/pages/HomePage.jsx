import { useState } from "react";
import { Link } from "react-router-dom";
import ShortenForm from "../components/ShortenForm";
import ShortUrlResult from "../components/ShortUrlResult";
import { useLinkHistory } from "../hooks/useLinkHistory";

const HomePage = () => {
  const [result, setResult] = useState(null);
  const { history, addToHistory } = useLinkHistory();

  const handleResult = (data) => {
    setResult(data);
    addToHistory(data);
  };

  const latest = history[0];

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <h1 className="font-display font-bold text-3xl md:text-5xl leading-tight max-w-xl">
        Turn long urls into short, reliable links.
      </h1>
      <p className="mt-4 text-ink-muted max-w-md">
        Paste a link below. Get a short one back instantly, backed by a
        cached, rate-limited, horizontally scaled redirect service.
      </p>

      <div className="mt-10">
        <ShortenForm onResult={handleResult} />
        <ShortUrlResult result={result} />
      </div>

      {latest && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-3">
            <p className="font-display text-xs text-ink-muted">recent</p>
            <Link
              to="/history"
              className="font-body text-xs text-accent hover:underline"
            >
              View all links →
            </Link>
          </div>
          <div className="flex items-center justify-between gap-3 bg-surface border border-border rounded-[10px] px-4 py-2.5">
            <div className="min-w-0">
              {/* ✅ Fixed: added the missing <a tag */}
              <a
                href={latest.shortUrl}
                target="_blank"
                rel="noreferrer"
                className="font-display text-sm hover:underline truncate block"
              >
                {latest.shortUrl}
              </a>
              <p className="text-xs text-ink-muted truncate">{latest.originalUrl}</p>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(latest.shortUrl)}
              className="shrink-0 font-body text-xs text-ink-muted hover:text-ink transition-colors"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;