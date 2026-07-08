const History = ({ items }) => {
  if (!items || items.length === 0) return null;

  const handleCopy = (shortUrl) => {
    navigator.clipboard.writeText(shortUrl);
  };

  return (
    <div className="mt-10">
      <p className="font-display text-xs text-ink-muted mb-3">recent links</p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.shortUrl + item.createdAt}
            className="flex items-center justify-between gap-3 bg-surface
                       border border-border rounded-[10px] px-4 py-2.5"
          >
            <div className="min-w-0">
              <a
                href={item.shortUrl}
                target="_blank"
                rel="noreferrer"
                className="font-display text-sm hover:underline block truncate"
              >
                {item.shortUrl}
              </a>
              <p className="text-xs text-ink-muted truncate">
                {item.originalUrl}
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
    </div>
  );
};

export default History;