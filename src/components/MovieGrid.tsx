import { SimpleGrid, Title, Button, Group } from '@mantine/core';
import { VideoCard } from './VideoCard';

interface ContentItem {
  id: number;
  title: string;
  imageUrl: string;
  rating: number;
  duration: string;
  type: 'series' | 'movie';
  year: number;
}

const popularContent: ContentItem[] = [
  {
    id: 1,
    title: 'The Mandalorian',
    imageUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0',
    rating: 4.8,
    duration: '45m',
    type: 'series',
    year: 2023
  },
  {
    id: 2,
    title: 'Inception',
    imageUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0',
    rating: 4.9,
    duration: '2h 28m',
    type: 'movie',
    year: 2010
  },
  {
    id: 3,
    title: 'Breaking Bad',
    imageUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0',
    rating: 4.9,
    duration: '45m',
    type: 'series',
    year: 2008
  },
  {
    id: 4,
    title: 'The Dark Knight',
    imageUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0',
    rating: 4.8,
    duration: '2h 32m',
    type: 'movie',
    year: 2008
  }
];

export function MovieGrid() {
  return (
    <>
      {/* Most Popular Section */}
      <div className="mb-12">
        <Group justify="space-between" mb="xl">
          <Title order={2} className="text-gradient">الأكثر مشاهدة</Title>
          <Button variant="subtle" className="custom-button">عرض الكل</Button>
        </Group>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
          {popularContent.map((content) => (
            <VideoCard
              key={content.id}
              title={content.title}
              imageUrl={content.imageUrl}
              rating={content.rating}
              duration={content.duration}
              type={content.type}
              year={content.year}
            />
          ))}
        </SimpleGrid>
      </div>

      {/* New Releases Section */}
      <div className="mb-12">
        <Group justify="space-between" mb="xl">
          <Title order={2} className="text-gradient">أحدث الإصدارات</Title>
          <Button variant="subtle" className="custom-button">عرض الكل</Button>
        </Group>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
          {popularContent.map((content) => (
            <VideoCard
              key={content.id}
              title={content.title}
              imageUrl={content.imageUrl}
              rating={content.rating}
              duration={content.duration}
              type={content.type}
              year={content.year}
            />
          ))}
        </SimpleGrid>
      </div>

      {/* Trending Now Section */}
      <div>
        <Group justify="space-between" mb="xl">
          <Title order={2} className="text-gradient">الرائج الآن</Title>
          <Button variant="subtle" className="custom-button">عرض الكل</Button>
        </Group>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
          {popularContent.map((content) => (
            <VideoCard
              key={content.id}
              title={content.title}
              imageUrl={content.imageUrl}
              rating={content.rating}
              duration={content.duration}
              type={content.type}
              year={content.year}
            />
          ))}
        </SimpleGrid>
      </div>
    </>
  );
} 