import { Paper, Title, Text, Button, Group, ThemeIcon, Stack } from '@mantine/core';
import { IconAlertTriangle, IconRefresh } from '@tabler/icons-react';

interface ErrorFallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
  message?: string;
  actionLabel?: string;
}

export function ErrorFallback({
  error,
  resetErrorBoundary,
  message = "Oops! Something unexpected happened.",
  actionLabel = "Try Again"
}: ErrorFallbackProps) {
  return (
    <Paper
      className="relative overflow-hidden min-h-[300px] flex items-center justify-center"
      p="xl"
      radius="md"
      withBorder
      shadow="md"
    >
      <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-16 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 transform -translate-x-16 translate-y-16 bg-gradient-to-tr from-pink-500/20 to-purple-500/20 rounded-full blur-2xl" />
      
      <Stack align="center" spacing="lg">
        <ThemeIcon size={56} radius="xl" variant="light" color="red">
          <IconAlertTriangle size={32} />
        </ThemeIcon>
        
        <Title order={2} className="text-gradient text-center" mt="md">
          {message}
        </Title>
        
        {error && (
          <Text size="sm" c="dimmed" className="text-center max-w-md mt-2">
            {error.message}
          </Text>
        )}

        <Group mt="xl">
          <Button
            variant="gradient"
            gradient={{ from: 'red', to: 'pink' }}
            size="md"
            radius="xl"
            leftSection={<IconRefresh size={20} />}
            onClick={resetErrorBoundary}
            className="hover-scale"
          >
            {actionLabel}
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
} 