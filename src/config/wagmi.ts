import { createConfig, http } from 'wagmi';
import { baseSepolia } from './contract';
import { getDefaultConfig } from 'connectkit';

export const config = createConfig(
  getDefaultConfig({
    chains: [baseSepolia],
    transports: {
      [baseSepolia.id]: http('https://sepolia.base.org'),
    },
    walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_WALLETCONNECT_PROJECT_ID',
    appName: 'BasePOS Dashboard',
    appDescription: 'Decentralized Point-of-Sale System on Base',
    appUrl: typeof window !== 'undefined' ? window.location.origin : '',
    appIcon: '/favicon.ico',
    // Disable unnecessary connectors to reduce console warnings
    ssr: false,
  })
);

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
