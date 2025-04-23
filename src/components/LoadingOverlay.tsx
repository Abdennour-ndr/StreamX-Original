import { LoadingOverlay as MantineLoadingOverlay, Transition } from '@mantine/core';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export function LoadingOverlay({ visible, message = 'Loading...' }: LoadingOverlayProps) {
  return (
    <Transition mounted={visible} transition="fade" duration={400} timingFunction="ease">
      {(styles) => (
        <MantineLoadingOverlay
          visible={true}
          zIndex={1000}
          overlayProps={{ blur: 2, opacity: 0.7 }}
          loaderProps={{ 
            color: 'red',
            size: 'xl',
            variant: 'bars'
          }}
          style={styles}
        />
      )}
    </Transition>
  );
} 