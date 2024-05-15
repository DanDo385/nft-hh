"use client";

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import NFTArtifact from '../artifacts/contracts/NFT.sol/NFT.json';
import contractAddress from '../artifacts/NFT_address.json';

const MintNFT = ({ provider, signer, onMinting }) => {
  const [tokenURI, setTokenURI] = useState('');
  const [mintingStatus, setMintingStatus] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const correctChainId = 31337; // Hardhat local network chain ID

  useEffect(() => {
    const checkNetworkAndOwner = async () => {
      try {
        const { chainId } = await provider.getNetwork();
        console.log("Connected network chain ID: ", chainId);

        if (chainId !== correctChainId) {
          alert('Please connect to the correct network');
          return;
        }

        const contract = new ethers.Contract(contractAddress.address, NFTArtifact.abi, signer);
        const owner = await contract.owner();
        const signerAddress = await signer.getAddress();
        setIsOwner(owner.toLowerCase() === signerAddress.toLowerCase());
      } catch (error) {
        console.error('Error checking network and owner:', error);
      }
    };

    if (provider && signer) {
      checkNetworkAndOwner();
    }
  }, [provider, signer]);

  const mintNFT = async () => {
    if (!isOwner) {
      setMintingStatus('Only the owner can mint NFTs');
      return;
    }

    setMintingStatus('Minting in progress...');
    try {
      const contract = new ethers.Contract(contractAddress.address, NFTArtifact.abi, signer);
      console.log('Attempting to send mint transaction', { tokenURI });
      const tx = await contract.mint(tokenURI, { gasLimit: 1000000 }); // Increased gas limit
      console.log('Transaction sent:', tx.hash);
      await tx.wait();
      console.log('Transaction confirmed on the blockchain');
      setMintingStatus('Minting successful!');
      if (onMinting) onMinting('Minting successful!');
    } catch (error) {
      console.error('Minting error:', error);
      let errorMessage = 'Minting failed: Internal JSON-RPC error.';
      if (error.data && error.data.message) {
        errorMessage = `Minting failed: ${error.data.message}`;
        console.error('Detailed RPC Error:', error.data.message);
      } else if (error.message) {
        errorMessage = `Minting failed: ${error.message}`;
      }
      setMintingStatus(errorMessage);
      console.error('Detailed Error Message:', error);
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
      <p>{mintingStatus}</p>
    </div>
  );
};

export default MintNFT;
