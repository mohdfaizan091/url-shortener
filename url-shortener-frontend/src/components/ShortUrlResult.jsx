
const ShortUrlResult = ({ result }) => {
  if (!result) return null;

  return (
    <div>
      <p>Short URL:</p>
      <a href={result.shortUrl} target="_blank">
        {result.shortUrl}
      </a>
    </div>
  );
};

export default ShortUrlResult;
