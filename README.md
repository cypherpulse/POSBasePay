# Based-POS

[![Solidity](https://img.shields.io/badge/Solidity-^0.8.24-blue.svg)](https://soliditylang.org/)
[![Base Network](https://img.shields.io/badge/Base-Mainnet-blue.svg)](https://base.org/)
[![WalletConnect](https://img.shields.io/badge/WalletConnect-2.0-blue.svg)](https://walletconnect.com/)

A decentralized point-of-sale (POS) payment system built on the Base blockchain, featuring a secure payment vault contract and a user-friendly frontend interface.

## Project Structure

This monorepo contains:

- **contract-solidity/**: The smart contract implementation of POSVault, a decentralized payment vault for collecting ETH payments with protocol fees and leaderboard tracking.
- **frontend/**: (Coming soon) The web interface for merchants and customers to interact with the POS system.

## Getting Started

### Contract

For detailed information about the smart contract, including installation, setup, deployment, and usage, please refer to the [contract README](contract-solidity/README.md).

### Frontend

Frontend implementation will be added soon. Stay tuned!

## Features

- Secure ETH payment collection via smart contract
- Multi-merchant support with individual vaults
- Automated protocol fee collection
- Leaderboard tracking for merchants
- WalletConnect integration for seamless payments
- Gas-optimized operations on Base network

## License

This project is licensed under the MIT License - see the [contract README](contract-solidity/README.md) for details.