'use client';

import { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Stack,
  Grid,
  Card,
  Group,
  Button,
  Badge,
  List,
  ThemeIcon,
  Divider,
  Alert,
} from '@mantine/core';
import {
  IconCheck,
  IconAlertCircle,
  IconCrown,
  IconStar,
  IconDeviceTv,
  IconDownload,
} from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    interval: 'month',
    features: [
      'Ad-supported streaming',
      'HD quality',
      'Basic support',
    ],
    current: true,
  },
  {
    name: 'Premium',
    price: '$9.99',
    interval: 'month',
    features: [
      'Ad-free streaming',
      'Ultra HD quality',
      'Offline downloads',
      'Priority support',
      'Early access to new content',
    ],
    popular: true,
  },
];

export default function SubscriptionPage() {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (plan: string) => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Implement subscription logic
      console.log('Subscribe to plan:', plan);
    } catch (err) {
      setError('Failed to process subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <Container size="lg" py="xl">
        <Stack spacing="xl">
          <Title order={1} align="center">
            Choose Your Plan
          </Title>
          <Text align="center" color="dimmed">
            Select the plan that best fits your needs
          </Text>

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

          <Grid>
            {PLANS.map((plan) => (
              <Grid.Col key={plan.name} span={{ base: 12, md: 6 }}>
                <Card
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                  style={{
                    borderColor: plan.popular ? '#228be6' : undefined,
                    borderWidth: plan.popular ? 2 : 1,
                  }}
                >
                  <Stack spacing="md">
                    <Group position="apart">
                      <div>
                        <Title order={2}>{plan.name}</Title>
                        <Text size="xl" weight={700}>
                          {plan.price}
                          <Text component="span" size="sm" weight={400} color="dimmed">
                            /{plan.interval}
                          </Text>
                        </Text>
                      </div>
                      {plan.popular && (
                        <Badge
                          size="lg"
                          variant="filled"
                          leftSection={<IconCrown size={16} />}
                        >
                          Popular
                        </Badge>
                      )}
                      {plan.current && (
                        <Badge size="lg" variant="outline">
                          Current Plan
                        </Badge>
                      )}
                    </Group>

                    <Divider />

                    <List
                      spacing="sm"
                      size="sm"
                      center
                      icon={
                        <ThemeIcon color="teal" size={24} radius="xl">
                          <IconCheck size={16} />
                        </ThemeIcon>
                      }
                    >
                      {plan.features.map((feature, index) => (
                        <List.Item key={index}>{feature}</List.Item>
                      ))}
                    </List>

                    <Button
                      fullWidth
                      size="lg"
                      variant={plan.popular ? 'filled' : 'light'}
                      leftIcon={
                        plan.popular ? <IconCrown size={20} /> : <IconStar size={20} />
                      }
                      loading={loading}
                      disabled={plan.current}
                      onClick={() => handleSubscribe(plan.name)}
                    >
                      {plan.current ? 'Current Plan' : 'Subscribe Now'}
                    </Button>
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack spacing="md">
              <Title order={2}>Premium Features</Title>
              <Grid>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Group>
                    <ThemeIcon size="lg" radius="md" color="blue">
                      <IconDeviceTv size={24} />
                    </ThemeIcon>
                    <div>
                      <Text weight={500}>Ultra HD Quality</Text>
                      <Text size="sm" color="dimmed">
                        Watch in stunning 4K resolution
                      </Text>
                    </div>
                  </Group>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Group>
                    <ThemeIcon size="lg" radius="md" color="green">
                      <IconDownload size={24} />
                    </ThemeIcon>
                    <div>
                      <Text weight={500}>Offline Downloads</Text>
                      <Text size="sm" color="dimmed">
                        Watch without an internet connection
                      </Text>
                    </div>
                  </Group>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Group>
                    <ThemeIcon size="lg" radius="md" color="yellow">
                      <IconCrown size={24} />
                    </ThemeIcon>
                    <div>
                      <Text weight={500}>Priority Support</Text>
                      <Text size="sm" color="dimmed">
                        Get help faster with priority support
                      </Text>
                    </div>
                  </Group>
                </Grid.Col>
              </Grid>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </ProtectedRoute>
  );
} 