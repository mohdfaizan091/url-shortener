import "./App.css";

import { useState } from "react";
import ShortenForm from "./components/ShortenForm";
import ShortUrlResult from "./components/ShortUrlResult";

function App() {
  const [result, setResult] = useState(null);

  return (
    <div>
      <h1>URL Shortener</h1>

      <ShortenForm onResult={setResult} />
      <ShortUrlResult result={result} />
    </div>
  );
}

export default App;
