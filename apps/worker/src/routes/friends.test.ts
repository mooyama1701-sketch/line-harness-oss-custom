import { beforeEach, describe, expect, test, vi } from 'vitest';
import { Hono } from 'hono';

const dbMocks = {
  getFriends: vi.fn(),
  getFriendById: vi.fn(),
  getFriendCount: vi.fn(),
  removeTagFromFriend: vi.fn(),
  getFriendTags: vi.fn(),
  getScenarios: vi.fn(),
  enrollFriendInScenario: vi.fn(),
  jstNow: vi.fn(),
};
vi.mock('@line-crm/db', () => dbMocks);

const serviceMocks = {
  fireEvent: vi.fn(),
};
vi.mock('../services/event-bus.js', () => serviceMocks);
vi.mock('../services/step-delivery.js', () => ({ buildMessage: vi.fn() }));

const { friends: friendsModule } = await import('./friends.js');

type TagRow = {
  id: string;
  name: string;
  folder_id: string | null;
  color: string;
  created_at: string;
};

function setupApp(db: D1Database) {
  const app = new Hono<{ Bindings: { DB: D1Database } }>();
  app.use('*', async (c, next) => {
    c.env = { DB: db };
    await next();
  });
  app.route('/', friendsModule);
  return app;
}

function makeDb(options?: { tag?: TagRow | null; assigned?: boolean; insertChanges?: number }) {
  const calls: { sql: string; binds: unknown[] }[] = [];
  const db = {
    prepare(sql: string) {
      let bound: unknown[] = [];
      const stmt = {
        bind(...args: unknown[]) {
          bound = args;
          return stmt;
        },
        async first<_T>() {
          calls.push({ sql, binds: bound });
          if (/SELECT \* FROM tags WHERE id = \?/i.test(sql)) {
            return Object.prototype.hasOwnProperty.call(options ?? {}, 'tag') ? options?.tag : tagRow;
          }
          if (/SELECT 1 FROM friend_tags/i.test(sql)) {
            return options?.assigned ? { ok: 1 } : null;
          }
          return null;
        },
        async run() {
          calls.push({ sql, binds: bound });
          return { meta: { changes: options?.insertChanges ?? 1 } };
        },
        async all<_T>() {
          calls.push({ sql, binds: bound });
          return { results: [] };
        },
      };
      return stmt;
    },
  } as unknown as D1Database;
  return { db, calls };
}

const friendRow = {
  id: 'friend-1',
  line_user_id: 'U123',
  display_name: 'KAZU',
  picture_url: null,
  status_message: null,
  is_following: 1,
  metadata: '{}',
  user_id: null,
  created_at: '2026-06-25T00:00:00.000+09:00',
  updated_at: '2026-06-25T00:00:00.000+09:00',
};

const tagRow: TagRow = {
  id: 'tag-1',
  name: '男性',
  folder_id: null,
  color: '#06C755',
  created_at: '2026-06-25T00:00:00.000+09:00',
};

beforeEach(() => {
  for (const fn of Object.values(dbMocks)) fn.mockReset();
  for (const fn of Object.values(serviceMocks)) fn.mockReset();
  dbMocks.jstNow.mockReturnValue('2026-06-25T00:00:00.000+09:00');
  dbMocks.getScenarios.mockResolvedValue([]);
});

describe('GET /api/friends/:id/tags', () => {
  test('returns assigned tags for an existing friend', async () => {
    dbMocks.getFriendById.mockResolvedValue(friendRow);
    dbMocks.getFriendTags.mockResolvedValue([tagRow]);

    const res = await setupApp(makeDb().db).request('/api/friends/friend-1/tags');

    expect(res.status).toBe(200);
    const body = (await res.json()) as { success: boolean; data: Array<{ id: string; name: string }> };
    expect(body.success).toBe(true);
    expect(body.data).toEqual([expect.objectContaining({ id: 'tag-1', name: '男性' })]);
  });

  test('returns 404 when friend does not exist', async () => {
    dbMocks.getFriendById.mockResolvedValue(null);

    const res = await setupApp(makeDb().db).request('/api/friends/missing/tags');

    expect(res.status).toBe(404);
    expect(dbMocks.getFriendTags).not.toHaveBeenCalled();
  });
});

