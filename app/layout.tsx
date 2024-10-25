import type { Metadata } from 'next';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'Auth'
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider session={session} key={session?.user?.email || "anonymous"}>
      <html lang="en">
        <body>
          {children}
          <Toaster/>
        </body>
      </html>
    </SessionProvider>
  );
}
