import MainBackound from '@/components/MainBackound';
import { initializeGSAPPlugins } from '@/utils/gsap';

import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import '@/styles/index.css';
initializeGSAPPlugins();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {process.env.NODE_ENV === 'development' && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            width: '100%',
            background: 'red',
            color: 'white',
            textAlign: 'center',
          }}
        >
          DEV SITE
        </div>
      )}
      <MainBackound />
      <Component {...pageProps} />
    </>
  );
}
