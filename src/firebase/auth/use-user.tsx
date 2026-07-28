'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, type Auth, type User } from 'firebase/auth';
import { useAuth } from '@/firebase/provider';

export interface UseUserResult {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

/**
 * React hook to subscribe to Firebase user authentication state.
 *
 * This hook manages the real-time authentication state of a user. It returns an
 * object containing the user object, a loading state, and any potential errors
 * that occurred during the authentication process.
 *
 * The user state is `null` if no user is signed in. The `isUserLoading` state is
 * initially `true` and becomes `false` once the authentication state has been
 * determined. The `userError` state holds any error encountered during the
 * authentication state change monitoring.
 *
 * @returns {UseUserResult} An object with `user`, `isUserLoading`, and `userError`.
 */
export function useUser(): UseUserResult {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [userError, setUserError] = useState<Error | null>(null);

  useEffect(() => {
    if (!auth) {
      setIsUserLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user);
        setIsUserLoading(false);
      },
      (error) => {
        setUserError(error);
        setIsUserLoading(false);
      }
    );

    return () => unsubscribe();
  }, [auth]);

  return { user, isUserLoading, userError };
}
