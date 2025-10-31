import { useState, useEffect } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
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
  ChevronDown
} from 'lucide-react'
import { useWallet } from '@/contexts/wallet-context'
import { toast } from 'sonner'

export default function WalletConnectionDialog({ open, onOpenChange }) {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', ''])
  const [otpError, setOtpError] = useState(false)
  const [seedPhrase, setSeedPhrase] = useState([])
  const [verificationAnswers, setVerificationAnswers] = useState({})
  const [verificationQuestions, setVerificationQuestions] = useState([])
  const [walletAddress, setWalletAddress] = useState('')
  const [connectedWallets, setConnectedWallets] = useState({
    solana: null,
    evm: null,
    canopy: null
  })
  const [showWalletSelect, setShowWalletSelect] = useState(false)
  const [walletType, setWalletType] = useState(null)
  const [convertAmount, setConvertAmount] = useState('')
  const [isCreatingWallet, setIsCreatingWallet] = useState(false)
  const [walletCreated, setWalletCreated] = useState(false)
  const [selectedWalletForConversion, setSelectedWalletForConversion] = useState(null)
  const [showWalletDropdown, setShowWalletDropdown] = useState(false)
  const [selectedToken, setSelectedToken] = useState(null) // { walletType, token, amount }
  const [isConverting, setIsConverting] = useState(false)
  const [conversionSuccess, setConversionSuccess] = useState(false)
  const [loginSeedPhrase, setLoginSeedPhrase] = useState(Array(12).fill(''))
  const [isVerifying, setIsVerifying] = useState(false)
  const [verifySuccess, setVerifySuccess] = useState(false)
  const { connectWallet: connectWalletContext, getUserByEmail } = useWallet()

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep(1)
        setEmail('')
        setOtp(['', '', '', ''])
        setOtpError(false)
        setConnectedWallets({ solana: null, evm: null, canopy: null })
        setConvertAmount('')
        setSelectedWalletForConversion(null)
        setShowWalletDropdown(false)
        setSelectedToken(null)
        setIsConverting(false)
        setConversionSuccess(false)
        setLoginSeedPhrase(Array(12).fill(''))
        setIsVerifying(false)
        setVerifySuccess(false)
      }, 300)
    }
  }, [open])

  // Set the first connected wallet as selected when navigating to step 5
  useEffect(() => {
    if (step === 5 && !selectedWalletForConversion) {
      if (connectedWallets.solana) {
        setSelectedWalletForConversion('solana')
      } else if (connectedWallets.evm) {
        setSelectedWalletForConversion('evm')
      }
    }

    // Auto-select first token when navigating to step 5
    if (step === 5 && !selectedToken) {
      const firstWallet = connectedWallets.solana || connectedWallets.evm
      if (firstWallet) {
        const firstTokenKey = Object.keys(firstWallet.balances)[0]
        const walletType = connectedWallets.solana ? 'solana' : 'evm'
        setSelectedToken({
          walletType,
          token: firstTokenKey,
          amount: firstWallet.balances[firstTokenKey]
        })
      }
    }
  }, [step, connectedWallets, selectedWalletForConversion, selectedToken])

  const handleClose = () => {
    onOpenChange(false)
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
      setOtpError(false)
    }
  }

  // Step 1: Email submission
  const handleEmailContinue = () => {
    if (email && email.includes('@')) {
      setStep(2)
    }
  }

  // Step 2: OTP verification
  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)
      setOtpError(false)

      // Auto-focus next input
      if (value && index < 3) {
        document.getElementById(`otp-${index + 1}`)?.focus()
      }
    }
  }

  const handleVerify = () => {
    const otpCode = otp.join('')
    setIsVerifying(true)
    setVerifySuccess(false)

    // Simulate verification delay (2 seconds)
    setTimeout(() => {
      if (otpCode === '1111') {
        setIsVerifying(false)
        setVerifySuccess(true)
        setOtpError(false)

        // Check if user has wallet
        const user = getUserByEmail(email)

        // Wait a moment to show "Verified" then navigate
        setTimeout(() => {
          setVerifySuccess(false)

          if (user && user.hasWallet) {
            // User has wallet - connect immediately and close dialog
            connectWalletContext(email, user.walletAddress)
            handleClose()
          } else {
            // User doesn't have wallet - go to Step 3 (create wallet)
            setStep(3)
          }
        }, 1500)
      } else {
        setIsVerifying(false)
        setVerifySuccess(false)
        setOtpError(true)
      }
    }, 2000)
  }

  const handleResendCode = () => {
    toast.success('Verification code resent')
    setOtp(['', '', '', ''])
    setOtpError(false)
    document.getElementById('otp-0')?.focus()
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

  // Step 1.5: Seed phrase login
  const handleSeedPhraseLogin = () => {
    // For demo purposes, accept any 12 valid words
    // In production, this would validate against actual wallet recovery
    const allFieldsFilled = loginSeedPhrase.every(w => w.trim() !== '')

    if (allFieldsFilled) {
      // Show success toast
      toast.success('Wallet restored successfully!')

      // Connect wallet (seed phrase login doesn't require email)
      connectWalletContext()

      // Close dialog
      handleClose()
    } else {
      toast.error('Please fill in all 12 words')
    }
  }

  // Step 3: Wallet creation
  const handleCreateWallet = () => {
    setIsCreatingWallet(true)
    setWalletCreated(false)

    // Simulate wallet creation delay
    setTimeout(() => {
      const phrase = generateSeedPhrase()
      setSeedPhrase(phrase)
      setVerificationQuestions(generateVerificationQuestions(phrase))
      setWalletAddress('0x' + Math.random().toString(16).substr(2, 40))
      setIsCreatingWallet(false)
      setWalletCreated(true)

      // Wait a moment to show "Wallet Created" then navigate
      setTimeout(() => {
        setWalletCreated(false)
        setStep(3.1)
      }, 1500)
    }, 3000)
  }

  const handleImportWallet = () => {
    // Handle file upload
    setStep(4)
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
      // Connect wallet immediately so sidebar shows it active
      connectWalletContext(email, walletAddress)
      // Go to step 3.3 to show funding options
      setStep(3.3)
    } else {
      toast.error('Incorrect words selected. Please try again.')
    }
  }

  // Step 3.3: Wallet created - Fund or skip
  const handleFundWallet = () => {
    setStep(4)
  }

  const handleDoItLater = () => {
    connectWalletContext(email, walletAddress)
    handleClose()
  }

  // Step 4: Connect wallets
  const handleConnectWallet = (type) => {
    setWalletType(type)
    setShowWalletSelect(true)
  }

  const handleWalletProviderSelect = (provider) => {
    // Simulate wallet connection
    const mockBalance = {
      provider,
      address: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
      balances: {
        USDT: 100.50,
        USDC: 50.25
      }
    }

    setConnectedWallets(prev => ({
      ...prev,
      [walletType]: mockBalance
    }))
    setShowWalletSelect(false)
    setWalletType(null)
  }

  const handleDisconnectWallet = (type) => {
    setConnectedWallets(prev => ({
      ...prev,
      [type]: null
    }))
  }

  const handleContinueToBalances = () => {
    if (connectedWallets.solana || connectedWallets.evm) {
      setStep(5)
    }
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
    connectWalletContext(email, walletAddress)
    handleClose()
  }

  const getTotalBalance = (walletType = null) => {
    if (walletType && connectedWallets[walletType]) {
      return Object.values(connectedWallets[walletType].balances).reduce((a, b) => a + b, 0)
    }

    let total = 0
    if (connectedWallets.solana) {
      total += Object.values(connectedWallets.solana.balances).reduce((a, b) => a + b, 0)
    }
    if (connectedWallets.evm) {
      total += Object.values(connectedWallets.evm.balances).reduce((a, b) => a + b, 0)
    }
    return total
  }

  const getWalletIcon = (walletType) => {
    if (walletType === 'solana') {
      return 'bg-orange-500'
    } else if (walletType === 'evm') {
      return 'bg-blue-500'
    }
    return 'bg-muted'
  }

  const getWalletLabel = (walletType) => {
    const wallet = connectedWallets[walletType]
    if (!wallet) return ''
    return `${wallet.provider} (${walletType === 'solana' ? 'Solana' : 'EVM'})`
  }

  const formatWalletAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 !rounded-3xl" hideClose noAnimation>
        {/* Step 1: Email Entry */}
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
              <p className="text-sm text-muted-foreground text-center">Connect your wallet in a few simple steps</p>
            </div>

            {/* Form */}
            <div className="px-6 pb-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="block">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleEmailContinue()}
                  className="h-11 rounded-xl"
                />
              </div>

              <Button
                className="w-full h-11 rounded-xl bg-primary"
                onClick={handleEmailContinue}
                disabled={!email || !email.includes('@')}
              >
                Continue
              </Button>

              {/* Divider with OR */}
              <div className="relative flex items-center justify-center">
                <div className="flex-1 border-t border-border"></div>
                <span className="px-4 text-xs text-muted-foreground">OR</span>
                <div className="flex-1 border-t border-border"></div>
              </div>

              <Button
                variant="ghost"
                className="w-full h-11 rounded-xl text-muted-foreground hover:text-foreground hover:bg-transparent -mt-8"
                onClick={() => setStep(1.5)}
              >
                Login with Seed Phrase
              </Button>
            </div>
          </div>
        )}

        {/* Step 1.5: Login with Seed Phrase */}
        {step === 1.5 && (
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

              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>

              <h2 className="text-2xl font-bold text-center mb-2">Login with Seed Phrase</h2>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                Enter your 12-word recovery phrase to restore your wallet
              </p>
            </div>

            {/* Seed Phrase Input */}
            <div className="px-6 pb-6 space-y-6">
              {/* Seed Phrase Grid */}
              <div className="grid grid-cols-2 gap-3">
                {loginSeedPhrase.map((word, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground w-6">{index + 1}.</span>
                    <Input
                      id={`seed-${index}`}
                      type="text"
                      value={word}
                      onChange={(e) => {
                        const newPhrase = [...loginSeedPhrase]
                        newPhrase[index] = e.target.value.toLowerCase().trim()
                        setLoginSeedPhrase(newPhrase)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && index < 11) {
                          document.getElementById(`seed-${index + 1}`)?.focus()
                        } else if (e.key === 'Enter' && index === 11) {
                          handleSeedPhraseLogin()
                        }
                      }}
                      placeholder="word"
                      autoFocus={index === 0}
                      className="h-9 rounded-lg text-sm"
                    />
                  </div>
                ))}
              </div>

              <Button
                className="w-full h-11 rounded-xl bg-primary"
                onClick={handleSeedPhraseLogin}
                disabled={loginSeedPhrase.some(w => !w)}
              >
                Login
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Verification Code */}
        {step === 2 && (
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
                <Send className="w-8 h-8 text-primary" />
              </div>

              <h2 className="text-2xl font-bold text-center mb-2">Verification Code Sent</h2>
              <p className="text-sm text-muted-foreground text-center max-w-2xs">
                We have sent a 4-digit verification code to {email}
              </p>
            </div>

            {/* OTP Inputs */}
            <div className="px-6 pb-6 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-center gap-3">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !digit && index > 0) {
                          document.getElementById(`otp-${index - 1}`)?.focus()
                        }
                      }}
                      autoFocus={index === 0}
                      className={`w-16 h-16 text-center !text-2xl font-semibold rounded-xl ${
                        otpError ? 'border-red-500 focus-visible:ring-red-500' : ''
                      }`}
                    />
                  ))}
                </div>

                {otpError && (
                  <p className="text-sm text-red-500 text-center">
                    Please enter a valid code.
                  </p>
                )}

                <div className="text-center">
                  <Button
                    variant="link"
                    className="text-primary cursor-pointer"
                    onClick={handleResendCode}
                  >
                    Resend code
                  </Button>
                </div>
              </div>

              <Button
                className={`w-full h-11 rounded-xl cursor-pointer ${
                  verifySuccess
                    ? 'bg-green-600 hover:bg-green-600'
                    : ''
                }`}
                onClick={handleVerify}
                disabled={otp.some(d => !d) || isVerifying}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : verifySuccess ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Verified!
                  </>
                ) : (
                  'Continue'
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
              <h2 className="text-2xl font-bold text-center mb-4 max-w-2xs">No Canopy Wallet Found for {email}</h2>
              <p className="text-sm text-muted-foreground text-center">
                You can create a new wallet or import an existing one.
              </p>
            </div>

            {/* Content */}
            <div className="px-6 pb-6 space-y-6">
              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-11 rounded-xl"
                  onClick={handleImportWallet}
                  disabled
                >
                  Import Keyfile
                </Button>
                <Button
                  className={`h-11 rounded-xl ${walletCreated ? 'bg-green-600 hover:bg-green-600' : 'bg-primary'}`}
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
                        className="h-11 rounded-xl"
                        onClick={() => handleVerificationAnswer(qIndex, option)}
                      >
                        {option}
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

        {/* Wallet Selection Modal */}
        {showWalletSelect && (
          <Dialog open={showWalletSelect} onOpenChange={setShowWalletSelect}>
            <DialogContent className="sm:max-w-[400px] p-0 gap-0" hideClose noAnimation>
              <div className="relative p-6 border-b">
                <h3 className="text-xl font-bold">Select Wallet</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 rounded-full"
                  onClick={() => setShowWalletSelect(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-6 space-y-3">
                <button
                  onClick={() => handleWalletProviderSelect('MetaMask')}
                  className="w-full p-4 bg-muted hover:bg-muted/70 rounded-xl flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center">
                      <WalletIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">MetaMask</p>
                      <p className="text-sm text-muted-foreground">Multi-chain</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </button>

                <button
                  onClick={() => handleWalletProviderSelect('WalletConnect')}
                  className="w-full p-4 bg-muted hover:bg-muted/70 rounded-xl flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                      <WalletIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">WalletConnect</p>
                      <p className="text-sm text-muted-foreground">Multi-chain</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Step 4: Connect Wallets */}
        {step === 4 && !showWalletSelect && (
          <div className="flex flex-col">
            {/* Header */}
            <div className="relative p-6 pb-4 flex flex-col items-center">
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

              <h2 className="text-2xl font-bold text-center mb-2">Connect Your Wallets</h2>
              <p className="text-sm text-muted-foreground text-center">Connect wallets fund your account</p>
            </div>

            {/* Content */}
            <div className="px-6 pb-6 space-y-6 max-h-[400px] overflow-y-auto">
              {/* Solana Wallet */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground block">Solana Wallet</Label>
                {connectedWallets.solana ? (
                  <div className="p-4 bg-[#1dd13a]/10 border-2 border-[#1dd13a] rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center">
                          <WalletIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{connectedWallets.solana.provider}</p>
                          <p className="text-sm text-muted-foreground">
                            USDT: {connectedWallets.solana.balances.USDT} , USDC: {connectedWallets.solana.balances.USDC}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-[#1dd13a]" />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDisconnectWallet('solana')}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleConnectWallet('solana')}
                    className="w-full p-4 border-2 border-dashed rounded-xl hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <Plus className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">Connect Solana Wallet</p>
                          <p className="text-sm text-muted-foreground">MetaMask, WalletConnect</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </button>
                )}
              </div>

              {/* EVM Wallet */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground block">EVM Wallet</Label>
                {connectedWallets.evm ? (
                  <div className="p-4 bg-[#1dd13a]/10 border-2 border-[#1dd13a] rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                          <WalletIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{connectedWallets.evm.provider}</p>
                          <p className="text-sm text-muted-foreground">Multi-chain</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-[#1dd13a]" />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDisconnectWallet('evm')}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleConnectWallet('evm')}
                    className="w-full p-4 border-2 border-dashed rounded-xl hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <Plus className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">Connect EVM Wallet</p>
                          <p className="text-sm text-muted-foreground">MetaMask, WalletConnect</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </button>
                )}
              </div>

              {/* Fund via Transfer */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground block">Fund via Transfer</Label>
                <div className="p-4 bg-muted rounded-xl">
                  <p className="font-medium mb-2">Transfer CNPY from another Canopy Wallet</p>
                  <p className="text-sm text-muted-foreground mb-3">Send CNPY tokens to this address</p>
                  <div className="flex items-center gap-2 p-3 bg-background rounded-lg">
                    <code className="flex-1 text-xs truncate">
                      0x742d35Cc6634C0532925a3b844Bc9e7595f0...
                    </code>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                className="w-full h-12 rounded-xl"
                onClick={handleContinueToBalances}
                disabled={!connectedWallets.solana && !connectedWallets.evm}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 5: Balances Found */}
        {step === 5 && (
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
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>

              <h2 className="text-2xl font-bold text-center mb-2">Choose Fund Source</h2>
              <p className="text-sm text-muted-foreground text-center">
                Select which token you want to convert to CNPY
              </p>
            </div>

            {/* Content */}
            <div className="px-6 pb-6 space-y-6">
              {/* Balance Summary - Compact */}
              <div className="p-4 bg-muted rounded-xl space-y-3">
                <p className="text-sm text-muted-foreground">Balance Available</p>
                <p className="text-3xl font-bold -mt-2">
                  ${selectedWalletForConversion ? getTotalBalance(selectedWalletForConversion).toFixed(2) : getTotalBalance().toFixed(2)}
                </p>

                {/* Wallet Selector Dropdown */}
                {selectedWalletForConversion && (
                  <div className="relative">
                    <button
                      onClick={() => setShowWalletDropdown(!showWalletDropdown)}
                      className="w-full flex items-center justify-between px-3 py-2 bg-background rounded-full hover:bg-background/80 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full ${getWalletIcon(selectedWalletForConversion)} flex items-center justify-center`}>
                          <WalletIcon className="w-3 h-3 text-white" />
                        </div>
                        <div className="flex items-center gap-1.5 text-sm">
                          <span className="font-medium">{getWalletLabel(selectedWalletForConversion)}</span>
                          <span className="text-muted-foreground">
                            {formatWalletAddress(connectedWallets[selectedWalletForConversion]?.address)}
                          </span>
                        </div>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showWalletDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {showWalletDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-background rounded-xl border shadow-lg z-10">
                        {Object.entries(connectedWallets).map(([type, wallet]) => {
                          if (!wallet) return null
                          return (
                            <button
                              key={type}
                              onClick={() => {
                                setSelectedWalletForConversion(type)
                                setShowWalletDropdown(false)
                              }}
                              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors ${
                                selectedWalletForConversion === type ? 'bg-muted' : ''
                              }`}
                            >
                              <div className={`w-5 h-5 rounded-full ${getWalletIcon(type)} flex items-center justify-center`}>
                                <WalletIcon className="w-3 h-3 text-white" />
                              </div>
                              <div className="flex-1 text-left">
                                <p className="text-sm font-medium">{getWalletLabel(type)}</p>
                                <p className="text-xs text-muted-foreground">${getTotalBalance(type).toFixed(2)}</p>
                              </div>
                              {selectedWalletForConversion === type && (
                                <Check className="w-4 h-4 text-primary" />
                              )}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Token List - Compact with Radio Buttons */}
                {selectedWalletForConversion && connectedWallets[selectedWalletForConversion] && (
                  <div className="space-y-2 pt-2 border-t">
                    {Object.entries(connectedWallets[selectedWalletForConversion].balances).map(([token, amount]) => {
                      const isSelected = selectedToken?.walletType === selectedWalletForConversion && selectedToken?.token === token
                      return (
                        <button
                          key={token}
                          onClick={() => setSelectedToken({ walletType: selectedWalletForConversion, token, amount })}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-background/80 transition-colors ${
                            isSelected ? 'bg-background' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {/* Radio Button */}
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              isSelected ? 'border-primary' : 'border-muted-foreground'
                            }`}>
                              {isSelected && <div className="w-2 h-2 rounded-full bg-primary" />}
                            </div>
                            <div className={`w-6 h-6 rounded-full ${token === 'USDT' ? 'bg-green-500' : 'bg-blue-500'} flex items-center justify-center`}>
                              <span className="text-xs font-bold text-white">{token === 'USDT' ? 'T' : '$'}</span>
                            </div>
                            <span className="text-sm font-medium">{token}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{amount}</p>
                            <p className="text-xs text-muted-foreground">${amount.toFixed(2)}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              <Button
                className="w-full h-12 rounded-xl bg-primary"
                onClick={handleContinueToConversion}
              >
                Continue
              </Button>
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
                    <span className="block">Available: ${getTotalBalance().toFixed(2)}</span>
                    <span className="text-xs">7xKX ... gAsU</span>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setConvertAmount(getTotalBalance().toString())}
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
                  {(parseFloat(convertAmount || '0') + 550.50).toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">CNPY</p>

                {/* Funded Source - Compact */}
                {selectedToken && (
                  <div className="pt-3 border-t">
                    <p className="text-xs text-muted-foreground mb-2">Funded from</p>
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full ${selectedToken.token === 'USDT' ? 'bg-green-500' : 'bg-blue-500'} flex items-center justify-center`}>
                        <span className="text-xs font-bold text-white">{selectedToken.token === 'USDT' ? 'T' : '$'}</span>
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
                Start Buying Projects
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
