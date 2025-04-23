'use client';

import React from 'react';
import { 
  Card, 
  Text, 
  Group, 
  Stack, 
  Title, 
  Button
} from '@mantine/core';

export default function AdminDashboard() {
  return (
    <div style={{ padding: '20px' }}>
      <Title order={2}>لوحة التحكم</Title>
      <Text mb={20}>مرحباً بك في لوحة تحكم StreamX</Text>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        <Card withBorder p="xl">
          <Text fw={500}>المستخدمين</Text>
          <Text size="xl" fw={700} mt={10}>1,203</Text>
        </Card>
        
        <Card withBorder p="xl">
          <Text fw={500}>الأفلام</Text>
          <Text size="xl" fw={700} mt={10}>430</Text>
        </Card>
        
        <Card withBorder p="xl">
          <Text fw={500}>الإعلانات</Text>
          <Text size="xl" fw={700} mt={10}>24</Text>
        </Card>
        
        <Card withBorder p="xl">
          <Text fw={500}>التذاكر</Text>
          <Text size="xl" fw={700} mt={10}>18</Text>
        </Card>
      </div>
    </div>
  );
} 