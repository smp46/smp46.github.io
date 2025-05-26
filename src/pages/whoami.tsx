import React from 'react';
import Image from 'next/image';
import Head from 'next/head';

export default function Whoami() {
  return (
    <div
      id="welcome"
      className="flex items-center justify-center md:min-h-screen"
    >
      <div className="container mx-auto px-4">
        <Head>
          <title>
            whoami - Aspiring Software Developer, Student & Tinkerer – smp46
          </title>
          <meta
            name="description"
            content="Learn more about smp46 – an aspiringu software developer with a passion for building tools, apps, and fun digital experiences. Here's my journey, philosophy, and what drives me."
          ></meta>
          <meta
            name="keywords"
            content="smp46, whoami, about smp46, software engineer bio, developer story, personal site, web developer, creative engineer"
          ></meta>
        </Head>

        <div className="flex flex-col lg:grid sm:gap-8 items-center py-12 sm:px-6">
          <div className="flex justify-center order-1">
            <div className="relative sm:w-96 sm:h-96 w-60 h-60 rounded-full overflow-hidden">
              <Image
                src="https://cdn.statically.io/gh/smp46/smp46.github.io/nextjs/assets/me.jpg"
                fill
                sizes="384px"
                alt="Picture of me"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,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"
              />
            </div>
          </div>

          <div className="text-center mt-6 lg:mt-0 order-2">
            <h1 className="text-5xl font-bold mb-6">whoami</h1>
            <p className="md:text-3xl text-2xl mb-4">
              I am excited to complete my Bachelor&#39;s of Computer Science and
              am keen to enter the field of my major, Cyber Security. I&#39;m an
              active member of the UQ Cyber Squad, where we are lucky enough to
              get regular industry talks and workshops. I enjoy participating in
              CTFs and follow the industry closely.
              <br />
              <br />
              In my free time, you&#39;ll find me working on personal projects
              or playing video games.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
