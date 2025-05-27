import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { FaGithub } from 'react-icons/fa';

export default function Post({ children, frontMatter }) {
  const {
    title,
    description,
    keywords,
    subtitle,
    github,
    date,
    created,
    updated,
    readingTime,
  } = frontMatter;

  const [isLoading, setIsLoading] = useState(true);

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const showUpdated = updated && updated !== created;
  const hasAnyDate = created || date || updated;

  useEffect(() => {
    const images = document.querySelectorAll('img');
    let loadedCount = 0;

    if (images.length === 0) {
      setIsLoading(false);
      return;
    }

    images.forEach((img) => {
      if (img.complete) {
        loadedCount++;
        if (loadedCount === images.length) setIsLoading(false);
      } else {
        img.addEventListener('load', () => {
          loadedCount++;
          if (loadedCount === images.length) setIsLoading(false);
        });
        img.addEventListener('error', () => {
          loadedCount++;
          if (loadedCount === images.length) setIsLoading(false);
        });
      }
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const h1 = document.querySelector('h1');
      if (h1 && !document.getElementById('post-dates')) {
        const belowH1 = document.createElement('div');
        belowH1.id = 'below-h1';
        belowH1.className =
          'flex justify-between text-sm text-gray-600 mt-2 mb-8 not-prose';

        const dateDiv = document.createElement('div');
        dateDiv.id = 'post-dates';
        dateDiv.style.whiteSpace = 'pre-line';

        let dateText = '';
        if (created) dateText += `Started: ${formatDate(created)}`;
        if (showUpdated) {
          if (created) {
            console.log(window.innerWidth);
            if (window.innerWidth <= 500) {
              dateText += '\n';
            } else {
              dateText += ' • ';
            }
          }
          dateText += `Updated: ${formatDate(updated)}`;
        }

        dateDiv.textContent = dateText;

        const timeDiv = document.createElement('div');
        timeDiv.id = 'post-read-time';

        let timeText = '';
        if (readingTime) {
          timeText += `${readingTime}`;
        }

        timeDiv.textContent = timeText;

        belowH1.insertAdjacentElement('beforeend', dateDiv);
        belowH1.insertAdjacentElement('beforeend', timeDiv);
        h1.insertAdjacentElement('afterend', belowH1);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [hasAnyDate, created, showUpdated, updated, readingTime]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Head>
        <title>{title.concat(' | ').concat(subtitle)}</title>
        <meta name="description" content={description}></meta>
        <meta name="keywords" content={keywords}></meta>
      </Head>

      <div
        className={` fixed inset-0 bg-white flex items-center justify-center z-29 sm:ml-64
          transition-opacity duration-500
          ${isLoading ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} `}
      >
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-black border-t-transparent"></div>
      </div>

      <div className="fixed top-0 right-0 w-[80px] h-[80px] z-50 sm:block hidden">
        <a
          className="github-corner"
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View source on GitHub"
        >
          <svg
            width="80"
            height="80"
            viewBox="0 0 250 250"
            style={{
              fill: '#151513',
              color: '#fff',
              position: 'absolute',
              top: 0,
              border: 0,
              right: 0,
            }}
            aria-hidden="true"
          >
            <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
            <path
              d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
              fill="currentColor"
              style={{ transformOrigin: '130px 106px' }}
              className="octo-arm"
            ></path>
            <path
              d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
              fill="currentColor"
              className="octo-body"
            ></path>
          </svg>
        </a>
      </div>

      <div className="flex items-center justify-center min-h-screen mb-5 overflow-hidden">
        <div
          className="prose prose-headings:break-words prose-headings:hyphens-auto prose-lg
            prose-img:mx-auto prose-headings:mt-8 prose-headings:font-semibold
            prose-headings:text-black prose-h1:text-3xl sm:prose-h1:text-5xl
            prose-h1:font-extrabold sm:prose-h1:font-bold prose-h2:text-3xl
            prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-2xl prose-h6:text-xl
            dark:prose-headings:text-black text-black overflow-hidden max-w-[100ch]"
        >
          {children}
        </div>
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View source on GitHub"
          className="fixed bottom-4 bg-white rounded-full right-4 z-28 text-black hover:scale-110
            transition-transform duration-200 sm:hidden block"
        >
          <FaGithub className="text-3xl" />
        </a>
      </div>
    </div>
  );
}
