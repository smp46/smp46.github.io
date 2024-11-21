// pages/index.tsx
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Head from 'next/head';

export default function Home() {
  const rightGifRef = useRef<HTMLImageElement>(null);
  const leftGifRef = useRef<HTMLImageElement>(null);
  const finalImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const animationDuration = 2.4;

    const animateGif = () => {
      setTimeout(() => {
        if (leftGifRef.current) leftGifRef.current.style.opacity = '0';
        if (rightGifRef.current) rightGifRef.current.style.opacity = '0';
        if (finalImageRef.current) finalImageRef.current.style.opacity = '1';
      }, animationDuration * 1000);
    };

    animateGif();
  }, []);

  return (
    <div className="flex flex-col items-center text-center sm:px-8 py-10">
      <Head>
        <title>smp46</title>
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
            src="/me3.gif"
            alt="Left GIF animation"
            unoptimized={false}
            layout="fill"
            objectFit="contain"
            style={{ position: 'absolute', top: 0, left: 0, opacity: 1 }}
          />
          <Image
            ref={rightGifRef}
            src="/snake3.gif"
            unoptimized={false}
            alt="Right GIF animation"
            layout="fill"
            objectFit="contain"
            style={{ position: 'absolute', top: 0, left: 0, opacity: 1 }}
          />
          <Image
            ref={finalImageRef}
            src="/pp.png"
            alt="Final Image"
            layout="fill"
            objectFit="contain"
            style={{ position: 'absolute', top: 0, left: 0, opacity: 0 }}
          />
        </div>
      </div>

      <h1 className="text-5xl font-bold text-black mt-4 mb-2">
        Hi I&#39;m Samuel
      </h1>
      <h2 className="text-4xl text-gray-600">(smp46)</h2>

      <p className="sm:mt-4 mt-12 text-2xl sm:p-4">
        I&#39;m a passionate undergrad studying Computer Science at the
        University of Queensland. This website highlights some of my
        achievements and skills as an aspiring software developer.
      </p>
    </div>
  );
}
