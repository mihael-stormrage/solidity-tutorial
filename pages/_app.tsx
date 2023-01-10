import 'styles/globals.css';
import { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import MetaMaskAccountProvider from 'context/meta-mask-account-provider';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <MetaMaskAccountProvider>
    <Toaster />
    <Component {...pageProps} />
  </MetaMaskAccountProvider>
);

export default MyApp;
