'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import ScrollObserver from '@/components/ui/ScrollObserver';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <ScrollObserver />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppFloatingButton />
    </>
  );
}
