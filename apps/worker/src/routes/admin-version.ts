import { Hono } from 'hono';
import {
  BUNDLE_VERSION,
  WORKER_HASH,
  ADMIN_HASH,
  LIFF_HASH,
  RELEASED_AT,
} from '../_version.js';

// Unauthenticated by design — returns build-time public metadata used by the
// dashboard's upgrade banner before the user logs in. The manifest proxy exists
// because GitHub release assets do not reliably send browser CORS headers.
// Task 18's /admin/update/* mounts under the same /admin prefix but layers
// ADMIN_API_KEY middleware on those subpaths.
const app = new Hono();

app.get('/version', (c) =>
  c.json({
    version: BUNDLE_VERSION,
    worker_hash: WORKER_HASH,
    admin_hash: ADMIN_HASH,
    liff_hash: LIFF_HASH,
    released_at: RELEASED_AT,
    updateEnabled: false,
    updateAvailable: false,
  }),
);

app.get('/manifest', (c) => {
  return c.json(
    {
      code: 'UPDATE_DISABLED',
      message: '初期リリースでは自動更新機能を利用できません',
      updateEnabled: false,
      updateAvailable: false,
    },
    501,
  );
});

export default app;
