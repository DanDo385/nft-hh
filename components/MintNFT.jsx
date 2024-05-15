"use client";

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import NFTArtifact from '../artifacts/contracts/NFT.sol/NFT.json';
import contractAddress from '../artifacts/NFT_address.json';

const MintNFT = ({ provider, signer, onMinting }) => {
  const [tokenURI, setTokenURI] = useState('');
  const [mintingStatus, setMintingStatus] = useState('');
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const checkNetworkAndOwner = async () => {
      const { chainId } = await provider.getNetwork();
      console.log("Connected network chain ID: ", chainId);

      const contract = new ethers.Contract(contractAddress.address, NFTArtifact.abi, signer);
      const owner = await contract.owner();
      const signerAddress = await signer.getAddress();
      setIsOwner(owner.toLowerCase() === signerAddress.toLowerCase());

      if (chainId !== your_chain_id) {
        alert('Please connect to the correct network');
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
      const tx = await contract.mint(tokenURI, { gasLimit: 500000 });
      await tx.wait();
      setMintingStatus('Minting successful!');
      if (onMinting) onMinting('Minting successful!');
    } catch (error) {
      console.error('Minting error:', error);
      let errorMessage = 'Minting failed: Internal JSON-RPC error.';
      if (error.data && error.data.message) {
        errorMessage = `Minting failed: ${error.data.message}`;
      } else if (error.message) {
        errorMessage = `Minting failed: ${error.message}`;
      }
      setMintingStatus(errorMessage);
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
