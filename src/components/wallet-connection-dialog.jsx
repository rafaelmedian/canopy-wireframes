import { useState, useEffect } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  X,
  ArrowLeft,
  Send,
  Mail,
  Check,
  Upload,
  Wallet as WalletIcon,
  Plus,
  ChevronRight,
  Copy,
  CheckCircle,
  ArrowDown
} from 'lucide-react'
import { useWallet } from '@/contexts/wallet-context'
import { toast } from 'sonner'

export default function WalletConnectionDialog({ open, onOpenChange }) {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', ''])
  const [otpError, setOtpError] = useState(false)
  const [walletCreated, setWalletCreated] = useState(false)
  const [connectedWallets, setConnectedWallets] = useState({
    solana: null,
    evm: null,
    canopy: null
  })
  const [showWalletSelect, setShowWalletSelect] = useState(false)
  const [walletType, setWalletType] = useState(null)
  const [convertAmount, setConvertAmount] = useState('')
  const { connectWallet: connectWalletContext } = useWallet()

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep(1)
        setEmail('')
        setOtp(['', '', '', ''])
        setOtpError(false)
        setWalletCreated(false)
        setConnectedWallets({ solana: null, evm: null, canopy: null })
        setConvertAmount('')
      }, 300)
    }
  }, [open])

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
    if (otpCode === '1111') {
      setStep(3)
      setOtpError(false)
    } else {
      setOtpError(true)
    }
  }

  const handleResendCode = () => {
    toast.success('Verification code resent')
    setOtp(['', '', '', ''])
    setOtpError(false)
    document.getElementById('otp-0')?.focus()
  }

  // Step 3: Wallet creation
  const handleCreateWallet = () => {
    setWalletCreated(true)
    setStep(4)
  }

  const handleImportWallet = () => {
    // Handle file upload
    setWalletCreated(true)
    setStep(4)
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
    setStep(7)
  }

  // Step 7: Complete
  const handleComplete = () => {
    connectWalletContext()
    handleClose()
  }

  const getProgressDots = () => {
    const dots = []
    for (let i = 0; i < 5; i++) {
      const isActive = i < step || step === 7
      dots.push(
        <div
          key={i}
          className={`w-2 h-2 rounded-full transition-colors ${
            isActive ? 'bg-[#1dd13a]' : 'bg-muted'
          }`}
        />
      )
    }
    return dots
  }

  const getTotalBalance = () => {
    let total = 0
    if (connectedWallets.solana) {
      total += Object.values(connectedWallets.solana.balances).reduce((a, b) => a + b, 0)
    }
    if (connectedWallets.evm) {
      total += Object.values(connectedWallets.evm.balances).reduce((a, b) => a + b, 0)
    }
    return total
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

              <h2 className="text-2xl font-bold text-center mb-2">Verification code sent</h2>
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
                className="w-full h-11 rounded-xl cursor-pointer"
                onClick={handleVerify}
                disabled={otp.some(d => !d)}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Wallet Setup */}
        {step === 3 && (
          <div className="flex flex-col">
            {/* Header */}
            <div className="relative p-6 pb-4 flex flex-col items-center">
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

              <img
                src="/svg/logo.svg"
                alt="Canopy"
                className="h-6 mb-4 invert"
              />

              <h2 className="text-2xl font-bold text-center">Create or Connect Canopy wallet</h2>
            </div>

            {/* Content */}
            <div className="px-6 pb-6 space-y-6">
              {/* Email Status Card */}
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl border">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{email}</p>
                  <p className="text-sm text-muted-foreground">Email Verified</p>
                </div>
                <Check className="w-5 h-5 text-[#1dd13a]" />
              </div>

              {/* Status Message */}
              <p className="text-sm text-muted-foreground text-center">
                No wallet created for this account yet. Create a new wallet or import an existing one.
              </p>

              {/* Create Wallet Button */}
              <Button
                className="w-full h-12 rounded-xl bg-primary"
                onClick={handleCreateWallet}
              >
                Create Canopy Wallet
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-background px-2 text-muted-foreground">or</span>
                </div>
              </div>

              {/* Import Wallet */}
              <div className="space-y-3">
                <Label className="text-sm text-muted-foreground block">Import Existing Wallet</Label>
                <button
                  onClick={handleImportWallet}
                  className="w-full p-8 border-2 border-dashed rounded-xl hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium">Upload Keyfile (.JSON)</p>
                      <p className="text-sm text-muted-foreground">Click to browse or drag and drop</p>
                    </div>
                  </div>
                </button>

                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={handleBack}
                >
                  Back
                </Button>
              </div>

              {/* Progress Dots */}
              <div className="flex justify-center gap-2 pt-2">
                {getProgressDots()}
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

              {/* Canopy Wallet */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground block">Canopy Wallet (Optional)</Label>
                <button
                  className="w-full p-4 border-2 border-dashed rounded-xl hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#1dd13a] flex items-center justify-center">
                        <WalletIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">Connect Canopy Wallet</p>
                        <p className="text-sm text-muted-foreground">Use your Canopy account</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </button>
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

              {/* Progress Dots */}
              <div className="flex justify-center gap-2 pt-2">
                {getProgressDots()}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Balances Found */}
        {step === 5 && (
          <div className="flex flex-col">
            {/* Header */}
            <div className="relative p-6 pb-4 flex flex-col items-center">
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

              <h2 className="text-2xl font-bold text-center mb-2">Balances Found!</h2>
              <p className="text-sm text-muted-foreground text-center">
                We found USDT and USDC in your connected wallets
              </p>
            </div>

            {/* Content */}
            <div className="px-6 pb-6 space-y-6">
              {/* Balance Summary */}
              <div className="p-6 bg-muted rounded-xl space-y-4">
                <p className="text-sm text-muted-foreground">Total Balance</p>
                <p className="text-4xl font-bold">${getTotalBalance().toFixed(2)}</p>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                      <WalletIcon className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-medium">MetaMask (Multi-chain)</span>
                  </div>
                  <p className="text-sm text-muted-foreground">7xKX ... gAsU</p>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                          <span className="text-xs font-bold text-white">T</span>
                        </div>
                        <div>
                          <p className="font-medium">USDT</p>
                          <p className="text-xs text-muted-foreground">Tether USD</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">100.50</p>
                        <p className="text-xs text-muted-foreground">$100.50</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-xs font-bold text-white">$</span>
                        </div>
                        <div>
                          <p className="font-medium">USDC</p>
                          <p className="text-xs text-muted-foreground">USD Coin</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">50.25</p>
                        <p className="text-xs text-muted-foreground">$50.25</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Step Info */}
              <div className="p-4 border-2 border-primary/20 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-primary bg-primary/20 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Next: Convert to CNPY</p>
                    <p className="text-sm text-muted-foreground">
                      Convert your USDT/USDC to CNPY to start buying into projects
                    </p>
                  </div>
                </div>
              </div>

              <Button
                className="w-full h-12 rounded-xl bg-primary"
                onClick={handleContinueToConversion}
              >
                Continue to Conversion
              </Button>

              {/* Progress Dots */}
              <div className="flex justify-center gap-2 pt-2">
                {getProgressDots()}
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Convert to CNPY */}
        {step === 6 && (
          <div className="flex flex-col">
            {/* Header */}
            <div className="relative p-6 pb-4 flex flex-col items-center">
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

              <img
                src="/svg/logo.svg"
                alt="Canopy"
                className="h-6 mb-4 invert"
              />

              <h2 className="text-2xl font-bold text-center mb-2">Convert to CNPY</h2>
              <p className="text-sm text-muted-foreground text-center">
                Convert your USDT/USDC to CNPY to start buying into projects
              </p>
            </div>

            {/* Content */}
            <div className="px-6 pb-6 space-y-6">
              <div className="p-6 bg-muted rounded-xl space-y-6">
                {/* Available Balance */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Available Balance</p>
                  <p className="text-4xl font-bold mb-1">${getTotalBalance().toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">7xKX ... gAsU · ${getTotalBalance().toFixed(2)}</p>
                </div>

                {/* Amount Input */}
                <div className="space-y-2">
                  <Label className="block">Amount to Convert</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-muted-foreground">
                      $
                    </span>
                    <Input
                      type="text"
                      inputMode="decimal"
                      value={convertAmount}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value === '' || /^\d*\.?\d*$/.test(value)) {
                          setConvertAmount(value)
                        }
                      }}
                      className="h-14 pl-8 pr-20 text-lg rounded-xl"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setConvertAmount(getTotalBalance().toString())}
                    >
                      Max
                    </Button>
                  </div>
                </div>

                {/* Arrow Indicator */}
                <div className="flex justify-center">
                  <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
                    <ArrowDown className="w-5 h-5" />
                  </div>
                </div>

                {/* Conversion Result */}
                <div className="p-4 bg-background rounded-xl">
                  <p className="text-sm text-muted-foreground mb-2">You will receive</p>
                  <p className="text-3xl font-bold text-[#1dd13a]">
                    {parseFloat(convertAmount || '0').toFixed(2)} CNPY
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">1 USD = 1 CNPY</p>
                </div>
              </div>

              <Button
                className="w-full h-12 rounded-xl bg-[#1dd13a] hover:bg-[#1dd13a]/90 text-white"
                onClick={handleConvert}
                disabled={!convertAmount || parseFloat(convertAmount) <= 0}
              >
                Convert to CNPY
              </Button>

              {/* Progress Dots */}
              <div className="flex justify-center gap-2 pt-2">
                {getProgressDots()}
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Success */}
        {step === 7 && (
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

              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-primary" />
              </div>

              <h2 className="text-3xl font-bold text-center mb-2">Wallet Funded!</h2>
              <p className="text-sm text-muted-foreground text-center">
                Your Canopy wallet is ready. You can now buy into projects.
              </p>
            </div>

            {/* Content */}
            <div className="px-6 pb-6 space-y-6">
              <div className="p-6 bg-muted rounded-xl space-y-4">
                <p className="text-sm text-muted-foreground">Your CNPY Balance</p>
                <div>
                  <p className="text-5xl font-bold text-[#1dd13a]">
                    {(parseFloat(convertAmount || '0') + 550.50).toFixed(2)}
                  </p>
                  <p className="text-muted-foreground mt-1">CNPY</p>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Connected Wallets</span>
                    <span className="font-medium">
                      {Object.values(connectedWallets).filter(w => w !== null).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Remaining Balance</span>
                    <span className="font-medium">$0.75</span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full h-12 rounded-xl bg-primary"
                onClick={handleComplete}
              >
                Start Buying Projects
              </Button>

              {/* Progress Dots */}
              <div className="flex justify-center gap-2 pt-2">
                {getProgressDots()}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
