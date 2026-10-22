import type { CapacitorConfig } from '@capacitor/cli';
const config: CapacitorConfig = {
  appId: 'mg.madacommerce.app',
  appName: 'Mada Commerce Premium',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: { androidScheme: 'https' }
};
export default config;
