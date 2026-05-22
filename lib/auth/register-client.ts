import type { AuthUser } from '@/lib/auth/login-client';

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  role: 'buyer' | 'seller';
  shopName?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
};

type RegisterSuccess = { ok: true; user: AuthUser };
type RegisterFailure = { ok: false; error: string };

export function parseAuthApiError(data: unknown, fallback: string): string {
  if (data && typeof data === 'object' && 'error' in data && typeof (data as { error: unknown }).error === 'string') {
    return (data as { error: string }).error;
  }
  if (
    data &&
    typeof data === 'object' &&
    'details' in data &&
    data.details &&
    typeof data.details === 'object'
  ) {
    return Object.values(data.details as Record<string, string[]>).flat().join(' ');
  }
  return fallback;
}

export async function registerAccount(input: RegisterInput): Promise<RegisterSuccess | RegisterFailure> {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        name: input.name,
        email: input.email,
        password: input.password,
        role: input.role,
        ...(input.role === 'seller' && input.shopName?.trim() ? { shopName: input.shopName.trim() } : {}),
        ...(input.phone?.trim() ? { phone: input.phone.trim() } : {}),
        ...(input.address ? { address: input.address } : {}),
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const base = parseAuthApiError(data, 'Registration failed');
      const detail =
        data && typeof data === 'object' && 'detail' in data && typeof (data as { detail: unknown }).detail === 'string'
          ? (data as { detail: string }).detail
          : '';
      return { ok: false, error: detail ? `${base} (${detail})` : base };
    }
    if (!data.user) {
      return { ok: false, error: 'Unexpected response from server' };
    }
    return { ok: true, user: data.user as AuthUser };
  } catch {
    return { ok: false, error: 'Network error. Try again.' };
  }
}
