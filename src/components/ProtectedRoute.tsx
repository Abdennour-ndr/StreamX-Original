import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader } from '@mantine/core';
import { User } from '@/types/user';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireSubscription?: boolean;
}

export default function ProtectedRoute({ children, requireSubscription = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/signin');
      } else if (requireSubscription && !user.subscription?.active) {
        router.push('/subscription');
      }
    }
  }, [user, loading, router, requireSubscription]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loader size="xl" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requireSubscription && !user.subscription?.active) {
    return null;
  }

  return <>{children}</>;
} 