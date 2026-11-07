import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [status, setStatus] = useState("Checking API...");

  useEffect(() => {
    const controller = new AbortController();

    async function checkApi() {
      try {
        const response = await fetch("/api/health", {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`API responded with ${response.status}`);
        }
        const data = await response.json();
        setStatus(data.status === "ok" ? "API connected" : "Unexpected API response");
      } catch (error) {
        if (error.name !== "AbortError") {
          setStatus("API unavailable");
        }
      }
    }

    checkApi();
    return () => controller.abort();
  }, []);

  return (
    <div className="app">
      <header className="app__header">
        <nav className="container app__nav" aria-label="Main navigation">
          <span className="app__brand">KinDisk</span>
          <span className="app__badge">React + Express</span>
        </nav>
      </header>
      <main className="container app__main">
        <p className="app__eyebrow">Full-stack starter</p>
        <h1>KinDisk</h1>
        <p className="app__lead">
          A clean starting point with golden accents, responsive typography, a shared design system,
          and a connected Express API.
        </p>
        <section className="app__panel" aria-labelledby="connection-title">
          <h2 id="connection-title">Connection status</h2>
          <p className="app__status" role="status">
            Backend: {status}
          </p>
        </section>
        <p className="app__footer">Edit src/styles/tokens.css to customize the theme.</p>
      </main>
    </div>
  );
}
