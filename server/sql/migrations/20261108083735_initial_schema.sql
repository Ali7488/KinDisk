-- migrate:up

CREATE TABLE Users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL CHECK (LENGTH(TRIM(username)) > 0),
  password_hash TEXT NOT NULL
);

CREATE TABLE Folders(
  folder_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owned_by UUID NOT NULL REFERENCES Users(user_id),
  parent_folder_id UUID REFERENCES Folders(folder_id),
  folder_name TEXT NOT NULL CHECK (LENGTH(TRIM(folder_name)) > 0),

  CONSTRAINT folder_not_own_parent
    CHECK (parent_folder_id IS DISTINCT FROM folder_id)
);

CREATE TABLE Files(
  file_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folder_id UUID REFERENCES Folders(folder_id),
  owner_id UUID NOT NULL REFERENCES Users(user_id),
  created_by UUID NOT NULL REFERENCES Users(user_id),
  storage_key TEXT UNIQUE NOT NULL,
  original_name TEXT NOT NULL CHECK (LENGTH(TRIM(original_name)) > 0),
  size_bytes BIGINT NOT NULL CHECK (size_bytes >= 0),
  mime_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TYPE permission_level AS ENUM (
  'ADMIN',
  'EDITOR',
  'VIEWER',
  'NONE'
);

CREATE TABLE FolderAccess(
  folder_id UUID REFERENCES Folders(folder_id),
  user_id UUID REFERENCES Users(user_id),
  permission permission_level NOT NULL,

  PRIMARY KEY (folder_id, user_id)
);


-- migrate:down

DROP TABLE IF EXISTS FolderAccess;
DROP TABLE IF EXISTS Files;
DROP TABLE IF EXISTS Folders;
DROP TABLE IF EXISTS Users;
DROP TYPE permission_level;
