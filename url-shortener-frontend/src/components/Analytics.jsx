const Analytics = ({ data }) => {
  if (!data) return null;

  const rows = [
    { label: "Original URL", value: data.originalUrl },
    { label: "Clicks", value: data.clickCount },
    { label: "Created", value: new Date(data.createdAt).toLocaleString() },
  ];

  return (
    <div className="mt-4 bg-surface border border-border rounded-[10px] px-4 py-3">
      <p className="font-display text-xs text-ink-muted mb-2">analytics</p>
      <dl className="space-y-1.5">
        {rows.map((row) => (
          <div key={row.label} className="flex text-sm gap-3">
            <dt className="text-ink-muted w-28 shrink-0">{row.label}</dt>
            <dd className="font-display truncate">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default Analytics;