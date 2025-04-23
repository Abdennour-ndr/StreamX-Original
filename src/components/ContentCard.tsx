'use client';

import { Card, Text, Group, ActionIcon, Badge } from '@mantine/core'
import { IconPlayerPlay, IconTrash, IconPlus } from '@tabler/icons-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDatabase } from '@/providers/DatabaseProvider'

interface ContentCardProps {
  id: string
  title: string
  description: string
  posterUrl: string
  type: string
  releaseYear: number
  showRemove?: boolean
  showAdd?: boolean
}

export default function ContentCard({
  id,
  title,
  description,
  posterUrl,
  type,
  releaseYear,
  showRemove = false,
  showAdd = false,
}: ContentCardProps) {
  const router = useRouter()
  const { userData, updateUserData } = useDatabase()
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToList = async () => {
    if (isLoading) return

    try {
      setIsLoading(true)
      const currentList = userData?.myList || []
      const isInList = currentList.some((item: any) => item.id === id)
      
      if (!isInList) {
        const newItem = {
          id,
          title,
          description,
          posterUrl,
          type,
          releaseYear,
          addedAt: new Date().toISOString(),
        }
        await updateUserData({ myList: [...currentList, newItem] })
      }
    } catch (error) {
      console.error('Failed to add to list:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveFromList = async () => {
    if (isLoading) return

    try {
      setIsLoading(true)
      const updatedList = userData?.myList?.filter((item: any) => item.id !== id) || []
      await updateUserData({ myList: updatedList })
    } catch (error) {
      console.error('Failed to remove from list:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card
      withBorder
      p="md"
      radius="md"
      className="h-full flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => router.push(`/watch/${id}`)}
    >
      <div className="relative aspect-video mb-4">
        <div
          className="absolute inset-0 bg-cover bg-center rounded"
          style={{ backgroundImage: `url(${posterUrl})` }}
        />
        <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <Group spacing="xs">
            <ActionIcon
              variant="white"
              size="lg"
              radius="xl"
              onClick={(e) => {
                e.stopPropagation()
                router.push(`/watch/${id}`)
              }}
            >
              <IconPlayerPlay size={20} />
            </ActionIcon>
            {showRemove && (
              <ActionIcon
                variant="white"
                size="lg"
                radius="xl"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemoveFromList()
                }}
                loading={isLoading}
              >
                <IconTrash size={20} />
              </ActionIcon>
            )}
            {showAdd && (
              <ActionIcon
                variant="white"
                size="lg"
                radius="xl"
                onClick={(e) => {
                  e.stopPropagation()
                  handleAddToList()
                }}
                loading={isLoading}
              >
                <IconPlus size={20} />
              </ActionIcon>
            )}
          </Group>
        </div>
      </div>

      <div className="flex-grow">
        <Text size="sm" weight={500} lineClamp={1} className="mb-1">
          {title}
        </Text>
        <Text size="xs" color="dimmed" lineClamp={2} className="mb-2">
          {description}
        </Text>
        <Group spacing="xs">
          <Badge size="sm" variant="light">
            {type}
          </Badge>
          <Badge size="sm" variant="light">
            {releaseYear}
          </Badge>
        </Group>
      </div>
    </Card>
  )
} 