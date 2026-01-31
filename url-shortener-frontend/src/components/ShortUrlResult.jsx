import { useEffect, useState } from "react";
import { fetchAnalytics } from "../api/url";
import Analytics from "./Analytics";

const ShortUrlResult = ({ result }) => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (!result) return;

    const code = result.shortUrl.split("/").pop();

    const loadAnalytics = async () => {
      const data = await fetchAnalytics(code);
      setAnalytics(data);
    };

    loadAnalytics();
  }, [result]);

  if (!result) return null;

  return (
    <div>
      <p>Short URL:</p>
      <a href={result.shortUrl} target="_blank">
        {result.shortUrl}
      </a>

      <Analytics data={analytics} />
    </div>
  );
};

export default ShortUrlResult;
