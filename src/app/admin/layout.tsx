'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Text, 
  Group, 
  Button, 
  Stack, 
  Avatar, 
  Menu, 
  UnstyledButton
} from '@mantine/core';
import { 
  IconLayoutDashboard, 
  IconUsers, 
  IconAd2, 
  IconTicket, 
  IconSettings, 
  IconLogout,
  IconChevronDown,
  IconBell,
  IconSearch,
  IconBrain
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [opened, { toggle }] = useDisclosure();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkAdmin = async () => {
      try {
        const adminStatus = localStorage.getItem('isAdmin');
        if (!adminStatus) {
          router.push('/admin/login');
          return;
        }
        setIsAdmin(true);
      } catch (error) {
        console.error('Error checking admin status:', error);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  const handleLogout = () => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem('isAdmin');
      router.push('/admin/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)'
      }}>
        <div style={{ 
          padding: '2rem',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '1rem',
          backdropFilter: 'blur(10px)'
        }}>
          <Text size="xl" c="white">جاري التحميل...</Text>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ 
        height: '60px',
        background: 'linear-gradient(90deg, #1a1a1a 0%, #2a2a2a 100%)'
      }}>
        <Group justify="space-between" p="xs">
          <Text size="xl" fw={700} c="white">لوحة تحكم StreamX</Text>
          <Group>
            <Button variant="subtle" leftSection={<IconSearch size={20} />} c="white">
              بحث
            </Button>
            <Button variant="subtle" leftSection={<IconBell size={20} />} c="white">
              الإشعارات
            </Button>
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <UnstyledButton>
                  <Group>
                    <Avatar size="sm" radius="xl" color="blue">A</Avatar>
                    <IconChevronDown size={16} />
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item leftSection={<IconSettings size={14} />}>
                  الإعدادات
                </Menu.Item>
                <Menu.Item leftSection={<IconLogout size={14} />} color="red" onClick={handleLogout}>
                  تسجيل الخروج
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </header>
      
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <aside style={{ 
          width: '300px',
          background: 'linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 100%)',
          overflowY: 'auto'
        }}>
          <Stack gap="xs" p="md" h="100%">
            <Group mb="xl">
              <Avatar size="lg" radius="xl" color="blue">A</Avatar>
              <div>
                <Text size="sm" c="white" fw={500}>المدير</Text>
                <Text size="xs" c="dimmed">admin@streamx.com</Text>
              </div>
            </Group>

            <Button
              variant="light"
              leftSection={<IconLayoutDashboard size={20} />}
              onClick={() => router.push('/admin')}
              fullWidth
              justify="flex-start"
              size="lg"
            >
              لوحة التحكم
            </Button>

            <Button
              variant="light"
              leftSection={<IconBrain size={20} />}
              onClick={() => router.push('/admin/ai-insights')}
              fullWidth
              justify="flex-start"
              size="lg"
            >
              رؤى الذكاء الاصطناعي
            </Button>

            <Button
              variant="light"
              leftSection={<IconUsers size={20} />}
              onClick={() => router.push('/admin/users')}
              fullWidth
              justify="flex-start"
              size="lg"
            >
              إدارة المستخدمين
            </Button>

            <Button
              variant="light"
              leftSection={<IconAd2 size={20} />}
              onClick={() => router.push('/admin/ads')}
              fullWidth
              justify="flex-start"
              size="lg"
            >
              الإعلانات
            </Button>

            <Button
              variant="light"
              leftSection={<IconTicket size={20} />}
              onClick={() => router.push('/admin/support')}
              fullWidth
              justify="flex-start"
              size="lg"
            >
              الدعم الفني
            </Button>

            <Button
              variant="light"
              leftSection={<IconSettings size={20} />}
              onClick={() => router.push('/admin/settings')}
              fullWidth
              justify="flex-start"
              size="lg"
            >
              الإعدادات
            </Button>

            <div style={{ marginTop: 'auto' }}>
              <Button
                variant="light"
                color="red"
                leftSection={<IconLogout size={20} />}
                onClick={handleLogout}
                fullWidth
                justify="flex-start"
                size="lg"
              >
                تسجيل الخروج
              </Button>
            </div>
          </Stack>
        </aside>
        
        <main style={{ 
          flex: 1,
          padding: '2rem',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
          overflowY: 'auto'
        }}>
          {children}
        </main>
      </div>
    </div>
  );
} 