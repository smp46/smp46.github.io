import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Feed } from 'feed';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';

const POSTS_PATH = path.join(process.cwd(), 'src/blog');

interface PostFrontMatter {
  title: string;
  description: string;
  date: string;
  created: string;
  updated: string;
  [key: string]: any;
}

interface Post {
  slug: string;
  frontMatter: PostFrontMatter;
  content: string;
  htmlContent?: string;
}

// Create markdown processor
const markdownProcessor = remark()
  .use(remarkGfm) // GitHub Flavored Markdown support
  .use(remarkHtml, { sanitize: false }); // Convert to HTML

async function convertMarkdownToHtml(markdown: string): Promise<string> {
  const result = await markdownProcessor.process(markdown);
  return result.toString();
}

async function getAllPosts(): Promise<Post[]> {
  const filenames = fs.readdirSync(POSTS_PATH);

  const posts = await Promise.all(
    filenames
      .filter((name) => name.endsWith('.mdx'))
      .map(async (filename) => {
        const slug = filename.replace(/\.mdx?$/, '');
        const filePath = path.join(POSTS_PATH, filename);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data: frontMatter, content } = matter(fileContent);

        // Convert markdown content to HTML
        const htmlContent = await convertMarkdownToHtml(content);

        return {
          slug,
          frontMatter: frontMatter as PostFrontMatter,
          content: content, // Keep raw markdown if needed
          htmlContent: htmlContent, // Add HTML version
        };
      })
  );

  // Sort posts by date (newest first), using updated > date > created
  return posts.sort((a, b) => {
    const dateA =
      a.frontMatter.updated ||
      a.frontMatter.date ||
      a.frontMatter.created ||
      '1970-01-01';
    const dateB =
      b.frontMatter.updated ||
      b.frontMatter.date ||
      b.frontMatter.created ||
      '1970-01-01';
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });
}

async function generateFeeds() {
  const baseURL =
    'https://cdn.statically.io/gh/smp46/smp46.github.io/nextjs/public';
  const feedDirectory = 'feeds';
  const author = 'smp46';
  const websiteURL = 'https://smp46.me';

  const posts = await getAllPosts();

  const feed = new Feed({
    title: `smp46`,
    description: 'Projects, attempts and other things',
    id: websiteURL,
    link: websiteURL,
    favicon: `${baseURL}/favicon.ico`,
    language: 'en',
    generator: 'Next.js using Feed for Node.js',
    feedLinks: {
      rss2: `${baseURL}/${feedDirectory}/feed.xml`,
      atom: `${baseURL}/${feedDirectory}/atom.xml`,
      json: `${baseURL}/${feedDirectory}/feed.json`,
    },
    author: {
      name: author,
      email: 'me@smp46.me',
      link: `${websiteURL}/whoami`,
    },
    copyright: `All rights reserved ${new Date().getFullYear()}, ${author}`,
  });

  posts.forEach((post) => {
    const { title, description, date, created, updated } = post.frontMatter;
    const url = `${websiteURL}/blog/${post.slug}`;

    const mainDate =
      date || updated || created || new Date().toISOString().split('T')[0];
    const publishedDate = created || date || mainDate;
    const updatedDate = updated || date || mainDate;

    feed.addItem({
      title: title,
      id: url,
      link: url,
      description: description,
      content: post.htmlContent, // Use HTML content instead of raw markdown
      date: new Date(mainDate),
      published: new Date(publishedDate),
      // Only add updated if it's different from published
      ...(updatedDate !== publishedDate && {
        updated: new Date(updatedDate),
      }),
    });
  });

  // Create feeds directory if it doesn't exist
  fs.mkdirSync(`./public/${feedDirectory}`, { recursive: true });

  // Write feed files
  fs.writeFileSync(`./public/${feedDirectory}/feed.xml`, feed.rss2());
  fs.writeFileSync(`./public/${feedDirectory}/atom.xml`, feed.atom1());
  fs.writeFileSync(`./public/${feedDirectory}/feed.json`, feed.json1());

  console.log(`✅ RSS feeds generated successfully!`);
  console.log(`   - ${posts.length} posts included`);
  console.log(`   - Files saved to /public/${feedDirectory}/`);

  const postsWithoutDates = posts.filter(
    (p) =>
      !p.frontMatter.date && !p.frontMatter.created && !p.frontMatter.updated
  );

  if (postsWithoutDates.length > 0) {
    console.log(`⚠️  ${postsWithoutDates.length} posts without dates`);
  }
}

generateFeeds().catch((error) => {
  console.error('❌ Error generating feeds:', error);
  process.exit(1);
});
