import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import HistoryPage from "./pages/HistoryPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </main>
        <footer className="border-t border-border">
          <div className="max-w-3xl mx-auto px-6 pt-10 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              <div>
                <span className="font-display font-bold text-lg tracking-tight">
                  lnk<span className="text-accent">/</span>
                </span>
                <p className="mt-2 text-sm text-ink-muted max-w-xs">
                  A horizontally-scaled, cached, rate-limited URL shortener — built as a system design exercise.
                </p>
              </div>

              <div className="flex gap-10 text-sm">
                <div>
                  <p className="font-display text-xs text-ink-muted mb-2">project</p>
                  <ul className="space-y-1.5">
                    <li>
                      
                      <a
                        href="https://github.com/mohdfaizan091/url-shortener"
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-ink transition-colors"
                      >
                        GitHub
                      </a>
                    </li>
                    <li>
                      
                      <a
                        href={`${import.meta.env.VITE_API_URL}/health`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-ink transition-colors"
                      >
                        API status
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="font-display text-xs text-ink-muted mb-2">connect</p>
                  <ul className="space-y-1.5">
                    <li>
                      <a
                        href="https://linkedin.com/in/mohd-faizan"
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-ink transition-colors"
                      >
                        LinkedIn
                      </a>
                    </li>
                    <li>
                      {/* ✅ Fixed: added missing <a tag */}
                      <a
                        href="https://github.com/mohdfaizan091"
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-ink transition-colors"
                      >
                        Profile
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-ink-muted font-display">
              <span>Node · Express · MongoDB · Redis · Nginx · Docker</span>
              <span className="font-body">Built by Mohd Faizan</span>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;