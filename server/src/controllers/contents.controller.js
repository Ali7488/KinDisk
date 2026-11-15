import { getUserContent } from "../services/getUserContent.service.js";

export const contentHandler = async (_req, res) => {
  // Temporary until users are actually added,then instead I will retrieve the userId from the session
  const userContent = await getUserContent(null);
  res.status(200).json(userContent);
};
