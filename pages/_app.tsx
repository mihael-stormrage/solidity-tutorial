import '../styles/globals.css';
import { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    <Toaster />
    <Component {...pageProps} />
  </>
);

export default MyApp;
