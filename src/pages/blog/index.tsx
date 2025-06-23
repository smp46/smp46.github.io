import React from 'react';
import Head from 'next/head';
import { promises as fs } from 'fs';
import path from 'path';
import grayMatter from 'gray-matter';
import Link from 'next/link';
import Image from 'next/image';
import { FaRss, FaAtom } from 'react-icons/fa';
import { VscJson } from 'react-icons/vsc';

interface Post {
  path: string;
  title: string;
  subtitle: string;
  description: string;
  type: string;
  date: string;
  heroImage?: string;
  heroImageBlurData?: string;
  featured?: boolean;
}

interface Props {
  posts: Post[];
}

const formatDate = (dateString: string) => {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default function FeaturedBlogLayout({ posts }: Props) {
  const featuredPost = posts.find((post) => post.featured) || posts[0];
  const otherPosts = posts.filter((post) => post.path !== featuredPost.path);

  return (
    <>
      <div
        id="featured-layout"
        className="flex items-center justify-center md:min-h-screen"
      >
        <div className="min-h-screen py-10 px-4 w-full max-w-6xl mx-auto">
          <Head>
            <title> Projects and Other Things - smp46</title>
            <meta
              name="description"
              content="Explore my personal and undergraduate projects showcasing my journey and skills."
            ></meta>
            <meta
              name="keywords"
              content="Portfolio, Developer, Projects, Write ups, articles, programming"
            ></meta>
          </Head>

          <header className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">
              Projects and Other Things
            </h1>
            <p className="text-xl text-gray-600">
              A collection of some things I&#39;ve built and thought about.
            </p>
          </header>

          <main>
            <section className="mb-16">
              <Link href={featuredPost.path} passHref>
                <div className="group grid grid-cols-1 md:grid-cols-2 gap-8 items-center cursor-pointer">
                  {featuredPost.heroImage && (
                    <div className="relative h-80 rounded-lg overflow-hidden shadow-lg">
                      <Image
                        src={featuredPost.heroImage}
                        alt={`Hero image for ${featuredPost.title}`}
                        fill
                        style={{ objectFit: 'contain' }}
                        className="group-hover:scale-105 transition-transform duration-300"
                        placeholder="blur"
                        blurDataURL={featuredPost.heroImageBlurData}
                      />
                    </div>
                  )}
                  <div
                    className={
                      featuredPost.heroImage ? '' : 'md:col-span-2 text-center'
                    }
                  >
                    <p className="text-sm text-gray-500 mb-2">
                      {formatDate(featuredPost.date)}
                    </p>
                    <h2 className="text-4xl font-extrabold text-black mb-4">
                      {featuredPost.title}
                    </h2>
                    <p className="text-lg text-gray-700">
                      {featuredPost.description}
                    </p>
                  </div>
                </div>
              </Link>
            </section>

            <section>
              <h3 className="text-3xl font-bold mb-6 border-b pb-2">
                All Articles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherPosts.map((post) => (
                  <Link key={post.path} href={post.path} passHref>
                    <div
                      className="group block cursor-pointer bg-white p-6 rounded-lg shadow-md hover:shadow-xl
                        transition-shadow"
                    >
                      <p className="text-sm text-gray-500 mb-2">
                        {formatDate(post.date)}
                      </p>
                      <h4 className="text-2xl font-bold text-black">
                        {post.title}
                      </h4>
                      <p className="text-md text-gray-600 mt-2">
                        {post.subtitle}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </main>

          <footer className="max-w-5xl mx-auto mt-16 mb-8">
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
                Choose your preferred format to stay updated.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const postsDirectory = path.join(process.cwd(), 'src/blog');
  const filenames = await fs.readdir(postsDirectory);

  const posts: Post[] = await Promise.all(
    filenames.map(async (filename) => {
      const filePath = path.join(postsDirectory, filename);
      const content = await fs.readFile(filePath, 'utf8');
      const { data } = grayMatter(content);

      return {
        path: `/blog/${filename.replace(/\.mdx$/, '')}`,
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        type: data.type || 'personal',
        date: data.updated || data.date || data.created,
        heroImage: data.heroImage || null,
        heroImageBlurData: data.heroImageBlurData || null,
        featured: data.featured || false,
      };
    })
  );

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return {
    props: {
      posts,
    },
  };
}
