"use client";
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import NFTArtifact from '../artifacts/contracts/NFT.sol/NFT.json';
import contractAddress from '../artifacts/NFT_address.json';

const IPFS_GATEWAY = "https://ipfs.io/ipfs/";

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
        const formattedUri = uri.replace('ipfs://', '');
        try {
          const response = await fetch(`${IPFS_GATEWAY}${formattedUri}`);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}, URL: ${IPFS_GATEWAY}${formattedUri}`);
          }
          const metadata = await response.json();
          const imageUrl = metadata.Image.replace('ipfs://', IPFS_GATEWAY);

          items.push({
            tokenId: i,
            name: metadata.Name,  // Adjusted for case sensitivity
            image: imageUrl,      // Properly formatted to be a valid URL
            description: metadata.Description // Adjusted for case sensitivity
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
