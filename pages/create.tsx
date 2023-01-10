import { ExternalProvider } from '@ethersproject/providers';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { useRouter } from 'next/router';
import {
  MouseEventHandler, ReactNode, useEffect, useState,
} from 'react';
import Keyboard, { KeyboardProps } from '../components/keyboard';
import PrimaryButton from '../components/primary-button';
import LoadingSvg from '../components/loading-svg';
import getContract from '../utils/getKeyboardsContract';
import { Keyboards } from '../typechain-types';

const inputClassName = [
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
].join(' ');

enum TxnState {
  DONE,
  WAIT,
  PENDING,
}

const Create = () => {
  const router = useRouter();
  const [ethereum, setEthereum] = useState<MetaMaskInpageProvider & ExternalProvider>();
  const [connectedAccount, setConnectedAccount] = useState<string>();
  const [keyboardKind, setKeyboardKind] = useState<Keyboards.KeyboardStructOutput['kind']>(0);
  const [isPBT, setIsPBT] = useState(false);
  const [filter, setFilter] = useState('');
  const [miningState, setMiningState] = useState<TxnState>(TxnState.DONE);

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

  const submitCreate: MouseEventHandler = async (e) => {
    e.preventDefault();
    if (!ethereum) return console.error('Ethereum object is required to create a keyboard');
    setMiningState(TxnState.WAIT);
    try {
      const keyboardsContract = getContract(ethereum);
      const createTxn = await keyboardsContract!!.create(keyboardKind, isPBT, filter);
      setMiningState(TxnState.PENDING);
      console.log('Create transaction started...', createTxn.hash);
      await createTxn.wait();
      console.log('Created keyboard!', createTxn.hash);
      return await router.push('/');
    } finally {
      setMiningState(TxnState.DONE);
    }
  };

  const renderButtonContent = (): ReactNode => {
    if (miningState === TxnState.DONE) return 'Create Keyboard!';
    return (
      <>
        <LoadingSvg />
        {miningState === TxnState.PENDING ? 'Pending...' : 'Creating...'}
      </>
    );
  };

  if (!ethereum) return <p>Please install MetaMask to connect to this site</p>;
  if (!connectedAccount) {
    return <PrimaryButton onClick={connectAccount}>Connect MetaMask Wallet</PrimaryButton>;
  }
  return (
    <div className='flex flex-col gap-y-8'>
      <form className='mt-8 flex flex-col gap-y-6'>
        <div>
          <label htmlFor='keyboard-type' className='block text-sm font-medium text-gray-700'>
            Keyboard Type
          </label>
          <select
            id='keyboard-type'
            name='keyboard-type'
            className={inputClassName}
            value={keyboardKind}
            onChange={(e) => setKeyboardKind(Number(e.target.value))}
          >
            <option value={0}>60%</option>
            <option value={1}>75%</option>
            <option value={2}>80%</option>
            <option value={3}>ISO-105</option>
          </select>
        </div>

        <div>
          <label htmlFor='keycap-type' className='block text-sm font-medium text-gray-700'>
            Keycap Type
          </label>
          <select
            id='keycap-type'
            name='keycap-type'
            className={inputClassName}
            value={isPBT ? 'pbt' : 'abs'}
            onChange={(e) => setIsPBT(e.target.value === 'pbt')}
          >
            <option value='abs'>ABS</option>
            <option value='pbt'>PBT</option>
          </select>
        </div>

        <div>
          <label htmlFor='filter' className='block text-sm font-medium text-gray-700'>
            Filter
          </label>
          <select
            id='filter'
            name='filter'
            className={inputClassName}
            onChange={(e) => setFilter(e.target.value)}
            value={filter}
          >
            <option value=''>None</option>
            <option value='sepia'>Sepia</option>
            <option value='grayscale'>Grayscale</option>
            <option value='invert'>Invert</option>
            <option value='hue-rotate-90'>Hue Rotate (90°)</option>
            <option value='hue-rotate-180'>Hue Rotate (180°)</option>
          </select>
        </div>

        <PrimaryButton
          type='submit'
          disabled={miningState !== TxnState.DONE}
          color={miningState === TxnState.PENDING ? 'amber-400' : 'white'}
          onClick={submitCreate}
        >
          {renderButtonContent()}
        </PrimaryButton>
      </form>

      <div>
        <h2 className='block text-lg font-medium text-gray-700'>Preview</h2>
        <Keyboard kind={keyboardKind as KeyboardProps['kind']} isPBT={isPBT} filter={filter} />
      </div>
    </div>
  );
};

export default Create;
