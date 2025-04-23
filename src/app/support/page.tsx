'use client';

import { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Stack,
  Card,
  Group,
  Button,
  TextInput,
  Textarea,
  Select,
  Table,
  Badge,
  Alert,
} from '@mantine/core';
import { IconAlertCircle, IconMessage } from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

const SUPPORT_CATEGORIES = [
  { value: 'account', label: 'Account Issues' },
  { value: 'billing', label: 'Billing & Payments' },
  { value: 'technical', label: 'Technical Support' },
  { value: 'content', label: 'Content Issues' },
  { value: 'other', label: 'Other' },
];

interface SupportTicket {
  id: string;
  category: string;
  subject: string;
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: string;
  lastUpdated: string;
}

export default function SupportPage() {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [tickets] = useState<SupportTicket[]>([
    {
      id: '1',
      category: 'technical',
      subject: 'Video playback issues',
      status: 'resolved',
      createdAt: '2024-03-01',
      lastUpdated: '2024-03-02',
    },
    {
      id: '2',
      category: 'billing',
      subject: 'Subscription renewal',
      status: 'in-progress',
      createdAt: '2024-03-15',
      lastUpdated: '2024-03-15',
    },
  ]);

  const handleSubmitTicket = async (values: {
    category: string;
    subject: string;
    description: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Implement submit ticket logic
      setSuccess(true);
    } catch (err) {
      setError('Failed to submit support ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <Container size="lg" py="xl">
        <Stack spacing="xl">
          <Title order={1}>Support</Title>

          {error && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Error"
              color="red"
              variant="filled"
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert
              title="Success"
              color="green"
              variant="filled"
            >
              Support ticket submitted successfully!
            </Alert>
          )}

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack spacing="md">
              <Title order={2}>Submit a Support Ticket</Title>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleSubmitTicket({
                  category: formData.get('category') as string,
                  subject: formData.get('subject') as string,
                  description: formData.get('description') as string,
                });
              }}>
                <Stack spacing="md">
                  <Select
                    label="Category"
                    name="category"
                    data={SUPPORT_CATEGORIES}
                    required
                  />
                  <TextInput
                    label="Subject"
                    name="subject"
                    placeholder="Brief description of your issue"
                    required
                  />
                  <Textarea
                    label="Description"
                    name="description"
                    placeholder="Please provide detailed information about your issue"
                    minRows={4}
                    required
                  />
                  <Button
                    type="submit"
                    leftIcon={<IconMessage size={16} />}
                    loading={loading}
                  >
                    Submit Ticket
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack spacing="md">
              <Title order={2}>Support History</Title>

              <Table>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td>
                        {SUPPORT_CATEGORIES.find(
                          (cat) => cat.value === ticket.category
                        )?.label}
                      </td>
                      <td>{ticket.subject}</td>
                      <td>
                        <Badge
                          color={
                            ticket.status === 'resolved'
                              ? 'green'
                              : ticket.status === 'in-progress'
                              ? 'yellow'
                              : 'blue'
                          }
                        >
                          {ticket.status}
                        </Badge>
                      </td>
                      <td>{ticket.createdAt}</td>
                      <td>{ticket.lastUpdated}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </ProtectedRoute>
  );
} 