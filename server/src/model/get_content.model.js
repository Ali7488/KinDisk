import { pool } from "../config/db.js";

//! This is a temporary solution until proper multi user is added
const getUserId = async () => {
  const sql = `SELECT user_id FROM public.users WHERE username = 'Mohannad'`;
  const userId = await pool.query(sql);
  return userId.rows[0];
};

export const getUserFolders = async (id) => {
  const userId = id !== null ? id : await getUserId();

  const sql = `SELECT folder.folder_id, folder.folder_name,folder.parent_folder_id
              FROM public.folders AS folder
              WHERE folder.owned_by = $1
              ORDER BY folder.folder_name ASC;`;
  const folders = pool.query(sql, [userId]);
  return folders.rows;
};

export const getUserFiles = async (id) => {
  const userId = id !== null ? id : await getUserId();

  const sql = `SELECT files.file_id, files.original_name AS file_name,
               files.folder_id  AS files_parent,
               files.size_bytes AS storage_used, files.owner_id
               FROM public.files AS files
               WHERE files.owner_id = $1
               ORDER BY files_parent;`;

  const files = pool.query(sql, [userId]);
  return files.rows;
};
