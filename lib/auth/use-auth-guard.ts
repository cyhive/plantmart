'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, type User } from '@/context/AuthContext';

type UserRole = User['role'];

/** Redirect to login when session is missing or role does not match. */
export function useRequireRole(role: UserRole, loginPath: string) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== role) {
      router.replace(loginPath);
    }
  }, [user, loading, role, loginPath, router]);

  const authorized = !loading && !!user && user.role === role;
  return { user, loading, authorized };
}

/** Redirect away from login/register when already signed in with the expected role. */
export function useRedirectIfRole(role: UserRole, destination: string) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (user?.role === role) {
      router.replace(destination);
    }
  }, [user, loading, role, destination, router]);
}
