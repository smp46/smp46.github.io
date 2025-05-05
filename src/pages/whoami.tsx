import React from 'react';
import Image from 'next/image';
import Head from 'next/head';

export default function Whoami() {
  return (
    <div id="whoami" className="container mx-auto px-4 py-8">
      <div className="lg:grid-cols-2 gap-8 items-center py-12 px-6">
        <Head>
          <title>whoami - Software Engineer, Student & Tinkerer – smp46</title>
          <meta name="description" content="Learn more about smp46 – a software engineer with a passion for building tools, apps, and playful digital experiences. Here's my journey, philosophy, and what drives me."></meta>
          <meta name="keywords" content="smp46, whoami, about smp46, software engineer bio, developer story, personal site, web developer, creative engineer"></meta>
        </Head>

        <div className="flex justify-center">
          <Image
            src="https://cdn.statically.io/gh/smp46/smp46.github.io/nextjs/assets/me.jpg"
            width={400}
            height={300}
            alt="Profile Picture"
            className="rounded-full object-cover shadow-md"
          />
        </div>

        <div className="text-center mt-9">
          <h1 className="text-5xl font-bold mb-6">whoami</h1>
          <p className="text-2xl mb-4">
            I am excited to complete my Bachelor&#39;s of Computer Science and am
            keen to enter the field of my major, Cyber Security. I&#39;m an active
            member of the UQ Cyber Squad, where we are lucky enough to get regular
            industry talks and workshops. I enjoy participating in CTFs and follow
            the industry closely.
            <br />
            <br />
            In my free time, you&#39;ll find me working on personal projects or
            playing video games.
          </p>
        </div>
      </div>
    </div>
  );
}
