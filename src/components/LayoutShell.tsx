'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import StickyMobileActionBar from '@/components/StickyMobileActionBar';
import ScrollObserver from '@/components/ui/ScrollObserver';
import { CurrencyProvider } from '@/context/CurrencyContext';

interface LayoutShellProps {
  children: React.ReactNode;
  initialSettings?: any;
  initialVisibility?: any;
}

export default function LayoutShell({
  children,
  initialSettings,
  initialVisibility,
}: LayoutShellProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <CurrencyProvider>{children}</CurrencyProvider>;
  }

  return (
    <CurrencyProvider>
      <ScrollObserver />
      <Navbar initialVisibility={initialVisibility} />
      <main>{children}</main>
      <Footer initialSettings={initialSettings} initialVisibility={initialVisibility} />
      <WhatsAppFloatingButton />
      <StickyMobileActionBar />
    </CurrencyProvider>
  );
}
