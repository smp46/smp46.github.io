// src/app/layout.tsx
import '../pages/globals.css'; // Import global styles
import Sidebar from './Sidebar'; // Adjust the path as needed
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <>
        <div className="flex h-screen">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <main className="flex-1 p-4">
            {children}
          </main>
        </div>
    </>
  );
}

