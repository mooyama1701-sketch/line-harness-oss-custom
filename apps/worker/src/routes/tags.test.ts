import { beforeEach, describe, expect, test, vi } from 'vitest';
import { Hono } from 'hono';

const dbMocks = {
  getTagsWithFriendCount: vi.fn(),
  getTagFoldersWithTagCount: vi.fn(),
  createTag: vi.fn(),
  createTagFolder: vi.fn(),
  updateTagFolder: vi.fn(),
  deleteTag: vi.fn(),
  deleteTagFolder: vi.fn(),
};
vi.mock('@line-crm/db', () => dbMocks);

const { tags: tagsModule } = await import('./tags.js');

function setupApp() {
  const app = new Hono<{ Bindings: { DB: D1Database } }>();
  app.use('*', async (c, next) => {
    c.env = { DB: {} as D1Database };
    await next();
  });
  app.route('/', tagsModule);
  return app;
}

beforeEach(() => {
  for (const fn of Object.values(dbMocks)) fn.mockReset();
});

describe('POST /api/tags', () => {
  test('trims name before creating a tag', async () => {
    dbMocks.createTag.mockResolvedValue({
      id: 'tag-1',
      name: 'シナリオテスト',
      folder_id: null,
      color: '#06C755',
      created_at: '2026-06-24T00:00:00.000+09:00',
    });

    const res = await setupApp().request('/api/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '  シナリオテスト  ', color: '#06C755' }),
    });

    expect(res.status).toBe(201);
    expect(dbMocks.createTag).toHaveBeenCalledWith(expect.anything(), {
      name: 'シナリオテスト',
      color: '#06C755',
      folderId: null,
    });
  });

  test('creates a tag inside a folder', async () => {
    dbMocks.createTag.mockResolvedValue({
      id: 'tag-1',
      name: '水泳部',
      folder_id: 'folder-1',
      color: '#06C755',
      created_at: '2026-06-24T00:00:00.000+09:00',
    });

    const res = await setupApp().request('/api/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '水泳部', color: '#06C755', folderId: 'folder-1' }),
    });

    expect(res.status).toBe(201);
    expect(dbMocks.createTag).toHaveBeenCalledWith(expect.anything(), {
      name: '水泳部',
      color: '#06C755',
      folderId: 'folder-1',
    });
  });

  test('rejects blank names', async () => {
    const res = await setupApp().request('/api/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '   ' }),
    });

    expect(res.status).toBe(400);
    expect(dbMocks.createTag).not.toHaveBeenCalled();
  });

  test('returns 409 for duplicate tag names', async () => {
    dbMocks.createTag.mockRejectedValue(new Error('D1_ERROR: UNIQUE constraint failed: tags.name'));

    const res = await setupApp().request('/api/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '重複タグ' }),
    });

    expect(res.status).toBe(409);
    const body = (await res.json()) as { success: boolean; error: string };
    expect(body.success).toBe(false);
    expect(body.error).toBe('tag name already exists');
  });
});

describe('GET /api/tags', () => {
  test('returns tags with friendCount', async () => {
    dbMocks.getTagsWithFriendCount.mockResolvedValue([
      {
        id: 'tag-1',
        name: 'VIP',
        folder_id: 'folder-1',
        color: '#06C755',
        created_at: '2026-06-24T00:00:00.000+09:00',
        folder_name: '属性',
        friend_count: 3,
      },
    ]);

    const res = await setupApp().request('/api/tags');

    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      success: boolean;
      data: Array<{ id: string; friendCount: number }>;
    };
    expect(body.success).toBe(true);
    expect(body.data).toEqual([
      expect.objectContaining({
        id: 'tag-1',
        friendCount: 3,
        folderId: 'folder-1',
        folderName: '属性',
      }),
    ]);
  });
});

describe('PATCH /api/tags/:id', () => {
  test('moves a tag to a folder', async () => {
    dbMocks.updateTagFolder.mockResolvedValue({
      id: 'tag-1',
      name: '水泳部',
      folder_id: 'folder-1',
      color: '#06C755',
      created_at: '2026-06-24T00:00:00.000+09:00',
    });

    const res = await setupApp().request('/api/tags/tag-1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folderId: 'folder-1' }),
    });

    expect(res.status).toBe(200);
    expect(dbMocks.updateTagFolder).toHaveBeenCalledWith(expect.anything(), 'tag-1', 'folder-1');
  });
});

describe('GET /api/tag-folders', () => {
  test('returns folders with tagCount', async () => {
    dbMocks.getTagFoldersWithTagCount.mockResolvedValue([
      {
        id: 'folder-1',
        name: '部活',
        created_at: '2026-06-24T00:00:00.000+09:00',
        tag_count: 3,
      },
    ]);

    const res = await setupApp().request('/api/tag-folders');

    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      success: boolean;
      data: Array<{ id: string; tagCount: number }>;
    };
    expect(body.success).toBe(true);
    expect(body.data).toEqual([
      expect.objectContaining({
        id: 'folder-1',
        tagCount: 3,
      }),
    ]);
  });
});

describe('POST /api/tag-folders', () => {
  test('trims name before creating a folder', async () => {
    dbMocks.createTagFolder.mockResolvedValue({
      id: 'folder-1',
      name: '部活',
      created_at: '2026-06-24T00:00:00.000+09:00',
    });

    const res = await setupApp().request('/api/tag-folders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '  部活  ' }),
    });

    expect(res.status).toBe(201);
    expect(dbMocks.createTagFolder).toHaveBeenCalledWith(expect.anything(), { name: '部活' });
  });

  test('rejects blank folder names', async () => {
    const res = await setupApp().request('/api/tag-folders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '   ' }),
    });

    expect(res.status).toBe(400);
    expect(dbMocks.createTagFolder).not.toHaveBeenCalled();
  });

  test('returns 409 for duplicate folder names', async () => {
    dbMocks.createTagFolder.mockRejectedValue(new Error('D1_ERROR: UNIQUE constraint failed: tag_folders.name'));

    const res = await setupApp().request('/api/tag-folders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '部活' }),
    });

    expect(res.status).toBe(409);
    const body = (await res.json()) as { success: boolean; error: string };
    expect(body.success).toBe(false);
    expect(body.error).toBe('tag folder name already exists');
  });
});
