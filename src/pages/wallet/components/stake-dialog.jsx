import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { X, ArrowLeft, Check, Info, Wallet } from 'lucide-react'

export default function StakeDialog({ open, onOpenChange, selectedChain, availableChains = [], assets = [] }) {
  const [step, setStep] = useState(1)
  const [amount, setAmount] = useState('')
  const [source, setSource] = useState('trading')
  const [internalSelectedChain, setInternalSelectedChain] = useState(null)

  // Determine if we need to show chain selection
  const needsChainSelection = !selectedChain && availableChains.length > 0
  const activeChain = selectedChain || internalSelectedChain

  // Reset internal state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setInternalSelectedChain(null)
      setStep(1)
      setAmount('')
      setSource('trading')
    }
  }, [open])

  const handleChainSelect = (chainId) => {
    const chain = availableChains.find(c => c.chainId === chainId)
    if (chain) {
      // Enrich with asset data
      const asset = assets?.find(a => a.chainId === chainId)
      const enrichedChain = {
        ...chain,
        price: asset?.price || 0,
        balance: asset?.balance || 0
      }
      setInternalSelectedChain(enrichedChain)
    }
  }

  if (!activeChain && !needsChainSelection) return null

  // Calculate values (only when we have an active chain)
  const availableBalance = activeChain?.balance || 0
  const amountNum = parseFloat(amount) || 0
  const amountUSD = activeChain ? amountNum * (activeChain.price || 0) : 0
  const projectedYearlyInterest = activeChain ? amountNum * (activeChain.apy / 100) : 0
  const projectedYearlyInterestUSD = activeChain ? projectedYearlyInterest * (activeChain.price || 0) : 0

  const handleMaxClick = () => {
    setAmount(availableBalance.toString())
  }

  const handleContinue = () => {
    if (step === 1 && amountNum > 0 && activeChain) {
      setStep(2)
    } else if (step === 2) {
      setStep(3)
    }
  }

  const handleBack = () => {
    if (step === 2) {
      setStep(1)
    }
  }

  const handleClose = () => {
    setStep(1)
    setAmount('')
    setSource('trading')
    setInternalSelectedChain(null)
    onOpenChange(false)
  }

  const handleDone = () => {
    handleClose()
  }

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] p-0" hideClose noAnimation>
          {/* Step 1: Stake Form */}
          {step === 1 && (
            <>
              {/* Header */}
              <div className="relative px-6 py-3  border-b">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={handleClose}
                >
                  <X className="w-5 h-5" />
                </Button>
                <div className="space-y-1">
                  <h2 className="text-xl font-bold">Earn Rewards</h2>
                </div>
              </div>

              <div className="px-6 pb-6 space-y-6">
                {/* Chain Selection or Display */}
                {needsChainSelection ? (
                  <div className="space-y-2">
                    <Label className="block text-sm font-medium">Select Chain</Label>
                    <Select value={activeChain?.chainId} onValueChange={handleChainSelect}>
                      <SelectTrigger className="h-auto py-3 [&>span]:line-clamp-none [&>span]:block">
                        <SelectValue placeholder="Choose a chain to stake">
                          {activeChain ? (
                            <div className="flex items-center gap-3">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: activeChain.color }}
                              >
                                <span className="text-sm font-bold text-white">
                                  {activeChain.symbol.slice(0, 2)}
                                </span>
                              </div>
                              <div className="flex flex-col items-start">
                                <span className="font-medium text-sm">{activeChain.chain}</span>
                                <span className="text-xs text-muted-foreground">
                                  {activeChain.symbol} • {activeChain.apy}% APY
                                </span>
                              </div>
                            </div>
                          ) : null}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {availableChains.map((chain) => (
                          <SelectItem key={chain.chainId} value={chain.chainId} className="h-auto py-3">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: chain.color }}
                              >
                                <span className="text-sm font-bold text-white">
                                  {chain.symbol.slice(0, 2)}
                                </span>
                              </div>
                              <div className="flex flex-col items-start gap-1">
                                <span className="font-medium">{chain.chain}</span>
                                <span className="text-xs text-muted-foreground">
                                  {chain.symbol} • {chain.apy}% APY
                                </span>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  /* Chain Display (when chain is pre-selected) */
                  <div className="p-4 mt-2 bg-muted/30 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: activeChain.color }}
                        >
                          <span className="text-sm font-bold text-white">
                            {activeChain.symbol.slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold">{activeChain.chain}</p>
                          <p className="text-sm text-muted-foreground">{activeChain.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{activeChain.apy}%</p>
                        <p className="text-xs text-muted-foreground">APY</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Source - Only show if we have an active chain */}
                {activeChain && (
                  <div className="space-y-2">
                    <Label className="block text-sm font-medium">Source</Label>
                    <Select value={source} onValueChange={setSource}>
                      <SelectTrigger className="h-auto py-3 [&>span]:line-clamp-none [&>span]:block">
                        <SelectValue>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                              <Wallet className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col items-start">
                              <span className="font-medium text-sm">Wallet balance</span>
                              <span className="text-xs text-muted-foreground">
                                {activeChain.symbol} balance: {availableBalance} {activeChain.symbol}
                              </span>
                            </div>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="trading" className="h-auto py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                              <Wallet className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col items-start gap-1">
                              <span className="font-medium">Wallet balance</span>
                              <span className="text-xs text-muted-foreground">
                                {activeChain.symbol} balance: {availableBalance} {activeChain.symbol}
                              </span>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Amount - Only show if we have an active chain */}
                {activeChain && (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="block text-sm font-medium">Amount</Label>
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
                            // Only allow numbers and decimal point
                            if (value === '' || /^\d*\.?\d*$/.test(value)) {
                              setAmount(value)
                            }
                          }}
                          className="pr-16 text-lg"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          {activeChain.symbol}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        approx. ${amountUSD.toFixed(2)} USD
                      </p>
                    </div>

                    {/* Projected Interest */}
                    <div className="space-y-2 pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm">Projected 1 year interest</Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>Estimated interest earnings after 1 year based on current APY</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="text-center py-2">
                        <p className="text-2xl font-bold">
                          {amountNum > 0 ? projectedYearlyInterest.toFixed(4) : '−'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          approx. ${projectedYearlyInterestUSD.toFixed(2)} USD
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {/* Continue Button */}
                <Button
                  className="w-full h-12"
                  onClick={handleContinue}
                  disabled={!activeChain || !amountNum || amountNum <= 0}
                >
                  Continue
                </Button>
              </div>
            </>
          )}

          {/* Step 2: Confirmation */}
          {step === 2 && (
            <>
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
                <h2 className="text-xl font-bold text-center pt-8">Earn confirmation</h2>
              </div>

              <div className="px-6 pb-6 space-y-6">
                {/* Summary */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Summary</h3>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">From</span>
                      <span className="text-sm font-medium">Wallet balance</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">To</span>
                      <span className="text-sm font-medium">Staking</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Annual % yield</span>
                      <span className="text-sm font-medium">{activeChain.apy}%</span>
                    </div>

                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-sm font-semibold">Total</span>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{amountNum} {activeChain.symbol}</p>
                        <p className="text-xs text-muted-foreground">${amountUSD.toFixed(2)} USD</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    By clicking "confirm," you are agreeing to lend your crypto to Canopy Network
                    according to the terms of the Master Loan Agreement. You are also authorizing
                    Canopy to disclose your name, email, date of birth, and state of residence to
                    Canopy solely for the purposes of fulfilling customer identification and
                    anti-money laundering obligations.
                  </p>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                  <Button
                    className="w-full h-12"
                    onClick={handleContinue}
                  >
                    Confirm
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

          {/* Step 3: Success */}
          {step === 3 && (
            <>
              <div className="relative p-6 pb-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={handleClose}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="px-6 pb-6 space-y-6">
                {/* Success Icon */}
                <div className="flex flex-col items-center space-y-4 py-8">
                  <div className="w-16 h-16 rounded-full border-2 border-foreground flex items-center justify-center">
                    <Check className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold">Success!</h2>
                  <p className="text-center text-muted-foreground">
                    You will begin earning interest on{' '}
                    <span className="font-semibold text-foreground">
                      {amountNum} {activeChain.symbol}
                    </span>{' '}
                    after one business day.
                  </p>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                  <Button
                    className="w-full h-12"
                    onClick={handleDone}
                  >
                    Done
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={handleDone}
                  >
                    Go to Portfolio
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}
