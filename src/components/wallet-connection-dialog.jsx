import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  X,
  ArrowLeft,
  Send,
  Check,
  Wallet as WalletIcon,
  Plus,
  ChevronRight,
  Copy,
  CheckCircle,
  ArrowDown,
  Shield,
  Loader2,
  RotateCcw,
  CheckCircle2
} from 'lucide-react'
import { useWallet } from '@/contexts/wallet-context'
import { toast } from 'sonner'

export default function WalletConnectionDialog({ open, onOpenChange, initialStep = 1 }) {
  const [step, setStep] = useState(initialStep)
  const [connectedEvmAddress, setConnectedEvmAddress] = useState('')
  const [evmProvider, setEvmProvider] = useState('')
  const [seedPhrase, setSeedPhrase] = useState([])
  const [verificationAnswers, setVerificationAnswers] = useState({})
  const [verificationQuestions, setVerificationQuestions] = useState([])
  const [walletAddress, setWalletAddress] = useState('')
  const [fundSourceTab, setFundSourceTab] = useState('evm') // 'evm' or 'canopy'
  const [convertAmount, setConvertAmount] = useState('')
  const [isCreatingWallet, setIsCreatingWallet] = useState(false)
  const [walletCreated, setWalletCreated] = useState(false)
  const [selectedToken, setSelectedToken] = useState(null) // { walletType, token, amount }
  const [isConverting, setIsConverting] = useState(false)
  const [conversionSuccess, setConversionSuccess] = useState(false)
  const [connectionStep, setConnectionStep] = useState(0) // 0: not started, 1: requesting, 2: signature, 3: approved
  const [password, setPassword] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState(null)
  const [availableWallets, setAvailableWallets] = useState([])
  const [newWalletName, setNewWalletName] = useState('')
  const { connectWallet: connectWalletContext, getUserByEvmAddress, updateWalletData, currentWallet } = useWallet()

  // Refs to store timeout IDs for cancellation
  const connectionTimeoutsRef = useRef([])

  // Demo EVM addresses for prototype
  const DEMO_EVM_ADDRESSES = {
    withFunds: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
    noFunds: '0x742d35Cc6634C0532925a3b844Bc9e7595f00000'
  }

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep(initialStep)
        setConnectedEvmAddress('')
        setEvmProvider('')
        setFundSourceTab('evm')
        setConvertAmount('')
        setSelectedToken(null)
        setIsConverting(false)
        setConversionSuccess(false)
        setConnectionStep(0)
        setPassword('')
        setIsLoggingIn(false)
        setSelectedWallet(null)
        setAvailableWallets([])
        setNewWalletName('')
      }, 300)
    }
  }, [open, initialStep])

  // When opening at step 2.3 (wallet switching), load user from localStorage
  useEffect(() => {
    if (open && initialStep === 2.3) {
      const storedEvm = localStorage.getItem('evmAddress')
      if (storedEvm) {
        setConnectedEvmAddress(storedEvm)
        const user = getUserByEvmAddress(storedEvm)

        // Build wallet list from user.wallets or currentWallet
        let wallets = []
        if (user && user.wallets && user.wallets.length > 0) {
          wallets = user.wallets
        } else if (currentWallet) {
          // New user with first wallet - use currentWallet from context
          wallets = [currentWallet]
        }
        setAvailableWallets(wallets)
      }
    }
  }, [open, initialStep, getUserByEvmAddress, currentWallet])

  // Reset fund source tab when navigating to step 5
  useEffect(() => {
    if (step === 5) {
      setFundSourceTab('evm')
      setSelectedToken(null)
    }
  }, [step])

  const handleClose = () => {
    // Clear any pending connection timeouts
    clearConnectionTimeouts()
    onOpenChange(false)
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  // Clear all connection timeouts
  const clearConnectionTimeouts = () => {
    connectionTimeoutsRef.current.forEach(id => clearTimeout(id))
    connectionTimeoutsRef.current = []
  }

  // Step 1: Connect EVM Wallet - starts the 3-step connection sequence
  const handleConnectEvmWallet = (provider) => {
    // Clear any existing timeouts
    clearConnectionTimeouts()

    setEvmProvider(provider)
    setStep(2) // Move to connection flow step
    setConnectionStep(1) // Start with "Requesting connection..."

    // Save the provider to localStorage for settings page
    localStorage.setItem('evmProvider', provider)

    // MetaMask = account with funds, WalletConnect = account without funds
    const demoAddress = provider === 'MetaMask'
      ? DEMO_EVM_ADDRESSES.withFunds
      : DEMO_EVM_ADDRESSES.noFunds
    setConnectedEvmAddress(demoAddress)

    // Step 1: Requesting connection (2 seconds)
    const timeout1 = setTimeout(() => {
      setConnectionStep(2) // Move to "Signature requested"

      // Step 2: Signature requested (2 seconds)
      const timeout2 = setTimeout(() => {
        setConnectionStep(3) // Move to "Connection Approved"

        // Step 3: Connection Approved (1.5 seconds then navigate)
        const timeout3 = setTimeout(() => {
          // Check if user has Canopy wallet
          const user = getUserByEvmAddress(demoAddress)

          if (user && user.hasWallet) {
            // User has Canopy wallet - check if they have multiple wallets
            if (user.wallets && user.wallets.length > 1) {
              // Multiple wallets - show wallet selection
              setAvailableWallets(user.wallets)
              setConnectionStep(0)
              setStep(2.3)
            } else if (user.wallets && user.wallets.length === 1) {
              // Single wallet - auto-select and go to password
              setSelectedWallet(user.wallets[0])
              setConnectionStep(0)
              setStep(2.5)
            } else {
              // Go to password step
              setConnectionStep(0)
              setStep(2.5)
            }
          } else {
            // User doesn't have Canopy wallet - go to Step 3 (create wallet)
            setConnectionStep(0)
            setStep(3)
          }
        }, 1500)
        connectionTimeoutsRef.current.push(timeout3)
      }, 2000)
      connectionTimeoutsRef.current.push(timeout2)
    }, 2000)
    connectionTimeoutsRef.current.push(timeout1)
  }

  // Cancel connection flow
  const handleCancelConnection = () => {
    // Clear all pending timeouts
    clearConnectionTimeouts()
    setConnectionStep(0)
    setStep(1)
    setEvmProvider('')
    setConnectedEvmAddress('')
  }

  // Step 2.5: Password verification
  const handlePasswordContinue = () => {
    // For prototype - no validation, any password works
    setIsLoggingIn(true)

    // Simulate login delay (2 seconds)
    setTimeout(() => {
      const user = getUserByEvmAddress(connectedEvmAddress)
      if (user && user.hasWallet) {
        // Use selected wallet info if available
        connectWalletContext(connectedEvmAddress, selectedWallet?.address, selectedWallet)
        setIsLoggingIn(false)
        handleClose()
      }
    }, 2000)
  }

  // Generate seed phrase
  const generateSeedPhrase = () => {
    const words = [
      'forest', 'happy', 'mountain', 'ocean', 'rainbow', 'silver',
      'thunder', 'village', 'whisper', 'yellow', 'crystal', 'bridge'
    ]
    return words
  }

  // Generate verification questions
  const generateVerificationQuestions = (phrase) => {
    const questions = [
      { position: 3, word: phrase[2], options: ['ocean', 'silver', 'mountain', 'village'] },
      { position: 7, word: phrase[6], options: ['thunder', 'rainbow', 'forest', 'whisper'] }
    ]
    return questions
  }

  // Step 3: Wallet creation
  const handleCreateWallet = () => {
    setIsCreatingWallet(true)
    setWalletCreated(false)

    // Simulate wallet creation delay
    setTimeout(() => {
      setIsCreatingWallet(false)
      setWalletCreated(true)

      // Wait a moment to show "Wallet Created" then navigate to wallet name step
      setTimeout(() => {
        setWalletCreated(false)
        setStep(3.05) // Go to wallet name step for new users
      }, 1500)
    }, 3000)
  }

  // Step 3.1: Seed phrase written down
  const handleSeedPhraseConfirm = () => {
    setStep(3.2)
  }

  // Step 3.2: Verify seed phrase
  const handleVerificationAnswer = (questionIndex, answer) => {
    setVerificationAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }))
  }

  const handleVerificationContinue = () => {
    // Check if all answers are correct
    const allCorrect = verificationQuestions.every((q, idx) =>
      verificationAnswers[idx] === q.word
    )

    if (allCorrect) {
      // Create wallet info with the user's chosen name
      const walletInfo = {
        address: walletAddress,
        nickname: newWalletName || 'New Wallet',
        icon: 'wallet'
      }
      // Connect wallet immediately so sidebar shows it active
      connectWalletContext(connectedEvmAddress, walletAddress, walletInfo)
      // Go to step 3.3 to show funding options
      setStep(3.3)
    } else {
      toast.error('Incorrect words selected. Please try again.')
    }
  }

  // Step 3.3: Wallet created - Fund or skip
  const handleFundWallet = () => {
    setStep(5) // Go directly to Choose Fund Source
  }

  const handleDoItLater = () => {
    connectWalletContext(connectedEvmAddress, walletAddress)
    handleClose()
  }

  // Step 5: Continue to conversion
  const handleContinueToConversion = () => {
    setStep(6)
    setConvertAmount('150.75')
  }

  // Step 6: Convert to CNPY
  const handleConvert = () => {
    setIsConverting(true)
    setConversionSuccess(false)

    // Simulate conversion delay
    setTimeout(() => {
      setIsConverting(false)
      setConversionSuccess(true)

      // Wait a moment to show "Converted" then navigate
      setTimeout(() => {
        setConversionSuccess(false)
        setStep(7)
      }, 1500)
    }, 2000)
  }

  // Step 7: Complete
  const handleComplete = () => {
    const convertedAmount = parseFloat(convertAmount || '0')
    const currentDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

    // Create wallet data object with funded amount
    const fundedWalletData = {
      totalValue: convertedAmount,
      assets: [
        {
          id: 1,
          chainId: 1,
          symbol: 'CNPY',
          name: 'Canopy',
          balance: convertedAmount,
          price: 1,
          value: convertedAmount,
          change24h: 0,
          color: '#1dd13a'
        }
      ],
      transactions: [
        {
          id: 1,
          type: 'received',
          symbol: 'CNPY',
          amount: convertedAmount,
          timestamp: currentDate,
          status: 'completed',
          hash: '0x' + Math.random().toString(16).substr(2, 40)
        }
      ],
      stakes: [
        {
          id: 1,
          chainId: 1,
          symbol: 'CNPY',
          chain: 'Canopy',
          amount: 0,
          apy: 15.0,
          rewards: 0,
          color: '#1dd13a'
        }
      ],
      unstaking: [],
      earningsHistory: []
    }

    // Save to localStorage
    updateWalletData(fundedWalletData)

    connectWalletContext(connectedEvmAddress, walletAddress)
    handleClose()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 !rounded-3xl" hideClose noAnimation onInteractOutside={(e) => e.preventDefault()}>
        {/* Step 1: Connect EVM Wallet */}
        {step === 1 && (
          <div className="flex flex-col">
            {/* Header */}
            <div className="relative px-6 py-12 flex flex-col items-center">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 rounded-full"
                onClick={handleClose}
              >
                <X className="w-5 h-5" />
              </Button>

              <img
                src="/svg/logo-compact.svg"
                alt="Canopy"
                className="h-12 mb-4"
              />

              <h2 className="text-2xl font-bold text-center mb-2">Welcome to Canopy</h2>
              <p className="text-sm text-muted-foreground text-center">Connect your EVM wallet to get started</p>
            </div>

            {/* Wallet Options */}
            <div className="px-20 pb-6 flex flex-col items-center gap-3">
              <button
                onClick={() => handleConnectEvmWallet('MetaMask')}
                className="w-full h-12 px-5 pr-12 bg-muted hover:bg-muted/70 rounded-xl flex items-center gap-3 transition-colors"
              >
                <img src="/svg/metamaskt.svg" alt="MetaMask" className="w-6 h-6" />
                <p className="flex-1 font-medium">Connect with MetaMask</p>
              </button>

              <button
                onClick={() => handleConnectEvmWallet('WalletConnect')}
                className="w-full h-12 px-5 pr-12 bg-muted hover:bg-muted/70 rounded-xl flex items-center gap-3 transition-colors"
              >
                <img src="/svg/walletconnect.svg" alt="WalletConnect" className="w-6 h-6" />
                <p className="flex-1 font-medium">WalletConnect</p>
              </button>

              <p className="text-xs text-muted-foreground text-center pt-2">
                By connecting, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Connection Flow (3 sub-steps) */}
        {step === 2 && (
          <div className="flex flex-col">
            {/* Header with back/close buttons - only show if not on approved step */}
            <div className="relative px-6 pt-4">
              {connectionStep !== 3 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-2 rounded-full"
                    onClick={handleCancelConnection}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 rounded-full"
                    onClick={handleClose}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </>
              )}
            </div>

            {/* Connection Animation */}
            <div className="px-6 py-16 flex flex-col items-center">
              {/* Icons Row: Canopy -- status -- Wallet */}
              <div className="flex items-center gap-2 mb-8">
                {/* Canopy Logo */}
                <div className="w-14 h-14 flex items-center justify-center">
                  <img
                    src="/svg/logo-compact.svg"
                    alt="Canopy"
                    className="h-10"
                  />
                </div>

                {/* Dashed line */}
                <div className="w-8 border-t-2 border-dashed border-muted-foreground/40" />

                {/* Status Icon */}
                <div className="w-8 h-8 flex items-center justify-center">
                  {connectionStep === 3 ? (
                    <div className="w-6 h-6 rounded-full bg-[#1dd13a] flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  )}
                </div>

                {/* Dashed line */}
                <div className="w-8 border-t-2 border-dashed border-muted-foreground/40" />

                {/* Wallet Provider Logo */}
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                  evmProvider === 'MetaMask' ? 'bg-[#F5841F]' :
                  evmProvider === 'WalletConnect' ? 'bg-[#3B99FC]' :
                  'bg-blue-600'
                }`}>
                  {evmProvider === 'MetaMask' ? (
                    <img src="/svg/metamaskt.svg" alt="MetaMask" className="w-8 h-8" />
                  ) : evmProvider === 'WalletConnect' ? (
                    <img src="/svg/walletconnect.svg" alt="WalletConnect" className="w-8 h-8" />
                  ) : (
                    <WalletIcon className="w-7 h-7 text-white" />
                  )}
                </div>
              </div>

              {/* Status Text */}
              <h2 className="text-xl font-bold text-center mb-2">
                {connectionStep === 1 && 'Requesting connection...'}
                {connectionStep === 2 && 'Signature requested'}
                {connectionStep === 3 && 'Connection Approved'}
              </h2>

              {connectionStep === 2 && (
                <p className="text-sm text-muted-foreground text-center max-w-xs">
                  Please open your wallet and approve the signature request to connect to Canopy.
                </p>
              )}
            </div>

            {/* Cancel Button - only show on steps 1 and 2 */}
            {connectionStep !== 3 && (
              <div className="px-6 pb-6">
                <Button
                  variant="outline"
                  className="w-full h-11 rounded-xl"
                  onClick={handleCancelConnection}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Step 2.3: Wallet Selection */}
        {step === 2.3 && (
          <div className="flex flex-col">
            {/* Header */}
            <div className="relative px-6 py-12 flex flex-col items-center">
              {/* Only show back button if NOT in switch mode */}
              {initialStep !== 2.3 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-2 rounded-full"
                  onClick={() => setStep(1)}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 rounded-full"
                onClick={handleClose}
              >
                <X className="w-5 h-5" />
              </Button>

              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <WalletIcon className="w-8 h-8 text-primary" />
              </div>

              <h2 className="text-2xl font-bold text-center mb-2">Select Wallet</h2>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                Choose which wallet you want to log in with
              </p>
            </div>

            {/* Wallet List */}
            <div className="px-6 pb-6 space-y-4">
              <div className="space-y-3">
                {availableWallets.map((wallet, index) => {
                  const isCurrentWallet = currentWallet && currentWallet.address === wallet.address
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedWallet(wallet)
                        // Always go to password step for security
                        setStep(2.5)
                      }}
                      className={`w-full p-4 rounded-xl flex items-center justify-between transition-colors ${
                        isCurrentWallet
                          ? 'bg-primary/10 border-2 border-primary'
                          : 'bg-muted hover:bg-muted/70'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isCurrentWallet ? 'bg-primary/20' : 'bg-primary/10'
                        }`}>
                          <WalletIcon className={`w-5 h-5 ${isCurrentWallet ? 'text-primary' : 'text-primary'}`} />
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{wallet.nickname}</p>
                            {isCurrentWallet && (
                              <Badge variant="secondary" className="text-xs bg-primary/20 text-primary border-0">
                                Connected
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground font-mono">
                            {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )
                })}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 border-t border-border"></div>
                <span className="text-sm text-muted-foreground">or</span>
                <div className="flex-1 border-t border-border"></div>
              </div>

              {/* Create New Wallet Button */}
              <Button
                variant="outline"
                className="w-full h-11 rounded-xl"
                onClick={() => {
                  setIsCreatingWallet(true)
                  // Simulate wallet creation delay
                  setTimeout(() => {
                    setIsCreatingWallet(false)
                    setStep(2.9) // Go to wallet name step
                  }, 2000)
                }}
                disabled={isCreatingWallet}
              >
                {isCreatingWallet ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating wallet...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Wallet
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 2.9: Wallet Name */}
        {step === 2.9 && (
          <div className="flex flex-col">
            {/* Header */}
            <div className="relative px-6 py-12 flex flex-col items-center">
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-2 rounded-full"
                onClick={() => setStep(2.3)}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 rounded-full"
                onClick={handleClose}
              >
                <X className="w-5 h-5" />
              </Button>

              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <WalletIcon className="w-8 h-8 text-primary" />
              </div>

              <h2 className="text-2xl font-bold text-center mb-2">Name Your Wallet</h2>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                Choose a name to easily identify this wallet
              </p>
            </div>

            {/* Form */}
            <div className="px-6 pb-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="wallet-name" className="block text-sm font-medium">Wallet Name</Label>
                <Input
                  id="wallet-name"
                  type="text"
                  placeholder="e.g., Main Wallet, Trading, Savings"
                  value={newWalletName}
                  onChange={(e) => setNewWalletName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newWalletName.trim()) {
                      // Generate seed phrase and go to step 3.1
                      const phrase = generateSeedPhrase()
                      setSeedPhrase(phrase)
                      setVerificationQuestions(generateVerificationQuestions(phrase))
                      setWalletAddress('0x' + Math.random().toString(16).substr(2, 40))
                      setStep(3.1)
                    }
                  }}
                  autoFocus
                  className="h-11 rounded-xl"
                  maxLength={30}
                />
                <p className="text-xs text-muted-foreground">
                  {newWalletName.length}/30 characters
                </p>
              </div>

              <Button
                className="w-full h-11 rounded-xl bg-primary"
                onClick={() => {
                  // Generate seed phrase and go to step 3.1
                  const phrase = generateSeedPhrase()
                  setSeedPhrase(phrase)
                  setVerificationQuestions(generateVerificationQuestions(phrase))
                  setWalletAddress('0x' + Math.random().toString(16).substr(2, 40))
                  setStep(3.1)
                }}
                disabled={!newWalletName.trim()}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 2.5: Password Entry */}
        {step === 2.5 && (
          <div className="flex flex-col">
            {/* Header */}
            <div className="relative px-6 py-12 flex flex-col items-center">
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-2 rounded-full"
                onClick={() => setStep(availableWallets.length > 1 ? 2.3 : 2)}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 rounded-full"
                onClick={handleClose}
              >
                <X className="w-5 h-5" />
              </Button>

              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>

              <h2 className="text-2xl font-bold text-center mb-2">
                {initialStep === 2.3 ? 'Confirm Switch' : 'Enter Password'}
              </h2>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                {selectedWallet
                  ? `Enter password for ${selectedWallet.nickname}`
                  : 'Please enter your password to access your wallet'}
              </p>
            </div>

            {/* Password Input */}
            <div className="px-6 pb-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password" className="block">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && password && handlePasswordContinue()}
                  autoFocus
                  className="h-11 rounded-xl"
                />
                <p className="text-xs text-muted-foreground">
                  Your password is your seed phrase without spaces
                </p>
              </div>

              <Button
                className="w-full h-11 rounded-xl bg-primary"
                onClick={handlePasswordContinue}
                disabled={!password || isLoggingIn}
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {initialStep === 2.3 ? 'Switching...' : 'Logging in...'}
                  </>
                ) : (
                  initialStep === 2.3 ? 'Switch Wallet' : 'Continue'
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Wallet Setup */}
        {step === 3 && (
          <div className="flex flex-col">
            {/* Header */}
            <div className="relative px-6 py-12 flex flex-col items-center">
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-2 rounded-full"
                onClick={() => setStep(1)}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 rounded-full"
                onClick={handleClose}
              >
                <X className="w-5 h-5" />
              </Button>

              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <WalletIcon className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-center mb-4 max-w-2xs">No Canopy Wallet Found</h2>
              <p className="text-sm text-muted-foreground text-center max-w-xs">
                Create a Canopy wallet linked to your EVM address to get started.
              </p>
            </div>

            {/* Content */}
            <div className="px-6 pb-6 space-y-6">
              {/* Action Buttons */}
              <Button
                className={`w-full h-11 rounded-xl ${walletCreated ? 'bg-green-600 hover:bg-green-600' : 'bg-primary'}`}
                onClick={handleCreateWallet}
                disabled={isCreatingWallet}
              >
                {isCreatingWallet ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating wallet...
                  </>
                ) : walletCreated ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Wallet Created
                  </>
                ) : (
                  'Create Wallet'
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3.05: Wallet Name for New Users */}
        {step === 3.05 && (
          <div className="flex flex-col">
            {/* Header */}
            <div className="relative px-6 py-12 flex flex-col items-center">
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-2 rounded-full"
                onClick={() => setStep(3)}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 rounded-full"
                onClick={handleClose}
              >
                <X className="w-5 h-5" />
              </Button>

              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <WalletIcon className="w-8 h-8 text-primary" />
              </div>

              <h2 className="text-2xl font-bold text-center mb-2">Name Your Wallet</h2>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                Choose a name to easily identify this wallet
              </p>
            </div>

            {/* Form */}
            <div className="px-6 pb-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="new-user-wallet-name" className="block text-sm font-medium">Wallet Name</Label>
                <Input
                  id="new-user-wallet-name"
                  type="text"
                  placeholder="e.g., Main Wallet, Trading, Savings"
                  value={newWalletName}
                  onChange={(e) => setNewWalletName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newWalletName.trim()) {
                      // Generate seed phrase and go to step 3.1
                      const phrase = generateSeedPhrase()
                      setSeedPhrase(phrase)
                      setVerificationQuestions(generateVerificationQuestions(phrase))
                      setWalletAddress('0x' + Math.random().toString(16).substr(2, 40))
                      setStep(3.1)
                    }
                  }}
                  autoFocus
                  className="h-11 rounded-xl"
                  maxLength={30}
                />
                <p className="text-xs text-muted-foreground">
                  {newWalletName.length}/30 characters
                </p>
              </div>

              <Button
                className="w-full h-11 rounded-xl bg-primary"
                onClick={() => {
                  // Generate seed phrase and go to step 3.1
                  const phrase = generateSeedPhrase()
                  setSeedPhrase(phrase)
                  setVerificationQuestions(generateVerificationQuestions(phrase))
                  setWalletAddress('0x' + Math.random().toString(16).substr(2, 40))
                  setStep(3.1)
                }}
                disabled={!newWalletName.trim()}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 3.1: Secure Your Wallet - Seed Phrase */}
        {step === 3.1 && (
          <div className="flex flex-col">
            {/* Header */}
            <div className="relative px-6 py-12 flex flex-col items-center">
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-2 rounded-full"
                onClick={() => setStep(3.05)}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 rounded-full"
                onClick={handleClose}
              >
                <X className="w-5 h-5" />
              </Button>

              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>

              <h2 className="text-2xl font-bold text-center mb-2">Secure Your Wallet</h2>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                This is your recovery phrase. Write down these 12 words in exact order and store them safely offline.
              </p>
            </div>

            {/* Content */}
            <div className="px-6 pb-6 space-y-6">
              {/* Seed Phrase Grid */}
              <div className="p-6 bg-muted/30 rounded-xl border-2 border-border">
                <div className="grid grid-cols-2 gap-3">
                  {seedPhrase.map((word, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground w-6">{index + 1}.</span>
                      <span className="font-medium">{word}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warning */}
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <div className="flex gap-3">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <p className="font-medium text-sm mb-1">Never Share Your Recovery Phrase</p>
                    <p className="text-sm text-muted-foreground">
                      Anyone with these words can access and control your wallet. Canopy will never ask for your recovery phrase. Store it offline in a secure location.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                className="w-full h-11 rounded-xl bg-primary"
                onClick={handleSeedPhraseConfirm}
              >
                I've Written It Down
              </Button>
            </div>
          </div>
        )}

        {/* Step 3.2: Verify Seed Phrase */}
        {step === 3.2 && (
          <div className="flex flex-col">
            {/* Header */}
            <div className="relative px-6 py-12 flex flex-col items-center">
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-2 rounded-full"
                onClick={() => setStep(3.1)}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 rounded-full"
                onClick={handleClose}
              >
                <X className="w-5 h-5" />
              </Button>

              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>

              <h2 className="text-2xl font-bold text-center mb-2">Verify Your Backup</h2>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                Select the words in the correct order to verify your backup
              </p>
            </div>

            {/* Content */}
            <div className="px-6 pb-6 space-y-6">
              {verificationQuestions.map((question, qIndex) => (
                <div key={qIndex} className="space-y-3">
                  <Label className="block text-center">What is word #{question.position}?</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {question.options.map((option, oIndex) => (
                      <Button
                        key={oIndex}
                        variant={verificationAnswers[qIndex] === option ? 'default' : 'outline'}
                        className="h-11 rounded-xl relative"
                        onClick={() => handleVerificationAnswer(qIndex, option)}
                      >
                        {option}
                        {/* Testing indicator - shows correct answer */}
                        {option === question.word && (
                          <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-500" />
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}

              <Button
                className="w-full h-11 rounded-xl bg-primary mt-4"
                onClick={handleVerificationContinue}
                disabled={Object.keys(verificationAnswers).length < verificationQuestions.length}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 3.3: Wallet Created - Fund or Skip */}
        {step === 3.3 && (
          <div className="flex flex-col">
            {/* Header */}
            <div className="relative px-6 py-12 flex flex-col items-center">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 rounded-full"
                onClick={handleClose}
              >
                <X className="w-5 h-5" />
              </Button>

              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-primary" />
              </div>

              <h2 className="text-2xl font-bold text-center mb-2">Wallet Created!</h2>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                This is your wallet address. Fund your wallet to get started.
              </p>
            </div>

            {/* Content */}
            <div className="px-6 pb-6 space-y-6">
              {/* Wallet Address */}
              <div className="p-4 bg-muted/30 rounded-xl border">
                <Label className="block text-sm text-muted-foreground mb-2">Your Wallet Address</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm font-mono truncate">{walletAddress}</code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      navigator.clipboard.writeText(walletAddress)
                      toast.success('Address copied')
                    }}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  className="w-full h-11 rounded-xl bg-primary"
                  onClick={handleFundWallet}
                >
                  Fund Wallet
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-11 rounded-xl"
                  onClick={handleDoItLater}
                >
                  Do It Later
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Choose Fund Source */}
        {step === 5 && (
          <div className="flex flex-col">
            {/* Header */}
            <div className="relative px-6 py-12 flex flex-col items-center">
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-2 rounded-full"
                onClick={() => initialStep === 5 ? handleClose() : setStep(3.3)}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 rounded-full"
                onClick={handleClose}
              >
                <X className="w-5 h-5" />
              </Button>

              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <WalletIcon className="w-8 h-8 text-primary" />
              </div>

              <h2 className="text-2xl font-bold text-center mb-2">Choose Fund Source</h2>
              <p className="text-sm text-muted-foreground text-center">
                Select which token you want to convert to CNPY
              </p>
            </div>

            {/* Content */}
            <div className="px-6 pb-6 space-y-4">
              {/* Tabs */}
              <div className="flex gap-2 p-1 bg-muted rounded-xl">
                <button
                  onClick={() => setFundSourceTab('evm')}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    fundSourceTab === 'evm'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  EVM Wallet
                </button>
                <button
                  onClick={() => setFundSourceTab('canopy')}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    fundSourceTab === 'canopy'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Another Canopy Wallet
                </button>
              </div>

              {/* EVM Wallet Tab Content */}
              {fundSourceTab === 'evm' && (
                <div className="space-y-4">
                  {/* Token Selection */}
                  <div className="p-4 bg-muted rounded-xl space-y-3">
                    {/* Connected EVM Wallet Info - Compact */}
                    <div className="flex items-center justify-between pb-3 border-b border-border">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          evmProvider === 'MetaMask' ? 'bg-[#F5841F]' : 'bg-[#3B99FC]'
                        }`}>
                          <img
                            src={evmProvider === 'MetaMask' ? '/svg/metamaskt.svg' : '/svg/walletconnect.svg'}
                            alt={evmProvider}
                            className="w-4 h-4"
                          />
                        </div>
                        <span className="text-sm font-medium">{evmProvider}</span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {connectedEvmAddress ? `${connectedEvmAddress.slice(0, 6)}...${connectedEvmAddress.slice(-4)}` : ''}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[#1dd13a]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#1dd13a]" />
                        Connected
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">Select token to convert</p>
                    <div className="space-y-2">
                      {[
                        { token: 'ETH', amount: 0.5, icon: 'bg-purple-500', symbol: 'E' },
                        { token: 'USDC', amount: 150.75, icon: 'bg-blue-500', symbol: '$' }
                      ].map(({ token, amount, icon, symbol }) => {
                        const isSelected = selectedToken?.token === token
                        return (
                          <button
                            key={token}
                            onClick={() => setSelectedToken({ walletType: 'evm', token, amount })}
                            className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-colors ${
                              isSelected ? 'bg-background border-2 border-primary' : 'bg-background/50 hover:bg-background'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                isSelected ? 'border-primary' : 'border-muted-foreground'
                              }`}>
                                {isSelected && <div className="w-2 h-2 rounded-full bg-primary" />}
                              </div>
                              <div className={`w-8 h-8 rounded-full ${icon} flex items-center justify-center`}>
                                <span className="text-sm font-bold text-white">{symbol}</span>
                              </div>
                              <span className="font-medium">{token}</span>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{amount}</p>
                              <p className="text-xs text-muted-foreground">${(token === 'ETH' ? amount * 2000 : amount).toFixed(2)}</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <Button
                    className="w-full h-12 rounded-xl"
                    onClick={handleContinueToConversion}
                    disabled={!selectedToken}
                  >
                    Continue
                  </Button>
                </div>
              )}

              {/* Another Canopy Wallet Tab Content */}
              {fundSourceTab === 'canopy' && (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-xl space-y-3">
                    <p className="font-medium">Transfer CNPY from another Canopy Wallet</p>
                    <p className="text-sm text-muted-foreground">Send CNPY tokens to this address</p>
                    <div className="flex items-center gap-2 p-3 bg-background rounded-lg">
                      <code className="flex-1 text-sm font-mono truncate">
                        {walletAddress || '0x742d35Cc6634C0532925a3b844Bc9e7595f0...'}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 flex-shrink-0"
                        onClick={() => {
                          navigator.clipboard.writeText(walletAddress || '0x742d35Cc6634C0532925a3b844Bc9e7595f00000')
                          toast.success('Address copied')
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <Button
                    className="w-full h-12 rounded-xl"
                    variant="outline"
                    onClick={() => {
                      // Skip funding and complete wallet setup
                      connectWalletContext(connectedEvmAddress, walletAddress)
                      handleClose()
                    }}
                  >
                    I've sent the funds
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 6: Convert to CNPY */}
        {step === 6 && (
          <div className="flex flex-col">
            {/* Header */}
            <div className="relative px-6 py-12 flex flex-col items-center">
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-2 rounded-full"
                onClick={handleBack}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 rounded-full"
                onClick={handleClose}
              >
                <X className="w-5 h-5" />
              </Button>

              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <RotateCcw className="w-8 h-8 text-primary" />
              </div>

              <h2 className="text-2xl font-bold text-center mb-2">Convert to CNPY</h2>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                Convert your {selectedToken?.token || 'USDT/USDC'} to CNPY to start buying into projects
              </p>
            </div>

            {/* Content */}
            <div className="px-6 pb-6 space-y-6">
              {/* Amount Input Card */}
              <Card className="bg-muted/30 p-4 space-y-3">
                {/* Input */}
                <div className="flex items-center justify-center">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={convertAmount}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value === '' || /^\d*\.?\d*$/.test(value)) {
                        setConvertAmount(value)
                      }
                    }}
                    placeholder="$0"
                    autoFocus
                    className="text-5xl font-bold bg-transparent border-0 outline-none p-0 h-auto text-center w-full placeholder:text-muted-foreground"
                  />
                </div>

                {/* Available Balance & Max Button */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    <span className="block">Available: {selectedToken?.amount || 0} {selectedToken?.token || ''}</span>
                    <span className="text-xs">${selectedToken?.token === 'ETH' ? ((selectedToken?.amount || 0) * 2000).toFixed(2) : (selectedToken?.amount || 0).toFixed(2)}</span>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setConvertAmount((selectedToken?.token === 'ETH' ? (selectedToken?.amount || 0) * 2000 : selectedToken?.amount || 0).toString())}
                  >
                    Use max
                  </Button>
                </div>
              </Card>

              {/* Swap Direction Button */}
              <div className="relative flex justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-8 w-8 bg-background border-2"
                >
                  <ArrowDown className="w-4 h-4" />
                </Button>
              </div>

              {/* Conversion Result Card */}
              <Card className="bg-muted/30 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* CNPY Token Avatar */}
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <svg width="20" height="20" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.7649 0.880227C12.658 0.827134 12.5342 0.905351 12.5342 1.02378V3.04351C12.5342 3.18794 12.7104 3.26027 12.8135 3.15814L14.069 1.91394C14.1383 1.84534 14.1317 1.73215 14.0535 1.67368C13.6439 1.36708 13.2123 1.10259 12.7649 0.880227Z" fill="white"/>
                        <path d="M10.4705 0.127791C10.5477 0.141319 10.6032 0.208239 10.6032 0.285896V5.28157C10.6032 5.32456 10.586 5.36579 10.5553 5.3962L8.90769 7.02887C8.80463 7.13099 8.62842 7.05867 8.62842 6.91423V0.163239C8.62842 0.0764816 8.69735 0.00493239 8.78487 0.00272091C9.34863 -0.0115243 9.91358 0.0301658 10.4705 0.127791Z" fill="white"/>
                        <path d="M6.64953 9.26628C6.68021 9.23588 6.69744 9.19464 6.69744 9.15164V0.531669C6.69744 0.424066 6.59358 0.346317 6.48993 0.37839C5.89636 0.562066 5.31929 0.812546 4.77074 1.12983C4.72107 1.15856 4.69092 1.21149 4.69092 1.26849V10.8158C4.69092 10.9602 4.86713 11.0325 4.97019 10.9304L6.64953 9.26628Z" fill="white"/>
                        <path d="M2.4827 3.0726C2.57734 2.95748 2.75983 3.02558 2.75983 3.17407L2.75984 13.0535C2.75984 13.0965 2.7426 13.1377 2.71192 13.1681L2.53426 13.3441C2.46504 13.4128 2.35058 13.4059 2.29159 13.3285C-0.0224758 10.292 0.0412298 6.04232 2.4827 3.0726Z" fill="white"/>
                        <path d="M10.3924 8.65513C10.2467 8.65513 10.1737 8.48052 10.2768 8.37839L11.9244 6.74572C11.9551 6.71532 11.9966 6.69824 12.04 6.69824H17.1031C17.1812 6.69824 17.2486 6.75292 17.2625 6.82908C17.3635 7.38074 17.408 7.94056 17.396 8.49942C17.3942 8.58642 17.3219 8.65513 17.234 8.65513H10.3924Z" fill="white"/>
                        <path d="M14.1825 4.50709C14.0795 4.60922 14.1525 4.78383 14.2982 4.78383H16.3466C16.4664 4.78383 16.5454 4.66045 16.4911 4.55456C16.2638 4.11067 15.9935 3.68279 15.6806 3.27689C15.6215 3.20007 15.5077 3.19389 15.4388 3.26223L14.1825 4.50709Z" fill="white"/>
                        <path d="M8.13428 10.5684C8.09089 10.5684 8.04928 10.5854 8.0186 10.6158L6.33926 12.28C6.2362 12.3821 6.30919 12.5567 6.45493 12.5567H16.1382C16.196 12.5567 16.2496 12.5265 16.2784 12.4769C16.5952 11.933 16.8447 11.3612 17.027 10.7733C17.0588 10.6707 16.9803 10.5684 16.8721 10.5684H8.13428Z" fill="white"/>
                        <path d="M3.91045 14.9412C3.83293 14.8825 3.82636 14.7696 3.89534 14.7013L4.08101 14.5173C4.11169 14.4868 4.1533 14.4697 4.19669 14.4697H14.2374C14.3867 14.4697 14.4559 14.6496 14.3406 14.7438C11.33 17.208 6.99201 17.2737 3.91045 14.9412Z" fill="white"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">CNPY</p>
                      <p className="text-xs text-muted-foreground">0 CNPY</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{parseFloat(convertAmount || '0').toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">${parseFloat(convertAmount || '0').toFixed(2)}</p>
                  </div>
                </div>
              </Card>

              <Button
                className={`w-full h-11 rounded-xl ${
                  conversionSuccess
                    ? 'bg-green-600 hover:bg-green-600'
                    : 'bg-[#1dd13a] hover:bg-[#1dd13a]/90'
                } text-white`}
                onClick={handleConvert}
                disabled={!convertAmount || parseFloat(convertAmount) <= 0 || isConverting}
              >
                {isConverting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Converting...
                  </>
                ) : conversionSuccess ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Converted!
                  </>
                ) : (
                  'Convert to CNPY'
                )}
              </Button>

              {/* Exchange Rate */}
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <span>1 USD = 1 CNPY</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Success */}
        {step === 7 && (
          <div className="flex flex-col">
            {/* Header */}
            <div className="relative px-6 py-12 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-primary" />
              </div>

              <h2 className="text-3xl font-bold text-center mb-2">Wallet Funded!</h2>
              <p className="text-sm text-muted-foreground text-center">
                Your Canopy wallet is ready. You can now buy into projects.
              </p>
            </div>

            {/* Content */}
            <div className="px-6 pb-6 space-y-4">
              {/* Balance Card - Cleaner Design */}
              <div className="p-4 bg-muted/30 rounded-xl space-y-3">
                <p className="text-sm text-muted-foreground">Your CNPY Balance</p>
                <p className="text-4xl font-bold">
                  {parseFloat(convertAmount || '0').toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">CNPY</p>

                {/* Funded Source - Compact */}
                {selectedToken && (
                  <div className="pt-3 border-t">
                    <p className="text-xs text-muted-foreground mb-2">Funded from</p>
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full ${selectedToken.token === 'ETH' ? 'bg-purple-500' : 'bg-blue-500'} flex items-center justify-center`}>
                        <span className="text-xs font-bold text-white">{selectedToken.token === 'ETH' ? 'E' : '$'}</span>
                      </div>
                      <span className="text-sm font-medium">{selectedToken.token}</span>
                      <span className="text-sm text-muted-foreground">
                        {parseFloat(convertAmount || '0').toFixed(2)} {selectedToken.token}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <Button
                className="w-full h-12 rounded-xl bg-primary"
                onClick={handleComplete}
              >
                Get Started
              </Button>

              <Button
                variant="outline"
                className="w-full h-11 rounded-xl"
                onClick={() => setStep(4)}
              >
                Add More Funds
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
