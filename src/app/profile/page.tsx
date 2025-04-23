'use client';

import { useState, useEffect } from 'react';
import { Container, Title, Card, TextInput, Button, Group, Text, Avatar, Stack } from '@mantine/core';
import { auth, db } from '@/lib/firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

interface ProfileData {
  displayName: string;
  email: string;
  photoURL?: string;
  bio?: string;
  phone?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    displayName: '',
    email: '',
    bio: '',
    phone: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data() as ProfileData;
        setProfile(data);
        setFormData(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) return;

      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: formData.displayName,
      });

      // Update Firestore profile
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: formData.displayName,
        bio: formData.bio,
        phone: formData.phone,
      });

      setProfile(formData);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return (
      <Container size="sm" py="xl">
        <Text>جاري التحميل...</Text>
      </Container>
    );
  }

  return (
    <Container size="sm" py="xl">
      <Card withBorder shadow="sm" radius="md">
        <Stack spacing="lg">
          <Group position="apart">
            <Title order={2}>الملف الشخصي</Title>
            <Button
              variant={editing ? 'filled' : 'outline'}
              onClick={() => setEditing(!editing)}
            >
              {editing ? 'حفظ التغييرات' : 'تعديل الملف الشخصي'}
            </Button>
          </Group>

          <form onSubmit={handleSubmit}>
            <Stack spacing="md">
              <Group>
                <Avatar
                  size="xl"
                  radius="xl"
                  src={profile?.photoURL}
                  alt={profile?.displayName}
                />
                <div>
                  <Text size="sm" color="dimmed">
                    البريد الإلكتروني
                  </Text>
                  <Text>{profile?.email}</Text>
                </div>
              </Group>

              <TextInput
                label="الاسم"
                value={formData.displayName}
                onChange={(e) =>
                  setFormData({ ...formData, displayName: e.target.value })
                }
                disabled={!editing}
              />

              <TextInput
                label="السيرة الذاتية"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                disabled={!editing}
              />

              <TextInput
                label="رقم الهاتف"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                disabled={!editing}
              />

              {editing && (
                <Group position="right" mt="md">
                  <Button type="submit" color="blue">
                    حفظ التغييرات
                  </Button>
                </Group>
              )}
            </Stack>
          </form>
        </Stack>
      </Card>
    </Container>
  );
} 