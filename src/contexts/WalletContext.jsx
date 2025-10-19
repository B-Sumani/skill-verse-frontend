import React, { createContext, useContext, useState, useEffect } from 'react';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const [showWalletDialog, setShowWalletDialog] = useState(false);

  // Check for existing wallet connection on mount
  useEffect(() => {
    const savedAddress = localStorage.getItem('walletAddress');
    if (savedAddress) {
      setWalletAddress(savedAddress);
      setIsConnected(true);
    }
  }, []);

  const connectWallet = async (address) => {
    try {
      setIsConnecting(true);
      setConnectionError('');
      
      // In a real app, this would connect to actual wallet APIs
      // For now, we'll simulate the connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setWalletAddress(address);
      setIsConnected(true);
      localStorage.setItem('walletAddress', address);
      
      return { success: true };
    } catch (error) {
      setConnectionError('Failed to connect wallet');
      return { success: false, error: error.message };
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress('');
    setIsConnected(false);
    setConnectionError('');
    localStorage.removeItem('walletAddress');
  };

  const showWalletConnection = () => {
    setShowWalletDialog(true);
  };

  const hideWalletConnection = () => {
    setShowWalletDialog(false);
  };

  const handleWalletConnect = (address) => {
    connectWallet(address);
    hideWalletConnection();
  };

  const handleWalletSkip = () => {
    hideWalletConnection();
  };

  const value = {
    // State
    isConnected,
    walletAddress,
    isConnecting,
    connectionError,
    showWalletDialog,
    
    // Actions
    connectWallet,
    disconnectWallet,
    showWalletConnection,
    hideWalletConnection,
    handleWalletConnect,
    handleWalletSkip,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

