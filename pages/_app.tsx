
import Head from 'next/head';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import ToastProvider from '../components/ToastProvider';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Terratrust - Secure Land Ownership on Blockchain</title>
        <meta name="description" content="Prevent land fraud with blockchain-verified ownership records. Built on Starknet for Nigeria." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </Head>
      <ToastProvider />
      <Component {...pageProps} />
    </>
  );
}
