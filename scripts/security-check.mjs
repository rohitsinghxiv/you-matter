// You Matter: live security check.
// Uses TWO throwaway test accounts (email-confirmed). Needs only the PUBLIC key, never the secret key.
//
//   SUPABASE_URL=https://xxxx.supabase.co \
//   SUPABASE_ANON_KEY=sb_publishable_... \
//   APP_URL=https://your-app.vercel.app \
//   TEST_A_EMAIL=... TEST_A_PASSWORD=... TEST_B_EMAIL=... TEST_B_PASSWORD=... \
//   node scripts/security-check.mjs
//
// Optional: DELETE_B=1 also tests account deletion (this PERMANENTLY deletes test account B).
import { createClient } from '@supabase/supabase-js';

const env = process.env;
for (const k of ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'TEST_A_EMAIL', 'TEST_A_PASSWORD', 'TEST_B_EMAIL', 'TEST_B_PASSWORD']) {
  if (!env[k]) { console.error(`Missing env var: ${k}`); process.exit(2); }
}
const APP = (env.APP_URL || '').replace(/\/$/, '');
const mk = () => createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, { auth: { persistSession: false, autoRefreshToken: false } });

let failed = 0;
const check = (name, ok, detail = '') => {
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${!ok && detail ? `\n        -> ${detail}` : ''}`);
};
const blocked = (r) => !!r.error || (Array.isArray(r.data) && r.data.length === 0); // denied OR touched nothing
const j = (x) => JSON.stringify(x)?.slice(0, 200);

async function login(email, password) {
  const c = mk();
  const { data, error } = await c.auth.signInWithPassword({ email, password });
  if (error) { console.error(`Cannot sign in ${email}: ${error.message}`); process.exit(2); }
  return { c, id: data.user.id, token: data.session.access_token };
}

const A = await login(env.TEST_A_EMAIL, env.TEST_A_PASSWORD);
const B = await login(env.TEST_B_EMAIL, env.TEST_B_PASSWORD);
const anon = mk();
console.log(`\nSigned in as A (${A.id.slice(0, 8)}) and B (${B.id.slice(0, 8)})\n`);

const base = { reflection_body: 'security test', current_struggle: 'security test' };
const mkJournal = async (who, is_public, title) => {
  const r = await who.c.from('journals').insert({ user_id: who.id, title, is_public, ...base }).select().single();
  if (r.error) { console.error('Setup failed creating journal:', r.error.message); process.exit(2); }
  return r.data.id;
};
const pub = await mkJournal(A, true, 'SECTEST public');
const priv = await mkJournal(A, false, 'SECTEST private');
const bOwn = await mkJournal(B, true, 'SECTEST B own');

console.log('--- Reading data ---');
check('B can read A\'s PUBLIC journal', (await B.c.from('journals').select('id').eq('id', pub)).data?.length === 1);
check('B cannot read A\'s PRIVATE journal', (await B.c.from('journals').select('id').eq('id', priv)).data?.length === 0);
check('Logged-out visitor can read public journal', (await anon.from('journals').select('id').eq('id', pub)).data?.length === 1);
check('Logged-out visitor cannot read private journal', (await anon.from('journals').select('id').eq('id', priv)).data?.length === 0);
const prof = await anon.from('profiles').select('*').eq('id', A.id).single();
check('Public profile does not expose email', prof.data && !('email' in prof.data), j(prof.data));

console.log('\n--- Tampering with other people\'s data ---');
let r = await B.c.from('journals').update({ title: 'HACKED' }).eq('id', pub).select();
check('B cannot edit A\'s journal', blocked(r), j(r));
check('A\'s journal title unchanged', (await A.c.from('journals').select('title').eq('id', pub).single()).data?.title === 'SECTEST public');
r = await B.c.from('journals').delete().eq('id', pub).select();
check('B cannot delete A\'s journal', blocked(r), j(r));
check('A\'s journal still exists', (await A.c.from('journals').select('id').eq('id', pub)).data?.length === 1);
r = await B.c.from('journals').insert({ user_id: A.id, title: 'forged', ...base });
check('B cannot create a journal AS A', !!r.error, j(r));
r = await B.c.from('profiles').update({ pen_name: 'HACKED' }).eq('id', A.id).select();
check('B cannot edit A\'s profile', blocked(r), j(r));

console.log('\n--- Moderator-only fields ---');
r = await B.c.from('journals').update({ is_hidden: true }).eq('id', bOwn).select();
check('User cannot hide their own journal (is_hidden)', !!r.error || r.data?.[0]?.is_hidden !== true, j(r));
r = await B.c.from('profiles').update({ is_banned: true }).eq('id', B.id).select();
check('User cannot change own is_banned', !!r.error || r.data?.[0]?.is_banned !== true, j(r));
r = await B.c.from('profiles').update({ is_banned: false }).eq('id', B.id).select(); // restore in case
r = await B.c.from('journals').insert({ user_id: B.id, title: 'x', is_hidden: true, ...base });
check('User cannot create a pre-hidden journal', !!r.error, j(r));

console.log('\n--- Comments must go through the server ---');
r = await B.c.from('comments').insert({ journal_id: pub, user_id: B.id, content: 'direct insert', ai_moderation: { isApproved: true } });
check('Direct comment insert from the browser is refused', !!r.error, j(r));
r = await anon.from('comments').insert({ journal_id: pub, user_id: A.id, content: 'anon insert' });
check('Logged-out comment insert is refused', !!r.error, j(r));

console.log('\n--- Reactions ---');
r = await B.c.from('reactions').insert({ journal_id: pub, user_id: B.id, emoji: '🤍' });
check('B can react to a public journal', !r.error, j(r));
r = await B.c.from('reactions').insert({ journal_id: priv, user_id: B.id, emoji: '🤍' });
check('B cannot react to A\'s private journal', !!r.error, j(r));
r = await B.c.from('reactions').insert({ journal_id: pub, user_id: A.id, emoji: '🫂' });
check('B cannot react AS A', !!r.error, j(r));
r = await B.c.from('reactions').insert({ journal_id: bOwn, user_id: B.id, emoji: '💀' });
check('Invalid emoji is refused', !!r.error, j(r));

console.log('\n--- Private data ---');
await A.c.from('user_steps').upsert({ user_id: A.id, step_id: 'sectest', completed: true });
check('B cannot read A\'s coping-step progress', (await B.c.from('user_steps').select('*').eq('user_id', A.id)).data?.length === 0);
r = await B.c.from('reports').insert({ reporter_id: B.id, target_type: 'journal', target_id: pub, reason: 'security test' });
check('B can file a report', !r.error, j(r));
r = await B.c.from('reports').select('*');
check('Users cannot read the reports table', !!r.error || r.data?.length === 0, j(r));

console.log('\n--- Server API ---');
if (!APP) {
  console.log('SKIP  set APP_URL to test /api/comments and /api/account');
} else {
  const post = (body, token) => fetch(`${APP}/api/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
  }).then(async (res) => ({ status: res.status, body: await res.json().catch(() => ({})) }));

  let x = await post({ journalId: pub, content: 'You matter.' });
  check('Comment API rejects logged-out callers (401)', x.status === 401, j(x));
  x = await post({ journalId: 'not-a-uuid', content: 'hi' }, B.token);
  check('Comment API rejects invalid post id (400)', x.status === 400, j(x));
  x = await post({ journalId: priv, content: 'You matter, truly.' }, B.token);
  check('Comment API refuses private journals (404)', x.status === 404, j(x));
  x = await post({ journalId: pub, content: 'stop whining' }, B.token);
  check('Unkind comment is rejected', x.body.success === false, j(x));
  x = await post({ journalId: pub, content: 'Check out https://spam.example now' }, B.token);
  check('Comment containing a link is rejected', x.body.success === false, j(x));
  x = await post({ journalId: pub, content: 'Sending you warmth. You are not alone, and your feelings are valid.' }, B.token);
  if (x.status === 503) console.log('WARN  Kind comment got 503: Gemini key/model not working (moderation fails closed). Check GEMINI_API_KEY and GEMINI_MODEL.');
  else check('Kind comment is accepted and stored', x.body.success === true, j(x));
  const cid = x.body?.comment?.id;
  if (cid) {
    check('Stored comment is visible to the author of the journal', (await A.c.from('comments').select('id').eq('id', cid)).data?.length === 1);
    r = await A.c.from('comments').delete().eq('id', cid).select();
    check('Journal owner can delete a comment on their journal', r.data?.length === 1, j(r));
  }
  x = await fetch(`${APP}/api/account`, { method: 'DELETE' });
  check('Account-delete API rejects logged-out callers (401)', x.status === 401);

  const headers = (await fetch(APP)).headers;
  check('Security headers present (CSP, HSTS, nosniff)', !!headers.get('content-security-policy') && !!headers.get('strict-transport-security') && headers.get('x-content-type-options') === 'nosniff');
}

console.log('\n--- Cleanup ---');
await A.c.from('journals').delete().in('id', [pub, priv]);
await B.c.from('journals').delete().eq('id', bOwn);
await A.c.from('user_steps').delete().eq('step_id', 'sectest');
console.log('Test journals removed (their comments and reactions cascade).');

if (env.DELETE_B === '1' && APP) {
  console.log('\n--- Account deletion (DELETE_B=1) ---');
  const res = await fetch(`${APP}/api/account`, { method: 'DELETE', headers: { Authorization: `Bearer ${B.token}` } });
  check('Delete-account API succeeds for B', res.status === 200, `status ${res.status}`);
  check('B\'s profile is gone', (await A.c.from('profiles').select('id').eq('id', B.id)).data?.length === 0);
  const again = await mk().auth.signInWithPassword({ email: env.TEST_B_EMAIL, password: env.TEST_B_PASSWORD });
  check('B can no longer sign in', !!again.error);
}

console.log(`\n${failed === 0 ? 'ALL CHECKS PASSED' : `${failed} CHECK(S) FAILED`}`);
process.exit(failed === 0 ? 0 : 1);
