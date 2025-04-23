'use client';

import { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Stack,
  Grid,
  Card,
  Group,
  Button,
  Image,
  Badge,
} from '@mantine/core';
import { IconPlayerPlay, IconTrash } from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

interface WatchlistItem {
  id: string;
  title: string;
  posterUrl: string;
  type: 'movie' | 'series';
  duration: string;
  rating: number;
}

export default function WatchlistPage() {
  const { user } = useAuth();
  const [watchlist] = useState<WatchlistItem[]>([
    {
      id: '1',
      title: 'Movie Title 1',
      posterUrl: 'https://via.placeholder.com/300x450',
      type: 'movie',
      duration: '2h 15m',
      rating: 4.5,
    },
    {
      id: '2',
      title: 'Series Title 1',
      posterUrl: 'https://via.placeholder.com/300x450',
      type: 'series',
      duration: '45m',
      rating: 4.2,
    },
  ]);

  const handleRemoveFromWatchlist = (id: string) => {
    // TODO: Implement remove from watchlist logic
    console.log('Remove from watchlist:', id);
  };

  return (
    <ProtectedRoute>
      <Container size="lg" py="xl">
        <Stack spacing="xl">
          <Title order={1}>My Watchlist</Title>
          <Text color="dimmed">
            {watchlist.length} {watchlist.length === 1 ? 'item' : 'items'} in your watchlist
          </Text>

          <Grid>
            {watchlist.map((item) => (
              <Grid.Col key={item.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Card.Section>
                    <div style={{ position: 'relative' }}>
                      <Image
                        src={item.posterUrl}
                        height={300}
                        alt={item.title}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          opacity: 0,
                          transition: 'opacity 0.2s',
                        }}
                        className="hover:opacity-100"
                      >
                        <Link href={`/watch/${item.id}`} passHref>
                          <Button
                            variant="white"
                            leftIcon={<IconPlayerPlay size={16} />}
                          >
                            Watch Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card.Section>

                  <Group position="apart" mt="md" mb="xs">
                    <Text weight={500} lineClamp={1}>
                      {item.title}
                    </Text>
                    <Badge color={item.type === 'movie' ? 'blue' : 'green'}>
                      {item.type}
                    </Badge>
                  </Group>

                  <Group position="apart">
                    <Text size="sm" color="dimmed">
                      {item.duration}
                    </Text>
                    <Group spacing="xs">
                      <IconStar size={16} color="#fab005" />
                      <Text size="sm">{item.rating}</Text>
                    </Group>
                  </Group>

                  <Button
                    variant="light"
                    color="red"
                    fullWidth
                    mt="md"
                    radius="md"
                    leftIcon={<IconTrash size={16} />}
                    onClick={() => handleRemoveFromWatchlist(item.id)}
                  >
                    Remove
                  </Button>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Stack>
      </Container>
    </ProtectedRoute>
  );
} 