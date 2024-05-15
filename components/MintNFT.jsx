// components/MintNFT.jsx

import { useState } from "react";
import { getContract } from "../lib/ethers";

const MintNFT = () => {
  const [tokenURI, setTokenURI] = useState("");
  const [status, setStatus] = useState("");

  const handleMint = async () => {
    try {
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
    <div>
      <input
        type="text"
        value={tokenURI}
        onChange={(e) => setTokenURI(e.target.value)}
        placeholder="Enter token URI"
      />
      <button onClick={handleMint}>Mint NFT</button>
      <p>{status}</p>
    </div>
  );
};

export default MintNFT;
