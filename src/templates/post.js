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
                        console.log(window.innerWidth)
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
                <div
                    className="absolute top-0 right-0 w-0 h-0 border-t-[80px] border-l-[80px] border-t-black
            border-l-transparent"
                />

                <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View source on GitHub"
                    className="absolute top-2 right-2 text-white text-3xl hover:scale-110 transition-transform
            duration-200"
                >
                    <FaGithub />
                </a>
            </div>

            <div className="flex items-center justify-center min-h-screen mb-5 overflow-hidden">
                <div
                    className="prose prose-headings:break-words prose-headings:hyphens-auto prose-lg
            prose-img:mx-auto prose-headings:mt-8 prose-headings:font-semibold
            prose-headings:text-black prose-h1:text-3xl sm:prose-h1:text-5xl prose-h1:font-extrabold sm:prose-h1:font-bold prose-h2:text-3xl
            prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-2xl prose-h6:text-xl
            dark:prose-headings:text-black text-black overflow-hidden max-w-[100ch]"
                >
                    {children}
                </div>
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
    );
}
