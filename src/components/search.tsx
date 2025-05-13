// components/Search.tsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface SearchResult {
  id: string;
  data: () => Promise<{
    url: string;
    meta: {
      title: string;
    };
    excerpt: string;
  }>;
}

interface SearchResultItemProps {
  result: SearchResult;
  onResultClick?: () => void;
}

interface PagefindWindow extends Window {
  pagefind?: {
    search: (query: string) => Promise<{ results: SearchResult[] }>;
    debouncedSearch?: (query: string) => Promise<{ results: SearchResult[] }>;
  };
}

declare const window: PagefindWindow;

interface SearchProps {
  onResultClick?: () => void;
}

export default function Search({ onResultClick }: SearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    async function loadPagefind() {
        if (typeof window.pagefind === "undefined") {
        try {
            window.pagefind = await import(
            // @ts-expect-error pagefind exists only on build
            /* webpackIgnore: true */ "./pagefind/pagefind.js"
            );
        } catch(e) {
            console.log(e);
            window.pagefind = {
            search: () => Promise.resolve({ 
                results: [
                {
                    id: "dummy-id",
                    data: async () => ({
                    url: '/dummy-url',
                    meta: {
                        title: 'dummy title'
                    },
                    excerpt: 'dummy excerpt'
                    })
                }
                ] 
            })
            }
        }
        }

    }
    loadPagefind();
  }, []);

  async function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const newQuery = e.target.value;
    setQuery(newQuery);

    if (!newQuery.trim() || !window.pagefind) {
      setResults([]);
      return;
    }

    try {
      const search = await window.pagefind.search(newQuery);
      setResults(search.results);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={handleSearch}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1
            focus:ring-black"
          aria-label="Search"
          autoFocus
        />

        <div
          className={`absolute left-0 right-0 top-full mt-2 bg-white rounded-lg shadow-lg border p-4
            max-h-96 overflow-y-auto z-10 transition-opacity duration-200 ease-in-out
            ${results.length > 0 ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        >
          <h3 className="text-lg font-medium mb-2">Search Results</h3>
          <div className="space-y-4">
            {results.map((result) => (
                <SearchResultItem 
                    key={result.id} 
                    result={result} 
                    onResultClick={onResultClick}
                />
            ))}
          </div>
        </div>
      </div>

      <div className="h-96"></div>
    </div>
  );
}




function SearchResultItem({ result, onResultClick }: SearchResultItemProps) {
  const [data, setData] = useState<{
    url: string;
    meta: { title: string };
    excerpt: string;
  } | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const resultData = await result.data();
        resultData.url = resultData.url.replace('_next/static/chunks/pages/', '');
        setData(resultData);
      } catch (error) {
        console.error('Error fetching result data:', error);
      }
    }
    fetchData();
  }, [result]);

  if (!data) return null;

  return (
    <Link
      href={data.url}
      className="block hover:bg-gray-50 p-2 rounded transition"
      onClick={() => onResultClick && onResultClick()}
    >
      <h4 className="font-medium">{data.meta.title}</h4>
      <p
        className="text-sm text-gray-600"
        dangerouslySetInnerHTML={{ __html: data.excerpt }}
      ></p>
    </Link>
  );
}
