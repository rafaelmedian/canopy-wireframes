import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X, AlertCircle } from 'lucide-react'

export default function CancelUnstakeDialog({ open, onOpenChange, unstakingItem, onConfirm }) {
  if (!unstakingItem) return null

  const handleConfirm = () => {
    onConfirm && onConfirm(unstakingItem)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0" hideClose noAnimation>
        <div className="relative p-6 pb-4">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={() => onOpenChange(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="px-6 pb-6 space-y-6">
          {/* Chain Info */}
          <div className="flex flex-col items-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold">Cancel Unstake Request?</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Are you sure you want to cancel this unstake request?
              </p>
            </div>
          </div>

          {/* Unstake Details */}
          <div className="p-4 bg-muted/50 rounded-lg space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Chain</span>
              <span className="font-medium">{unstakingItem.symbol}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium">{unstakingItem.amount} {unstakingItem.symbol}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Time Remaining</span>
              <span className="font-medium">{unstakingItem.daysRemaining} days, {unstakingItem.hoursRemaining} hours</span>
            </div>
          </div>

          {/* Warning */}
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-xs text-muted-foreground leading-relaxed">
              By canceling this unstake request, your {unstakingItem.amount} {unstakingItem.symbol} will
              be returned to active staking and will continue earning rewards immediately.
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full h-12"
              onClick={handleConfirm}
            >
              Yes, Cancel Unstake Request
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => onOpenChange(false)}
            >
              No, Keep Unstaking
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
