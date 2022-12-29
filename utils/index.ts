import { ExternalProvider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import abi from './Keyboards.json';

const contractAddress = '0x5345D19d556D019fB2C6526681d6873434bAe1C0';
const { abi: contractABI } = abi;

const getContract = (ethereum: ExternalProvider) => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(contractAddress, contractABI, signer);
};

export { contractAddress, contractABI, getContract as default };
