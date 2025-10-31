import { createContext, useContext, useState, useEffect } from 'react'
import walletDataByUser from '@/data/wallet.json'
import usersData from '@/data/users.json'

const WalletContext = createContext()

export function WalletProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [fundedWalletData, setFundedWalletData] = useState(null)

  // Check localStorage for existing connection
  useEffect(() => {
    const storedAddress = localStorage.getItem('walletAddress')
    const storedIsConnected = localStorage.getItem('isWalletConnected')
    const storedEmail = localStorage.getItem('userEmail')
    const storedWalletData = localStorage.getItem('walletData')

    if (storedAddress && storedIsConnected === 'true') {
      setWalletAddress(storedAddress)
      setIsConnected(true)

      // Restore user from email
      if (storedEmail) {
        const user = getUserByEmail(storedEmail)
        if (user) {
          setCurrentUser(user)
        }
      }

      // Restore funded wallet data
      if (storedWalletData) {
        setFundedWalletData(JSON.parse(storedWalletData))
      }
    }
  }, [])

  const getUserByEmail = (email) => {
    return usersData.users.find(user => user.email.toLowerCase() === email.toLowerCase())
  }

  const connectWallet = (email = null, address = null) => {
    // Get user from email if provided
    let user = null
    let walletAddr = address

    if (email) {
      user = getUserByEmail(email)
      if (user && user.hasWallet) {
        walletAddr = user.walletAddress
      }
    }

    // Use provided address or default mock address
    if (!walletAddr) {
      walletAddr = '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199'
    }

    setWalletAddress(walletAddr)
    setIsConnected(true)
    setCurrentUser(user)

    localStorage.setItem('walletAddress', walletAddr)
    localStorage.setItem('isWalletConnected', 'true')

    if (email) {
      localStorage.setItem('userEmail', email)
    }
  }

  const disconnectWallet = () => {
    setWalletAddress(null)
    setIsConnected(false)
    setCurrentUser(null)
    setFundedWalletData(null)
    localStorage.removeItem('walletAddress')
    localStorage.removeItem('isWalletConnected')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('walletData')
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

    // Return balance based on current user email
    if (currentUser && currentUser.email) {
      const userData = walletDataByUser[currentUser.email]
      return userData ? userData.totalValue : 0
    }
    // Default to withfunds user
    return walletDataByUser['withfunds@email.com'].totalValue
  }

  const getWalletData = () => {
    // If user has funded wallet data in memory/localStorage, use that
    if (fundedWalletData) {
      return fundedWalletData
    }

    // Return wallet data based on current user email
    if (currentUser && currentUser.email) {
      return walletDataByUser[currentUser.email] || walletDataByUser['nofunds@email.com']
    }
    // Default to withfunds user
    return walletDataByUser['withfunds@email.com']
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
        currentUser,
        connectWallet,
        disconnectWallet,
        getTotalBalance,
        getWalletData,
        updateWalletData,
        formatAddress,
        getUserByEmail
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
