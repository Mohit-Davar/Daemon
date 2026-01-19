import { useEffect } from 'react';

import { useAuthStore } from '@/features/auth/store/auth-store';

export function Auth() {
  const { user, login, logout } = useAuthStore();
  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <div className="flex justify-end p-2 items-center gap-2">
      {user ? (
        <>
          <img src={user.photo} alt={user.displayName} className="w-8 h-8 rounded-full" />
          <span>{user.displayName}</span>
          <button onClick={logout} className="bg-red-500 px-4 py-2 rounded text-white">
            Logout
          </button>
        </>
      ) : (
        <button onClick={login} className="bg-blue-500 px-4 py-2 rounded text-white">
          Sign in with GitHub
        </button>
      )}
    </div>
  );
}
