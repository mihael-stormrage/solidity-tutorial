import { ExternalProvider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import abi from './Keyboards.json';

const contractAddress = '0x039e26625FAd8c8c877B8E947e935B76BcFce123';
const { abi: contractABI } = abi;

const getContract = (ethereum: ExternalProvider) => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(contractAddress, contractABI, signer);
};

export { contractAddress, contractABI, getContract as default };
