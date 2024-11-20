require("@nomiclabs/hardhat-waffle");
require('dotenv').config({ path: './.env.local' });
const { task } = require("hardhat/config");

// Retrieve the private key and RPC URL from environment variables
const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;
const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;

// Define a custom task to print the list of accounts
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: "0.8.10", // Specify the Solidity version
  defaultNetwork: "sepolia", // Set the default network to Sepolia
  networks: {
    hardhat: {}, // Configuration for Hardhat's local network
    sepolia: {
      url: rpcUrl || "https://sepolia.infura.io/v3/84fa584a498a45428a3f4dad697b27bd", // Use Infura RPC URL
      accounts: [privateKey] // Private key for the account to deploy
    }
  }
};
