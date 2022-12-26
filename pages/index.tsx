import { ExternalProvider } from '@ethersproject/providers';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import PrimaryButton from '../components/primary-button';
import Keyboard, { KeyboardProps } from '../components/keyboard';
import getContract from '../utils';
import { Keyboards } from '../typechain-types';

const Home = () => {
  const [ethereum, setEthereum] = useState<MetaMaskInpageProvider & ExternalProvider>();
  const [connectedAccount, setConnectedAccount] = useState<string>();
  const [keyboards, setKeyboards] = useState<Keyboards.KeyboardStructOutput[]>([]);

  const getKeyboards = async () => {
    if (!ethereum || !connectedAccount) return;
    const keyboardsContract = getContract(ethereum);
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
  if (keyboards.length) {
    return (
      <div className='flex flex-col gap-4'>
        <PrimaryButton type='link' href='/create'>Create a Keyboard!</PrimaryButton>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-2 p-2'>
          {keyboards.map(([kind, isPBT, filter]) => (
            <Keyboard key={nanoid(4)} kind={kind as KeyboardProps['kind']} isPBT={isPBT} filter={filter} />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className='flex flex-col gap-4'>
      <PrimaryButton type='link' href='/create'>Create a Keyboard!</PrimaryButton>
      <p>No keyboards yet!</p>
    </div>
  );
};

export default Home;
