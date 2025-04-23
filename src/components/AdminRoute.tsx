'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { checkUserRole } from '@/lib/userManagement';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        router.push('/auth/login');
        return;
      }

      const role = await checkUserRole(user.uid);
      if (role !== 'superadmin' && role !== 'admin') {
        router.push('/browse');
        return;
      }

      setIsLoading(false);
    };

    checkAccess();
  }, [user, router]);

  if (isLoading) {
    return null;
  }

  return <>{children}</>;
} 