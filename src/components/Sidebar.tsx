import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaDiscord, FaGithub, FaLinkedin, FaRssSquare } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';
import { FiMenu, FiX } from 'react-icons/fi';
import { IoSearchCircleSharp } from 'react-icons/io5';
import Search from './search';

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const [showSearch, setShowSearch] = useState(false);

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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        ((event.metaKey && event.key === ' ') ||
          (event.ctrlKey && event.key === ' ') ||
          event.key === 'Escape') &&
        showSearch
      ) {
        setShowSearch(false);
      } else if (
        ((event.metaKey && event.key === ' ') || // For macOS (Command+Space)
          (event.ctrlKey && event.key === ' ')) && // For Windows/Linux (Ctrl+Space)
        !showSearch
      ) {
        setShowSearch(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  });

  const navLinks = [
    { href: '/', label: 'Welcome' },
    { href: '/projects/', label: 'Projects' },
    { href: '/experience/', label: 'Experience' },
    { href: '/whoami/', label: 'whoami' },
  ];

  return (
    <>
      <div
        className="sm:hidden fixed top-0 left-0 w-full bg-black text-white flex items-center
          justify-between px-8 py-4 z-50"
      >
        <button
          className="text-white text-5xl flex items-center justify-center"
          onClick={toggleSidebar}
          aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
        >
          {isSidebarOpen ? <FiX /> : <FiMenu />}
        </button>

        <Link href="/">
          <h2 className="sm:text-3xl text-5xl font-bold leading-none -translate-y-2 sm:translate-y-0">
            smp46
          </h2>
        </Link>
      </div>

      {showSearch && (
        <div
          className="sm:mt-0 sm:ml-64 fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex
            items-center justify-center pt-20 sm:z-50 z-30"
          onClick={() => setShowSearch(false)}
        >
          <Search onResultClick={() => setShowSearch(false)} />
        </div>
      )}

      <div
        className={`fixed top-0 left-0 h-screen bg-black text-white flex flex-col px-4 py-8 z-40
          transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          transition-transform duration-300 sm:translate-x-0 sm:static mt-8 w-64
          sm:flex-shrink-0 sm:mt-0 overflow-y-auto`}
      >
        <Link href="/">
          <h2 className="text-5xl font-bold hidden sm:block">smp46</h2>
        </Link>
        <div className="mt-4 flex space-x-4">
          <a
            href="https://discord.com/users/335649164769886208"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white sm:text-2xl text-4xl transition-transform duration-300
              hover:scale-110"
            aria-label="Discord"
            data-umami-event="Clicked Discord Link"
            data-link="external"
          >
            <FaDiscord />
          </a>
          <a
            href="https://github.com/smp46"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white sm:text-2xl text-4xl transition-transform duration-300
              hover:scale-110"
            aria-label="GitHub"
            data-umami-event="Clicked Github Link"
            data-link="external"
          >
            <FaGithub />
          </a>
          <a
            href="https://linkedin.com/in/smp46"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white sm:text-2xl text-4xl transition-transform duration-300
              hover:scale-110"
            aria-label="LinkedIn"
            data-umami-event="Clicked LinkedIn Link"
            data-link="external"
          >
            <FaLinkedin />
          </a>
          <a
            href="mailto:me@smp46.me"
            className="text-white sm:text-2xl text-4xl transition-transform duration-300
              hover:scale-110"
            target="_blank"
            rel="noopener noreferrer"
            data-umami-event="Clicked email Link"
            data-link="external"
          >
            <SiGmail />
          </a>
          <a
            href="httpsL//smp46.me/feeds/feed.xml"
            className="text-white sm:text-2xl text-4xl transition-transform duration-300
              hover:scale-110"
            target="_blank"
            rel="noopener noreferrer"
            data-umami-event="Clicked rss Link"
            data-link="external"
          >
            <FaRssSquare />
          </a>
        </div>

        <nav className="flex flex-col sm:space-y-2 space-y-4 mt-6">
          {navLinks.map(({ href, label }) => {
            const isActive =
              href === '/' ? pathname === '/' : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                className={`text-white transition-transform duration-300 hover:scale-110 origin-left
                cursor-pointer ${
                isActive
                    ? 'font-semibold sm:text-2xl text-3xl'
                    : 'sm:text-xl text-2xl'
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
      {pathname === '/' && (
        <button
          aria-label="Open search bar"
          onClick={() => setShowSearch(true)}
          className="fixed bottom-4 right-4 z-20 p-0 border-0 bg-transparent cursor-pointer sm:hidden
            block"
        >
          <IoSearchCircleSharp className="text-5xl hover:scale-110 transition-transform duration-200" />
        </button>
      )}
    </>
  );
}
