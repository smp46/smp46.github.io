import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { execSync } from 'child_process';

const POSTS_PATH = path.join(process.cwd(), 'src/projects');

function getGitDates(filePath: string) {
  try {
    // Get first commit date (created)
    const created = execSync(
      `git log --follow --format=%aI --reverse "${filePath}" | head -1`,
      { encoding: 'utf8' }
    ).trim();

    // Get last commit date (updated)
    const updated = execSync(
      `git log -1 --format=%aI "${filePath}"`,
      { encoding: 'utf8' }
    ).trim();

    return {
      created: created ? new Date(created).toISOString().split('T')[0] : null,
      updated: updated ? new Date(updated).toISOString().split('T')[0] : null,
    };
  } catch (error) {
    return { created: null, updated: null };
  }
}

function addDatesToMdx() {
  const filenames = fs.readdirSync(POSTS_PATH);

  filenames
    .filter((name) => name.endsWith('.mdx'))
    .forEach((filename) => {
      const filePath = path.join(POSTS_PATH, filename);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data: frontMatter, content } = matter(fileContent);

      // Skip if date already exists
      if (frontMatter.date) {
        console.log(`✓ ${filename} already has date`);
        return;
      }

      // Get dates from Git
      const gitDates = getGitDates(filePath);

      // Fallback to file stats if Git history not available
      const stats = fs.statSync(filePath);
      const fallbackDate = stats.mtime.toISOString().split('T')[0];

      // Add dates to frontmatter
      frontMatter.date = gitDates.updated || fallbackDate;
      if (gitDates.created) {
        frontMatter.created = gitDates.created;
      }
      if (gitDates.updated && gitDates.updated !== gitDates.created) {
        frontMatter.updated = gitDates.updated;
      }

      // Write back to file
      const newContent = matter.stringify(content, frontMatter);
      fs.writeFileSync(filePath, newContent);

      console.log(`✅ Added dates to ${filename}:`);
      console.log(`   date: ${frontMatter.date}`);
      if (frontMatter.created) console.log(`   created: ${frontMatter.created}`);
      if (frontMatter.updated) console.log(`   updated: ${frontMatter.updated}`);
    });
}

addDatesToMdx();

