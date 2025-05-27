import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import Post from '../../templates/post.js';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypePrismPlus from 'rehype-prism-plus';
import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';

const POSTS_PATH = path.join(process.cwd(), 'src/projects');

export async function getStaticPaths() {
  const filenames = fs.readdirSync(POSTS_PATH);
  const slugs = filenames.map((name) => name.replace(/\.mdx?$/, ''));
  const paths = slugs.map((slug) => ({ params: { slug } }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const filePath = path.join(POSTS_PATH, `${slug}.mdx`);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data: frontMatter, content } = matter(fileContent);

  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [
        remarkGfm, // GitHub Flavored Markdown
        remarkReadingTime,
      ],
      rehypePlugins: [rehypeSlug, rehypePrismPlus],
    },
    scope: frontMatter,
  });

  const enhancedFrontMatter = {
    ...frontMatter,
    ...readingTimeData,
  };

  return {
    props: {
      frontMatter: enhancedFrontMatter,
      mdxSource,
    },
  };
}

export default function PostPage({ frontMatter, mdxSource }) {
  return (
    <Post frontMatter={frontMatter}>
      <MDXRemote {...mdxSource} />
    </Post>
  );
}

let readingTimeData = {};

// Create the remark plugin
function remarkReadingTime() {
  return function (tree) {
    const textOnPage = toString(tree);
    const readingTime = getReadingTime(textOnPage);

    // Store the reading time data
    readingTimeData = {
      readingTime: readingTime.text,
      wordCount: readingTime.words,
      minutes: Math.ceil(readingTime.minutes),
    };
  };
}
