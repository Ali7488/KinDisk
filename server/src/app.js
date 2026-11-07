import express from "express";
import { apiRouter } from "./routes/index.js";

export const app = express();

app.use(express.json());
app.use("/api", apiRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: "Internal server error" });
});
