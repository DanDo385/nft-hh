// components/NFTCards.jsx
"use client";
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import NFTArtifact from '../artifacts/contracts/NFT.sol/NFT.json';
import contractAddress from '../artifacts/NFT_address.json';

const NFTCards = ({ provider }) => {
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!provider) return;
      const contract = new ethers.Contract(contractAddress.address, NFTArtifact.abi, provider);
      const totalSupply = await contract.tokenCount();
      const items = [];

      for (let i = 1; i <= totalSupply; i++) {
        const uri = await contract.tokenURI(i);
        const response = await fetch(`https://ipfs.io/ipfs/${uri}`);
        const metadata = await response.json();

        items.push({
          tokenId: i,
          name: metadata.name,
          image: metadata.image,
          description: metadata.description
        });
      }

      setNfts(items);
    };

    fetchNFTs();
  }, [provider]);

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {nfts.map(nft => (
        <div key={nft.tokenId} className="border p-4 rounded shadow">
          <img src={nft.image} alt={nft.name} className="w-full h-auto mb-2" />
          <h5>{nft.name}</h5>
          <p>{nft.description}</p>
        </div>
      ))}
    </div>
  );
};

export default NFTCards;
