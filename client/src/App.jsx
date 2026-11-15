import { useEffect, useState } from "react";
import "./App.css";

const CONTENTS_URL = "/api/user/contents";

function displayBytes(value) {
  if (value == null) return "—";

  // PostgreSQL BIGINT values arrive as strings; avoid losing precision.
  try {
    return `${BigInt(value).toLocaleString("en-CA")} B`;
  } catch {
    return "—";
  }
}

export default function App() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadContents() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(CONTENTS_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed (HTTP ${response.status}).`);
        }

        const data = await response.json();
        if (!Array.isArray(data.folders) || !Array.isArray(data.files)) {
          throw new Error("The API returned an unexpected contents format.");
        }

        if (!controller.signal.aborted) setContent(data);
      } catch (caughtError) {
        if (controller.signal.aborted) return;

        setContent(null);
        setError(caughtError instanceof Error ? caughtError.message : "Unable to load contents.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadContents();
    return () => controller.abort();
  }, [refreshCount]);

  const folders = content?.folders ?? [];
  const files = content?.files ?? [];

  return (
    <main className="app container">
      <header className="app__header">
        <div>
          <h1>KinDisk</h1>
          <p>Development view: current seeded user's file and folder metadata.</p>
        </div>
        <button
          type="button"
          onClick={() => setRefreshCount((count) => count + 1)}
          disabled={loading}
        >
          Refresh
        </button>
      </header>

      {loading && <p role="status">Loading contents…</p>}
      {error && <p role="alert">Could not load contents: {error}</p>}

      {!loading && !error && (
        <>
          <section aria-labelledby="folder-heading">
            <h2 id="folder-heading">Folders ({folders.length})</h2>
            <div className="app__table-wrap">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Folder name</th>
                    <th scope="col">Folder ID</th>
                    <th scope="col">Parent folder ID</th>
                  </tr>
                </thead>
                <tbody>
                  {folders.length === 0 ? (
                    <tr>
                      <td colSpan={3}>No folders found.</td>
                    </tr>
                  ) : (
                    folders.map((folder) => (
                      <tr key={folder.folder_id}>
                        <td>{folder.folder_name}</td>
                        <td><code>{folder.folder_id}</code></td>
                        <td><code>{folder.parent_folder_id ?? "Root"}</code></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section aria-labelledby="file-heading">
            <h2 id="file-heading">Files ({files.length})</h2>
            <div className="app__table-wrap">
              <table>
                <thead>
                  <tr>
                    <th scope="col">File name</th>
                    <th scope="col">File ID</th>
                    <th scope="col">Folder ID</th>
                    <th scope="col">Size</th>
                  </tr>
                </thead>
                <tbody>
                  {files.length === 0 ? (
                    <tr>
                      <td colSpan={4}>No files found.</td>
                    </tr>
                  ) : (
                    files.map((file) => (
                      <tr key={file.file_id}>
                        <td>{file.file_name}</td>
                        <td><code>{file.file_id}</code></td>
                        <td><code>{file.files_parent ?? "Root"}</code></td>
                        <td className="app__number">{displayBytes(file.storage_used)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <p className="app__note">
            This is a flat development listing, not the finished folder hierarchy.
            Seeded file records do not yet have downloadable contents.
          </p>
        </>
      )}
    </main>
  );
}
