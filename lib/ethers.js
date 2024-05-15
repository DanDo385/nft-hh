import { ethers } from "ethers";
import NFTArtifact from "../artifacts/contracts/NFT.sol/NFT.json";
import contractAddress from "../artifacts/NFT_address.json";

export const getContract = () => {
  if (!window.ethereum) throw new Error("No crypto wallet found");
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress.address, NFTArtifact.abi, signer);
  return contract;
};
