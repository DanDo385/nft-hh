// components/MintNFT.jsx
"use client";

import React, { useState } from 'react';
import { ethers } from 'ethers';
import NFTArtifact from '../artifacts/contracts/NFT.sol/NFT.json';
import contractAddress from '../artifacts/NFT_address.json';

const MintNFT = ({ provider, signer }) => {
  const [tokenURI, setTokenURI] = useState('');
  const [mintingStatus, setMintingStatus] = useState('');

  const mintNFT = async () => {
    setMintingStatus('Minting in progress...'); // Initial status message
    try {
      const contract = new ethers.Contract(contractAddress.address, NFTArtifact.abi, signer);
      const tx = await contract.mint(tokenURI);
      await tx.wait();
      setMintingStatus('Minting successful!'); // Success message
    } catch (error) {
      console.error('Minting error:', error);
      setMintingStatus(`Minting failed: ${error.message}`); // Error message
    }
  };

  return (
    <div className="p-4 border rounded shadow">
      <input
        type="text"
        value={tokenURI}
        onChange={(e) => setTokenURI(e.target.value)}
        placeholder="Enter token URI"
        className="input input-bordered mb-2"
      />
      <button onClick={mintNFT} className="btn btn-primary">
        Mint NFT
      </button>
      <p>{mintingStatus}</p> {/* Display the minting status */}
    </div>
  );
};

export default MintNFT;
erro