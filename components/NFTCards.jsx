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
        const formattedUri = uri.replace('ipfs://', '');
        const urls = [
          `https://ipfs.io/ipfs/${formattedUri}`,
          `https://cloudflare-ipfs.com/ipfs/${formattedUri}`
        ];

        for (const url of urls) {
          try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const metadata = await response.json();

            items.push({
              tokenId: i,
              name: metadata.name,
              image: metadata.image,
              description: metadata.description
            });
            break; // Break if successful
          } catch (error) {
            console.error(`Failed to fetch metadata from ${url}:`, error);
            if (url === urls[urls.length - 1]) { // Last URL
              console.error(`All fetch attempts failed for token ID ${i}:`, error);
            }
          }
        }
      }
      setNfts(items);
    };

    fetchNFTs();
  }, [provider, lastUpdate]);

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
