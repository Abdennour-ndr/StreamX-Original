import { Container, Group, Image, Text, Stack, Anchor } from '@mantine/core';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t py-12 mt-auto">
      <Container size="lg">
        <Stack gap="xl">
          {/* Logo and Social Links */}
          <Group justify="space-between" align="center">
            <Link href="/" className="no-underline">
              <Group gap="xs">
                <Image
                  src="/logo.png"
                  alt="StreamX"
                  width={32}
                  height={32}
                />
                <Text
                  size="xl"
                  fw={700}
                  className="text-gradient bg-gradient-to-r from-blue-500 to-cyan-500"
                >
                  StreamX
                </Text>
              </Group>
            </Link>
            <Group gap="lg">
              <Text size="sm" c="dimmed">FOLLOW ON</Text>
              <Anchor href="https://facebook.com" target="_blank">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 opacity-75 hover:opacity-100 transition-opacity"
                >
                  <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
                </svg>
              </Anchor>
              <Anchor href="https://instagram.com" target="_blank">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 opacity-75 hover:opacity-100 transition-opacity"
                >
                  <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
                </svg>
              </Anchor>
            </Group>
          </Group>

          {/* Navigation Links */}
          <Group gap="xl" justify="center">
            <Link href="/feedback" className="no-underline">
              <Text 
                component="span" 
                c="dimmed"
                className="hover:text-white transition-colors"
              >
                Feedback
              </Text>
            </Link>
            <Link href="/help" className="no-underline">
              <Text 
                component="span" 
                c="dimmed"
                className="hover:text-white transition-colors"
              >
                Help
              </Text>
            </Link>
            <Link href="/faq" className="no-underline">
              <Text 
                component="span" 
                c="dimmed"
                className="hover:text-white transition-colors"
              >
                FAQ
              </Text>
            </Link>
          </Group>

          {/* Copyright */}
          <Text ta="center" size="sm" c="dimmed">
            © {new Date().getFullYear()} All rights reserved
          </Text>
        </Stack>
      </Container>
    </footer>
  );
} 