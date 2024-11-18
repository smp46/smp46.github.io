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
      <main className="s:ml-64 mt-16 sm:mt-0">
        {children}
      </main>
    </div>
  );
}
