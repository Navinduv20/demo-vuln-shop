# ⚠️ demo-vuln-shop — a DELIBERATELY VULNERABLE fake app

> **This is not a real application and must never be deployed.**
> It is a **fake shop with intentional security weaknesses**, built only as a
> test fixture for the *Beyond Static Scans* exploitability-validation tool
> (MSc dissertation, Navindu Perera). It holds **no real data**, performs **no
> real authentication**, and is meant to run **only locally, in an isolated
> sandbox**. Do not host it, do not expose it to a network, do not put real
> data in it.

## What it is

A tiny Express app with a handful of **intentional** vulnerabilities, each
marked `// INTENTIONAL (DEMO)` in the code and catalogued in
[`VULNERABILITIES.md`](./VULNERABILITIES.md) (which doubles as the ground-truth
answer key for evaluating the tool). The weaknesses are a mix of:

- **live misconfigurations** the tool confirms by reading responses (missing
  security headers, wildcard CORS, insecure cookie, tech disclosure, no HSTS), and
- **code-level / dependency** issues that populate the "needs review" path
  (hardcoded secret, MD5, weak token, IDOR, reflected input, vulnerable `lodash`
  and `jsonwebtoken`).

## How to test the onboarding flow with it

**Option A — straight from a Git repo (tests the dashboard "Add from Git" flow):**
1. Push this folder to a repo of your own (e.g. `https://github.com/<you>/demo-vuln-shop`).
   ```bash
   cd demo-vuln-shop
   git init && git add . && git commit -m "deliberately vulnerable demo fixture"
   git branch -M main
   git remote add origin https://github.com/<you>/demo-vuln-shop.git
   git push -u origin main
   ```
2. In the tool: start the backend (`npm start`), open the dashboard, click
   **"+ Add a target from a Git repo"**, paste the URL, tick consent, **Add**.
3. Restart the backend, pick **demo-vuln-shop**, **Start**.

**Option B — locally, without pushing (tests the pipeline against local code):**
```bash
# from the Prototype folder
npm run add-target -- --id demoshop --name "Demo Vuln Shop" --source ../demo-vuln-shop --port 3000 --ready /health
```

Either way, you should see items 1–5 come back **Confirmed** (with the real
response headers as evidence) and the rest as **Needs review**.

## Run it directly (optional)

```bash
npm install
npm start           # http://localhost:3000  (shows a red DEMO warning banner)
```
Endpoints: `/` , `/health` , `/search?q=…` , `/orders/1001` , `POST /login`.
