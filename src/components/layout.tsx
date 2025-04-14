// src/app/layout.tsx
import Sidebar from './Sidebar';
import Head from 'next/head';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen">
      <Head>
        <meta http-equiv='content-language' content='en-us'></meta>
        <meta name="author" content="Samuel Paynter"></meta>
      </Head>
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 sm:ml-auto mt-16 sm:mt-0 sm:overflow-y-auto px-8">
        {children}
      </main>
    </div>
  );
}
