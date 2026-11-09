-- migrate:up
ALTER TABLE Users
ADD COLUMN quota_override_bytes BIGINT
  CHECK (quota_override_bytes >= 0);

CREATE TABLE Settings (
  settings_id SMALLINT PRIMARY KEY
    CHECK (settings_id = 1),

  owner_user_id UUID NOT NULL UNIQUE
    REFERENCES Users(user_id),

  total_storage BIGINT NOT NULL
    CHECK (total_storage > 0) ,

  single_upload_limit BIGINT NOT NULL
    DEFAULT 512000000
    CHECK (single_upload_limit > 0)
);

-- migrate:down
DROP TABLE Settings;
ALTER TABLE Users
  DROP COLUMN quota_override_bytes;
