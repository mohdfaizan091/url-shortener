const Analytics = ({ data }) => {
  if (!data) return null;

  return (
    <div>
      <h3>Analytics</h3>
      <p><strong>Original URL:</strong> {data.originalUrl}</p>
      <p><strong>Clicks:</strong> {data.clickCount}</p>
      <p>
        <strong>Created At:</strong>{" "}
        {new Date(data.createdAt).toLocaleString()}
      </p>
    </div>
  );
};

export default Analytics;
