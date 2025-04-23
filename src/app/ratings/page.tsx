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
  Rating,
  ActionIcon,
  Badge,
} from '@mantine/core';
import { IconStar, IconTrash } from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

interface RatingItem {
  id: string;
  title: string;
  posterUrl: string;
  type: 'movie' | 'series';
  userRating: number;
  contentRating: number;
  review?: string;
}

export default function RatingsPage() {
  const { user } = useAuth();
  const [ratings] = useState<RatingItem[]>([
    {
      id: '1',
      title: 'Movie Title 1',
      posterUrl: 'https://via.placeholder.com/300x450',
      type: 'movie',
      userRating: 4.5,
      contentRating: 4.2,
      review: 'Great movie with amazing performances!',
    },
    {
      id: '2',
      title: 'Series Title 1',
      posterUrl: 'https://via.placeholder.com/300x450',
      type: 'series',
      userRating: 5,
      contentRating: 4.8,
    },
  ]);

  const handleRemoveRating = (id: string) => {
    // TODO: Implement remove rating logic
    console.log('Remove rating:', id);
  };

  return (
    <ProtectedRoute>
      <Container size="lg" py="xl">
        <Stack spacing="xl">
          <Title order={1}>My Ratings</Title>
          <Text color="dimmed">
            {ratings.length} {ratings.length === 1 ? 'rating' : 'ratings'} in total
          </Text>

          <Grid>
            {ratings.map((item) => (
              <Grid.Col key={item.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Card.Section>
                    <Link href={`/watch/${item.id}`} passHref>
                      <Image
                        component="a"
                        src={item.posterUrl}
                        height={300}
                        alt={item.title}
                        style={{ cursor: 'pointer' }}
                      />
                    </Link>
                  </Card.Section>

                  <Group position="apart" mt="md" mb="xs">
                    <Link href={`/watch/${item.id}`} passHref>
                      <Text
                        component="a"
                        weight={500}
                        lineClamp={1}
                        style={{ cursor: 'pointer' }}
                      >
                        {item.title}
                      </Text>
                    </Link>
                    <Badge color={item.type === 'movie' ? 'blue' : 'green'}>
                      {item.type}
                    </Badge>
                  </Group>

                  <Stack spacing="xs">
                    <Group position="apart">
                      <Text size="sm" color="dimmed">
                        Your Rating
                      </Text>
                      <Group spacing="xs">
                        <IconStar size={16} color="#fab005" />
                        <Text size="sm">{item.userRating}</Text>
                      </Group>
                    </Group>

                    <Group position="apart">
                      <Text size="sm" color="dimmed">
                        Average Rating
                      </Text>
                      <Group spacing="xs">
                        <IconStar size={16} color="#fab005" />
                        <Text size="sm">{item.contentRating}</Text>
                      </Group>
                    </Group>
                  </Stack>

                  {item.review && (
                    <Text size="sm" mt="md" lineClamp={3}>
                      {item.review}
                    </Text>
                  )}

                  <Group position="right" mt="md">
                    <ActionIcon
                      variant="light"
                      color="red"
                      title="Remove Rating"
                      onClick={() => handleRemoveRating(item.id)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Stack>
      </Container>
    </ProtectedRoute>
  );
} 