# Solidity Keyboard Generator

Mechanical Keyboard Builder .Web3

![Preview]

## Overview

This app lets you create and brag you mechanical keyboard on blockchain!

You can also tip other user's keyboards (and take tips for yours!)

It's using Ethereum testnet (Goerli), so you don't need to spend real money to play with it.

Being deployed, this app is completely serverless and static, all the backend work being processed by smart-contract.

## Requirements

- [Node.js](https://nodejs.org)\
  Minimum: **16.x**\
  Recomended: **18.12** or later

## Install
Install dependencies
```sh
yarn
```

Set up environment variables as follows:<br>
https://docs.alchemy.com/docs/alchemy-quickstart-guide
```dotenv
NODE_API_URL=""
GOERLI_PRIVATE_KEY=""
```

### Deploy smart-contract
```sh
hardhat run deploy
```

## Development
### Install git hooks
For commit lint
```sh
yarn prepare
```

### Run dev server
```sh
yarn dev
```
Navigate to http://localhost:3000

## Test
```sh
yarn test-chain
```

[Preview]: https://gcyrkvfwpvlwjrrklxnh.supabase.co/storage/v1/object/public/tutorials/b71ebdf5-d544-49fb-a52f-6f1f261f83d0/tutorial_Euqy2mFXpuX1Z5wHzcGOO
