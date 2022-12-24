import { Signer } from 'ethers';
import { ethers } from 'hardhat';
import { Keyboards } from '../typechain-types';

const getOwner = () => ethers.getSigners()
  .then(([owner]) => owner);

export const retrieveKeyboards = async (
  keyboardsContract: Keyboards,
  message: string = 'We got the keyboards!',
  signer?: Signer,
) => {
  const keyboards = await keyboardsContract
    .connect(signer ?? await getOwner())
    .getKeyboards();
  console.log(message, keyboards);
};
