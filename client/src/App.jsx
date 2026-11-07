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
    <main className="app">
      <h1>KinDisk</h1>
      <p>Frontend: React + Vite</p>
      <p role="status">Backend: {status}</p>
    </main>
  );
}
