import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Card } from '@/components/ui/card'
import { X, ArrowLeft, Check, AlertCircle, Copy, ArrowDown, Loader2, Repeat, ChevronRight, ChevronDown, Wallet as WalletIcon } from 'lucide-react'
import { toast } from 'sonner'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import WalletConnectionDialog from '@/components/wallet-connection-dialog'

export default function BuyDialog({ open, onOpenChange, defaultTab = 'cnpy', assets = [] }) {
  const [step, setStep] = useState(1)
  const [buyType, setBuyType] = useState(null) // 'cnpy-external' | 'cnpy-swap' | 'chain-token'
  const [selectedSourceAsset, setSelectedSourceAsset] = useState(null)
  const [selectedTargetAsset, setSelectedTargetAsset] = useState(null)
  const [selectedTokenToBuy, setSelectedTokenToBuy] = useState(null)
  const [amount, setAmount] = useState('')
  const [exchangeRate, setExchangeRate] = useState(1)
  const [fee, setFee] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [txHash, setTxHash] = useState(null)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [walletDialogOpen, setWalletDialogOpen] = useState(false)
  const [showSourceTokenDropdown, setShowSourceTokenDropdown] = useState(false)

  // Validation states
  const [amountError, setAmountError] = useState('')

  // Get CNPY asset for calculations
  const cnpyAsset = assets.find(a => a.symbol === 'CNPY')
  const chainTokenAssets = assets.filter(a => a.symbol !== 'CNPY' && a.balance > 0)

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setStep(1)
      setBuyType(null)
      setSelectedSourceAsset(null)
      setSelectedTargetAsset(null)
      setSelectedTokenToBuy(null)
      setAmount('')
      setExchangeRate(1)
      setFee(0)
      setIsProcessing(false)
      setTxHash(null)
      setError(null)
      setAmountError('')
      setActiveTab(defaultTab)
      setShowSourceTokenDropdown(false)
    }
  }, [open, defaultTab])

  // Calculate values
  const amountNum = parseFloat(amount) || 0
  const feePercentage = 0.005 // 0.5%
  const calculatedFee = amountNum * feePercentage

  // Calculate target amount based on selected tokens
  const getTargetAmount = () => {
    if (selectedSourceAsset && selectedTokenToBuy) {
      // Converting source token to target token
      const sourceUSDValue = amountNum * selectedSourceAsset.price
      return sourceUSDValue / selectedTokenToBuy.price - calculatedFee
    }
    if (buyType === 'cnpy-swap' && selectedSourceAsset) {
      // Converting chain token to CNPY
      const sourceUSDValue = amountNum * selectedSourceAsset.price
      return sourceUSDValue / (cnpyAsset?.price || 2) - calculatedFee
    } else if (buyType === 'chain-token' && selectedTargetAsset) {
      // Converting CNPY to chain token
      const cnpyUSDValue = amountNum * (cnpyAsset?.price || 2)
      return cnpyUSDValue / selectedTargetAsset.price - calculatedFee
    }
    return amountNum - calculatedFee
  }

  const targetAmount = getTargetAmount()
  const sourceUSDValue = selectedSourceAsset
    ? amountNum * selectedSourceAsset.price
    : (buyType === 'chain-token'
      ? amountNum * (cnpyAsset?.price || 1)
      : amountNum * (selectedSourceAsset?.price || 1))
  const targetUSDValue = selectedTokenToBuy
    ? targetAmount * selectedTokenToBuy.price
    : (buyType === 'chain-token'
      ? targetAmount * (selectedTargetAsset?.price || 1)
      : targetAmount * (cnpyAsset?.price || 2))

  // Validate amount
  const validateAmount = () => {
    if (!amountNum || amountNum <= 0) {
      setAmountError('Amount must be greater than 0')
      return false
    }

    const availableBalance = selectedSourceAsset
      ? selectedSourceAsset.balance
      : (buyType === 'chain-token'
        ? cnpyAsset?.balance || 0
        : selectedSourceAsset?.balance || 0)

    if (amountNum > availableBalance) {
      setAmountError('Insufficient balance')
      return false
    }

    setAmountError('')
    return true
  }

  const handleMaxClick = () => {
    const maxBalance = selectedSourceAsset
      ? selectedSourceAsset.balance
      : (buyType === 'chain-token'
        ? cnpyAsset?.balance || 0
        : selectedSourceAsset?.balance || 0)
    setAmount(maxBalance.toString())
    setAmountError('')
  }

  const handleTabChange = (value) => {
    setActiveTab(value)
    setBuyType(null)
    setSelectedSourceAsset(null)
    setSelectedTargetAsset(null)
    setAmount('')
    setAmountError('')
  }

  const handleTokenSelect = (token) => {
    setSelectedTokenToBuy(token)

    if (token.symbol === 'CNPY') {
      // CANOPY goes to Connect Wallets
      handleClose()
      setWalletDialogOpen(true)
    } else {
      // Other tokens go to swap step
      // ALWAYS set CANOPY as default source
      if (cnpyAsset) {
        setSelectedSourceAsset(cnpyAsset)
        setExchangeRate(cnpyAsset.price / token.price)
      } else {
        // If no CANOPY, use first available token with balance
        const firstToken = assets.find(a => a.balance > 0)
        if (firstToken) {
          setSelectedSourceAsset(firstToken)
          setExchangeRate(firstToken.price / token.price)
        }
      }
      setStep(2)
    }
  }

  const handleBuyTypeSelect = (type) => {
    setBuyType(type)
    if (type === 'cnpy-external') {
      // Open external wallet dialog
      handleClose()
      setWalletDialogOpen(true)
    } else if (type === 'cnpy-swap') {
      setStep(2)
    } else if (type === 'chain-token') {
      setStep(2)
    }
  }

  const handleSourceAssetSelect = (assetId) => {
    const asset = chainTokenAssets.find(a => a.id === parseInt(assetId))
    if (asset) {
      setSelectedSourceAsset(asset)
      setExchangeRate(asset.price / (cnpyAsset?.price || 2))
    }
  }

  const handleTargetAssetSelect = (assetId) => {
    const asset = assets.find(a => a.id === parseInt(assetId))
    if (asset) {
      setSelectedTargetAsset(asset)
      setExchangeRate((cnpyAsset?.price || 1) / asset.price)
    }
  }

  const handleContinueFromStep2 = () => {
    if (!validateAmount()) return
    setStep(3)
  }

  const handleBack = () => {
    if (step === 2) {
      setStep(1)
      setAmount('')
      setAmountError('')
    } else if (step === 3) {
      setStep(2)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  const handleConfirmSwap = async () => {
    setStep(4)
    setIsProcessing(true)
    setError(null)

    // Simulate transaction
    setTimeout(() => {
      // Random success/failure for demo (90% success rate)
      const success = Math.random() > 0.1

      if (success) {
        // Generate mock transaction hash
        const mockHash = '0x' + Array.from({ length: 64 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join('')
        setTxHash(mockHash)
        setIsProcessing(false)
        setError(null)
      } else {
        setIsProcessing(false)
        setError('Swap failed. Please try again.')
      }
    }, 2000)
  }

  const handleBuyMore = () => {
    setStep(1)
    setBuyType(null)
    setSelectedSourceAsset(null)
    setSelectedTargetAsset(null)
    setAmount('')
    setTxHash(null)
    setError(null)
    setAmountError('')
  }

  const handleTryAgain = () => {
    setStep(2)
    setError(null)
  }

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  }

  const formatAddress = (addr) => {
    if (!addr) return ''
    if (addr.length <= 12) return addr
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] p-0" hideClose noAnimation>
          {/* Step 1: Token Selection */}
          {step === 1 && (
            <>
              <VisuallyHidden>
                <DialogTitle>Buy - Select Token</DialogTitle>
              </VisuallyHidden>
              {/* Header */}
              <div className="relative px-6 py-6 border-b">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={handleClose}
                >
                  <X className="w-5 h-5" />
                </Button>
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold">What do you want to buy?</h2>
                  <p className="text-sm text-muted-foreground">Select a token to purchase</p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-4 space-y-3 max-h-[500px] overflow-y-auto">
                {/* CANOPY - Always first */}
                {cnpyAsset && (
                  <button
                    onClick={() => handleTokenSelect(cnpyAsset)}
                    className="w-full p-4 border-2 rounded-xl hover:bg-muted/30 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: cnpyAsset.color }}
                        >
                          <span className="text-lg font-bold text-white">
                            {cnpyAsset.symbol.slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-base">{cnpyAsset.name}</p>
                          <p className="text-sm text-muted-foreground">
                            ${cnpyAsset.price.toFixed(2)} per token
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </button>
                )}

                {/* Other Tokens */}
                {assets.filter(a => a.symbol !== 'CNPY').map((token) => (
                  <button
                    key={token.id}
                    onClick={() => handleTokenSelect(token)}
                    className="w-full p-4 border-2 rounded-xl hover:bg-muted/30 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: token.color }}
                        >
                          <span className="text-lg font-bold text-white">
                            {token.symbol.slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-base">{token.name}</p>
                          <p className="text-sm text-muted-foreground">
                            ${token.price.toFixed(4)} per token
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 2: Swap to Buy Token */}
          {step === 2 && selectedTokenToBuy && (
            <>
              <VisuallyHidden>
                <DialogTitle>Buy {selectedTokenToBuy.name}</DialogTitle>
              </VisuallyHidden>
              <div className="relative px-6 py-6 border-b">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-2"
                  onClick={handleBack}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={handleClose}
                >
                  <X className="w-5 h-5" />
                </Button>
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold">Buy {selectedTokenToBuy.name}</h2>
                  <p className="text-sm text-muted-foreground">Select source token and amount to swap</p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-4 space-y-6">
                {/* Source Token Selector with Dropdown */}
                <div className="p-4 bg-muted rounded-xl space-y-3">
                  <p className="text-sm text-muted-foreground">Pay with</p>

                  {/* Source Token Dropdown */}
                  {selectedSourceAsset && (
                    <div className="relative">
                      <button
                        onClick={() => setShowSourceTokenDropdown(!showSourceTokenDropdown)}
                        className="w-full flex items-center justify-between px-3 py-2 bg-background rounded-full hover:bg-background/80 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center`}
                            style={{ backgroundColor: selectedSourceAsset.color }}
                          >
                            <span className="text-xs font-bold text-white">
                              {selectedSourceAsset.symbol.slice(0, 2)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm">
                            <span className="font-medium">{selectedSourceAsset.name}</span>
                            <span className="text-muted-foreground">
                              {selectedSourceAsset.balance.toFixed(2)} {selectedSourceAsset.symbol}
                            </span>
                          </div>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform ${showSourceTokenDropdown ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Dropdown Menu */}
                      {showSourceTokenDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-background rounded-xl border shadow-lg z-10">
                          {assets.filter(a => a.balance > 0 && a.id !== selectedTokenToBuy.id).map((token) => (
                            <button
                              key={token.id}
                              onClick={() => {
                                setSelectedSourceAsset(token)
                                setExchangeRate(token.price / selectedTokenToBuy.price)
                                setShowSourceTokenDropdown(false)
                              }}
                              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors ${
                                selectedSourceAsset.id === token.id ? 'bg-muted' : ''
                              }`}
                            >
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center`}
                                style={{ backgroundColor: token.color }}
                              >
                                <span className="text-xs font-bold text-white">
                                  {token.symbol.slice(0, 2)}
                                </span>
                              </div>
                              <div className="flex-1 text-left">
                                <p className="text-sm font-medium">{token.name}</p>
                                <p className="text-xs text-muted-foreground">{token.balance.toFixed(2)} {token.symbol}</p>
                              </div>
                              {selectedSourceAsset.id === token.id && (
                                <Check className="w-4 h-4 text-primary" />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Amount Input Card */}
                <Card className="bg-muted/30 p-6 space-y-3">
                  {/* Input */}
                  <div className="flex items-center justify-center">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={amount}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value === '' || /^\d*\.?\d*$/.test(value)) {
                          setAmount(value)
                          if (amountError) setAmountError('')
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
                      <span className="block">Available: {selectedSourceAsset?.balance.toFixed(2)} {selectedSourceAsset?.symbol}</span>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={handleMaxClick}
                    >
                      Use max
                    </Button>
                  </div>
                </Card>

                {/* Swap Direction */}
                <div className="relative flex justify-center">
                  <div className="w-8 h-8 rounded-full bg-background border-2 flex items-center justify-center">
                    <ArrowDown className="w-4 h-4" />
                  </div>
                </div>

                {/* Target Token Preview */}
                <Card className="bg-muted/30 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Target Token Avatar */}
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: selectedTokenToBuy.color }}
                      >
                        <span className="text-sm font-bold text-white">
                          {selectedTokenToBuy.symbol.slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{selectedTokenToBuy.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {selectedTokenToBuy.balance.toFixed(2)} {selectedTokenToBuy.symbol}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{targetAmount.toFixed(4)}</p>
                      <p className="text-xs text-muted-foreground">${targetUSDValue.toFixed(2)}</p>
                    </div>
                  </div>
                </Card>

                {amountError && (
                  <p className="text-sm text-red-500 text-center">{amountError}</p>
                )}

                <Button
                  className="w-full h-11 rounded-xl bg-[#1dd13a] hover:bg-[#1dd13a]/90 text-white"
                  onClick={handleContinueFromStep2}
                  disabled={!amountNum || amountNum <= 0}
                >
                  Continue
                </Button>

                {/* Exchange Rate */}
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <span>1 {selectedSourceAsset?.symbol} ≈ {exchangeRate.toFixed(4)} {selectedTokenToBuy.symbol}</span>
                </div>
              </div>
            </>
          )}

          {/* Step 3: Review & Confirm */}
          {step === 3 && (
            <>
              <VisuallyHidden>
                <DialogTitle>Buy - Review & Confirm</DialogTitle>
              </VisuallyHidden>
              <div className="relative p-6 pb-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-2"
                  onClick={handleBack}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={handleClose}
                >
                  <X className="w-5 h-5" />
                </Button>
                <h2 className="text-xl font-bold text-center">Review & Confirm</h2>
              </div>

              <div className="px-6 pb-6 space-y-6">
                {/* From/To Cards */}
                <div className="space-y-4">
                  {/* From */}
                  <Card className="p-4 border">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: buyType === 'chain-token'
                            ? cnpyAsset?.color || '#1dd13a'
                            : selectedSourceAsset?.color
                        }}
                      >
                        <span className="text-sm font-bold text-white">
                          {buyType === 'chain-token'
                            ? 'CN'
                            : selectedSourceAsset?.symbol.slice(0, 2)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground mb-1">From</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">
                            {buyType === 'chain-token' ? 'CNPY' : selectedSourceAsset?.name}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {amountNum.toFixed(4)} {buyType === 'chain-token' ? 'CNPY' : selectedSourceAsset?.symbol} ≈ ${sourceUSDValue.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Arrow */}
                  <div className="flex justify-center">
                    <ArrowDown className="w-5 h-5 text-muted-foreground" />
                  </div>

                  {/* To */}
                  <Card className="p-4 border">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: buyType === 'chain-token'
                            ? selectedTargetAsset?.color
                            : cnpyAsset?.color || '#1dd13a'
                        }}
                      >
                        <span className="text-sm font-bold text-white">
                          {buyType === 'chain-token'
                            ? selectedTargetAsset?.symbol.slice(0, 2)
                            : 'CN'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground mb-1">To</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">
                            {buyType === 'chain-token' ? selectedTargetAsset?.name : 'CNPY'}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          ~{targetAmount.toFixed(4)} {buyType === 'chain-token' ? selectedTargetAsset?.symbol : 'CNPY'} ≈ ${targetUSDValue.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Summary */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Summary</h3>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Exchange rate</span>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          1 {buyType === 'chain-token' ? 'CNPY' : selectedSourceAsset?.symbol} ≈ {exchangeRate.toFixed(4)} {buyType === 'chain-token' ? selectedTargetAsset?.symbol : 'CNPY'}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Fee (0.5%)</span>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          ${(calculatedFee * (buyType === 'chain-token' ? (cnpyAsset?.price || 2) : (selectedSourceAsset?.price || 1))).toFixed(4)}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-sm font-semibold">Total you will receive</span>
                      <div className="text-right">
                        <p className="text-sm font-semibold">
                          ~{targetAmount.toFixed(4)} {buyType === 'chain-token' ? selectedTargetAsset?.symbol : 'CNPY'}
                        </p>
                        <p className="text-xs text-muted-foreground">${targetUSDValue.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Warning */}
                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground">
                      This swap cannot be reversed. Please review before confirming.
                    </p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                  <Button
                    className="w-full h-12"
                    onClick={handleConfirmSwap}
                  >
                    Confirm & Swap
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={handleBack}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Step 4: Transaction Status */}
          {step === 4 && (
            <>
              <VisuallyHidden>
                <DialogTitle>Buy - Transaction Status</DialogTitle>
              </VisuallyHidden>
              <div className="relative p-6 pb-4">
                {!isProcessing && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={handleClose}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                )}
              </div>

              <div className="px-6 pb-6 space-y-6">
                {/* Processing State */}
                {isProcessing && (
                  <div className="flex flex-col items-center space-y-4 pb-8">
                    <div className="w-16 h-16 rounded-full border-2 border-foreground/40 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                    <h2 className="text-2xl font-bold">Processing Swap</h2>
                    <p className="text-center text-muted-foreground">
                      Please wait while your swap is being processed...
                    </p>
                  </div>
                )}

                {/* Success State */}
                {!isProcessing && !error && txHash && (
                  <>
                    <div className="flex flex-col items-center space-y-4 py-8">
                      <div className="w-16 h-16 rounded-full border-2 border-green-500 flex items-center justify-center">
                        <Check className="w-8 h-8 text-green-500" />
                      </div>
                      <h2 className="text-2xl font-bold">Swap Successful!</h2>
                      <p className="text-center text-muted-foreground">
                        You have successfully bought{' '}
                        <span className="font-semibold text-foreground">
                          {targetAmount.toFixed(4)} {buyType === 'chain-token' ? selectedTargetAsset?.symbol : 'CNPY'}
                        </span>
                      </p>
                    </div>

                    {/* Transaction Details */}
                    <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Transaction Hash</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-mono break-all">{formatAddress(txHash)}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 flex-shrink-0"
                            onClick={() => copyToClipboard(txHash, 'Transaction hash')}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">What you bought</p>
                        <p className="text-sm font-medium">
                          {targetAmount.toFixed(4)} {buyType === 'chain-token' ? selectedTargetAsset?.symbol : 'CNPY'}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">What you spent</p>
                        <p className="text-sm font-medium">
                          {amountNum.toFixed(4)} {buyType === 'chain-token' ? 'CNPY' : selectedSourceAsset?.symbol}
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full mt-2"
                        onClick={() => {
                          toast.info('Block explorer integration coming soon')
                        }}
                      >
                        View on Explorer
                      </Button>
                    </div>

                    {/* Buttons */}
                    <div className="space-y-3">
                      <Button
                        className="w-full h-12"
                        onClick={handleBuyMore}
                      >
                        Buy More
                      </Button>
                    </div>
                  </>
                )}

                {/* Failed State */}
                {!isProcessing && error && (
                  <>
                    <div className="flex flex-col items-center space-y-4 py-8">
                      <div className="w-16 h-16 rounded-full border-2 border-red-500 flex items-center justify-center">
                        <X className="w-8 h-8 text-red-500" />
                      </div>
                      <h2 className="text-2xl font-bold">Swap Failed</h2>
                      <p className="text-center text-muted-foreground">
                        {error}
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="space-y-3">
                      <Button
                        className="w-full h-12"
                        onClick={handleTryAgain}
                      >
                        Try Again
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full"
                        onClick={handleClose}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* External Wallet Dialog */}
      <WalletConnectionDialog
        open={walletDialogOpen}
        onOpenChange={setWalletDialogOpen}
        initialStep={5}
      />
    </TooltipProvider>
  )
}
