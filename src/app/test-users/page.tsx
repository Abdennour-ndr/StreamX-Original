'use client';

import { useState } from 'react';
import { Container, Title, Table, Badge, Menu, ActionIcon } from '@mantine/core';
import { IconDots, IconUserCheck, IconUserX, IconUser } from '@tabler/icons-react';

// Test data
const testUsers = [
  {
    id: '1',
    name: 'المسؤول',
    email: 'admin@test.com',
    role: 'admin'
  },
  {
    id: '2',
    name: 'المشرف',
    email: 'moderator@test.com',
    role: 'moderator'
  },
  {
    id: '3',
    name: 'المستخدم',
    email: 'user@test.com',
    role: 'user'
  }
];

export default function TestUsersPage() {
  const [users, setUsers] = useState(testUsers);

  const updateRole = (userId: string, newRole: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'red';
      case 'moderator': return 'blue';
      default: return 'gray';
    }
  };

  return (
    <Container size="xl" py="xl">
      <Title order={2} mb="xl">قائمة المستخدمين</Title>
      
      <Table>
        <thead>
          <tr>
            <th>الاسم</th>
            <th>البريد الإلكتروني</th>
            <th>الدور</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <Badge color={getRoleColor(user.role)}>
                  {user.role === 'admin' ? 'مسؤول' : 
                   user.role === 'moderator' ? 'مشرف' : 'مستخدم'}
                </Badge>
              </td>
              <td>
                <Menu>
                  <Menu.Target>
                    <ActionIcon>
                      <IconDots size={16} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      leftSection={<IconUserCheck size={14} />}
                      onClick={() => updateRole(user.id, 'admin')}
                      disabled={user.role === 'admin'}
                    >
                      تعيين كمسؤول
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconUser size={14} />}
                      onClick={() => updateRole(user.id, 'moderator')}
                      disabled={user.role === 'moderator'}
                    >
                      تعيين كمشرف
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconUserX size={14} />}
                      onClick={() => updateRole(user.id, 'user')}
                      disabled={user.role === 'user'}
                    >
                      تعيين كمستخدم
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
} 