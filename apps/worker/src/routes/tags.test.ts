import { beforeEach, describe, expect, test, vi } from 'vitest';
import { Hono } from 'hono';

const dbMocks = {
  getTags: vi.fn(),
  createTag: vi.fn(),
  deleteTag: vi.fn(),
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
