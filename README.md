# You Matter

A peer-support journaling app where people can write privately or share publicly, receive kind words from others, and find coping exercises and crisis helplines.

> **Not therapy or emergency care.** You Matter is a peer-support space. If you or someone near you is in immediate danger, contact local emergency services or a crisis line in your country.

**Live demo:** _add your Vercel URL here_

## Features

- **Journal entries** with mood, current struggle, coping mechanism, small wins, and the advice you'd like to receive. Each entry can be private (only you) or public.
- **Community feed** of public entries, with one reaction per person (🤍 🫂 🕯️ 🌱 ✨).
- **Moderated comments.** Every comment is checked before it is published. Dismissive, mocking, or unsafe comments are rejected, and the system rejects anything it cannot check.
- **Coping steps:** guided grounding, breathing, and action steps, plus custom steps you can add. Progress is saved to your account.
- **Country helpline directory** for finding local support.
- **Calm music player** and light/dark themes.
- **Report button** on posts, **account and data deletion**, and moderator controls to hide posts or ban users.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite 6, Tailwind CSS 4 |
| API | Vercel serverless functions (`/api`) |
| Database and auth | Supabase (PostgreSQL, Auth, Row Level Security) |
| AI moderation | Google Gemini via `@google/genai` |
| Hosting | Vercel |

## How it is built

```
Browser (React)
  ├── reads/writes journals, reactions, steps ──► Supabase directly
  │                                                 protected by Row Level Security
  └── posts comments, deletes account ───────────► /api (Vercel function)
                                                     ├─ verifies the user's login token
                                                     ├─ rate-limits (stored in the database)
                                                     ├─ moderates with Gemini (fails closed)
                                                     └─ writes with the server-only service key
```

The browser only ever holds the public Supabase key. The service-role key and the Gemini key exist only in server environment variables.

## Security model

- **Row Level Security** on every table. Private journals are readable only by their author. Users cannot edit or delete anyone else's data.
- **Comments cannot be inserted from the browser.** The table has no insert permission for users, so the moderated API route is the only way in.
- **Moderator-only fields** (`is_hidden`, `is_banned`) are protected by database triggers.
- **Database-level limits:** journal creation is limited per day, and comment rate limits are stored in the database so they hold across serverless instances.
- **Security headers:** CSP, HSTS, `X-Frame-Options`, `nosniff`, and a restrictive Permissions-Policy (see `vercel.json`).
- **Prompt-injection hardening:** user text is fenced as untrusted data in the moderation prompt.
- **Privacy:** emails stay in Supabase Auth and are never copied to public profile data. Users can delete their account and all their data.

### Automated check against a live deployment

`scripts/security-check.mjs` signs in as two test accounts and verifies, among other things:

- one user cannot read, edit, delete, or impersonate another user's content
- moderator-only fields cannot be changed by users
- comments cannot be inserted directly, and the comment API rejects bad requests, unkind comments, and links

```bash
# Create two throwaway test accounts and confirm their emails first.
# Put these in .env.test (it is git-ignored) and delete the file afterwards.
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_ANON_KEY=sb_publishable_...
APP_URL=https://your-app.vercel.app
TEST_A_EMAIL=...
TEST_A_PASSWORD=...
TEST_B_EMAIL=...
TEST_B_PASSWORD=...
```

```bash
node --env-file=.env.test scripts/security-check.mjs
# DELETE_B=1 also tests account deletion (permanently deletes test account B)
```

Requires Node 20.6+.

## Getting started

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run `supabase/migrations/001_init.sql`. It creates the tables, policies, triggers, and permissions.
3. Under **Authentication → Providers → Email**, keep **Confirm email** on.
4. Under **Authentication → URL Configuration**, set your site URL and add it to the redirect URLs.
5. For real use, configure your own email provider under **Authentication → SMTP**. The built-in sender is heavily rate-limited.

### 2. Environment variables

Copy `.env.example` and fill it in. On Vercel, add these under **Project Settings → Environment Variables**.

| Variable | Exposed to browser | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` | yes | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | yes | Public (publishable) key |
| `SUPABASE_URL` | no | Same URL, for the server |
| `SUPABASE_SERVICE_ROLE_KEY` | **never** | Secret key, bypasses RLS |
| `GEMINI_API_KEY` | **never** | Moderation |
| `GEMINI_MODEL` | no | Optional override (default `gemini-3.5-flash-lite`) |

Variables starting with `VITE_` are built into the site. Redeploy after changing them.

### 3. Run locally

```bash
npm install
npx vercel dev      # runs the frontend and the /api functions together
```

`npm run dev` starts only the frontend, so comments and account deletion will not work without the API.

### 4. Deploy

Push to GitHub and import the repo in Vercel (framework: Vite, build `npm run build`, output `dist`). See `DEPLOY.md` for the full checklist.

## Project structure

```
api/                  Vercel serverless functions
  comments.ts         moderated comment creation
  account.ts          account and data deletion
  inspire-digest.ts   AI writing prompts (login required)
lib/                  server-only helpers (Supabase admin, Gemini, moderation)
src/
  components/         UI (journal cards, editor, steps, helplines, music)
  utils/auth.ts       Supabase Auth wrapper
  utils/data.ts       database access and default coping steps
  data/               country helpline directory
supabase/migrations/  database schema, RLS policies, grants
scripts/              live security check
vercel.json           security headers and function settings
```

## Known limitations

- **Public journals are not AI-moderated**, only comments are. The protection for journals is the report button plus manual review of the `reports` table. A real launch needs a plan for who reviews reports and how quickly.
- **Helpline numbers must be verified** before relying on them (`src/data/countryHelplines.ts`).
- **No crisis detection** on posts yet. People in immediate danger need professional help, and the app does not automatically escalate.
- The in-memory API rate limit on `inspire-digest` is per serverless instance. Use Vercel WAF rules or Upstash Redis for stronger limits.
- Before public use, add a privacy policy and terms, and review data-protection law (for example India's DPDP Act or GDPR) because journal text is sensitive personal data.

## Origin

The first version was generated in Google AI Studio with all data stored in the browser. It was reviewed and rebuilt with a real database, real authentication, server-side moderation, and security tests.

## License

Released under the [MIT License](LICENSE). The software is provided as is, with no warranty. You are responsible for how you deploy and operate it, especially for a service that handles sensitive personal data.