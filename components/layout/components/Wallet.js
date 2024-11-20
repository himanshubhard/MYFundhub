import styled from "styled-components";
import { ethers } from "ethers";
import { useState } from "react";


const networks = {
  sepolia: {
    chainId: `0x${Number(11155111).toString(16)}`, // Sepolia Testnet Chain ID
    chainName: "Sepolia Testnet",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://sepolia.infura.io/v3/84fa584a498a45428a3f4dad697b27bd"],
    blockExplorerUrls: ["https://sepolia.etherscan.io"],
  },
};



const Wallet = () => {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask is not installed. Please install it to use this feature.");
        return;
      }

      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Create provider
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

      // Fetch signer
      const signer = provider.getSigner();

      // Get account address
      const Address = await signer.getAddress();
      setAddress(Address);

      // Get account balance
      const Balance = ethers.utils.formatEther(await signer.getBalance());
      setBalance(Balance);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet. Please try again.");
    }
  };

  return (
    <ConnectWalletWrapper onClick={connectWallet}>
      {balance === "" ? <Balance></Balance> : <Balance>{balance.slice(0, 4)} ETH</Balance>}
      {address === "" ? <Address>Connect Wallet</Address> : <Address>{address.slice(0, 6)}...{address.slice(-4)}</Address>}
    </ConnectWalletWrapper>
  );
};


const ConnectWalletWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) => props.theme.bgDiv};
  padding: 5px 9px;
  height: 100%;
  color: ${(props) => props.theme.color};
  border-radius: 10px;
  margin-right: 15px;
  font-family: 'Roboto';
  font-weight: bold;
  font-size: small;
  cursor: pointer;
`;

const Address = styled.h2`
    background-color: ${(props) => props.theme.bgSubDiv};
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 5px 0 5px;
    border-radius: 10px;
`

const Balance = styled.h2`
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    margin-right: 5px;
`

export default Wallet;