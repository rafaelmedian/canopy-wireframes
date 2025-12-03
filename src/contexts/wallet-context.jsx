import { createContext, useContext, useState, useEffect } from 'react'
import walletDataByUser from '@/data/wallet.json'
import usersData from '@/data/users.json'

const WalletContext = createContext()

export function WalletProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState(null)
  const [evmAddress, setEvmAddress] = useState(null) // EVM wallet used for authentication
  const [currentUser, setCurrentUser] = useState(null)
  const [currentWallet, setCurrentWallet] = useState(null)
  const [fundedWalletData, setFundedWalletData] = useState(null)

  // Check localStorage for existing connection
  useEffect(() => {
    const storedAddress = localStorage.getItem('walletAddress')
    const storedIsConnected = localStorage.getItem('isWalletConnected')
    const storedEvmAddress = localStorage.getItem('evmAddress')
    const storedWalletData = localStorage.getItem('walletData')
    const storedWallet = localStorage.getItem('currentWallet')

    if (storedAddress && storedIsConnected === 'true') {
      setWalletAddress(storedAddress)
      setIsConnected(true)

      // Restore EVM address
      if (storedEvmAddress) {
        setEvmAddress(storedEvmAddress)
        const user = getUserByEvmAddress(storedEvmAddress)
        if (user) {
          setCurrentUser(user)
        }
      }

      // Restore current wallet info
      if (storedWallet) {
        setCurrentWallet(JSON.parse(storedWallet))
      }

      // Restore funded wallet data
      if (storedWalletData) {
        setFundedWalletData(JSON.parse(storedWalletData))
      }
    }
  }, [])

  const getUserByEvmAddress = (address) => {
    return usersData.users.find(user => user.evmAddress?.toLowerCase() === address?.toLowerCase())
  }

  // Keep for backwards compatibility during transition
  const getUserByEmail = (email) => {
    return usersData.users.find(user => user.email?.toLowerCase() === email?.toLowerCase())
  }

  const connectWallet = (evmAddr = null, canopyAddress = null, walletInfo = null) => {
    // Get user from EVM address if provided
    let user = null
    let walletAddr = canopyAddress
    let wallet = walletInfo

    if (evmAddr) {
      user = getUserByEvmAddress(evmAddr)
      if (user && user.hasWallet) {
        // If wallet info is provided, use it
        if (walletInfo) {
          walletAddr = walletInfo.address
          wallet = walletInfo
        } else if (user.wallets && user.wallets.length > 0) {
          // Find the wallet matching the address, or use first wallet
          wallet = user.wallets.find(w => w.address === canopyAddress) || user.wallets[0]
          walletAddr = wallet.address
        }
      }
    }

    // Use provided address or default mock Canopy address
    if (!walletAddr) {
      walletAddr = '0xCNPY' + (evmAddr ? evmAddr.slice(2) : '8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199')
      wallet = { address: walletAddr, nickname: 'My Wallet', icon: 'wallet' }
    }

    setWalletAddress(walletAddr)
    setEvmAddress(evmAddr)
    setIsConnected(true)
    setCurrentUser(user)
    setCurrentWallet(wallet)

    localStorage.setItem('walletAddress', walletAddr)
    localStorage.setItem('isWalletConnected', 'true')
    localStorage.setItem('currentWallet', JSON.stringify(wallet))

    if (evmAddr) {
      localStorage.setItem('evmAddress', evmAddr)
    }
  }

  const disconnectWallet = () => {
    setWalletAddress(null)
    setEvmAddress(null)
    setIsConnected(false)
    setCurrentUser(null)
    setCurrentWallet(null)
    setFundedWalletData(null)
    localStorage.removeItem('walletAddress')
    localStorage.removeItem('isWalletConnected')
    localStorage.removeItem('evmAddress')
    localStorage.removeItem('walletData')
    localStorage.removeItem('currentWallet')
  }

  const updateWalletData = (fundedData) => {
    setFundedWalletData(fundedData)
    localStorage.setItem('walletData', JSON.stringify(fundedData))
  }

  const getTotalBalance = () => {
    // If user has funded wallet data in memory/localStorage, use that
    if (fundedWalletData) {
      return fundedWalletData.totalValue
    }

    // Return balance based on current user's EVM address
    if (currentUser && currentUser.evmAddress) {
      const userData = walletDataByUser[currentUser.evmAddress]
      return userData ? userData.totalValue : 0
    }
    // Default to demo user with funds
    return walletDataByUser['0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199']?.totalValue || 0
  }

  const getWalletData = () => {
    // If user has funded wallet data in memory/localStorage, use that
    if (fundedWalletData) {
      return fundedWalletData
    }

    // Return wallet data based on current user's EVM address
    if (currentUser && currentUser.evmAddress) {
      return walletDataByUser[currentUser.evmAddress] || walletDataByUser['0x742d35Cc6634C0532925a3b844Bc9e7595f00000']
    }
    // Default to demo user with funds
    return walletDataByUser['0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199']
  }

  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        walletAddress,
        evmAddress,
        currentUser,
        currentWallet,
        connectWallet,
        disconnectWallet,
        getTotalBalance,
        getWalletData,
        updateWalletData,
        formatAddress,
        getUserByEvmAddress,
        getUserByEmail // Keep for backwards compatibility
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider')
  }
  return context
}
