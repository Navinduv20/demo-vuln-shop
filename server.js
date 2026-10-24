// ============================================================================
//  DEMO-VULN-SHOP  —  DELIBERATELY VULNERABLE TEST FIXTURE
//  ---------------------------------------------------------------------------
//  This is NOT a real application. It is a fake shop with intentional security
//  weaknesses, used only to exercise the "Beyond Static Scans" exploitability
//  validation tool in an isolated local sandbox.
//
//  ⚠️  DO NOT DEPLOY THIS. DO NOT PUT REAL DATA IN IT. RUN IT ONLY LOCALLY.
//
//  Every weakness below is marked  // INTENTIONAL (DEMO)  and is catalogued in
//  VULNERABILITIES.md, which doubles as the ground-truth answer key.
// ============================================================================

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');

const app = express();
app.use(express.json());
app.use(cookieParser());

// INTENTIONAL (DEMO) — A05: wildcard CORS on an app that also uses cookies.
app.use(cors({ origin: '*' }));

// INTENTIONAL (DEMO) — A05: no helmet / no security headers are set, and
// X-Powered-By is left enabled (Express sets it by default). A hardened app
// would `app.disable('x-powered-by')` and add helmet() with CSP, HSTS, etc.

// Fake in-memory data (not real customers).
const ORDERS = {
  1001: { id: 1001, owner: 'alice', item: 'Demo Mug', total: 12.5 },
  1002: { id: 1002, owner: 'bob', item: 'Demo Shirt', total: 25.0 },
};

const WARNING = `<div style="background:#B42318;color:#fff;padding:8px 12px;font-family:sans-serif">
  ⚠️ DEMO-VULN-SHOP — a deliberately vulnerable FAKE app for security-tool testing. Do not deploy. No real data.
</div>`;

// Health check (used by the sandbox to know the app is up).
app.get('/health', (_req, res) => res.json({ status: 'ok', app: 'demo-vuln-shop', demo: true }));

// Home page.
app.get('/', (req, res) => {
  // INTENTIONAL (DEMO) — A05: session cookie set with no HttpOnly / Secure /
  // SameSite flags, and A07: the "token" is non-cryptographic (Math.random).
  const weakToken = Math.random().toString(36).slice(2); // INTENTIONAL (DEMO) — A07
  res.cookie('sid', weakToken); // INTENTIONAL (DEMO) — A05 (no flags)
  res.type('html').send(`${WARNING}
    <h1>Demo Vuln Shop</h1>
    <p>A fake shop used to test a security tool. Try <code>/search?q=hello</code> or <code>/orders/1001</code>.</p>`);
});

// INTENTIONAL (DEMO) — A03: reflected input written into the HTML response
// without escaping (classic reflected-XSS pattern).
app.get('/search', (req, res) => {
  const q = req.query.q || '';
  res.type('html').send(`${WARNING}<h2>Results for ${q}</h2><p>No demo products matched.</p>`);
});

// INTENTIONAL (DEMO) — A01: returns an order by id with NO check that it
// belongs to the caller (insecure direct object reference / broken access control).
app.get('/orders/:id', (req, res) => {
  const order = ORDERS[req.params.id];
  if (!order) return res.status(404).json({ error: 'not found' });
  res.json(order);
});

// INTENTIONAL (DEMO) — A02: password "hashing" with MD5, and a hardcoded
// signing secret. Both are code-level weaknesses a static scanner flags.
const JWT_SECRET = 'demo-hardcoded-secret-do-not-use'; // INTENTIONAL (DEMO) — A02
app.post('/login', (req, res) => {
  const { username = '', password = '' } = req.body || {};
  const hashed = crypto.createHash('md5').update(password).digest('hex'); // INTENTIONAL (DEMO) — A02
  // (No real authentication happens — this is a fixture.)
  res.json({ ok: true, username, note: 'demo only — not real auth', hashPreview: hashed.slice(0, 6) + '…', secretLen: JWT_SECRET.length });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`demo-vuln-shop (FAKE, do not deploy) listening on ${PORT}`));
