# Planted vulnerabilities — ground-truth answer key

This FAKE app contains the intentional weaknesses below. Use this as the
ground-truth reference when you fill in `data/<id>/ground-truth.json` in the
Beyond Static Scans tool, and to check the tool's verdicts.

The **Expected tool verdict** column reflects how the current prototype behaves:
it *confirms* configuration/transport weaknesses with read-only checks, and
leaves code-level and active-exploit findings as **Needs review** (those checks
belong in the test-design document).

| # | Weakness | OWASP | Where | Truly a weakness? | Expected tool verdict |
|---|---|---|---|---|---|
| 1 | No security headers (no CSP, X-Frame-Options, etc.) | A05 | `server.js` (no helmet) | yes | **Confirmed** (headers absent on live responses) |
| 2 | Wildcard CORS (`origin: '*'`) | A05 | `app.use(cors(...))` | yes | **Confirmed** |
| 3 | Session cookie without HttpOnly/Secure/SameSite | A05 | `res.cookie('sid', …)` | yes | **Confirmed** |
| 4 | Technology disclosure (`X-Powered-By: Express`) | A05 | default, not disabled | yes | **Confirmed** |
| 5 | No HSTS (transport hardening missing) | A02 | no `Strict-Transport-Security` | yes | **Confirmed** |
| 6 | Hardcoded signing secret | A02 | `JWT_SECRET = '…'` | yes | **Needs review** (code-level) |
| 7 | MD5 password hashing | A02 | `/login` | yes | **Needs review** (code-level) |
| 8 | Non-cryptographic token (`Math.random`) | A07 | `/` cookie value | yes | **Needs review** |
| 9 | IDOR — order returned with no ownership check | A01 | `/orders/:id` | yes | **Needs review** (needs an active check) |
| 10 | Reflected input into HTML (XSS pattern) | A03 | `/search?q=` | yes | **Needs review** (needs an active check) |
| 11 | Vulnerable dependency: `lodash@4.17.15` | A03/—  | `package.json` | yes (prototype pollution advisory) | **Needs review** (SCA) |
| 12 | Vulnerable dependency: `jsonwebtoken@8.5.1` | A07/— | `package.json` | yes (older advisories) | **Needs review** (SCA) |

Notes:
- Items 1–5 are the ones the tool should **Confirm** live, each with the app's
  own response as evidence — these are your "it really works" demonstrations.
- Items 6–12 exercise the SAST/SCA ingestion and the "Needs review" path. They
  are real weaknesses; the prototype just doesn't have the active checks to
  confirm them yet (that's your test-design future work).
- Semgrep may also raise a few findings not listed here — decide and record
  those as part of your ground-truth labelling (that judgement is part of the
  methodology).
