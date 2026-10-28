import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_COOKIE_NAME, verifySessionToken } from '@/lib/adminAuth';
import AdminDashboardClient from './AdminDashboardClient';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Growmybizz CMS',
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const isAuthenticated = verifySessionToken(sessionToken);

  if (!isAuthenticated) {
    redirect('/admin/login');
  }

  return <AdminDashboardClient />;
}
