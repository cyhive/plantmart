export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  phone?: string;
  shopName?: string;
};

type LoginSuccess = { ok: true; user: AuthUser };
type LoginFailure = { ok: false; error: string };

export async function loginWithEmail(email: string, password: string): Promise<LoginSuccess | LoginFailure> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, error: typeof data.error === 'string' ? data.error : 'Sign in failed' };
    }
    if (!data.user) {
      return { ok: false, error: 'Unexpected response from server' };
    }
    return { ok: true, user: data.user as AuthUser };
  } catch {
    return { ok: false, error: 'Network error. Try again.' };
  }
}

export async function clearAuthSession() {
  try {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
  } catch {
    // Ignore logout failures after a rejected role-specific login.
  }
}

export async function loginWithRole(
  email: string,
  password: string,
  expectedRole: AuthUser['role'],
  wrongRoleMessage: string,
): Promise<LoginSuccess | LoginFailure> {
  const result = await loginWithEmail(email, password);
  if (!result.ok) return result;
  if (result.user.role !== expectedRole) {
    await clearAuthSession();
    return { ok: false, error: wrongRoleMessage };
  }
  return result;
}

/** Admin portal login — uses /api/admin/auth/login (non-admins never receive a session). */
export async function loginAsAdmin(email: string, password: string): Promise<LoginSuccess | LoginFailure> {
  try {
    const res = await fetch('/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, error: typeof data.error === 'string' ? data.error : 'Invalid email or password' };
    }
    if (!data.user) {
      return { ok: false, error: 'Unexpected response from server' };
    }
    return { ok: true, user: data.user as AuthUser };
  } catch {
    return { ok: false, error: 'Network error. Try again.' };
  }
}
