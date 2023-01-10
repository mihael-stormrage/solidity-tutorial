import { ExternalProvider } from '@ethersproject/providers';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { ethers } from 'ethers';
import { useState } from 'react';
import getContract from '../utils/getKeyboardsContract';
import LoadingSvg from './loading-svg';
import SecondaryButton from './secondary-button';

enum TxnState {
  DONE,
  WAIT,
  PENDING,
}

const TipButton = (
  { ethereum, index }: { ethereum: MetaMaskInpageProvider & ExternalProvider, index: number },
) => {
  const [miningState, setMiningState] = useState<TxnState>(TxnState.DONE);

  const submitTip = async () => {
    if (!ethereum) return console.error('Ethereum object is required to create a keyboard');
    setMiningState(TxnState.WAIT);
    try {
      const keyboardsContract = getContract(ethereum);
      const tipTxn = await keyboardsContract!!.tip(index, { value: ethers.utils.parseEther('0.01') });
      setMiningState(TxnState.PENDING);
      console.log('Tip transaction started...', tipTxn.hash);
      await tipTxn.wait();
      console.log('Sent tip!', tipTxn.hash);
    } finally {
      setMiningState(TxnState.DONE);
    }
  };

  const ButtonContent = () => {
    if (miningState === TxnState.DONE) return <>Tip 0.01 eth!</>;
    return (
      <>
        <LoadingSvg />
        {miningState === TxnState.PENDING ? 'Tipping...' : 'Wait...'}
      </>
    );
  };

  return (
    <SecondaryButton onClick={submitTip} disabled={miningState !== TxnState.DONE}>
      <ButtonContent />
    </SecondaryButton>
  );
};

export default TipButton;
