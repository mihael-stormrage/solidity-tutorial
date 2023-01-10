import { ethers } from 'ethers';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import { Keyboards } from 'typechain-types';
import useEffectAsync from 'hooks/use-effect-async';
import { useMetaMaskAccount } from 'context/meta-mask-account-provider';
import getKeyboardsContract from 'utils/getKeyboardsContract';
import isAddressesEqual from 'utils/isAddressesEqual';
import PrimaryButton from 'components/primary-button';
import TipButton from 'components/tip-button';
import Keyboard, { KeyboardProps } from 'components/keyboard';

const Home = () => {
  const { ethereum, connectedAccount, connectAccount } = useMetaMaskAccount();
  const [keyboards, setKeyboards] = useState<Keyboards.KeyboardStructOutput[]>([]);
  const [isKeyboardsLoading, setIsKeyboardsLoading] = useState(false);

  const keyboardsContract = getKeyboardsContract(ethereum);

  const getKeyboards = async () => {
    if (!ethereum || !connectedAccount) return;
    setIsKeyboardsLoading(true);
    const keyboardsData = await keyboardsContract!!.getKeyboards();
    console.log('Retrieved keyboards...', keyboardsData);
    setKeyboards(keyboardsData);
    setIsKeyboardsLoading(false);
  };

  const addContractEventHandlers = () => {
    if (!keyboardsContract || !connectedAccount) return;
    keyboardsContract.on('KeyboardCreated', async (keyboard) => {
      if (connectedAccount && !isAddressesEqual(keyboard.owner, connectedAccount)) {
        toast('Somebody created a new keyboard!', { id: JSON.stringify(keyboard) });
      }
      await getKeyboards();
    });
    keyboardsContract.on('TipSent', (recipient, amount) => {
      if (!isAddressesEqual(recipient, connectedAccount)) return;
      toast(`You received a tip of ${ethers.utils.formatEther(amount)} eth!`, { id: recipient + amount });
    });
  };

  useEffectAsync(getKeyboards, [!!keyboardsContract, connectedAccount]);
  useEffect(addContractEventHandlers, [!!keyboardsContract, connectedAccount]);

  const KeyboardsGallery = (): JSX.Element => {
    if (keyboards.length) {
      return (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-2 p-2'>
          {keyboards.map(([kind, isPBT, filter, owner], i) => (
            <div key={nanoid(4)} className='relative'>
              <Keyboard kind={kind as KeyboardProps['kind']} isPBT={isPBT} filter={filter} />
              <span className='absolute top-1 right-6'>
                {isAddressesEqual(owner, connectedAccount)
                  ? <UserCircleIcon className='h-5 w-5 text-indigo-100' />
                  : <TipButton keyboardsContract={keyboardsContract!!} index={i} />}
              </span>
            </div>
          ))}
        </div>
      );
    }
    if (isKeyboardsLoading) return <p>Loading Keyboards...</p>;
    return <p>No keyboards yet!</p>;
  };

  if (!ethereum) return <p>Please install MetaMask to connect to this site</p>;
  if (!connectedAccount) {
    return <PrimaryButton onClick={connectAccount}>Connect MetaMask Wallet</PrimaryButton>;
  }
  return (
    <div className='flex flex-col gap-4'>
      <PrimaryButton type='link' href='/create'>Create a Keyboard!</PrimaryButton>
      <KeyboardsGallery />
    </div>
  );
};

export default Home;
