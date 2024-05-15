// components/LoginMetaMask.jsx

import React, { useState } from 'react';
import { ethers } from 'ethers';

const LoginMetaMask = ({ onLogin }) => {
  const [account, setAccount] = useState('');
  const [privateKey, setPrivateKey] = useState('');

  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        if (onLogin) onLogin(provider, signer, address);
      } catch (error) {
        console.error("MetaMask login error:", error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const importAccount = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const wallet = new ethers.Wallet(privateKey, provider);
      setAccount(wallet.address);
      if (onLogin) onLogin(provider, wallet, wallet.address);
    } catch (error) {
      console.error("Account import error:", error);
    }
  };

  return (
    <div className="p-4 border rounded shadow">
      <button onClick={connectMetaMask} className="btn btn-primary mb-2">
        Connect MetaMask
      </button>
      <div>
        <input
          type="text"
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
          placeholder="Enter private key"
          className="input input-bordered mb-2"
        />
        <button onClick={importAccount} className="btn btn-secondary">
          Import Account
        </button>
      </div>
      {account && <p>Connected Account: {account}</p>}
    </div>
  );
};

export default LoginMetaMask;
