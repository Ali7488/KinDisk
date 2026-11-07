import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import App from "./App.jsx";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

test("shows the Express health status when the API responds", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({
      ok: true,
      json: async () => ({ status: "ok" }),
    })),
  );

  render(<App />);

  await waitFor(() => {
    expect(screen.getByRole("status")).toHaveTextContent("API connected");
  });
});

test("shows a useful message when the API fails", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => {
      throw new Error("Network offline");
    }),
  );

  render(<App />);

  await waitFor(() => {
    expect(screen.getByRole("status")).toHaveTextContent("API unavailable");
  });
});
