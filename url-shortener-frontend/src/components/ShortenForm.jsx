import { useState } from "react";
import { shortenUrl } from "../api/url";

const ShortenForm = ({ onResult }) => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!url) {
      setError("Please enter a URL");
      return;
    }

    try {
      setLoading(true);
      const data = await shortenUrl(url);
      onResult(data);
      setUrl("");
    } catch {
      setError("Invalid or unreachable URL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter long URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Shortening..." : "Shorten"}
      </button>

      {error && <p>{error}</p>}
    </form>
  );
};

export default ShortenForm;
