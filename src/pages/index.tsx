// pages/index.tsx
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { BsCommand } from 'react-icons/bs';

export default function Welcome() {
  const rightGifRef = useRef<HTMLImageElement>(null);
  const leftGifRef = useRef<HTMLImageElement>(null);
  const finalImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const animationDuration = 2.4;

    const animateGif = () => {
      setTimeout(() => {
        if (leftGifRef.current) {
          leftGifRef.current.style.opacity = '0';
        }
        if (rightGifRef.current) {
          rightGifRef.current.style.opacity = '0';
        }
        if (finalImageRef.current) {
          finalImageRef.current.style.opacity = '1';
        }
      }, animationDuration * 1000);
    };

    animateGif();
  }, []);

  return (
    <div
      id="welcome"
      className="flex flex-col items-center justify-center md:min-h-screen relative"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center sm:px-8 py-10">
          <Head>
            <title>
              Hi, I&#39;m smp46 - Aspiring Software Developer & Builder of Things
            </title>
            <meta
              name="description"
              content="I&#39;m a passionate undergrad studying Computer Science at the University of Queensland. This website highlights some of my achievements and skills as an aspiring software developer."
            ></meta>
            <meta
              name="keywords"
              content="smp46, software engineer, developer portfolio, web developer, TypeScript, Next.js, personal site, student"
            ></meta>
          </Head>
          <div className="mb-4">
            <div
              style={{
                position: 'relative',
                width: '150px',
                height: '150px',
                margin: '0 auto',
              }}
            >
              <Image
                ref={leftGifRef}
                src="https://cdn.statically.io/gh/smp46/smp46.github.io/nextjs/assets/me3.gif"
                alt="Left GIF animation"
                unoptimized={false}
                fill
                style={{ position: 'absolute', top: 0, left: 0, opacity: 1 }}
              />
              <Image
                ref={rightGifRef}
                src="https://cdn.statically.io/gh/smp46/smp46.github.io/nextjs/assets/snake3.gif"
                unoptimized={false}
                alt="Right GIF animation"
                fill
                style={{ position: 'absolute', top: 0, left: 0, opacity: 1 }}
              />
              <Image
                ref={finalImageRef}
                src="https://cdn.statically.io/gh/smp46/smp46.github.io/nextjs/assets/pp.png?q=85&amp;f=webp"
                alt="Final Image"
                fill
                style={{ position: 'absolute', top: 0, left: 0, opacity: 0 }}
              />
            </div>
          </div>

          <h1 className="sm:text-6xl text-5xl font-semibold text-black mt-4 mb-2">
            Hi, I&#39;m Samuel
          </h1>
          <h2 className="text-4xl sm:text-5xl text-gray-600">(smp46)</h2>

          <p className="sm:mt-4 mt-12 md:text-3xl text-2xl sm:p-4">
            I&#39;m a passionate undergrad studying Computer Science at the
            University of Queensland. This website highlights some of my
            achievements and skills as an aspiring software developer.
          </p>
        </div>
      </div>

      <div
        className="hidden lg:block fixed bottom-0 left-0 right-0 bg-white bg-opacity-90 shadow-md
          pl-64 py-6 px-4 w-full"
      >
        <div className="flex items-center justify-center flex-wrap text-gray-500 max-w-4xl mx-auto">
          <span className="mr-2">Press</span>

          <svg className="mx-1 w-8 h-8" viewBox="0 0 100 100">
            <rect
              x="5"
              y="5"
              width="90"
              height="90"
              rx="10"
              ry="10"
              className="fill-none stroke-gray-500 stroke-2"
            />
            <text
              x="50"
              y="60"
              fill="currentColor"
              className="text-3xl"
              textAnchor="middle"
            >
              Ctrl
            </text>
          </svg>
          <span className="ml-1">+</span>

          <svg className="w-20 h-8" viewBox="0 0 200 100">
            <rect
              x="5"
              y="5"
              width="190"
              height="90"
              rx="10"
              ry="10"
              className="fill-none stroke-gray-500 stroke-2"
            />
            <text
              x="100"
              y="60"
              fill="currentColor"
              className="text-3xl"
              textAnchor="middle"
            >
              Space
            </text>
          </svg>

          <span className="mr-2">or</span>

          <div
            className="mx-1 w-8 h-8 border-[0.05vw] border-gray-500 rounded-md flex items-center
              justify-center"
          >
            <BsCommand className="text-gray-500 text-md" />
          </div>
          <span className="ml-1">+</span>

          <svg className="w-20 h-8" viewBox="0 0 200 100">
            <rect
              x="5"
              y="5"
              width="190"
              height="90"
              rx="10"
              ry="10"
              className="fill-none stroke-gray-500 stroke-2"
            />
            <text
              x="100"
              y="60"
              fill="currentColor"
              className="text-3xl"
              textAnchor="middle"
            >
              Space
            </text>
          </svg>

          <span className="ml-1">
            to launch the search bar anywhere on this website.
          </span>
        </div>
      </div>
    </div>
  );
}
