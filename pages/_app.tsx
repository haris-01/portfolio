import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import MainBackound from '@/components/MainBackound';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <MainBackound />
      <Component {...pageProps} />
    </>
  );
}
