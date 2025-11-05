import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X, ArrowLeft, Check } from 'lucide-react'

export default function ClaimDialog({ open, onOpenChange, selectedStake }) {
  const [step, setStep] = useState(1)

  if (!selectedStake) return null

  const rewardsAmount = selectedStake.rewards || 0
  const rewardsUSD = selectedStake.rewardsUSD || 0

  const handleConfirm = () => {
    setStep(2)
  }

  const handleBack = () => {
    setStep(1)
  }

  const handleClose = () => {
    setStep(1)
    onOpenChange(false)
  }

  const handleDone = () => {
    handleClose()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0" hideClose noAnimation>
        {/* Step 1: Confirmation */}
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
                  <h2 className="text-xl font-semibold">{selectedStake.chain}</h2>
                  <p className="text-sm text-muted-foreground">{selectedStake.symbol}</p>
                </div>
              </div>

              {/* Claim amount */}
              <div className="space-y-4">
                <h3 className="font-semibold text-center">Claim Rewards</h3>

                <div className="p-6 bg-muted/50 rounded-lg text-center space-y-2">
                  <p className="text-3xl font-bold">
                    {rewardsAmount} {selectedStake.symbol}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ≈ ${rewardsUSD.toFixed(2)} USD
                  </p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">From</span>
                    <span className="font-medium">Staking rewards</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">To</span>
                    <span className="font-medium">Wallet balance</span>
                  </div>

                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-sm font-semibold">Total</span>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{rewardsAmount} {selectedStake.symbol}</p>
                      <p className="text-xs text-muted-foreground">${rewardsUSD.toFixed(2)} USD</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your rewards will be transferred to your wallet balance immediately.
                  Your staked assets will remain earning interest.
                </p>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <Button
                  className="w-full h-12"
                  onClick={handleConfirm}
                >
                  Confirm Claim
                </Button>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Step 2: Success */}
        {step === 2 && (
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
                  You have successfully claimed{' '}
                  <span className="font-semibold text-foreground">
                    {rewardsAmount} {selectedStake.symbol}
                  </span>
                  {' '}(${rewardsUSD.toFixed(2)} USD).
                </p>
                <p className="text-sm text-center text-muted-foreground">
                  Your rewards are now available in your wallet balance.
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
