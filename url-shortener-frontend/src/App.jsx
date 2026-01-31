import { shortenUrl } from "./api/url";

function App() {
  const testApi = async () => {
    const data = await shortenUrl("https://www.google.com");
    console.log(data);
  };

  return (
    <div>
      <h1>URL Shortener</h1>
      <button onClick={testApi}>Test Backend</button>
    </div>
  );
}

export default App;
