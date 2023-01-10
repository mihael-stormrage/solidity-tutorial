import { ExternalProvider } from '@ethersproject/providers';
import { MetaMaskInpageProvider } from '@metamask/providers';
import {
  createContext, ReactNode, useContext, useState,
} from 'react';
import useEffectAsync from 'hooks/use-effect-async';

const MetaMaskAccountContext = createContext({} as {
  ethereum?: MetaMaskInpageProvider & ExternalProvider,
  connectedAccount?: string,
  connectAccount: () => Promise<void>,
});

const MetaMaskAccountProvider = ({ children }: { children: ReactNode }) => {
  const [ethereum, setEthereum] = useState<MetaMaskInpageProvider & ExternalProvider>();
  const [connectedAccount, setConnectedAccount] = useState<string>();

  const setEthereumFromWindow = async () => {
    if (window.ethereum) setEthereum(window.ethereum);
  };

  const handleAccounts = (accounts: string[]) => {
    if (!accounts.length) return console.log('No authorized accounts yet');
    const [account] = accounts;
    console.log('We have an authorized account: ', account);
    return setConnectedAccount(account);
  };

  const getConnectedAccount = async () => {
    if (!ethereum) return;
    const accounts = await ethereum.request({ method: 'eth_accounts' }) as string[];
    handleAccounts(accounts);
  };

  const connectAccount = async () => {
    if (!ethereum) return alert('MetaMask is required to connect an account');
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' }) as string[];
    return handleAccounts(accounts);
  };

  useEffectAsync(setEthereumFromWindow);
  useEffectAsync(getConnectedAccount);

  const value = { ethereum, connectedAccount, connectAccount };

  return (
    <MetaMaskAccountContext.Provider value={value}>
      {children}
    </MetaMaskAccountContext.Provider>
  );
};

const useMetaMaskAccount = () => useContext(MetaMaskAccountContext);

export { MetaMaskAccountProvider as default, useMetaMaskAccount };
