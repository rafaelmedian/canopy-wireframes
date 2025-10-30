import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X, Check, AlertCircle } from 'lucide-react'

export default function UnstakeDialog({ open, onOpenChange, selectedStake, onUnstakeSuccess }) {
  const [step, setStep] = useState(1)
  const [amount, setAmount] = useState('')

  if (!selectedStake) return null

  const stakedAmount = selectedStake.amount || 0
  const amountNum = parseFloat(amount) || 0
  const amountUSD = amountNum * (selectedStake.price || 0)
  const unstakingPeriod = 7 // 7 days unstaking period

  const handleMaxClick = () => {
    setAmount(stakedAmount.toString())
  }

  const handleContinue = () => {
    if (step === 1 && amountNum > 0) {
      setStep(2)
    } else if (step === 2) {
      // Call the success handler before moving to step 3
      onUnstakeSuccess && onUnstakeSuccess(selectedStake, amountNum)
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
    onOpenChange(false)
  }

  const handleDone = () => {
    handleClose()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0" hideClose noAnimation>
        {/* Step 1: Unstake Form */}
        {step === 1 && (
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
              {/* Chain Info */}
              <div className="flex flex-col items-center space-y-3">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: selectedStake.color }}
                >
                  <span className="text-xl font-bold text-white">
                    {selectedStake.symbol.slice(0, 2)}
                  </span>
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-semibold">Unstake {selectedStake.chain}</h2>
                  <p className="text-sm text-muted-foreground">{selectedStake.symbol}</p>
                </div>
              </div>

              {/* Staked Amount Info */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Currently Staked</span>
                  <span className="font-medium">{stakedAmount} {selectedStake.symbol}</span>
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Amount to Unstake</Label>
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
                    {selectedStake.symbol}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  approx. ${amountUSD.toFixed(2)} USD
                </p>
              </div>

              {/* Warning */}
              <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  {amountNum >= stakedAmount ? (
                    <>
                      <p className="text-sm font-medium text-yellow-500">Unstaking Period</p>
                      <p className="text-xs text-muted-foreground">
                        Your funds will be available after {unstakingPeriod} days. You will stop earning
                        rewards immediately.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-yellow-500">Partial Unstake</p>
                      <p className="text-xs text-muted-foreground">
                        Your remaining staked amount will continue earning rewards, but your rewards counter
                        will reset to 0 as this creates a new staking position. Unstaked funds will be
                        available after {unstakingPeriod} days.
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Continue Button */}
              <Button
                className="w-full h-12"
                onClick={handleContinue}
                disabled={!amountNum || amountNum <= 0 || amountNum > stakedAmount}
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
                <X className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={handleClose}
              >
                <X className="w-5 h-5" />
              </Button>
              <h2 className="text-xl font-bold text-center pt-8">Unstake confirmation</h2>
            </div>

            <div className="px-6 pb-6 space-y-6">
              {/* Summary */}
              <div className="space-y-4">
                <h3 className="font-semibold">Summary</h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">From</span>
                    <span className="text-sm font-medium">Staking</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">To</span>
                    <span className="text-sm font-medium">Wallet balance</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Unstaking period</span>
                    <span className="text-sm font-medium">{unstakingPeriod} days</span>
                  </div>

                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-sm font-semibold">Total</span>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{amountNum} {selectedStake.symbol}</p>
                      <p className="text-xs text-muted-foreground">${amountUSD.toFixed(2)} USD</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  By unstaking, you will stop earning rewards immediately. Your funds will be
                  available in your wallet after {unstakingPeriod} days. This action cannot be undone.
                </p>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <Button
                  className="w-full h-12"
                  onClick={handleContinue}
                >
                  Confirm Unstake
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
                <h2 className="text-2xl font-bold">Unstaking initiated!</h2>
                <p className="text-center text-muted-foreground">
                  Your{' '}
                  <span className="font-semibold text-foreground">
                    {amountNum} {selectedStake.symbol}
                  </span>{' '}
                  will be available in {unstakingPeriod} days.
                </p>
                <p className="text-sm text-center text-muted-foreground">
                  You can view the unstaking progress in the queue below.
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
                  View Portfolio
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
