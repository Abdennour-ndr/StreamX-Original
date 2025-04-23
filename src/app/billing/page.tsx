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
  Table,
  Badge,
  ActionIcon,
  Modal,
  TextInput,
  Grid,
} from '@mantine/core';
import {
  IconCreditCard,
  IconTrash,
  IconPlus,
  IconAlertCircle,
} from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

interface PaymentMethod {
  id: string;
  type: 'card';
  last4: string;
  expiry: string;
  isDefault: boolean;
}

interface BillingHistory {
  id: string;
  date: string;
  amount: string;
  status: 'paid' | 'pending' | 'failed';
  description: string;
}

export default function BillingPage() {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [addCardModal, setAddCardModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      last4: '4242',
      expiry: '12/25',
      isDefault: true,
    },
  ]);

  const [billingHistory] = useState<BillingHistory[]>([
    {
      id: '1',
      date: '2024-03-01',
      amount: '$9.99',
      status: 'paid',
      description: 'Premium Subscription',
    },
    {
      id: '2',
      date: '2024-02-01',
      amount: '$9.99',
      status: 'paid',
      description: 'Premium Subscription',
    },
  ]);

  const handleAddCard = async () => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Implement add card logic
      setSuccess(true);
      setAddCardModal(false);
    } catch (err) {
      setError('Failed to add payment method. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCard = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Implement remove card logic
      setSuccess(true);
    } catch (err) {
      setError('Failed to remove payment method. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <Container size="lg" py="xl">
        <Stack spacing="xl">
          <Title order={1}>Billing</Title>

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
              Operation completed successfully!
            </Alert>
          )}

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack spacing="md">
              <Group position="apart">
                <Title order={2}>Payment Methods</Title>
                <Button
                  leftIcon={<IconPlus size={16} />}
                  onClick={() => setAddCardModal(true)}
                >
                  Add Payment Method
                </Button>
              </Group>

              <Table>
                <thead>
                  <tr>
                    <th>Card</th>
                    <th>Expires</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentMethods.map((method) => (
                    <tr key={method.id}>
                      <td>
                        <Group>
                          <IconCreditCard size={20} />
                          <Text>•••• {method.last4}</Text>
                        </Group>
                      </td>
                      <td>{method.expiry}</td>
                      <td>
                        {method.isDefault && (
                          <Badge color="blue">Default</Badge>
                        )}
                      </td>
                      <td>
                        <ActionIcon
                          variant="light"
                          color="red"
                          title="Remove Card"
                          onClick={() => handleRemoveCard(method.id)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Stack>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack spacing="md">
              <Title order={2}>Billing History</Title>

              <Table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {billingHistory.map((item) => (
                    <tr key={item.id}>
                      <td>{item.date}</td>
                      <td>{item.description}</td>
                      <td>{item.amount}</td>
                      <td>
                        <Badge
                          color={
                            item.status === 'paid'
                              ? 'green'
                              : item.status === 'pending'
                              ? 'yellow'
                              : 'red'
                          }
                        >
                          {item.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Stack>
          </Card>
        </Stack>

        <Modal
          opened={addCardModal}
          onClose={() => setAddCardModal(false)}
          title="Add Payment Method"
        >
          <Stack spacing="md">
            <TextInput
              label="Card Number"
              placeholder="1234 5678 9012 3456"
              required
            />
            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Expiry Date"
                  placeholder="MM/YY"
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="CVC"
                  placeholder="123"
                  required
                />
              </Grid.Col>
            </Grid>
            <Button
              fullWidth
              loading={loading}
              onClick={handleAddCard}
            >
              Add Card
            </Button>
          </Stack>
        </Modal>
      </Container>
    </ProtectedRoute>
  );
} 