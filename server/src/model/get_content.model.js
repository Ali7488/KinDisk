import { pool } from "../config/db.js";
import { logger } from "../utils/logger.js";

//! This is a temporary solution until proper multi user is added
const getUserId = async () => {
  const sql = `SELECT user_id FROM public.users WHERE username = 'Mohannad'`;
  const result = await pool.query(sql);
  const userId = result.rows[0]?.user_id;

  if (!userId) {
    throw new Error("Development User Missing");
  }
  logger.info(userId);
  return userId;
};

export const getUserFolders = async (id) => {
  const userId = id ?? (await getUserId());

  const sql = `SELECT folder.folder_id, folder.folder_name,folder.parent_folder_id
              FROM public.folders AS folder
              WHERE folder.owned_by = $1
              ORDER BY folder.folder_name ASC;`;
  const folders = await pool.query(sql, [userId]);
  return folders.rows;
};

export const getUserFiles = async (id) => {
  const userId = id ?? (await getUserId());

  const sql = `SELECT files.file_id, files.original_name AS file_name,
               files.folder_id  AS files_parent,
               files.size_bytes AS storage_used, files.owner_id
               FROM public.files AS files
               WHERE files.owner_id = $1
               ORDER BY files_parent;`;

  const files = await pool.query(sql, [userId]);
  return files.rows;
};
