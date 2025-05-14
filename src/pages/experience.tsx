import React from 'react';
import { FaLinkedin } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';
import Head from 'next/head';

export default function Experience() {
  return (
    <div
      id="welcome"
      className="flex items-center justify-center md:min-h-screen"
    >
      <div className="container mx-auto px-4 py-8 sm:py-0">
        <Head>
          <title>My Experience - Past Roles and Work History – smp46</title>
          <meta
            name="description"
            content="A detailed look at smp46's professional experience, roles."
          ></meta>
          <meta
            name="keywords"
            content="smp46, software engineer experience, developer work history, resume, tech career, experience, professional background"
          ></meta>
        </Head>
        <h1 className="text-4xl font-bold mb-8 text-center">My Experience</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-3xl font-semibold">
              Treasurer at UQ Cyber Squad
              <br />
              <small className="text-gray-500">October 2024 - Current</small>
            </h3>
            <ul className="mt-4 text-xl list-disc pl-5 space-y-3">
              <li>Approving, managing and balancing finances for the Club.</li>
              <li>
                Reaching out to industry to secure talks, sponsorships and other
                experiences for our members.
              </li>
              <li>
                Overall, running and supporting a rapidly growing university
                club.
              </li>
            </ul>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-3xl font-semibold">
              Computer Salesperson at Australian Computer Traders
              <br />
              <small className="text-gray-500">March 2023 - Current</small>
            </h3>
            <ul className="mt-4 text-xl list-disc pl-5 space-y-3">
              <li>
                Working in the primary retail store for the company, focusing on
                sales of refurbished laptops and desktops.
              </li>
              <li>Both in person and over the phone sales and tech support.</li>
              <li>
                Continued to utilise technical skills to assist with and enhance
                on-site tech work and refurbishment.
              </li>
            </ul>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-3xl font-semibold">
              Computer Technician at Pro Computers
              <br />
              <small className="text-gray-500">
                December 2019 - March 2022
              </small>
            </h3>
            <ul className="mt-4 text-xl list-disc pl-5 space-y-3">
              <li>
                Customer facing computer technician role with a focus on
                computer repairs, customer support and retail sales.
              </li>
              <li>
                Promoted from work experience to a traineeship to a full-time
                position within the business.
              </li>
              <li>
                Helped manage the commencement of a new shopfront and solo
                operated stores.
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center text-xl">
          <p>
            Send me an email or contact me on LinkedIn for more information or
            to request a full résumé.
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            <a
              href="mailto:me@smp46.me"
              target="_blank"
              rel="noopener noreferrer"
              data-umami-event="Clicked email Link"
              data-link="external"
            >
              <SiGmail size="40" />
            </a>
            <a
              href="https://linkedin.com/in/smp46"
              target="_blank"
              rel="noopener noreferrer"
              data-umami-event="Clicked LinkedIn Link"
              data-link="external"
            >
              <FaLinkedin size="40" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
