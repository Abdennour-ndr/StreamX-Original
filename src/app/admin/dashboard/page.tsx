'use client';

import { Container, Title, SimpleGrid, Card, Text, Group, Button } from '@mantine/core';
import { IconUsers, IconSettings, IconUser, IconChartBar } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import AdminGuard from '@/components/AdminGuard';

const features = [
  {
    title: 'إدارة المستخدمين',
    description: 'عرض وتعديل صلاحيات المستخدمين',
    icon: IconUsers,
    color: 'blue',
    path: '/admin/users',
  },
  {
    title: 'الإحصائيات',
    description: 'عرض إحصائيات الموقع',
    icon: IconChartBar,
    color: 'green',
    path: '/admin/stats',
  },
  {
    title: 'إعدادات الموقع',
    description: 'تعديل إعدادات الموقع العامة',
    icon: IconSettings,
    color: 'orange',
    path: '/admin/settings',
  },
];

function DashboardContent() {
  const router = useRouter();

  return (
    <Container size="xl" py="xl">
      <Title order={2} mb="xl">لوحة التحكم</Title>
      
      <SimpleGrid cols={3} spacing="lg">
        {features.map((feature) => (
          <Card
            key={feature.title}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
          >
            <Group position="apart" mb="md">
              <feature.icon size={24} color={feature.color} />
              <Text size="lg" weight={500}>
                {feature.title}
              </Text>
            </Group>

            <Text size="sm" color="dimmed" mb="md">
              {feature.description}
            </Text>

            <Button
              variant="light"
              color={feature.color}
              fullWidth
              onClick={() => router.push(feature.path)}
            >
              الانتقال
            </Button>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
}

export default function DashboardPage() {
  return (
    <AdminGuard>
      <DashboardContent />
    </AdminGuard>
  );
} 