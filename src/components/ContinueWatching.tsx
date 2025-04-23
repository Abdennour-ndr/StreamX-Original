'use client';

import { Card, Image, Text, Progress, Button, Group } from '@mantine/core';
import { IconPlayerPlay } from '@tabler/icons-react';
import Link from 'next/link';

interface ContinueWatchingCardProps {
  id: number;
  title: string;
  imageUrl: string;
  progress: number;
  remainingTime: string;
  episodeInfo: string;
}

export function ContinueWatchingCard({
  id,
  title,
  imageUrl,
  progress,
  remainingTime,
  episodeInfo,
}: ContinueWatchingCardProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className="bg-gray-900 hover:scale-105 transition-transform duration-200">
      <Card.Section>
        <div className="relative">
          <Image
            src={imageUrl}
            height={160}
            alt={title}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
            <Link href={`/watch/${id}`}>
              <Button
                variant="filled"
                color="red"
                radius="xl"
                leftSection={<IconPlayerPlay size={20} />}
              >
                Continue Watching
              </Button>
            </Link>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <Progress 
              value={progress} 
              size="sm" 
              color="red"
              className="rounded-none"
            />
          </div>
        </div>
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500} truncate>
          {title}
        </Text>
      </Group>

      <Group justify="space-between">
        <Text size="sm" c="dimmed">
          {remainingTime} remaining
        </Text>
        <Text size="sm" c="dimmed">
          {episodeInfo}
        </Text>
      </Group>
    </Card>
  );
} 