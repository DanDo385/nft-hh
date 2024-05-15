import { ethers } from "ethers";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";

export const getContract = () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = provider.getSigner();
  const contractAddress = "YOUR_CONTRACT_ADDRESS";
  return new ethers.Contract(contractAddress, NFT.abi, signer);
};
