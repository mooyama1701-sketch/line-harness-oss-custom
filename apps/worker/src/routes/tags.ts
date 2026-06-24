import { Hono } from 'hono';
import {
  getTagsWithFriendCount,
  getTagFoldersWithTagCount,
  createTag,
  createTagFolder,
  updateTagFolder,
  deleteTag,
  deleteTagFolder,
} from '@line-crm/db';
import type {
  Tag as DbTag,
  TagFolder,
  TagFolderWithTagCount,
  TagWithFriendCount,
} from '@line-crm/db';
import type { Env } from '../index.js';

const tags = new Hono<Env>();

function serializeTag(row: DbTag) {
  return {
    id: row.id,
    name: row.name,
    folderId: row.folder_id ?? null,
    folderName: 'folder_name' in row ? (row as TagWithFriendCount).folder_name : null,
    color: row.color,
    createdAt: row.created_at,
    friendCount: 'friend_count' in row ? (row as TagWithFriendCount).friend_count : 0,
  };
}

function serializeTagFolder(row: TagFolder | TagFolderWithTagCount) {
  return {
    id: row.id,
    name: row.name,
    createdAt: row.created_at,
    tagCount: 'tag_count' in row ? row.tag_count : 0,
  };
}

// GET /api/tags - list all tags
tags.get('/api/tags', async (c) => {
  try {
    const items = await getTagsWithFriendCount(c.env.DB);
    return c.json({ success: true, data: items.map(serializeTag) });
  } catch (err) {
    console.error('GET /api/tags error:', err);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

// POST /api/tags - create tag
tags.post('/api/tags', async (c) => {
  try {
    const body = await c.req.json<{ name: string; color?: string; folderId?: string | null }>();
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const folderId = typeof body.folderId === 'string' && body.folderId ? body.folderId : null;

    if (!name) {
      return c.json({ success: false, error: 'name is required' }, 400);
    }

    const tag = await createTag(c.env.DB, {
      name,
      color: body.color,
      folderId,
    });

    return c.json({ success: true, data: serializeTag(tag) }, 201);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (/UNIQUE constraint failed: tags\.name/i.test(message)) {
      return c.json({ success: false, error: 'tag name already exists' }, 409);
    }
    console.error('POST /api/tags error:', err);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

// PATCH /api/tags/:id - move tag to another folder
tags.patch('/api/tags/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json<{ folderId?: string | null }>();
    const folderId = typeof body.folderId === 'string' && body.folderId ? body.folderId : null;
    const tag = await updateTagFolder(c.env.DB, id, folderId);
    return c.json({ success: true, data: serializeTag(tag) });
  } catch (err) {
    console.error('PATCH /api/tags/:id error:', err);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

// DELETE /api/tags/:id - delete tag
tags.delete('/api/tags/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await deleteTag(c.env.DB, id);
    return c.json({ success: true, data: null });
  } catch (err) {
    console.error('DELETE /api/tags/:id error:', err);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

// GET /api/tag-folders - list all tag folders
tags.get('/api/tag-folders', async (c) => {
  try {
    const items = await getTagFoldersWithTagCount(c.env.DB);
    return c.json({ success: true, data: items.map(serializeTagFolder) });
  } catch (err) {
    console.error('GET /api/tag-folders error:', err);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

// POST /api/tag-folders - create tag folder
tags.post('/api/tag-folders', async (c) => {
  try {
    const body = await c.req.json<{ name: string }>();
    const name = typeof body.name === 'string' ? body.name.trim() : '';

    if (!name) {
      return c.json({ success: false, error: 'name is required' }, 400);
    }

    const folder = await createTagFolder(c.env.DB, { name });
    return c.json({ success: true, data: serializeTagFolder(folder) }, 201);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (/UNIQUE constraint failed: tag_folders\.name/i.test(message)) {
      return c.json({ success: false, error: 'tag folder name already exists' }, 409);
    }
    console.error('POST /api/tag-folders error:', err);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

// DELETE /api/tag-folders/:id - delete tag folder and leave tags unclassified
tags.delete('/api/tag-folders/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await deleteTagFolder(c.env.DB, id);
    return c.json({ success: true, data: null });
  } catch (err) {
    console.error('DELETE /api/tag-folders/:id error:', err);
    return c.json({ success: false, error: 'Internal server error' }, 500);
  }
});

export { tags };
