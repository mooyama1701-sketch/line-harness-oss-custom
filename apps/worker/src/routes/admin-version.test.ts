import { afterEach, describe, expect, it, vi } from 'vitest';
import { Hono } from 'hono';
import adminVersion from './admin-version.js';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('GET /admin/version', () => {
  it('returns version + hashes', async () => {
    const app = new Hono();
    app.route('/admin', adminVersion);
    const res = await app.request('/admin/version');
    expect(res.status).toBe(200);
    const j = (await res.json()) as {
      version: string;
      worker_hash: string;
      admin_hash: string;
      liff_hash: string;
      released_at: string;
      updateEnabled: boolean;
      updateAvailable: boolean;
    };
    expect(j.version).toMatch(/^\d+\.\d+\.\d+(-\w+)?$/);
    expect(j.worker_hash).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(j.admin_hash).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(j.liff_hash).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(j.released_at).toMatch(/^\d{4}-\d{2}-\d{2}/);
    expect(j.updateEnabled).toBe(false);
    expect(j.updateAvailable).toBe(false);
  });
});

describe('GET /admin/manifest', () => {
  it('returns UPDATE_DISABLED without fetching an upstream manifest', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    const app = new Hono();
    app.route('/admin', adminVersion);
    const res = await app.request('/admin/manifest', {}, {
      MANIFEST_URL: 'https://example.com/release-manifest.json',
    });

    expect(res.status).toBe(501);
    expect(await res.json()).toEqual({
      code: 'UPDATE_DISABLED',
      message: '初期リリースでは自動更新機能を利用できません',
      updateEnabled: false,
      updateAvailable: false,
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
