# You Matter: deployment guide (Vercel + Supabase)

## 1. Supabase (database + auth)
1. Create a project at supabase.com.
2. **SQL Editor** > paste and run `supabase/migrations/001_init.sql`.
3. **Authentication > Providers > Email**: keep "Confirm email" ON. Set a minimum password length of 8+.
4. **Authentication > URL Configuration**: set Site URL to your Vercel URL; add it (and your preview URLs if wanted) to Redirect URLs.
5. **Authentication > SMTP**: configure a real SMTP provider before launch (the built-in mailer is heavily rate-limited).
6. **Settings > API**: copy the Project URL, `anon` key, and `service_role` key.
7. Turn on **daily backups** (Pro plan) or schedule your own `pg_dump`.

## 2. Vercel environment variables (Project Settings > Environment Variables)
| Name | Value | Exposed to browser? |
|---|---|---|
| `VITE_SUPABASE_URL` | Project URL | yes (public by design) |
| `VITE_SUPABASE_ANON_KEY` | anon key | yes (public by design) |
| `SUPABASE_URL` | Project URL | no |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key | **no. Secret.** |
| `GEMINI_API_KEY` | your Gemini key | **no. Secret.** |
| `GEMINI_MODEL` | optional model override | no |

Use a separate Supabase project for Preview deployments, or disable previews, so test data never mixes with real users.

## 3. Deploy
Push to GitHub, import the repo in Vercel (framework: Vite, build `npm run build`, output `dist`). `vercel.json` already sets security headers and API function limits.

## 4. After deploy: verify
- Sign up, confirm the email, sign in, post a public journal, react, comment.
- In a second browser (another account) confirm you can see the public post but NOT the first account's private posts.
- Try posting a comment with "stop whining": it must be rejected.
- Try inserting a comment directly with the anon key (it must fail: no insert policy).
- Run `Delete my account & data` on a test account and confirm the rows are gone.
- Check securityheaders.com and search the built JS for `service_role` (must be absent).

## 5. Running the community responsibly
- **Moderation queue:** review the `reports` table regularly (Supabase > Table editor). To hide a post: set `journals.is_hidden = true`. To block a user: set `profiles.is_banned = true`.
- **Crisis safety:** comments are AI-screened, but journals are not. Plan how you will handle posts that signal immediate danger, and keep verified crisis lines visible (see `src/data/countryHelplines.ts`; verify every number).
- **Legal:** add a Privacy Policy and Terms, state clearly this is peer support and not therapy or emergency care, and review India's DPDP Act obligations for sensitive personal data. Get legal advice before public launch.
- **Spend and abuse:** set a Gemini budget alert; consider Vercel WAF rate-limit rules on `/api/*`.
