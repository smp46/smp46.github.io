import React from 'react';
import Head from 'next/head';
import { promises as fs } from 'fs';
import path from 'path';
import grayMatter from 'gray-matter';
import Link from 'next/link';

export default function Personal({ posts }) {
  const personalProjects = posts.filter((post) => post.type === 'personal');
  const undergradProjects = posts.filter((post) => post.type === 'undergrad');

  return (
    <div className="min-h-screen py-10 px-6">
      <Head>
        <title>smp46 - Projects</title>
      </Head>
      <header className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-extrabold mb-4">
          Welcome to My Portfolio
        </h1>
        <p className="text-lg text-gray-600">
          Explore my personal and undergraduate projects showcasing my journey
          and skills.
        </p>
      </header>

      <main className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Personal Projects Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Personal Projects</h2>
          <div className="grid grid-cols-1 gap-3 ">
            {personalProjects.map((post) => {
              const { title, path } = post;
              return (
                <Link key={path} href={path}>
                  <div className="group p-6 rounded-lg shadow-lg bg-white hover:bg-gray-50 transition cursor-pointer border border-gray-200">
                    <h3 className="text-xl font-semibold transition-transform duration-100 transform group-hover:scale-110 group-hover:origin-left inline-block">
                      {title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2">
                      Click to learn more about this project.
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Undergrad Projects Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Undergrad Projects</h2>
          <div className="grid grid-cols-1 gap-3 ">
            {undergradProjects.map((post) => {
              const { title, path } = post;
              return (
                <Link key={path} href={path}>
                  <div className="group p-6 rounded-lg shadow-lg bg-white hover:bg-gray-50 transition cursor-pointer border border-gray-200">
                    <h3 className="text-xl font-semibold transition-transform duration-100 transform group-hover:scale-110 group-hover:origin-left inline-block">
                      {title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2">
                      Click to learn more about this project.
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </div>
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

  const posts = files.map((file) => {
    return {
      path: `/projects/${file.filename.replace('.mdx', '')}`,
      title: file.matter.data.title,
      type: file.matter.data.type || 'personal', // Default type to personal if not defined
    };
  });

  return {
    props: {
      posts,
    },
  };
}
