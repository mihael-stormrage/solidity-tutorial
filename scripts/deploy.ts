import { ethers } from 'hardhat';
import { retrieveKeyboards } from './utils';

const main = async () => {
  const keyboardsContractFactory = await ethers.getContractFactory('Keyboards');
  const keyboardsContract = await keyboardsContractFactory.deploy();
  await keyboardsContract.deployed();
  console.log('The keyboards contract is deployed!', keyboardsContract.address);
  await retrieveKeyboards(keyboardsContract);
};

main()
  .catch((err) => {
    process.exitCode = 1;
    console.error(err);
  });
