import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaDiscord, FaGithub, FaLinkedin } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  function toggleSidebar() {
    setIsSidebarOpen(!isSidebarOpen);
    if (!isMobile) {
      setIsMobile(true);
    }
  }

  function closeSidebar() {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }

  const navLinks = [
    { href: '/', label: 'Welcome' },
    { href: '/projects/', label: 'Projects' },
    { href: '/experience/', label: 'Experience' },
    { href: '/whoami/', label: 'whoami' },
  ];

  return (
    <>
      <div className="sm:hidden fixed top-0 left-0 w-full bg-black text-white flex items-center justify-between px-8 py-4 z-50">
        <button
          className="text-white text-5xl flex items-center justify-center"
          onClick={toggleSidebar}
          aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
        >
          {isSidebarOpen ? <FiX /> : <FiMenu />}
        </button>

        <Link href="/">
          <h2 className="sm:text-3xl text-5xl font-bold leading-none -translate-y-2 sm:translate-y-0">smp46</h2>
        </Link>
      </div>

      <div
        className={`fixed top-0 left-0 h-screen bg-black text-white flex flex-col px-4 py-8 z-40 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300 sm:translate-x-0 sm:static mt-8 w-64 sm:flex-shrink-0 sm:mt-0 overflow-y-scroll`}
      >
        <Link href="/">
          <h2 className="text-5xl font-bold hidden sm:block">smp46</h2>
        </Link>
        <div className="mt-4 flex space-x-4">
          <a
            href="https://discord.com/users/335649164769886208"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white sm:text-2xl text-4xl transition-transform duration-300 hover:scale-110"
            aria-label="Discord"
          >
            <FaDiscord />
          </a>
          <a
            href="https://github.com/smp46"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white sm:text-2xl text-4xl transition-transform duration-300 hover:scale-110"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>
          <a
            href="https://linkedin.com/in/smp46"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white sm:text-2xl text-4xl transition-transform duration-300 hover:scale-110"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </a>
          <a
            href="mailto:me@smp46.me"
            className="text-white sm:text-2xl text-4xl transition-transform duration-300 hover:scale-110"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiGmail />
          </a>
        </div>

        <nav className="flex flex-col sm:space-y-2 space-y-4 mt-6">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`text-white transition-transform duration-300 hover:scale-110 origin-left cursor-pointer ${
                  isActive ? 'font-semibold sm:text-2xl text-3xl' : 'sm:text-xl text-2xl'
                }`}
                onClick={closeSidebar}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}

