import { useState } from 'react'
import { Group, Button, Container, Text, Menu, Avatar, ActionIcon, Burger } from '@mantine/core'
import Link from 'next/link'
import { useAuth } from '@/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/providers/ThemeProvider'
import { IconSun, IconMoonStars, IconLogout, IconUser, IconSettings } from '@tabler/icons-react'

export default function Navigation() {
  const { user, logout } = useAuth()
  const { colorScheme, toggleColorScheme } = useTheme()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }

  return (
    <div className="bg-black text-white">
      <Container size="xl">
        <Group justify="space-between" className="py-4">
          <Link href="/" className="text-2xl font-bold text-white no-underline">
            StreamX
          </Link>

          {/* Desktop Navigation */}
          <Group className="hidden md:flex">
            {user ? (
              <>
                <Link href="/browse" className="text-white no-underline">
                  Browse
                </Link>
                <Link href="/my-list" className="text-white no-underline">
                  My List
                </Link>
                <Menu
                  opened={isMenuOpen}
                  onChange={setIsMenuOpen}
                  position="bottom-end"
                >
                  <Menu.Target>
                    <Avatar
                      src={user.photoURL}
                      alt={user.email}
                      radius="xl"
                      size="md"
                      className="cursor-pointer"
                    />
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item component={Link} href="/account" leftSection={<IconUser size={14} />}>
                      Account Settings
                    </Menu.Item>
                    <Menu.Item component={Link} href="/subscription" leftSection={<IconSettings size={14} />}>
                      Subscription
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item onClick={handleLogout} color="red" leftSection={<IconLogout size={14} />}>
                      Sign Out
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="subtle" color="gray">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
            <ActionIcon
              variant="default"
              onClick={toggleColorScheme}
              size="lg"
              aria-label="Toggle color scheme"
            >
              {colorScheme === 'dark' ? (
                <IconSun size={18} />
              ) : (
                <IconMoonStars size={18} />
              )}
            </ActionIcon>
          </Group>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Burger
              opened={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              color="white"
            />
          </div>
        </Group>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4">
            <Group direction="column" spacing="md">
              {user ? (
                <>
                  <Link href="/browse" className="text-white no-underline">
                    Browse
                  </Link>
                  <Link href="/my-list" className="text-white no-underline">
                    My List
                  </Link>
                  <Link href="/account" className="text-white no-underline">
                    Account Settings
                  </Link>
                  <Link href="/subscription" className="text-white no-underline">
                    Subscription
                  </Link>
                  <Button
                    variant="subtle"
                    color="red"
                    onClick={handleLogout}
                    leftSection={<IconLogout size={14} />}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="subtle" color="gray" fullWidth>
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button fullWidth>Get Started</Button>
                  </Link>
                </>
              )}
              <ActionIcon
                variant="default"
                onClick={toggleColorScheme}
                size="lg"
                aria-label="Toggle color scheme"
              >
                {colorScheme === 'dark' ? (
                  <IconSun size={18} />
                ) : (
                  <IconMoonStars size={18} />
                )}
              </ActionIcon>
            </Group>
          </div>
        )}
      </Container>
    </div>
  )
} 