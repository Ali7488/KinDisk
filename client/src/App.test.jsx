import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import App from "./App.jsx";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

test("renders folder and file tables from the actual contents API contract", async () => {
  fetch.mockResolvedValue({
    ok: true,
    json: async () => ({
      folders: [
        { folder_id: "folder-a", folder_name: "University", parent_folder_id: null },
      ],
      files: [
        {
          file_id: "file-a",
          file_name: "lecture.pdf",
          files_parent: "folder-a",
          storage_used: "4200000",
        },
      ],
    }),
  });

  render(<App />);

  expect(await screen.findByText("University")).toBeInTheDocument();
  expect(screen.getByText("lecture.pdf")).toBeInTheDocument();
  expect(screen.getByText("4,200,000 B")).toBeInTheDocument();
  expect(fetch).toHaveBeenCalledWith(
    "/api/user/contents",
    expect.objectContaining({ signal: expect.any(AbortSignal) }),
  );
});

test("shows the API error and allows retrying", async () => {
  fetch
    .mockResolvedValueOnce({ ok: false, status: 503 })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ folders: [], files: [] }),
    });

  render(<App />);

  expect(await screen.findByRole("alert")).toHaveTextContent("HTTP 503");
  fireEvent.click(screen.getByRole("button", { name: "Refresh" }));
  expect(await screen.findByText("No folders found.")).toBeInTheDocument();
  expect(screen.getByText("No files found.")).toBeInTheDocument();
  expect(fetch).toHaveBeenCalledTimes(2);
});

test("rejects a response without the expected folders and files arrays", async () => {
  fetch.mockResolvedValue({
    ok: true,
    json: async () => ({ folders: [] }),
  });

  render(<App />);

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "unexpected contents format",
  );
});
