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
          <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between text-xs text-ink-muted font-display">
            <span>Node · Express · MongoDB · Redis · Nginx · Docker</span>
            {/* ✅ Fixed: added the missing <a tag */}
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
    </BrowserRouter>
  );
}

export default App;