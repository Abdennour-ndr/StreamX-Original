import { ReactNode } from 'react';
import { Transition } from '@mantine/core';

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <Transition
      mounted={true}
      transition={{
        in: { opacity: 1, transform: 'translateY(0)' },
        out: { opacity: 0, transform: 'translateY(10px)' },
        common: { transition: 'transform 300ms ease, opacity 300ms ease' },
        transitionProperty: 'transform, opacity',
      }}
    >
      {(styles) => (
        <div style={styles}>
          {children}
        </div>
      )}
    </Transition>
  );
} 