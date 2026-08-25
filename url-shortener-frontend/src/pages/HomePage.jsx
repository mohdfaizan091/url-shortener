import { Link } from "react-router-dom";
import ShortenForm from "../components/ShortenForm";
import ShortUrlResult from "../components/ShortUrlResult";
import { useLinkHistory } from "../hooks/useLinkHistory";

const HomePage = () => {
  const { history, addToHistory } = useLinkHistory();

  const handleResult = (data) => {
    addToHistory(data);
  };

  const latest = history[0];

  return (
    <div className="relative min-h-[80vh] flex items-center overflow-hidden">
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(var(--color-border) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage: "linear-gradient(to bottom, black, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
        }}
      />

      <div className="max-w-4xl mx-auto px-6 w-full py-16">
        <h1 className="font-display font-bold text-3xl md:text-5xl leading-tight max-w-xl">
          Turn long urls into short, reliable links.
        </h1>
        <p className="mt-4 text-ink-muted max-w-md">
          Paste a link below. Get a short one back instantly, backed by a
          cached, rate-limited, horizontally scaled redirect service.
        </p>

        <div className="mt-10">
          <ShortenForm onResult={handleResult} />
          <ShortUrlResult result={latest} />
        </div>

        {history.length > 1 && (
          <div className="mt-6 text-right">
            <Link
              to="/history"
              className="font-body text-xs text-accent hover:underline"
            >
              View all links →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;