'use client';

import { Table, Badge, Menu, ActionIcon } from '@mantine/core';
import { IconDots, IconUserCheck, IconUserX, IconUser } from '@tabler/icons-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UsersTableProps {
  users: User[];
  onUpdateRole: (userId: string, newRole: string) => void;
}

export default function UsersTable({ users, onUpdateRole }: UsersTableProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'red';
      case 'moderator': return 'blue';
      default: return 'gray';
    }
  };

  return (
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
                    onClick={() => onUpdateRole(user.id, 'admin')}
                    disabled={user.role === 'admin'}
                  >
                    تعيين كمسؤول
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconUser size={14} />}
                    onClick={() => onUpdateRole(user.id, 'moderator')}
                    disabled={user.role === 'moderator'}
                  >
                    تعيين كمشرف
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconUserX size={14} />}
                    onClick={() => onUpdateRole(user.id, 'user')}
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
  );
} 