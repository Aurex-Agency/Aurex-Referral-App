import type { Metadata, Viewport } from 'next';
import './globals.css';
import { PortraitGuard } from '@/components/portrait-guard';

export const metadata: Metadata = {
  title: 'Magnolia | Mobile Detailing',
  description: 'Book a detail, earn rewards, and stay in touch with Magnolia Mobile Detailing. A fictional demonstration by Aurex.',
  manifest: '/manifest.webmanifest',
  icons: { icon: '/icon.svg', apple: '/icon-180.png' },
  appleWebApp: { capable: true, title: 'Magnolia', statusBarStyle: 'default' },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#172b36' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}<PortraitGuard /></body></html>;
}
