'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
  Box,
  Text,
  Group,
  Badge,
  Button,
  Menu,
  LoadingOverlay,
  Progress,
  Paper,
  Transition,
  MantineStyleProp,
} from '@mantine/core';
import { IconVideo, IconDownload, IconShare, IconDeviceTv } from '@tabler/icons-react';
import Image from 'next/image';

interface VideoState {
  isLoading: boolean;
  isPlaying: boolean;
  showControls: boolean;
  showFeatureOverlay: 'cast' | 'download' | 'share' | null;
  currentQuality: '360p' | '720p' | '1080p';
}

interface ComingSoonOverlayProps {
  title: string;
  description: string;
  onAction: () => void;
}

const ComingSoonOverlay: React.FC<ComingSoonOverlayProps> = ({ title, description, onAction }) => (
  <div style={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    zIndex: 20,
  }}>
    <Text fw={700} size="xl" ta="center" mb={16}>{title}</Text>
    <Text size="md" ta="center" mb={32}>{description}</Text>
    <Button onClick={onAction} variant="filled" color="blue">
      Got it
    </Button>
  </div>
);

const WatchPage = () => {
  const [videoState, setVideoState] = useState<VideoState>({
    isLoading: true,
    isPlaying: false,
    showControls: true,
    showFeatureOverlay: null,
    currentQuality: '1080p',
  });

  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleMouseMove = useCallback(() => {
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
    
    setVideoState(prev => ({ ...prev, showControls: true }));
    
    const timeout = setTimeout(() => {
      setVideoState(prev => ({ ...prev, showControls: false }));
    }, 3000);
    
    setControlsTimeout(timeout);
  }, [controlsTimeout]);

  const handleQualityChange = (quality: '360p' | '720p' | '1080p') => {
    setVideoState(prev => ({ ...prev, currentQuality: quality }));
  };

  const handleFeatureOverlay = (feature: 'cast' | 'download' | 'share' | null) => {
    setVideoState(prev => ({ ...prev, showFeatureOverlay: feature }));
  };

  useEffect(() => {
    return () => {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [controlsTimeout]);

  return (
    <Box className="video-container" onMouseMove={handleMouseMove}>
      <LoadingOverlay visible={videoState.isLoading} loaderProps={{ size: 'xl' }} />
      
      <Transition mounted={videoState.showControls} transition="fade" duration={200}>
        {(styles) => (
          <div className="video-controls-overlay" style={styles}>
            {/* Video Controls */}
            <Group justify="space-between" className="control-bar">
              <Group>
                <Button
                  variant="subtle"
                  color="gray"
                  onClick={() => setVideoState(prev => ({ ...prev, isPlaying: !prev.isPlaying }))}
                >
                  {videoState.isPlaying ? 'Pause' : 'Play'}
                </Button>
                
                <Menu>
                  <Menu.Target>
                    <Button variant="subtle" color="gray">
                      <IconVideo size={14} /> {videoState.currentQuality}
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown>
                    {['360p', '720p', '1080p'].map((quality) => (
                      <Menu.Item
                        key={quality}
                        onClick={() => handleQualityChange(quality as '360p' | '720p' | '1080p')}
                      >
                        {quality}
                      </Menu.Item>
                    ))}
                  </Menu.Dropdown>
                </Menu>
              </Group>

              <Group>
                <Button
                  variant="subtle"
                  color="gray"
                  onClick={() => handleFeatureOverlay('cast')}
                >
                  <IconDeviceTv size={14} />
                </Button>
                <Button
                  variant="subtle"
                  color="gray"
                  onClick={() => handleFeatureOverlay('download')}
                >
                  <IconDownload size={14} />
                </Button>
                <Button
                  variant="subtle"
                  color="gray"
                  onClick={() => handleFeatureOverlay('share')}
                >
                  <IconShare size={14} />
                </Button>
              </Group>
            </Group>
          </div>
        )}
      </Transition>

      {videoState.showFeatureOverlay && (
        <ComingSoonOverlay
          title={`${videoState.showFeatureOverlay.charAt(0).toUpperCase()}${videoState.showFeatureOverlay.slice(1)}`}
          description={`This ${videoState.showFeatureOverlay} feature is coming soon!`}
          onAction={() => handleFeatureOverlay(null)}
        />
      )}

      {/* Next Episode Preview */}
      <Paper className="next-episode-preview" p="md">
        <Group justify="space-between" align="center">
          <div>
            <Text fw={700} size="lg" mb={8}>Next Episode</Text>
            <Text size="sm" c="dimmed">Episode 2: The Journey Begins</Text>
          </div>
          <Button variant="light" color="blue">
            Watch Next
          </Button>
        </Group>
      </Paper>
    </Box>
  );
};

export default WatchPage;