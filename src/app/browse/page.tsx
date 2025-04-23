'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Container, Title, Text, SimpleGrid, Group, Stack } from '@mantine/core';
import { Navbar } from '@/components/Navbar';
import { VideoCard } from '@/components/VideoCard';
import { ContinueWatchingCard } from '@/components/ContinueWatching';
import { NewReleaseCard } from '@/components/NewReleases';

const popularContent = [
  {
    id: 1,
    title: 'WandaVision',
    imageUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=500&auto=format&fit=crop&q=60',
    rating: 4.8,
    duration: '45m',
    type: 'series' as const,
    year: 2023,
  },
  {
    id: 2,
    title: 'Ant-Man',
    imageUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500&auto=format&fit=crop&q=60',
    rating: 4.5,
    duration: '2h 5m',
    type: 'movie' as const,
    year: 2023,
  },
];

const continueWatching = [
  {
    id: 1,
    title: 'Stranger Things',
    imageUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0',
    progress: 45,
    remainingTime: '35m',
    episodeInfo: 'S4:E5 - The Nina Project',
  },
];

const newReleases = [
  {
    id: 1,
    title: 'The Last of Us',
    imageUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0',
    rating: 4.9,
    releaseDate: '2024-01-15',
    type: 'series' as const,
    genre: 'Drama',
  },
];

export default function BrowsePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return null; // or a loading spinner
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white">
        <Container size="lg" className="py-8">
          <Stack gap="xl">
            {continueWatching.length > 0 && (
              <section>
                <Title order={2} className="mb-4">Continue Watching</Title>
                <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
                  {continueWatching.map((item) => (
                    <ContinueWatchingCard key={item.id} {...item} />
                  ))}
                </SimpleGrid>
              </section>
            )}

            <section>
              <Title order={2} className="mb-4">Popular Content</Title>
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
                {popularContent.map((item) => (
                  <VideoCard key={item.id} {...item} />
                ))}
              </SimpleGrid>
            </section>

            <section>
              <Title order={2} className="mb-4">New Releases</Title>
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
                {newReleases.map((item) => (
                  <NewReleaseCard key={item.id} {...item} />
                ))}
              </SimpleGrid>
            </section>
          </Stack>
        </Container>
      </main>
    </>
  );
} 