// components/LoginMetaMask.jsx
"use client";
import React, { useState } from 'react';
import { ethers } from 'ethers';

const LoginMetaMask = ({ onLogin }) => {
  const [account, setAccount] = useState('');

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

  return (
    <div className="p-4 border rounded shadow">
      <button onClick={connectMetaMask} className="btn btn-primary mb-2">
        Connect MetaMask
      </button>
      {account && <p>Connected Account: {account}</p>}
    </div>
  );
};

export default LoginMetaMask;
