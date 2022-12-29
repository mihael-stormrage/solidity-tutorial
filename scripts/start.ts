import { ethers } from 'hardhat';
import { retrieveKeyboards } from './utils';

const main = async () => {
  const [owner, somebodyElse] = await ethers.getSigners();
  const keyboardsContractFactory = await ethers.getContractFactory('Keyboards');
  const keyboardsContract = await keyboardsContractFactory.deploy();
  await keyboardsContract.deployed();

  const keyboardTxn1 = await keyboardsContract.create(0, true, 'sepia');
  await keyboardTxn1.wait();
  const keyboardTxn2 = await keyboardsContract.connect(somebodyElse).create(1, false, 'grayscale');
  await keyboardTxn2.wait();
  await retrieveKeyboards(keyboardsContract);
  await retrieveKeyboards(keyboardsContract, 'And as somebody else!', somebodyElse);

  const balanceBefore = await ethers.provider.getBalance(somebodyElse.address);
  console.log('somebodyElse balance before!', ethers.utils.formatEther(balanceBefore));
  const tipTxn = await keyboardsContract.tip(1, { value: ethers.utils.parseEther('1000') });
  await tipTxn.wait();
  const balanceAfter = await ethers.provider.getBalance(somebodyElse.address);
  console.log('somebodyElse balance after!', ethers.utils.formatEther(balanceAfter));
};

main()
  .catch((err) => {
    process.exitCode = 1;
    console.error(err);
  });
