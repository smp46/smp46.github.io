// public/static/chunks/pages/pagefind/pagefind.js

// Mock implementation of the Pagefind API for development
export function search(query) {
  console.log("Using mock pagefind search with query:", query);

  // Return empty results if no query
  if (!query || !query.trim()) {
    return Promise.resolve({ results: [] });
  }

  // Generate mock results based on the query
  return Promise.resolve({
    results: [
      {
        id: `mock-result-1-${query}`,
        data: () => Promise.resolve({
          url: '/example-page-1',
          meta: { title: `Example Page About ${query}` },
          excerpt: `This is a sample result for "${query}" showing how search might work.`,
        }),
      },
      {
        id: `mock-result-2-${query}`,
        data: () => Promise.resolve({
          url: '/example-page-2',
          meta: { title: `Another Page Matching ${query}` },
          excerpt: `Another sample result matching "${query}" with different content.`,
        }),
      },
      {
        id: `mock-result-3-${query}`,
        data: () => Promise.resolve({
          url: '/blog/sample-post',
          meta: { title: `Blog Post Related to ${query}` },
          excerpt: `A blog post that contains information about "${query}" and related topics.`,
        }),
      },
    ],
  });
}

// Export any other methods that might be used
export default { search };

