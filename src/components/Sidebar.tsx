import React from "react";
import Link from "next/link";
import { FaDiscord, FaGithub, FaLinkedin } from "react-icons/fa";
import { SiGmail } from "react-icons/si";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-black text-white flex flex-col px-4 py-8">
      <h1 className="text-5xl font-bold">smp46</h1>
      <div className="mt-4 flex space-x-4">
        <a
          href="https://discord.com/users/335649164769886208"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white text-2xl transition-transform duration-300 hover:scale-110"
          aria-label="Discord"
        >
          <FaDiscord />
        </a>
        <a
          href="https://github.com/smp46"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white text-2xl transition-transform duration-300 hover:scale-110"
          aria-label="GitHub"
        >
          <FaGithub />
        </a>
        <a
          href="https://linkedin.com/in/smp46"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white text-2xl transition-transform duration-300 hover:scale-110"
          aria-label="LinkedIn"
        >
          <FaLinkedin />
        </a>
      <a href="mailto:me@smp46.me" className="text-white text-2xl transition-transform duration-300 hover:scale-110" target="_blank" rel="noopener noreferrer">
        <SiGmail />
      </a>
      </div>

      <nav className="flex flex-col space-y-2 mt-6">
        <Link href="/" passHref className="text-white font-semibold text-xl transition-transform duration-300 hover:scale-110 origin-left cursor-pointer">
          Home
        </Link>
        <Link href="/personal-projects" passHref className="text-white text-xl transition-transform duration-300 hover:scale-110 origin-left cursor-pointer">
          Personal Projects
        </Link>
        <Link href="/undergrad-projects" passHref className="text-white text-xl transition-transform duration-300 hover:scale-110 origin-left cursor-pointer">
          Undergrad Projects
        </Link>
        <Link href="/employment" passHref className="text-white text-xl transition-transform duration-300 hover:scale-110 origin-left cursor-pointer">
          Employment
        </Link>
        <Link href="/about-me" passHref className="text-white text-xl transition-transform duration-300 hover:scale-110 origin-left cursor-pointer">
          About Me
        </Link>
      </nav>
    </div>
  );
}
