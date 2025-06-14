import React from 'react';
import Head from 'next/head';
import { promises as fs } from 'fs';
import path from 'path';
import grayMatter from 'gray-matter';
import Link from 'next/link';
import { FaRss, FaAtom } from 'react-icons/fa';
import { VscJson } from 'react-icons/vsc';

interface Post {
  path: string;
  title: string;
  subtitle: string;
  type: string;
  description: string;
  keywords: string;
  github: string;
  date: string;
  created: string;
  updated: string;
}

interface Props {
  posts: Post[];
}

export default function Personal({ posts }: Props) {
  const personalProjects = posts.filter((post) => post.type === 'personal');
  const undergradProjects = posts.filter((post) => post.type === 'undergrad');

  return (
    <>
      <div
        id="welcome"
        className="flex items-center justify-center md:min-h-screen"
      >
        <div className="min-h-screen py-10 px-6">
          <Head>
            <title>
              Projects - Achievements, Attemps and Other Things - smp46
            </title>
            <meta
              name="description"
              content="Explore my personal and undergraduate projects showcasing my journey and skills."
            ></meta>
            <meta
              name="keywords"
              content="Portfolio, Developer, Software Developer, Projects, Write ups, articles, programming"
            ></meta>
          </Head>
          <header className="max-w-4xl mx-auto text-center mb-10">
            <h1 className="text-4xl font-bold mb-4">Welcome to My Portfolio</h1>
            <p className="text-xl text-gray-600">
              Explore my personal and undergraduate projects showcasing my
              journey and skills.
            </p>
          </header>

          <main className="max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Personal Projects Section */}
            <section>
              <h2 className="text-3xl font-bold mb-6">Personal Projects</h2>
              <div className="grid grid-cols-1 gap-3">
                {personalProjects.map((post) => {
                  const { title, subtitle, path } = post;
                  return (
                    <Link key={path} href={path}>
                      <div
                        className="group p-6 rounded-lg shadow-lg bg-white hover:bg-gray-50 transition
                          cursor-pointer border border-gray-200"
                      >
                        <h3
                          className="text-2xl font-semibold transition-transform duration-100 transform
                            group-hover:scale-110 group-hover:origin-left inline-block"
                        >
                          {title}
                        </h3>
                        <p className="text-md text-gray-500 mt-2">{subtitle}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* Undergrad Projects Section */}
            <section>
              <h2 className="text-3xl font-bold mb-6">Undergrad Projects</h2>
              <div className="grid grid-cols-1 gap-3">
                {undergradProjects.map((post) => {
                  const { title, subtitle, path } = post;
                  return (
                    <Link key={path} href={path}>
                      <div
                        className="group p-6 rounded-lg shadow-lg bg-white hover:bg-gray-50 transition
                          cursor-pointer border border-gray-200"
                      >
                        <h3
                          className="text-2xl font-semibold transition-transform duration-100 transform
                            group-hover:scale-110 group-hover:origin-left inline-block"
                        >
                          {title}
                        </h3>
                        <p className="text-md text-gray-500 mt-2">{subtitle}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          </main>
          <footer className="max-w-5xl mt-16 mb-8">
            <div className="rounded-lg bg-white p-6">
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="https://cdn.statically.io/gh/smp46/smp46.github.io/nextjs/public/feeds/feed.xml"
                  className="group flex items-center gap-2 px-4 py-2 rounded-md bg-orange-50 text-orange-600
                    hover:bg-orange-100 transition-all duration-200 border border-orange-200"
                  aria-label="RSS Feed"
                >
                  <FaRss className="text-lg group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">RSS</span>
                </a>

                <a
                  href="https://cdn.statically.io/gh/smp46/smp46.github.io/nextjs/public/feeds/atom.xml"
                  className="group flex items-center gap-2 px-4 py-2 rounded-md bg-purple-50 text-purple-600
                    hover:bg-purple-100 transition-all duration-200 border border-purple-200"
                  aria-label="Atom Feed"
                >
                  <FaAtom className="text-lg group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">Atom</span>
                </a>

                <a
                  href="https://cdn.statically.io/gh/smp46/smp46.github.io/nextjs/public/feeds/feed.json"
                  className="group flex items-center gap-2 px-4 py-2 rounded-md bg-blue-50 text-blue-600
                    hover:bg-blue-100 transition-all duration-200 border border-blue-200"
                  aria-label="JSON Feed"
                >
                  <VscJson className="text-lg group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">JSON</span>
                </a>
              </div>

              <p className="text-sm text-gray-500 text-center mt-4">
                Choose your preferred format to stay updated with new projects.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const postsDirectory = path.join(process.cwd(), 'src/projects');
  const filenames = await fs.readdir(postsDirectory);

  const files = await Promise.all(
    filenames.map(async (filename) => {
      const filePath = path.join(postsDirectory, filename);
      const content = await fs.readFile(filePath, 'utf8');
      const matter = grayMatter(content);
      return {
        filename,
        matter,
      };
    })
  );

  const posts: Post[] = files.map((file) => {
    return {
      path: `/projects/${file.filename.replace('.mdx', '')}`,
      title: file.matter.data.title,
      subtitle: file.matter.data.subtitle,
      description: file.matter.data.description,
      keywords: file.matter.data.keywords,
      github: file.matter.data.github,
      type: file.matter.data.type || 'personal', // Default type to personal if not defined
      date: file.matter.data.date,
      created: file.matter.data.created,
      updated: file.matter.data.updated,
    };
  });

  return {
    props: {
      posts,
    },
  };
}
