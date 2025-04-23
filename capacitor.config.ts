import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.streamx.app',
  appName: 'StreamX',
  webDir: 'out',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https'
  }
};

export default config; 