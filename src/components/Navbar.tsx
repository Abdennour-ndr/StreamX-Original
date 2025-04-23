'use client';

import { 
  AppShell, 
  Group, 
  Button, 
  Text, 
  Container,
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
  Box
} from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

export function Navbar() {
  const { user, signOut } = useAuth();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light');

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Box 
      component="nav" 
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b"
      style={{
        backgroundColor: computedColorScheme === 'dark' 
          ? 'rgba(26, 27, 30, 0.8)' 
          : 'rgba(255, 255, 255, 0.8)',
        borderColor: computedColorScheme === 'dark'
          ? 'var(--mantine-color-dark-4)'
          : 'var(--mantine-color-gray-3)'
      }}
    >
      <Container size="lg" className="h-[60px]">
        <Group justify="space-between" h="100%">
          <Group>
            <Link href="/" className="no-underline">
              <Text 
                size="xl" 
                fw={700} 
                variant="gradient"
                gradient={{ from: 'cyan', to: 'blue', deg: 45 }}
              >
                StreamX
              </Text>
            </Link>
            <Group gap="lg">
              {[
                { href: '/movie', label: 'Movie' },
                { href: '/drama', label: 'Drama' },
                { href: '/music-video', label: 'Music Video' },
                { href: '/live-show', label: 'Live Show' },
                { href: '/comedies', label: 'Comedies' }
              ].map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className="nav-link no-underline"
                >
                  <Text c={computedColorScheme === 'dark' ? 'dimmed' : 'gray.7'}>
                    {item.label}
                  </Text>
                </Link>
              ))}
            </Group>
          </Group>
          <Group>
            <ActionIcon
              variant="light"
              onClick={toggleColorScheme}
              size="lg"
              radius="md"
              aria-label="Toggle color scheme"
            >
              {computedColorScheme === 'dark' ? (
                <IconSun size="1.2rem" stroke={1.5} />
              ) : (
                <IconMoon size="1.2rem" stroke={1.5} />
              )}
            </ActionIcon>
            {user ? (
              <Button 
                variant="light" 
                onClick={signOut}
                className="custom-button"
              >
                Sign Out
              </Button>
            ) : (
              <Link href="/auth/login">
                <Button 
                  variant="light"
                  className="custom-button"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </Group>
        </Group>
      </Container>
    </Box>
  );
} 