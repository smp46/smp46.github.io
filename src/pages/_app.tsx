import type { AppProps } from 'next/app'; // Import AppProps type
import Layout from '../components/layout';
import Script from 'next/script';
import 'tailwindcss/tailwind.css';
import '../prism-theme.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
        <Script src="https://data.smp46.me/getinfo" data-website-id="c19979eb-45c7-48a1-be90-acaf7e819bde" />
      <Component {...pageProps} />
    </Layout>
  );
}
