// components/LoginMetaMask.jsx

"use client";
import { useState } from 'react';
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
        
        // Ensure network is connected to Hardhat local network
        const { chainId } = await provider.getNetwork();
        if (chainId !== 31337) {
          alert('Please switch to the Hardhat local network');
          return;
        }

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
