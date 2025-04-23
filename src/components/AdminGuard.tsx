'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader, Center, Text } from '@mantine/core';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // التحقق مما إذا كان المستخدم مسؤولاً
    const checkAdmin = () => {
      try {
        const isAdminUser = localStorage.getItem('isAdmin') === 'true';
        console.log('Is admin check:', isAdminUser);
        setIsAdmin(isAdminUser);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  // إذا كان جاري التحميل، اعرض مؤشر التحميل
  if (loading) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader size="xl" />
      </Center>
    );
  }

  // إذا لم يكن المستخدم مسؤولاً، قم بتوجيهه إلى صفحة تسجيل الدخول
  if (!isAdmin) {
    // استخدم setTimeout لتجنب خطأ "Text content does not match server-rendered HTML"
    setTimeout(() => {
      router.push('/admin/login');
    }, 0);
    
    return (
      <Center style={{ height: '100vh' }}>
        <Text>غير مصرح لك بالوصول. جاري التوجيه...</Text>
      </Center>
    );
  }

  // إذا كان المستخدم مسؤولاً، اعرض المحتوى
  return <>{children}</>;
} 