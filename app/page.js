// app/page.js

"use client";

import React, { useState } from 'react';
import MintNFT from '../components/MintNFT';
import LoginMetaMask from '../components/LoginMetaMask';
import NFTCards from '../components/NFTCards';

export default function Home() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [lastMinted, setLastMinted] = useState(null);

  const handleLogin = (provider, signer, address) => {
    const handleLogin = (provider, signer, address) => {
      console.log('Provider:', provider);
      console.log('Signer:', signer);
      console.log('Address:', address);
      setProvider(provider);
      setSigner(signer);
      setAddress(address);
    };
    

  const handleMinting = (status) => {
    if (status === 'Minting successful!') {
      setLastMinted(Date.now());
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <LoginMetaMask onLogin={handleLogin} />
      {address && (
        <>
          <p>Logged in as: {address}</p>
          <MintNFT provider={provider} signer={signer} onMinting={handleMinting} />
          <NFTCards provider={provider} lastUpdate={lastMinted} />
        </>
      )}
    </div>
  );
}
