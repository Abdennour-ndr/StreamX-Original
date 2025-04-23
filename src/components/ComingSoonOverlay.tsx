import { Paper, Title, Text, Button, Group, ThemeIcon, Stack } from '@mantine/core';
import { IconRocket, IconStars } from '@tabler/icons-react';

interface ComingSoonOverlayProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function ComingSoonOverlay({
  title = "Coming Soon!",
  description = "We're working on something amazing for you.",
  actionLabel = "Get Notified",
  onAction
}: ComingSoonOverlayProps) {
  return (
    <Paper
      className="relative overflow-hidden"
      p="xl"
      radius="md"
      withBorder
      shadow="md"
    >
      <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 transform -translate-x-16 translate-y-16 bg-gradient-to-tr from-red-500/20 to-orange-500/20 rounded-full blur-2xl" />
      
      <Stack gap="md">
        <ThemeIcon 
          size={56} 
          radius="xl" 
          variant="light" 
          color="blue"
          className="mx-auto animate-bounce"
        >
          <IconRocket size={32} />
        </ThemeIcon>
        
        <Title order={2} className="text-gradient text-center">
          {title}
        </Title>
        
        <Text size="lg" c="dimmed" className="text-center max-w-md mx-auto">
          {description}
        </Text>

        <Group justify="center" mt="lg">
          <Button
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan' }}
            size="md"
            radius="xl"
            leftSection={<IconStars size={20} />}
            onClick={onAction}
            className="hover-scale"
          >
            {actionLabel}
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
} 