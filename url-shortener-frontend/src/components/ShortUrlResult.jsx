import { useEffect, useState } from "react";
import { fetchAnalytics } from "../api/url";
import Analytics from "./Analytics";

const ShortUrlResult = ({ result }) => {
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!result) return;
    setCopied(false);
    setAnalytics(null);
    setAnalyticsLoading(true);

    const code = result.shortUrl.split("/").pop();

    const loadAnalytics = async () => {
      try {
        const data = await fetchAnalytics(code);
        setAnalytics(data);
      } finally {
        setAnalyticsLoading(false);
      }
    };

    loadAnalytics();
  }, [result]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (!result) return null;

  return (
    <div className="mt-6">
      <div
        className="flex items-center justify-between gap-3 bg-deep text-white
                   rounded-[10px] px-4 py-3"
      >
        <a
          href={result.shortUrl}
          target="_blank"
          rel="noreferrer"
          className="font-display text-sm md:text-base truncate hover:underline"
        >
          {result.shortUrl}
        </a>
        <button
          onClick={handleCopy}
          className="shrink-0 font-body text-xs font-medium bg-white/10
                     hover:bg-white/20 px-3 py-1.5 rounded-[6px] transition-colors"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {analyticsLoading && (
        <p className="mt-4 text-xs text-ink-muted font-display animate-pulse">
          loading analytics…
        </p>
      )}

      {!analyticsLoading && analytics && <Analytics data={analytics} />}
    </div>
  );
};

export default ShortUrlResult;