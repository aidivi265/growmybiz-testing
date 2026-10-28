import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_COOKIE_NAME, verifySessionToken } from '@/lib/adminAuth';

export default async function AdminIndexPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const isAuthenticated = verifySessionToken(sessionToken);

  if (isAuthenticated) {
    redirect('/admin/dashboard');
  }

  redirect('/admin/login');
}
