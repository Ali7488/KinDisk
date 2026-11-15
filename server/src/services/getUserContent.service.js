import { getUserFiles, getUserFolders } from "../model/get_content.model.js";

export const getUserContent = async (id) => {
  const folders = await getUserFolders(id);
  const files = await getUserFiles(id);

  return { folders, files };
};
