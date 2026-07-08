import { useState } from "react";
import ShortenForm from "./components/ShortenForm";
import ShortUrlResult from "./components/ShortUrlResult";

function App() {
  const [result, setResult] = useState(null);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          <span className="font-display font-bold text-lg tracking-tight">
            lnk<span className="text-accent">/</span>
          </span>
          <span className="font-display text-xs text-ink-muted">
            v1.0 — production
          </span>
        </div>
      </header>

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
            <ShortenForm onResult={setResult} />
            <ShortUrlResult result={result} />
          </div>
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="max-w-3xl mx-auto px-6 py-5 text-xs text-ink-muted font-display">
          Node · Express · MongoDB · Redis · Nginx · Docker
        </div>
      </footer>
    </div>
  );
}

export default App;