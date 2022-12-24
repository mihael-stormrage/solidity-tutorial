import { ethers } from 'hardhat';
import { retrieveKeyboards } from './utils';

const main = async () => {
  const [owner, somebodyElse] = await ethers.getSigners();
  const keyboardsContractFactory = await ethers.getContractFactory('Keyboards');
  const keyboardsContract = await keyboardsContractFactory.deploy();
  await keyboardsContract.deployed();

  const keyboardTxn1 = await keyboardsContract.create('A really great keyboard!');
  await keyboardTxn1.wait();
  const keyboardTxn2 = await keyboardsContract.connect(somebodyElse).create('An even better keyboard!');
  await keyboardTxn2.wait();
  await retrieveKeyboards(keyboardsContract);
  await retrieveKeyboards(keyboardsContract, 'And as somebody else!', somebodyElse);
};

main()
  .catch((err) => {
    process.exitCode = 1;
    console.error(err);
  });