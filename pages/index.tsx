import { ExternalProvider } from '@ethersproject/providers';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { ethers } from 'ethers';
import { nanoid } from 'nanoid';
import { MouseEventHandler, useEffect, useState } from 'react';
import PrimaryButton from '../components/primary-button';
import abi from '../utils/Keyboards.json';

const contractAddress = '0x74452192d2cB51D18F9dCA116d8E58C89ba35115';
const { abi: contractABI } = abi;

const getContract = (ethereum: ExternalProvider) => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(contractAddress, contractABI, signer);
};

const Home = () => {
  const [ethereum, setEthereum] = useState<MetaMaskInpageProvider & ExternalProvider>();
  const [connectedAccount, setConnectedAccount] = useState<string>();
  const [keyboards, setKeyboards] = useState([]);
  const [newKeyboard, setNewKeyboard] = useState('');

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

  const submitCreate: MouseEventHandler = async (e) => {
    e.preventDefault();
    if (!ethereum) return console.error('Ethereum object is required to create a keyboard');
    const keyboardsContract = getContract(ethereum);
    const createTxn = await keyboardsContract.create(newKeyboard);
    console.log('Create transaction started...', createTxn.hash);
    await createTxn.wait();
    console.log('Created keyboard!', createTxn.hash);
    return getKeyboards();
  };

  if (!ethereum) return <p>Please install MetaMask to connect to this site</p>;
  if (!connectedAccount) {
    return <PrimaryButton onClick={connectAccount}>Connect MetaMask Wallet</PrimaryButton>;
  }
  return (
    <div className='flex flex-col gap-y-8'>
      <form className='flex flex-col gap-y-2'>
        <div>
          <label htmlFor='keyboard-description' className='block text-sm font-medium text-gray-700'>
            Keyboard Description
          </label>
        </div>
        <input
          name='keyboard-type'
          className={[
            'mt-1',
            'block',
            'w-full',
            'pl-3',
            'pr-10',
            'py-2',
            'text-base',
            'border-gray-300',
            'focus:outline-none',
            'focus:ring-indigo-500',
            'focus:border-indigo-500',
            'sm:text-sm',
            'rounded-md',
          ].join(' ')}
          value={newKeyboard}
          onChange={(e) => setNewKeyboard(e.target.value)}
        />
        <PrimaryButton type='submit' onClick={submitCreate}>
          Create Keyboard!
        </PrimaryButton>
      </form>

      <div>{keyboards.map((keyboard) => <p key={nanoid(4)}>{keyboard}</p>)}</div>
    </div>
  );
};

export default Home;