describe('POST /api/friends/:id/tags', () => {
  test('adds a tag once and fires tag side effects', async () => {
    dbMocks.getFriendById.mockResolvedValue(friendRow);
    const { db, calls } = makeDb({ insertChanges: 1 });

    const res = await setupApp(db).request('/api/friends/friend-1/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tagId: 'tag-1' }),
    });

    expect(res.status).toBe(201);
    expect(calls.some((call) => /INSERT OR IGNORE INTO friend_tags/i.test(call.sql))).toBe(true);
    expect(serviceMocks.fireEvent).toHaveBeenCalledWith(db, 'tag_change', {
      friendId: 'friend-1',
      eventData: { tagId: 'tag-1', action: 'add' },
    });
  });

  test('does not fire side effects for a duplicate tag assignment', async () => {
    dbMocks.getFriendById.mockResolvedValue(friendRow);
    const { db } = makeDb({ insertChanges: 0 });

    const res = await setupApp(db).request('/api/friends/friend-1/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tagId: 'tag-1' }),
    });

    expect(res.status).toBe(200);
    expect(serviceMocks.fireEvent).not.toHaveBeenCalled();
  });

  test('returns 404 when friend does not exist', async () => {
    dbMocks.getFriendById.mockResolvedValue(null);

    const res = await setupApp(makeDb().db).request('/api/friends/missing/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tagId: 'tag-1' }),
    });

    expect(res.status).toBe(404);
  });

  test('returns 404 when tag does not exist', async () => {
    dbMocks.getFriendById.mockResolvedValue(friendRow);

    const res = await setupApp(makeDb({ tag: null }).db).request('/api/friends/friend-1/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tagId: 'missing-tag' }),
    });

    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/friends/:id/tags/:tagId', () => {
  test('removes an assigned tag and fires tag side effects', async () => {
    dbMocks.getFriendById.mockResolvedValue(friendRow);
    const { db } = makeDb({ assigned: true });

    const res = await setupApp(db).request('/api/friends/friend-1/tags/tag-1', { method: 'DELETE' });

    expect(res.status).toBe(200);
    expect(dbMocks.removeTagFromFriend).toHaveBeenCalledWith(db, 'friend-1', 'tag-1');
    expect(serviceMocks.fireEvent).toHaveBeenCalledWith(db, 'tag_change', {
      friendId: 'friend-1',
      eventData: { tagId: 'tag-1', action: 'remove' },
    });
  });

  test('is idempotent when the tag is already unassigned', async () => {
    dbMocks.getFriendById.mockResolvedValue(friendRow);
    const { db } = makeDb({ assigned: false });

    const res = await setupApp(db).request('/api/friends/friend-1/tags/tag-1', { method: 'DELETE' });

    expect(res.status).toBe(200);
    expect(dbMocks.removeTagFromFriend).not.toHaveBeenCalled();
    expect(serviceMocks.fireEvent).not.toHaveBeenCalled();
  });

  test('returns 404 when friend does not exist', async () => {
    dbMocks.getFriendById.mockResolvedValue(null);

    const res = await setupApp(makeDb({ assigned: true }).db).request('/api/friends/missing/tags/tag-1', {
      method: 'DELETE',
    });

    expect(res.status).toBe(404);
  });

  test('returns 404 when tag does not exist', async () => {
    dbMocks.getFriendById.mockResolvedValue(friendRow);

    const res = await setupApp(makeDb({ tag: null, assigned: true }).db).request(
      '/api/friends/friend-1/tags/missing-tag',
      { method: 'DELETE' },
    );

    expect(res.status).toBe(404);
  });
});
