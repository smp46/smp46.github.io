// components/Search.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

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
  isSelected: boolean;
  onResultClick?: () => void;
  loadedData?: any;
  onMouseEnter: () => void;
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
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loadedResultData, setLoadedResultData] = useState<Record<string, any>>(
    {}
  );
  const router = useRouter();

  useEffect(() => {
    setSelectedIndex(results.length > 0 ? 0 : -1);
  }, [results]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!results.length) {
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < results.length) {
            const data = loadedResultData[results[selectedIndex].id];
            if (data && data.url) {
              if (onResultClick) {
                onResultClick();
              }
              router.push(data.url);
            }
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [results, selectedIndex, loadedResultData, router, onResultClick]);

  useEffect(() => {
    const loadAllResultData = async () => {
      const dataPromises = results.map(async (result) => {
        try {
          const data = await result.data();

          data.url = data.url.replace('_next/static/chunks/pages/', '');
          return { id: result.id, data };
        } catch (error) {
          console.error('Error loading result data:', error);
          return null;
        }
      });

      const loadedData = await Promise.all(dataPromises);
      const dataMap: Record<string, any> = {};

      loadedData.forEach((item) => {
        if (item) {
          dataMap[item.id] = item.data;
        }
      });

      setLoadedResultData(dataMap);
    };

    if (results.length > 0) {
      loadAllResultData();
    }
  }, [results]);

  useEffect(() => {
    const loadPagefind = async () => {
      if (typeof window.pagefind === 'undefined') {
        try {
          window.pagefind = await import(
            // @ts-expect-error pagefind exists only on build
            /* webpackIgnore: true */ './pagefind/pagefind.js'
          );
        } catch (e) {
          console.log(e);
          window.pagefind = {
            search: () =>
              Promise.resolve({
                results: [
                  {
                    id: 'dummy-id',
                    data: async () => ({
                      url: '/dummy-url',
                      meta: {
                        title: 'dummy title',
                      },
                      excerpt: 'dummy excerpt',
                    }),
                  },
                  {
                    id: 'dummy-id2',
                    data: async () => ({
                      url: '/dummy-url2',
                      meta: {
                        title: 'title',
                      },
                      excerpt: 'excerpt',
                    }),
                  },
                ],
              }),
          };
        }
      }
    };

    loadPagefind();
  }, []);

  async function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const newQuery = e.target.value;
    setQuery(newQuery);

    if (!newQuery.trim() || !window.pagefind) {
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={handleSearch}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none
          focus:ring-2 focus:ring-black/10 transition-all duration-200 shadow-sm"
        aria-label="Search"
        autoFocus
      />;
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
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none
            focus:ring-2 focus:ring-black/10 shadow-sm"
          aria-label="Search"
          autoFocus
        />

        <div
          className={`absolute left-0 right-0 top-full mt-1 bg-white rounded-lg shadow-md border
            border-gray-200 max-h-96 overflow-y-auto z-10 transition-all duration-100
            ease-in-out
            ${results.length > 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
        >
          <div className="space-y-3">
            {results.map((result, index) => (
              <SearchResultItem
                key={result.id}
                isSelected={index === selectedIndex}
                onResultClick={onResultClick}
                loadedData={loadedResultData[result.id]}
                onMouseEnter={() => setSelectedIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="h-96"></div>
    </div>
  );
}

function SearchResultItem({
  isSelected,
  onResultClick,
  loadedData,
  onMouseEnter,
}: SearchResultItemProps) {
  const router = useRouter();

  if (!loadedData) {
    return null;
  }

  return (
    <div
      className={`p-4 rounded transition cursor-pointer
        ${isSelected ? 'bg-gray-200 ring-gray-300' : 'hover:bg-gray-50'}`}
      onClick={() => {
        if (onResultClick) onResultClick();
        router.push(loadedData.url);
      }}
      onMouseEnter={onMouseEnter}
    >
      <h4 className="font-medium">{loadedData.meta.title}</h4>
      <style jsx global>{`
        p mark {
          background-color: #d3d3d3;
          color: #000;
          padding: 0 2px;
          border-radius: 2px;
        }
      `}</style>
      <p
        className="text-sm text-gray-600"
        dangerouslySetInnerHTML={{ __html: loadedData.excerpt }}
      ></p>
    </div>
  );
}
