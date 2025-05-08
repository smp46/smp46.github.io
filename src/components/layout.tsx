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
        <meta httpEquiv="content-language" content="en-us"></meta>
        <meta name="author" content="Samuel Paynter "></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Sidebar />

      <main className="flex-1 sm:ml-auto mt-16 sm:mt-0 sm:overflow-y-scroll px-8 w-screen">
        {children}
      </main>
    </div>
  );
}
