# 👻 Ghost Commit — AI GitHub Repo Analyzer & Resurrection Planner

> *Point it at a dead GitHub repo. Get a real, AI-generated plan to bring it back — and open a GitHub issue to track it.*

Ghost Commit reads a **real** public GitHub repository, analyzes what has gone
stale, uses AI to produce a concrete resurrection plan, and can open a **real
GitHub issue** with that plan so the work lives where the code does.

## 🎯 What it actually does

- 🔍 **Real analysis** — fetches the repo, `package.json`, dependencies, last
  commit and open issues via the GitHub API, and detects concrete problems
  (outdated framework, aging dependencies, missing auth, long inactivity).
- 🧠 **AI resurrection plan** — turns that analysis into an ordered, actionable
  plan with OpenAI (`gpt-4o`). No key? You still get a transparent, clearly
  labelled heuristic plan.
- 📝 **One-click GitHub issue** — opens a genuine issue on the repo containing
  the plan (requires a `GITHUB_TOKEN` with write access).

There is **no fake data, no simulated progress, and no invented metrics** — the
UI only shows what the APIs actually return, and every link is real.

## 🏗️ Tech stack

Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS · Framer Motion ·
GitHub API (Octokit) · OpenAI · optional [Stack Auth](https://stack-auth.com) for login · Vercel.

## ⚡ Quick start

```bash
git clone https://github.com/taranggoyal70/ghost-commit.git
cd ghost-commit
npm install
cp .env.example .env.local   # then fill in keys (all optional to start)
npm run dev
```

Open http://localhost:3000 and paste a public repo URL.

## 🔑 Environment variables

All are optional — the analyzer works on public repos with **zero config**:

| Variable | Required? | Purpose |
| --- | --- | --- |
| `GITHUB_TOKEN` | Optional | Higher rate limits, private repos, and **creating issues**. Without it, public-repo analysis still works (unauthenticated, rate-limited). |
| `OPENAI_API_KEY` | Optional | Enables the AI-generated plan. Without it, a labelled heuristic plan is used. |
| `NEXT_PUBLIC_STACK_PROJECT_ID` / `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY` / `STACK_SECRET_SERVER_KEY` | Optional | Enable sign-in via Stack Auth. Without them, the app runs fully without accounts. |

## 📄 License

MIT
