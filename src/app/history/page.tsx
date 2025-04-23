'use client';

import { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Stack,
  Table,
  Group,
  Button,
  Badge,
  ActionIcon,
} from '@mantine/core';
import { IconPlayerPlay, IconTrash, IconClock } from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

interface HistoryItem {
  id: string;
  title: string;
  type: 'movie' | 'series';
  duration: string;
  progress: number;
  lastWatched: string;
}

export default function HistoryPage() {
  const { user } = useAuth();
  const [history] = useState<HistoryItem[]>([
    {
      id: '1',
      title: 'Movie Title 1',
      type: 'movie',
      duration: '2h 15m',
      progress: 75,
      lastWatched: '2 hours ago',
    },
    {
      id: '2',
      title: 'Series Title 1',
      type: 'series',
      duration: '45m',
      progress: 100,
      lastWatched: '1 day ago',
    },
  ]);

  const handleRemoveFromHistory = (id: string) => {
    // TODO: Implement remove from history logic
    console.log('Remove from history:', id);
  };

  const handleClearHistory = () => {
    // TODO: Implement clear history logic
    console.log('Clear history');
  };

  return (
    <ProtectedRoute>
      <Container size="lg" py="xl">
        <Stack spacing="xl">
          <Group position="apart">
            <Title order={1}>Watch History</Title>
            <Button
              variant="light"
              color="red"
              leftIcon={<IconTrash size={16} />}
              onClick={handleClearHistory}
            >
              Clear History
            </Button>
          </Group>

          <Text color="dimmed">
            {history.length} {history.length === 1 ? 'item' : 'items'} in your history
          </Text>

          <Table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Progress</th>
                <th>Last Watched</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id}>
                  <td>
                    <Link href={`/watch/${item.id}`} passHref>
                      <Text
                        component="a"
                        weight={500}
                        style={{ cursor: 'pointer' }}
                      >
                        {item.title}
                      </Text>
                    </Link>
                  </td>
                  <td>
                    <Badge color={item.type === 'movie' ? 'blue' : 'green'}>
                      {item.type}
                    </Badge>
                  </td>
                  <td>
                    <Group spacing="xs">
                      <IconClock size={16} color="#228be6" />
                      <Text>{item.progress}%</Text>
                    </Group>
                  </td>
                  <td>{item.lastWatched}</td>
                  <td>
                    <Group spacing="xs">
                      <Link href={`/watch/${item.id}`} passHref>
                        <ActionIcon
                          component="a"
                          variant="light"
                          color="blue"
                          title="Continue Watching"
                        >
                          <IconPlayerPlay size={16} />
                        </ActionIcon>
                      </Link>
                      <ActionIcon
                        variant="light"
                        color="red"
                        title="Remove from History"
                        onClick={() => handleRemoveFromHistory(item.id)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Stack>
      </Container>
    </ProtectedRoute>
  );
} 