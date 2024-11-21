import Head from 'next/head';
import Link from 'next/link';

export default function Post({ children, frontMatter }) {
  const { title } = frontMatter;
  return (
    <div className="min-h-screen ">
      <Head>
        <title>{title}</title>
      </Head>

    <div className="flex items-center justify-center min-h-screen mb-5">
      <div className="prose prose-headings:mt-8 prose-headings:font-semibold prose-headings:text-black 
      prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl 
      prose-h6:text-lg dark:prose-headings:text-black">
        {children}
      </div>
    </div>
    </div>
  );
}

