import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Card } from '@/components/ui/card'
import { X, ArrowLeft, Check, AlertCircle, Copy, ArrowDown, Loader2, Repeat } from 'lucide-react'
import { toast } from 'sonner'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import WalletConnectionDialog from '@/components/wallet-connection-dialog'

export default function BuyDialog({ open, onOpenChange, defaultTab = 'cnpy', assets = [] }) {
  const [step, setStep] = useState(1)
  const [buyType, setBuyType] = useState(null) // 'cnpy-external' | 'cnpy-swap' | 'chain-token'
  const [selectedSourceAsset, setSelectedSourceAsset] = useState(null)
  const [selectedTargetAsset, setSelectedTargetAsset] = useState(null)
  const [amount, setAmount] = useState('')
  const [exchangeRate, setExchangeRate] = useState(1)
  const [fee, setFee] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [txHash, setTxHash] = useState(null)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [walletDialogOpen, setWalletDialogOpen] = useState(false)

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
      setAmount('')
      setExchangeRate(1)
      setFee(0)
      setIsProcessing(false)
      setTxHash(null)
      setError(null)
      setAmountError('')
      setActiveTab(defaultTab)
    }
  }, [open, defaultTab])

  // Calculate values
  const amountNum = parseFloat(amount) || 0
  const feePercentage = 0.005 // 0.5%
  const calculatedFee = amountNum * feePercentage

  // Calculate target amount based on buy type
  const getTargetAmount = () => {
    if (buyType === 'cnpy-swap' && selectedSourceAsset) {
      // Converting chain token to CNPY
      const sourceUSDValue = amountNum * selectedSourceAsset.price
      return sourceUSDValue / (cnpyAsset?.price || 1) - calculatedFee
    } else if (buyType === 'chain-token' && selectedTargetAsset) {
      // Converting CNPY to chain token
      const cnpyUSDValue = amountNum * (cnpyAsset?.price || 1)
      return cnpyUSDValue / selectedTargetAsset.price - calculatedFee
    }
    return amountNum - calculatedFee
  }

  const targetAmount = getTargetAmount()
  const sourceUSDValue = buyType === 'chain-token'
    ? amountNum * (cnpyAsset?.price || 1)
    : amountNum * (selectedSourceAsset?.price || 1)
  const targetUSDValue = buyType === 'chain-token'
    ? targetAmount * (selectedTargetAsset?.price || 1)
    : targetAmount * (cnpyAsset?.price || 1)

  // Validate amount
  const validateAmount = () => {
    if (!amountNum || amountNum <= 0) {
      setAmountError('Amount must be greater than 0')
      return false
    }

    const availableBalance = buyType === 'chain-token'
      ? cnpyAsset?.balance || 0
      : selectedSourceAsset?.balance || 0

    if (amountNum > availableBalance) {
      setAmountError('Insufficient balance')
      return false
    }

    setAmountError('')
    return true
  }

  const handleMaxClick = () => {
    const maxBalance = buyType === 'chain-token'
      ? cnpyAsset?.balance || 0
      : selectedSourceAsset?.balance || 0
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
      setExchangeRate(asset.price / (cnpyAsset?.price || 1))
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

  const handleDone = () => {
    const tokenBought = buyType === 'chain-token'
      ? selectedTargetAsset?.symbol
      : 'CNPY'
    toast.success(`Successfully bought ${targetAmount.toFixed(4)} ${tokenBought}`)
    handleClose()
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
          {/* Step 1: Buy Type Selection */}
          {step === 1 && (
            <>
              <VisuallyHidden>
                <DialogTitle>Buy - Select Type</DialogTitle>
              </VisuallyHidden>
              {/* Header */}
              <div className="relative px-6 py-3 border-b">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={handleClose}
                >
                  <X className="w-5 h-5" />
                </Button>
                <div className="space-y-1">
                  <h2 className="text-xl font-bold">Buy</h2>
                </div>
              </div>

              <div className="px-6 pb-6 space-y-6">
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="cnpy">Buy CNPY</TabsTrigger>
                    <TabsTrigger value="chain-token">Buy Chain Tokens</TabsTrigger>
                  </TabsList>

                  {/* Buy CNPY Tab */}
                  <TabsContent value="cnpy" className="space-y-4 mt-4">
                    <div className="space-y-3">
                      <Label className="block text-sm font-medium">How do you want to buy CNPY?</Label>

                      {/* From External Wallet */}
                      <button
                        onClick={() => handleBuyTypeSelect('cnpy-external')}
                        className="w-full p-4 border-2 rounded-lg hover:bg-muted/30 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Repeat className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">From External Wallet</p>
                            <p className="text-sm text-muted-foreground">
                              Use ETH/USDC from EVM wallets with MetaMask
                            </p>
                          </div>
                        </div>
                      </button>

                      {/* From Chain Tokens */}
                      <button
                        onClick={() => handleBuyTypeSelect('cnpy-swap')}
                        className="w-full p-4 border-2 rounded-lg hover:bg-muted/30 transition-colors text-left"
                        disabled={chainTokenAssets.length === 0}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <ArrowDown className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">From Chain Tokens</p>
                            <p className="text-sm text-muted-foreground">
                              {chainTokenAssets.length > 0
                                ? 'Swap your existing chain tokens to CNPY'
                                : 'No chain tokens available to swap'}
                            </p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </TabsContent>

                  {/* Buy Chain Tokens Tab */}
                  <TabsContent value="chain-token" className="space-y-4 mt-4">
                    <div className="space-y-3">
                      <Label className="block text-sm font-medium">Buy with CNPY</Label>

                      {(cnpyAsset?.balance || 0) > 0 ? (
                        <button
                          onClick={() => handleBuyTypeSelect('chain-token')}
                          className="w-full p-4 border-2 rounded-lg hover:bg-muted/30 transition-colors text-left"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <ArrowDown className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">Buy Chain Token</p>
                              <p className="text-sm text-muted-foreground">
                                Available: {cnpyAsset.balance.toLocaleString()} CNPY
                              </p>
                            </div>
                          </div>
                        </button>
                      ) : (
                        <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                          <div className="flex gap-3">
                            <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">No CNPY Balance</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                You need CNPY to buy chain tokens. Buy CNPY first.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}

          {/* Step 2: Enter Amount & Select Assets */}
          {step === 2 && (
            <>
              <VisuallyHidden>
                <DialogTitle>Buy - Enter Amount</DialogTitle>
              </VisuallyHidden>
              <div className="relative px-6 py-3 border-b">
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
                <div className="space-y-1 text-center">
                  <h2 className="text-xl font-bold">
                    {buyType === 'cnpy-swap' ? 'Buy CNPY' : 'Buy Chain Token'}
                  </h2>
                </div>
              </div>

              <div className="px-6 pb-6 space-y-6">
                {/* Asset Selection */}
                {buyType === 'cnpy-swap' && (
                  <div className="space-y-2">
                    <Label className="block text-sm font-medium">Select asset to swap</Label>
                    <Select
                      value={selectedSourceAsset?.id?.toString()}
                      onValueChange={handleSourceAssetSelect}
                    >
                      <SelectTrigger className="h-auto py-3 [&>span]:line-clamp-none [&>span]:block">
                        <SelectValue placeholder="Choose an asset">
                          {selectedSourceAsset ? (
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                  style={{ backgroundColor: selectedSourceAsset.color }}
                                >
                                  <span className="text-sm font-bold text-white">
                                    {selectedSourceAsset.symbol.slice(0, 2)}
                                  </span>
                                </div>
                                <div className="flex flex-col items-start">
                                  <span className="font-medium text-sm">{selectedSourceAsset.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {selectedSourceAsset.balance.toLocaleString()} {selectedSourceAsset.symbol}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : null}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {chainTokenAssets.map((asset) => (
                          <SelectItem key={asset.id} value={asset.id.toString()} className="h-auto py-3">
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                  style={{ backgroundColor: asset.color }}
                                >
                                  <span className="text-sm font-bold text-white">
                                    {asset.symbol.slice(0, 2)}
                                  </span>
                                </div>
                                <div className="flex flex-col items-start gap-1">
                                  <span className="font-medium">{asset.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {asset.balance.toLocaleString()} {asset.symbol} ≈ ${asset.value.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {buyType === 'chain-token' && (
                  <div className="space-y-2">
                    <Label className="block text-sm font-medium">Select chain token</Label>
                    <Select
                      value={selectedTargetAsset?.id?.toString()}
                      onValueChange={handleTargetAssetSelect}
                    >
                      <SelectTrigger className="h-auto py-3 [&>span]:line-clamp-none [&>span]:block">
                        <SelectValue placeholder="Choose a token">
                          {selectedTargetAsset ? (
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                  style={{ backgroundColor: selectedTargetAsset.color }}
                                >
                                  <span className="text-sm font-bold text-white">
                                    {selectedTargetAsset.symbol.slice(0, 2)}
                                  </span>
                                </div>
                                <div className="flex flex-col items-start">
                                  <span className="font-medium text-sm">{selectedTargetAsset.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    ${selectedTargetAsset.price.toFixed(4)} per token
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : null}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {assets.filter(a => a.symbol !== 'CNPY').map((asset) => (
                          <SelectItem key={asset.id} value={asset.id.toString()} className="h-auto py-3">
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                  style={{ backgroundColor: asset.color }}
                                >
                                  <span className="text-sm font-bold text-white">
                                    {asset.symbol.slice(0, 2)}
                                  </span>
                                </div>
                                <div className="flex flex-col items-start gap-1">
                                  <span className="font-medium">{asset.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    ${asset.price.toFixed(4)} per token
                                  </span>
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Amount Input */}
                {((buyType === 'cnpy-swap' && selectedSourceAsset) ||
                  (buyType === 'chain-token' && selectedTargetAsset)) && (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="block text-sm font-medium">
                          Amount to {buyType === 'chain-token' ? 'spend' : 'swap'}
                        </Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs"
                          onClick={handleMaxClick}
                        >
                          Max
                        </Button>
                      </div>
                      <div className="relative">
                        <Input
                          type="text"
                          inputMode="decimal"
                          placeholder="0"
                          value={amount}
                          onChange={(e) => {
                            const value = e.target.value
                            if (value === '' || /^\d*\.?\d*$/.test(value)) {
                              setAmount(value)
                              if (amountError) setAmountError('')
                            }
                          }}
                          onBlur={validateAmount}
                          className={`pr-16 text-lg ${amountError ? 'border-red-500' : ''}`}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          {buyType === 'chain-token' ? 'CNPY' : selectedSourceAsset?.symbol}
                        </span>
                      </div>
                      {amountError && (
                        <p className="text-sm text-red-500">{amountError}</p>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          approx. ${sourceUSDValue.toFixed(2)} USD
                        </span>
                        <span className="text-muted-foreground">
                          Available: {buyType === 'chain-token'
                            ? (cnpyAsset?.balance || 0).toLocaleString() + ' CNPY'
                            : (selectedSourceAsset?.balance || 0).toLocaleString() + ' ' + selectedSourceAsset?.symbol}
                        </span>
                      </div>
                    </div>

                    {/* Swap Preview */}
                    {amountNum > 0 && (
                      <div className="p-4 bg-muted/30 rounded-lg border space-y-3">
                        <Label className="text-sm font-medium">You will receive</Label>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
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
                            <span className="font-medium">
                              {buyType === 'chain-token'
                                ? selectedTargetAsset?.symbol
                                : 'CNPY'}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">~{targetAmount.toFixed(4)}</p>
                            <p className="text-xs text-muted-foreground">
                              ≈ ${targetUSDValue.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 border-t space-y-1 text-xs text-muted-foreground">
                          <div className="flex justify-between">
                            <span>Exchange rate</span>
                            <span>
                              1 {buyType === 'chain-token' ? 'CNPY' : selectedSourceAsset?.symbol} ≈ {exchangeRate.toFixed(4)} {buyType === 'chain-token' ? selectedTargetAsset?.symbol : 'CNPY'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Fee (0.5%)</span>
                            <span>${(calculatedFee * (buyType === 'chain-token' ? (cnpyAsset?.price || 1) : (selectedSourceAsset?.price || 1))).toFixed(4)}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Continue Button */}
                    <Button
                      className="w-full h-12"
                      onClick={handleContinueFromStep2}
                      disabled={!amountNum || amountNum <= 0}
                    >
                      Continue
                    </Button>
                  </>
                )}
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
                          ${(calculatedFee * (buyType === 'chain-token' ? (cnpyAsset?.price || 1) : (selectedSourceAsset?.price || 1))).toFixed(4)}
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
                      <Button
                        variant="ghost"
                        className="w-full"
                        onClick={handleDone}
                      >
                        Close
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
        initialStep={4}
      />
    </TooltipProvider>
  )
}
