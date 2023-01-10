import { ExternalProvider } from '@ethersproject/providers';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { ethers } from 'ethers';
import abi from './Keyboards.json';

const contractAddress = '0xce2F49cb62f141D9FB3Ef66A4C753B8875d95A94';
const { abi: contractABI } = abi;

const getContract = (ethereum?: MetaMaskInpageProvider & ExternalProvider) => {
  if (!ethereum) return;
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(contractAddress, contractABI, signer);
};

export default getContract;
