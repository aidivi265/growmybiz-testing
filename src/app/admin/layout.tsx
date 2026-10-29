import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Access | Growmybiz24 CMS',
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * CMS Admin layout — separate from the public site layout.
 * Does NOT include Navbar or Footer.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#07070d] text-white font-[system-ui,sans-serif]">
      {children}
    </div>
  );
}
