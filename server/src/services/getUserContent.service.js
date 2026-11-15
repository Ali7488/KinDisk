import { getUserFiles, getUserFolders } from "../model/get_content.model.js";
import { logger } from "../utils/logger.js";

export const getUserContent = async (id) => {
  const folders = await getUserFolders(id);
  const files = await getUserFiles(id);
  logger.info("[User Content]", { folders, files });

  return { folders, files };
};
