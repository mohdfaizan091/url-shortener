import { useState } from "react";
import { shortenUrl } from "../api/url";

const normalizeUrl = (input) => {
  const trimmed = input.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
};

const isValidUrl = (value) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const ShortenForm = ({ onResult }) => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    const normalized = normalizeUrl(url);

    if (!isValidUrl(normalized)) {
      setError("Enter a valid URL, e.g. example.com");
      return;
    }

    try {
      setLoading(true);
      const data = await shortenUrl(normalized);
      onResult({ ...data, originalUrl: normalized });
      setUrl("");
    } catch {
      setError("Invalid or unreachable URL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        className="flex items-center gap-3 bg-surface border border-border
                   rounded-[10px] px-4 py-3 shadow-sm
                   focus-within:outline focus-within:outline-2
                   focus-within:outline-accent"
      >
        <span className="font-display text-accent select-none">&gt;</span>
        <input
          type="text"
          placeholder="paste-a-long-url-here.com/..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 min-w-0 bg-transparent outline-none placeholder:text-ink-muted"
        />
        <button
          type="submit"
          disabled={loading}
          className="shrink-0 bg-accent text-white font-body font-medium text-sm
                     px-4 py-2 rounded-[8px] hover:bg-accent/90
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors"
        >
          {loading ? "Shortening…" : "Shorten"}
        </button>
      </div>

      {error && (
        <p className="mt-2 text-sm text-error font-body">{error}</p>
      )}
    </form>
  );
};

export default ShortenForm;