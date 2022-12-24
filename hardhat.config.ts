import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: process.env.NODE_API_URL,
      accounts: [process.env.GOERLI_PRIVATE_KEY ?? []].flat(),
    }
  }
};

export default config;
