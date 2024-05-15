import { useState } from "react";
import { getContract } from "../lib/ethers";

const MintNFT = () => {
  const [tokenURI, setTokenURI] = useState("");
  const [status, setStatus] = useState("");

  const handleMint = async () => {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" }); // Request wallet connection
      const contract = getContract();
      const transaction = await contract.mint(tokenURI);
      await transaction.wait();
      setStatus("NFT minted successfully");
    } catch (error) {
      console.error(error);
      setStatus("Error minting NFT");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <input
        className="border border-gray-300 p-2 rounded"
        type="text"
        value={tokenURI}
        onChange={(e) => setTokenURI(e.target.value)}
        placeholder="Enter token URI"
      />
      <button
        className="bg-blue-500 text-white p-2 rounded"
        onClick={handleMint}
      >
        Mint NFT
      </button>
      <p>{status}</p>
    </div>
  );
};

export default MintNFT;
