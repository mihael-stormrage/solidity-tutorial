import { ethers } from 'ethers';
import { ExternalProvider } from '@ethersproject/providers';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { useEffect, useState } from 'react';
import PrimaryButton from '../components/primary-button';
import abi from '../utils/Keyboards.json';

const Home = () => {
  const [ethereum, setEthereum] = useState<MetaMaskInpageProvider & ExternalProvider>();
  const [connectedAccount, setConnectedAccount] = useState<string>();
  const [keyboards, setKeyboards] = useState([]);

  const contractAddress = '0x74452192d2cB51D18F9dCA116d8E58C89ba35115';
  const { abi: contractABI } = abi;

  const getKeyboards = async () => {
    if (!ethereum || !connectedAccount) return;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const keyboardsContract = new ethers.Contract(contractAddress, contractABI, signer);
    const keyboardsData = await keyboardsContract.getKeyboards();
    console.log('Retrieved keyboards...', keyboardsData);
    setKeyboards(keyboardsData);
  };

  const handleAccounts = (accounts: string[]) => {
    if (!accounts.length) return console.log('No authorized accounts yet');
    const [account] = accounts;
    console.log('We have an authorized account: ', account);
    return setConnectedAccount(account);
  };

  const connectAccount = async () => {
    if (!ethereum) return alert('MetaMask is required to connect an account');
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' }) as string[];
    return handleAccounts(accounts);
  };

  const getConnectedAccount = async () => {
    if (!window.ethereum) return;
    setEthereum(window.ethereum);
    if (!ethereum) return;
    const accounts = await ethereum.request({ method: 'eth_accounts' }) as string[];
    handleAccounts(accounts);
  };

  useEffect(() => {
    getConnectedAccount();
  });

  useEffect(() => {
    getKeyboards();
  }, [connectedAccount]);

  if (!ethereum) return <p>Please install MetaMask to connect to this site</p>;
  if (!connectedAccount) {
    return <PrimaryButton onClick={connectAccount}>Connect MetaMask Wallet</PrimaryButton>;
  }
  return (
    <p>
      {'Connected account: '}
      {connectedAccount}
    </p>
  );
};

export default Home;
