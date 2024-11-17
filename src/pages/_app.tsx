import type { AppProps } from 'next/app'; // Import AppProps type
import Layout from '../components/layout';
import '../pages/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

