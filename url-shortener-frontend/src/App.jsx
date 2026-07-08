import { useState } from "react";
import Navbar from "./components/Navbar";
import ShortenForm from "./components/ShortenForm";
import ShortUrlResult from "./components/ShortUrlResult";
import History from "./components/History";

const loadHistory = () => {
  try {
    const stored = localStorage.getItem("lnk_history");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

function App() {
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState(loadHistory);

  const handleResult = (data) => {
    setResult(data);

    setHistory((prev) => {
      const entry = { ...data, createdAt: new Date().toISOString() };
      const updated = [entry, ...prev].slice(0, 10);
      localStorage.setItem("lnk_history", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
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
            <History items={history} />
          </div>
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between text-xs text-ink-muted font-display">
          <span>Node · Express · MongoDB · Redis · Nginx · Docker</span>
          <a
            href="https://github.com/mohdfaizan091/url-shortener"
            target="_blank"
            rel="noreferrer"
            className="hover:text-ink transition-colors"
          >
            GitHub ↗
          </a>
        </div>
        <div className="max-w-3xl mx-auto px-6 pb-5 text-xs text-ink-muted font-body">
          Built by Mohd Faizan
        </div>
      </footer>
    </div>
  );
}

export default App;