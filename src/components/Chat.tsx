'use client';

import { useState, useEffect } from 'react';
import { Container, TextInput, Button, Paper, Text, Stack, Group, ActionIcon, Menu } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconSend, IconTrash, IconDots, IconRobot, IconUser } from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';
import { collection, doc, getDoc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { db } from '@/config/firebase';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export function Chat() {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const form = useForm({
    initialValues: {
      message: '',
    },
    validate: {
      message: (value) => (value.trim().length === 0 ? 'Message is required' : null),
    },
  });

  useEffect(() => {
    if (!currentUser) return;

    const conversationRef = doc(db, 'conversations', currentUser.uid);
    const unsubscribe = onSnapshot(conversationRef, (doc) => {
      if (doc.exists()) {
        setMessages(doc.data().messages || []);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleSubmit = async (values: { message: string }) => {
    if (!currentUser) {
      setError('You must be logged in to chat');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setIsTyping(true);

      const userMessage: Message = {
        role: 'user',
        content: values.message,
        timestamp: new Date(),
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await currentUser.getIdToken()}`,
        },
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const clearChat = async () => {
    if (!currentUser) return;

    try {
      const conversationRef = doc(db, 'conversations', currentUser.uid);
      await setDoc(conversationRef, {
        messages: [],
        updatedAt: serverTimestamp(),
      });
      setMessages([]);
    } catch (err) {
      setError('Failed to clear chat history');
    }
  };

  return (
    <Container size="sm">
      <Paper p="md" withBorder>
        <Stack gap="md">
          <Group justify="space-between">
            <Text fz="lg" fw={500}>
              Chat with AI
            </Text>
            <Menu position="bottom-end">
              <Menu.Target>
                <ActionIcon>
                  <IconDots size={16} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={clearChat} leftSection={<IconTrash size={14} />}>
                  Clear Chat
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>

          {error && (
            <Text c="red" fz="sm">
              {error}
            </Text>
          )}

          <Stack gap="xs">
            {messages.map((message, index) => (
              <Paper
                key={index}
                p="sm"
                withBorder
                style={{
                  backgroundColor:
                    message.role === 'assistant' ? '#f8f9fa' : 'white',
                }}
              >
                <Group gap="xs" mb={4}>
                  {message.role === 'assistant' ? (
                    <IconRobot size={16} />
                  ) : (
                    <IconUser size={16} />
                  )}
                  <Text fz="sm" fw={500}>
                    {message.role === 'user' ? 'You' : 'Assistant'}
                  </Text>
                  {message.timestamp && (
                    <Text fz="xs" c="dimmed">
                      {message.timestamp.toLocaleTimeString()}
                    </Text>
                  )}
                </Group>
                <Text fz="sm">{message.content}</Text>
              </Paper>
            ))}
            {isTyping && (
              <Text fz="sm" c="dimmed" fs="italic">
                Assistant is typing...
              </Text>
            )}
          </Stack>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Group gap="xs">
              <TextInput
                placeholder="Type your message..."
                {...form.getInputProps('message')}
                disabled={isLoading}
                style={{ flex: 1 }}
              />
              <Button
                type="submit"
                loading={isLoading}
                leftSection={<IconSend size={16} />}
              >
                Send
              </Button>
            </Group>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
} 