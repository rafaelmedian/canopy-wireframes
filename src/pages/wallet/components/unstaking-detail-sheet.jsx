import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet.jsx'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, AlertCircle } from 'lucide-react'

export default function UnstakingDetailSheet({ unstakingItem, stakes, open, onOpenChange, onCancel }) {
  if (!unstakingItem) return null

  const stake = stakes?.find(s => s.chainId === unstakingItem.chainId)

  // Calculate total unstaking period (for display)
  const totalDays = 7 // This should match the unstaking period

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold">Unstaking Request</SheetTitle>
        </SheetHeader>

        <div className="px-4 space-y-5">
          {/* Chain Info */}
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: stake?.color }}
            >
              <span className="text-lg font-bold text-white">
                {unstakingItem.symbol.slice(0, 2)}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">{unstakingItem.symbol}</h3>
              <Badge variant="secondary" className="mt-1">Pending</Badge>
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Amount Being Unstaked */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Amount Being Unstaked</p>
            <p className="text-2xl font-bold">
              {unstakingItem.amount} {unstakingItem.symbol}
            </p>
          </div>

          <div className="h-px bg-border" />

          {/* Time Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Available In</p>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm font-medium">
                  {unstakingItem.daysRemaining} days, {unstakingItem.hoursRemaining} hours
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Unstaking Period</p>
              <p className="text-sm font-medium">{totalDays} days</p>
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Information */}
          <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-yellow-500">What happens during unstaking?</p>
              <p className="text-xs text-muted-foreground">
                Your tokens are no longer earning rewards and will become available in your wallet
                after the unstaking period completes. You can cancel this unstake request at any time
                to return your tokens to active staking.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4">
            <Button
              variant="outline"
              className="w-full h-12"
              onClick={() => {
                onCancel && onCancel(unstakingItem)
                onOpenChange(false)
              }}
            >
              Cancel Unstake Request
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
