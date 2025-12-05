import { useState, useEffect } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { X, ArrowLeft, Check, Info, Wallet, Plus, RefreshCw } from 'lucide-react'

export default function CnpyStakeDialog({
  open,
  onOpenChange,
  cnpyStake,
  cnpyAsset,
  allChains = []
}) {
  const [step, setStep] = useState(1)
  const [amount, setAmount] = useState('')
  const [selectedChains, setSelectedChains] = useState([])
  const [autoCompound, setAutoCompound] = useState(true)

  // Initialize selected chains and auto-compound from current stake
  useEffect(() => {
    if (open && cnpyStake) {
      if (cnpyStake.committees) {
        setSelectedChains(cnpyStake.committees.map(c => c.chainId))
      }
      // Initialize auto-compound with existing stake setting
      setAutoCompound(cnpyStake.restakeRewards ?? true)
    }
  }, [open, cnpyStake])

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setStep(1)
      setAmount('')
      setAutoCompound(true)
    }
  }, [open])

  if (!cnpyStake) return null

  const availableBalance = cnpyAsset?.balance || 0
  const currentStakedAmount = cnpyStake.amount || 0
  const amountNum = parseFloat(amount) || 0
  const price = cnpyAsset?.price || 1.50
  const amountUSD = amountNum * price

  // Combine current committees with available chains
  const currentCommitteeIds = cnpyStake.committees?.map(c => c.chainId) || []
  const availableChains = cnpyStake.availableChains || []

  // All chains user can select from (currently staking + available to add)
  const allSelectableChains = [
    ...(cnpyStake.committees || []).map(c => ({ ...c, isCurrentCommittee: true })),
    ...availableChains.map(c => ({ ...c, isCurrentCommittee: false }))
  ]

  const handleChainToggle = (chainId) => {
    setSelectedChains(prev => {
      if (prev.includes(chainId)) {
        return prev.filter(id => id !== chainId)
      } else {
        return [...prev, chainId]
      }
    })
  }

  const handleMaxClick = () => {
    setAmount(availableBalance.toString())
  }

  const handleContinue = () => {
    if (step === 1) {
      // For adding more, need amount
      if (currentStakedAmount > 0) {
        // Already staking, go to chain selection
        setStep(2)
      } else if (amountNum > 0) {
        setStep(2)
      }
    } else if (step === 2) {
      setStep(3)
    } else if (step === 3) {
      setStep(4)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleClose = () => {
    setStep(1)
    setAmount('')
    setSelectedChains([])
    onOpenChange(false)
  }

  const handleDone = () => {
    handleClose()
  }

  const isAddingMore = currentStakedAmount > 0

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] p-0" hideClose noAnimation>
          {/* Step 1: Amount (if not already staking) or direct to chain selection */}
          {step === 1 && (
            <>
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
                  <h2 className="text-xl font-bold">
                    {isAddingMore ? 'Add More CNPY' : 'Stake CNPY'}
                  </h2>
                </div>
              </div>

              <div className="px-6 pb-6 space-y-6">
                {/* CNPY Info Card */}
                <div className="p-4 mt-2 bg-muted/30 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: cnpyStake.color }}
                      >
                        <span className="text-sm font-bold text-white">CN</span>
                      </div>
                      <div>
                        <p className="font-semibold">Canopy</p>
                        <p className="text-sm text-muted-foreground">CNPY</p>
                      </div>
                    </div>
                    {isAddingMore && (
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Currently staked</p>
                        <p className="font-semibold">{currentStakedAmount.toLocaleString()} CNPY</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Amount Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="block text-sm font-medium">
                      {isAddingMore ? 'Amount to add' : 'Amount to stake'}
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
                        }
                      }}
                      className="pr-16 text-lg"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      CNPY
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>approx. ${amountUSD.toFixed(2)} USD</span>
                    <span>Balance: {availableBalance.toLocaleString()} CNPY</span>
                  </div>
                </div>

                {/* Auto-compound Toggle */}
                <div className="p-4 bg-muted/30 rounded-lg border">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <RefreshCw className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        <Label htmlFor="cnpy-auto-compound" className="text-sm font-medium cursor-pointer">
                          Auto-compound rewards
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {autoCompound
                            ? 'Rewards will be automatically restaked to maximize your earnings through compound interest.'
                            : 'Rewards will be transferred to your wallet balance instead of being restaked.'}
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="cnpy-auto-compound"
                      checked={autoCompound}
                      onCheckedChange={setAutoCompound}
                    />
                  </div>
                </div>

                {/* Penalty Warning when auto-compound is disabled */}
                {!autoCompound && (
                  <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <Info className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-yellow-500">20% Reward Penalty</p>
                      <p className="text-xs text-muted-foreground">
                        Disabling auto-compound incurs a 20% penalty on your staking rewards to help maintain network security and stability.
                      </p>
                    </div>
                  </div>
                )}

                <Button
                  className="w-full h-12"
                  onClick={handleContinue}
                  disabled={amountNum <= 0}
                >
                  Continue to Select Chains
                </Button>
              </div>
            </>
          )}

          {/* Step 2: Chain Selection */}
          {step === 2 && (
            <>
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
                <h2 className="text-xl font-bold text-center pt-2">Select Chains</h2>
              </div>

              <div className="px-6 pb-6 space-y-4">
                {/* Info box */}
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Earn tokens from multiple chains</p>
                      <p className="text-xs text-muted-foreground">
                        When you stake CNPY, you can choose which chains to stake for. You'll earn both CNPY and the native token of each chain you select. This is optional and can be changed later.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Staking summary */}
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Staking amount</span>
                    <span className="font-medium">
                      {isAddingMore
                        ? `${currentStakedAmount.toLocaleString()} + ${amountNum.toLocaleString()} CNPY`
                        : `${amountNum.toLocaleString()} CNPY`
                      }
                    </span>
                  </div>
                </div>

                {/* Chain list */}
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  <Label className="text-sm font-medium">Chains to stake for</Label>

                  {allSelectableChains.map((chain) => {
                    const isSelected = selectedChains.includes(chain.chainId)

                    return (
                      <div
                        key={chain.chainId}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-muted-foreground/50'
                        }`}
                        onClick={() => handleChainToggle(chain.chainId)}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleChainToggle(chain.chainId)}
                          />
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: chain.color }}
                          >
                            <span className="text-xs font-bold text-white">
                              {chain.symbol.slice(0, 2)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm">{chain.chain}</p>
                              {chain.isCurrentCommittee && (
                                <span className="text-xs px-1.5 py-0.5 bg-green-500/10 text-green-600 rounded">
                                  Active
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Earn {chain.symbol}
                              {chain.estimatedApy && ` • Est. ${chain.estimatedApy}% APY`}
                            </p>
                          </div>
                          {chain.rewards > 0 && (
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">Earned</p>
                              <p className="text-sm font-medium">{chain.rewards} {chain.symbol}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <Button
                  className="w-full h-12"
                  onClick={handleContinue}
                >
                  {selectedChains.length > 0
                    ? `Continue (${selectedChains.length} chain${selectedChains.length !== 1 ? 's' : ''} selected)`
                    : 'Continue without extra chains'}
                </Button>
              </div>
            </>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
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
                <h2 className="text-xl font-bold text-center pt-8">Confirm Stake</h2>
              </div>

              <div className="px-6 pb-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Summary</h3>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Amount</span>
                      <span className="text-sm font-medium">{amountNum.toLocaleString()} CNPY</span>
                    </div>

                    {isAddingMore && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">New total</span>
                        <span className="text-sm font-medium">
                          {(currentStakedAmount + amountNum).toLocaleString()} CNPY
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Chains</span>
                      <span className="text-sm font-medium">{selectedChains.length} selected</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Auto-compound</span>
                      {autoCompound ? (
                        <span className="text-sm font-medium">Enabled</span>
                      ) : (
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium text-yellow-500">Disabled (20% penalty)</span>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="w-3.5 h-3.5 text-yellow-500" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p>Disabling auto-compound incurs a 20% penalty on your staking rewards to help maintain network security and stability.</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground mb-2">You will earn:</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                          CNPY
                        </span>
                        {selectedChains.map(chainId => {
                          const chain = allSelectableChains.find(c => c.chainId === chainId)
                          return chain ? (
                            <span
                              key={chainId}
                              className="text-xs px-2 py-1 rounded-full"
                              style={{
                                backgroundColor: `${chain.color}20`,
                                color: chain.color
                              }}
                            >
                              {chain.symbol}
                            </span>
                          ) : null
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    By clicking "confirm," you are staking your CNPY tokens for the selected chains.
                    You will earn CNPY rewards plus the native token of each chain you've selected.
                    You can modify your chain selection at any time via editStake.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button className="w-full h-12" onClick={handleContinue}>
                    Confirm Stake
                  </Button>
                  <Button variant="ghost" className="w-full" onClick={handleBack}>
                    Cancel
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
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
                <div className="flex flex-col items-center space-y-4 py-8">
                  <div className="w-16 h-16 rounded-full border-2 border-foreground flex items-center justify-center">
                    <Check className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold">Success!</h2>
                  <p className="text-center text-muted-foreground">
                    You are now staking{' '}
                    <span className="font-semibold text-foreground">
                      {isAddingMore
                        ? (currentStakedAmount + amountNum).toLocaleString()
                        : amountNum.toLocaleString()
                      } CNPY
                    </span>{' '}
                    for {selectedChains.length} chain{selectedChains.length !== 1 ? 's' : ''}.
                  </p>
                  <p className="text-sm text-center text-muted-foreground">
                    You will begin earning CNPY and native tokens after one business day.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button className="w-full h-12" onClick={handleDone}>
                    Done
                  </Button>
                  <Button variant="ghost" className="w-full" onClick={handleDone}>
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
