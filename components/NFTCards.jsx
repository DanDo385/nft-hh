"use client";
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import NFTArtifact from '../artifacts/contracts/NFT.sol/NFT.json';
import contractAddress from '../artifacts/NFT_address.json';

const NFTCards = ({ provider, lastUpdate }) => {
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!provider) return;
      const contract = new ethers.Contract(contractAddress.address, NFTArtifact.abi, provider);
      const totalSupply = await contract.tokenCount();
      const items = [];

      for (let i = 1; i <= totalSupply; i++) {
        const uri = await contract.tokenURI(i);
        // Remove the 'ipfs://' prefix and ensure no double 'https://' or double 'ipfs.io/ipfs/'
        const formattedUri = uri.replace('ipfs://', '');
        try {
          // Ensure we're using a valid and simple URL to access the IPFS gateway
          const response = await fetch(`https://ipfs.io/ipfs/${formattedUri}`);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const metadata = await response.json();

          items.push({
            tokenId: i,
            name: metadata.name,
            image: metadata.image,
            description: metadata.description
          });
        } catch (error) {
          console.error(`Failed to fetch metadata for token ID ${i}:`, error);
        }
      }

      setNfts(items);
    };

    fetchNFTs();
  }, [provider, lastUpdate]);  // Add `lastUpdate` here to trigger re-fetching when an NFT is minted

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
