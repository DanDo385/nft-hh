// pages/index.jsx

import React, { useState } from 'react';
import MintNFT from '../components/MintNFT';
import LoginMetaMask from '../components/LoginMetaMask';

export default function Home() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);

  const handleLogin = (provider, signer, address) => {
    setProvider(provider);
    setSigner(signer);
    setAddress(address);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <LoginMetaMask onLogin={handleLogin} />
      {address && (
        <>
          <p>Logged in as: {address}</p>
          <MintNFT provider={provider} signer={signer} />
        </>
      )}
    </div>
  );
}
