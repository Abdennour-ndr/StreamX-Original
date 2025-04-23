'use client';

import { Card, Image, Text, Badge, Button, Group } from '@mantine/core';
import { IconStar, IconPlayerPlay } from '@tabler/icons-react';
import Link from 'next/link';

interface VideoCardProps {
  id: number;
  title: string;
  imageUrl: string;
  rating: number;
  duration: string;
  type: 'movie' | 'series';
  year: number;
}

export function VideoCard({ id, title, imageUrl, rating, duration, type, year }: VideoCardProps) {
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
                Watch Now
              </Button>
            </Link>
          </div>
        </div>
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500} truncate>
          {title}
        </Text>
        <Badge color="yellow" variant="light">
          <Group gap={4}>
            <IconStar size={12} />
            {rating}
          </Group>
        </Badge>
      </Group>

      <Group justify="space-between">
        <Text size="sm" c="dimmed">
          {duration}
        </Text>
        <Group gap={8}>
          <Badge color={type === 'movie' ? 'blue' : 'green'} variant="light">
            {type}
          </Badge>
          <Badge color="gray" variant="light">
            {year}
          </Badge>
        </Group>
      </Group>
    </Card>
  );
} 