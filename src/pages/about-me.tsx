import React from 'react';
import Image from 'next/image';
import Head from 'next/head';

export default function AboutMe() {
  return (
    <div id="about-me" className="lg:grid-cols-2 gap-8 items-center py-12 px-6">
      <Head>
        <title>smp46 - About Me</title>
      </Head>

      <div className="flex justify-center">
        <Image
          src="/me.jpg"
          width={400}
          height={300}
          alt="Profile Picture"
          className="rounded-full object-cover shadow-md"
        />
      </div>

      <div className="text-center mt-9">
        <h1 className="text-4xl font-bold mb-6">About Me</h1>
        <p className="text-lg mb-4">
          I am excited to complete my Bachelor&#39;s of Computer Science and am keen
          to enter the field of my major, Cyber Security. I&#39;m an active member
          of the UQ Cyber Squad, where we are lucky enough to get regular
          industry talks and workshops. I enjoy participating in CTFs and follow
          the industry closely.
        </p>
        <p className="text-lg">
          In my free time, you&#39;ll find me working on personal projects or
          playing video games.
        </p>
      </div>
    </div>
  );
}
