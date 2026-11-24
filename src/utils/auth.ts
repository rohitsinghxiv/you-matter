import { User } from '../types';
import { supabase, authHeader } from '../lib/supabase';

type AuthResult = { success: boolean; user?: User; error?: string; needsConfirmation?: boolean };

async function loadUser(userId: string, email: string): Promise<User | null> {
  const { data } = await supabase
    .from('profiles')
    .select('id, pen_name, avatar_sticker, signature, bio, created_at')
    .eq('id', userId)
    .single();
  if (!data) return null;
  return {
    id: data.id,
    email,
    penName: data.pen_name,
    avatarSticker: data.avatar_sticker,
    signature: data.signature,
    bio: data.bio ?? undefined,
    createdAt: data.created_at,
  };
}

export async function registerUser(
  email: string,
  pass: string,
  penName: string,
  avatarSticker = '🌸',
  signature?: string
): Promise<AuthResult> {
  const e = email.trim().toLowerCase();
  const name = penName.trim();
  if (!e || !pass || !name) return { success: false, error: 'Please provide an email, password, and pen name.' };
  if (pass.length < 8) return { success: false, error: 'Password should be at least 8 characters long.' };
  if (name.length > 40) return { success: false, error: 'Pen name must be 40 characters or fewer.' };

  const { data, error } = await supabase.auth.signUp({
    email: e,
    password: pass,
    options: {
      emailRedirectTo: window.location.origin,
      data: { pen_name: name, avatar_sticker: avatarSticker, signature: (signature?.trim() || `- ${name}`).slice(0, 80) },
    },
  });
  if (error) return { success: false, error: error.message };
  // With email confirmation enabled there is no session until the link is clicked.
  if (!data.session || !data.user) return { success: true, needsConfirmation: true };
  const user = await loadUser(data.user.id, e);
  return user ? { success: true, user } : { success: false, error: 'Could not load your profile.' };
}

export async function loginUser(email: string, pass: string): Promise<AuthResult> {
  const e = email.trim().toLowerCase();
  if (!e || !pass) return { success: false, error: 'Please enter your email and password.' };
  const { data, error } = await supabase.auth.signInWithPassword({ email: e, password: pass });
  if (error || !data.user) return { success: false, error: 'Incorrect email or password.' };
  const user = await loadUser(data.user.id, e);
  return user ? { success: true, user } : { success: false, error: 'Could not load your profile.' };
}

export async function sendPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
    redirectTo: window.location.origin,
  });
  return error ? { success: false, error: error.message } : { success: true };
}

export async function getCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getSession();
  const s = data.session;
  return s ? loadUser(s.user.id, s.user.email || '') : null;
}

export function onAuthChange(cb: (user: User | null) => void): () => void {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    // Defer: calling supabase inside this callback can deadlock.
    setTimeout(async () => {
      cb(session ? await loadUser(session.user.id, session.user.email || '') : null);
    }, 0);
  });
  return () => data.subscription.unsubscribe();
}

export async function logoutUser() {
  await supabase.auth.signOut();
}

export async function deleteAccount(): Promise<{ success: boolean; error?: string }> {
  const res = await fetch('/api/account', { method: 'DELETE', headers: await authHeader() });
  if (!res.ok) return { success: false, error: 'Could not delete your account. Please try again.' };
  await supabase.auth.signOut();
  return { success: true };
}
