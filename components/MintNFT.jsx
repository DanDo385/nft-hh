// components/MintNFT.jsx

import React, { useState } from 'react';
import { ethers } from 'ethers';
import NFTArtifact from '../artifacts/contracts/NFT.sol/NFT.json';
import contractAddress from '../artifacts/NFT_address.json';

const MintNFT = ({ provider, signer }) => {
  const [tokenURI, setTokenURI] = useState('');
  const [mintedTokenId, setMintedTokenId] = useState(null);

  const mintNFT = async () => {
    try {
      const contract = new ethers.Contract(contractAddress.address, NFTArtifact.abi, signer);
      const tx = await contract.mint(tokenURI);
      await tx.wait();
      const tokenId = await contract.tokenCount();
      setMintedTokenId(tokenId.toNumber());
    } catch (error) {
      console.error('Minting error:', error);
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
      {mintedTokenId !== null && <p>Minted Token ID: {mintedTokenId}</p>}
    </div>
  );
};

export default MintNFT;
