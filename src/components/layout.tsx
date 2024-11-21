// src/app/layout.tsx
import Sidebar from './Sidebar';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 sm:ml-auto mt-16 sm:mt-0 sm:overflow-y-auto px-8">
        {children}
      </main>
    </div>
  );
}
