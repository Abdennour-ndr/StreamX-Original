import { Container, Title, Text, Grid, Card } from '@mantine/core'
import { useAuth } from '@/providers/AuthProvider'
import { useDatabase } from '@/providers/DatabaseProvider'
import ContentCard from '@/components/ContentCard'

export default function MyListPage() {
  const { user } = useAuth()
  const { userData } = useDatabase()

  if (!user) {
    return (
      <Container size="xl" className="py-8">
        <Title order={2} className="mb-4">My List</Title>
        <Text>Please sign in to view your list.</Text>
      </Container>
    )
  }

  return (
    <Container size="xl" className="py-8">
      <Title order={2} className="mb-8">My List</Title>

      {userData?.myList?.length === 0 ? (
        <Card withBorder p="xl" radius="md">
          <Text align="center" color="dimmed">
            Your list is empty. Start adding content to watch later!
          </Text>
        </Card>
      ) : (
        <Grid>
          {userData?.myList?.map((item: any) => (
            <Grid.Col key={item.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
              <ContentCard
                id={item.id}
                title={item.title}
                description={item.description}
                posterUrl={item.posterUrl}
                type={item.type}
                releaseYear={item.releaseYear}
                showRemove
              />
            </Grid.Col>
          ))}
        </Grid>
      )}
    </Container>
  )
} 