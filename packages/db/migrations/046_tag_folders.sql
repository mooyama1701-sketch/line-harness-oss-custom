-- 046_tag_folders.sql
-- タグをLステップ風にフォルダ分類できるようにする。

CREATE TABLE IF NOT EXISTS tag_folders (
  id         TEXT PRIMARY KEY,
  name       TEXT UNIQUE NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%f', 'now', '+9 hours'))
);

ALTER TABLE tags ADD COLUMN folder_id TEXT REFERENCES tag_folders(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_tags_folder_id ON tags (folder_id);
