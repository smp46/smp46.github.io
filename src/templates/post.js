import Head from 'next/head';

export default function Post({ children, frontMatter }) {
  const { title, description, keywords} = frontMatter;
  return (
    <div className="min-h-screen ">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description}></meta>
        <meta name="keywords" content={keywords}></meta>
      </Head>

    <div className="flex items-center justify-center min-h-screen mb-5">
      <div className="prose prose-headings:mt-8 prose-headings:font-semibold prose-headings:text-black 
      prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl 
      prose-h6:text-lg dark:prose-headings:text-black text-black">
        {children}
      </div>
    </div>
    </div>
  );
}

