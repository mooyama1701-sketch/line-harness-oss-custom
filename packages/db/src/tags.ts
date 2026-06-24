import { jstNow } from './utils.js';
export interface Tag {
  id: string;
  name: string;
  folder_id: string | null;
  color: string;
  created_at: string;
}

export interface TagWithFriendCount extends Tag {
  friend_count: number;
  folder_name: string | null;
}

export interface TagFolder {
  id: string;
  name: string;
  created_at: string;
}

export interface TagFolderWithTagCount extends TagFolder {
  tag_count: number;
}

export interface FriendTag {
  friend_id: string;
  tag_id: string;
  assigned_at: string;
}

export async function getTags(db: D1Database): Promise<Tag[]> {
  const result = await db
    .prepare(`SELECT * FROM tags ORDER BY name ASC`)
    .all<Tag>();
  return result.results;
}

export async function getTagsWithFriendCount(db: D1Database): Promise<TagWithFriendCount[]> {
  const result = await db
    .prepare(
      `SELECT
         t.id,
         t.name,
         t.folder_id,
         t.color,
         t.created_at,
         f.name AS folder_name,
         COUNT(ft.friend_id) AS friend_count
       FROM tags t
       LEFT JOIN tag_folders f ON f.id = t.folder_id
       LEFT JOIN friend_tags ft ON ft.tag_id = t.id
       GROUP BY t.id, t.name, t.folder_id, t.color, t.created_at, f.name
       ORDER BY COALESCE(f.name, ''), t.name ASC`,
    )
    .all<TagWithFriendCount>();
  return result.results;
}

export async function getTagFoldersWithTagCount(db: D1Database): Promise<TagFolderWithTagCount[]> {
  const result = await db
    .prepare(
      `SELECT
         f.id,
         f.name,
         f.created_at,
         COUNT(t.id) AS tag_count
       FROM tag_folders f
       LEFT JOIN tags t ON t.folder_id = f.id
       GROUP BY f.id, f.name, f.created_at
       ORDER BY f.name ASC`,
    )
    .all<TagFolderWithTagCount>();
  return result.results;
}

export interface CreateTagInput {
  name: string;
  color?: string;
  folderId?: string | null;
}

export async function createTag(
  db: D1Database,
  input: CreateTagInput,
): Promise<Tag> {
  const id = crypto.randomUUID();
  const now = jstNow();
  const color = input.color ?? '#3B82F6';

  await db
    .prepare(
      `INSERT INTO tags (id, name, folder_id, color, created_at)
       VALUES (?, ?, ?, ?, ?)`,
    )
    .bind(id, input.name, input.folderId ?? null, color, now)
    .run();

  return (await db
    .prepare(`SELECT * FROM tags WHERE id = ?`)
    .bind(id)
    .first<Tag>())!;
}

export interface CreateTagFolderInput {
  name: string;
}

export async function createTagFolder(
  db: D1Database,
  input: CreateTagFolderInput,
): Promise<TagFolder> {
  const id = crypto.randomUUID();
  const now = jstNow();

  await db
    .prepare(
      `INSERT INTO tag_folders (id, name, created_at)
       VALUES (?, ?, ?)`,
    )
    .bind(id, input.name, now)
    .run();

  return (await db
    .prepare(`SELECT * FROM tag_folders WHERE id = ?`)
    .bind(id)
    .first<TagFolder>())!;
}

export async function updateTagFolder(
  db: D1Database,
  tagId: string,
  folderId: string | null,
): Promise<Tag> {
  await db
    .prepare(`UPDATE tags SET folder_id = ? WHERE id = ?`)
    .bind(folderId, tagId)
    .run();

  return (await db
    .prepare(`SELECT * FROM tags WHERE id = ?`)
    .bind(tagId)
    .first<Tag>())!;
}

export async function deleteTagFolder(db: D1Database, id: string): Promise<void> {
  await db.prepare(`UPDATE tags SET folder_id = NULL WHERE folder_id = ?`).bind(id).run();
  await db.prepare(`DELETE FROM tag_folders WHERE id = ?`).bind(id).run();
}

export async function deleteTag(db: D1Database, id: string): Promise<void> {
  await db.prepare(`DELETE FROM tags WHERE id = ?`).bind(id).run();
}

export async function addTagToFriend(
  db: D1Database,
  friendId: string,
  tagId: string,
): Promise<void> {
  const now = jstNow();
  await db
    .prepare(
      `INSERT OR IGNORE INTO friend_tags (friend_id, tag_id, assigned_at)
       VALUES (?, ?, ?)`,
    )
    .bind(friendId, tagId, now)
    .run();
}

export async function removeTagFromFriend(
  db: D1Database,
  friendId: string,
  tagId: string,
): Promise<void> {
  await db
    .prepare(
      `DELETE FROM friend_tags WHERE friend_id = ? AND tag_id = ?`,
    )
    .bind(friendId, tagId)
    .run();
}

export async function getFriendTags(
  db: D1Database,
  friendId: string,
): Promise<Tag[]> {
  const result = await db
    .prepare(
      `SELECT t.*
       FROM tags t
       INNER JOIN friend_tags ft ON ft.tag_id = t.id
       WHERE ft.friend_id = ?
       ORDER BY t.name ASC`,
    )
    .bind(friendId)
    .all<Tag>();
  return result.results;
}

import type { Friend } from './friends';

export async function getFriendsByTag(
  db: D1Database,
  tagId: string,
): Promise<Friend[]> {
  const result = await db
    .prepare(
      `SELECT f.*
       FROM friends f
       INNER JOIN friend_tags ft ON ft.friend_id = f.id
       WHERE ft.tag_id = ?
       ORDER BY f.created_at DESC`,
    )
    .bind(tagId)
    .all<Friend>();
  return result.results;
}
