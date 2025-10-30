import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet.jsx'

export default function EarningsHistorySheet({ open, onOpenChange, stakes, earningsHistory = [] }) {
  // Calculate total earnings
  const totalEarnings = earningsHistory.reduce((sum, day) => {
    return sum + day.transactions.reduce((daySum, tx) => daySum + tx.amountUSD, 0)
  }, 0)

  // Group transactions by date
  const groupedByDate = earningsHistory

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold">Earnings History</SheetTitle>
        </SheetHeader>

        <div className="px-4 space-y-5">
          {/* Total Earned Summary */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Total Earned</p>
            <p className="text-3xl font-bold">
              ${totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-muted-foreground mt-1">All-time earnings</p>
          </div>

          <div className="h-px bg-border" />

          {/* Earnings List */}
          <div className="space-y-4">
            {groupedByDate.length > 0 ? (
              groupedByDate.map((dayGroup) => (
                <div key={dayGroup.date} className="space-y-2">
                  {/* Date Header */}
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {dayGroup.date}
                  </p>

                  {/* Transactions for this day */}
                  <div className="space-y-1">
                    {dayGroup.transactions.map((tx) => {
                      const stake = stakes?.find(s => s.chainId === tx.chainId)
                      return (
                        <div
                          key={tx.id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          {/* Chain Avatar */}
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: stake?.color }}
                          >
                            <span className="text-xs font-bold text-white">
                              {tx.symbol.slice(0, 2)}
                            </span>
                          </div>

                          {/* Chain Symbol */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{tx.symbol}</p>
                          </div>

                          {/* Amount */}
                          <div className="text-right">
                            <p className="text-sm font-medium">+{tx.amount} {tx.symbol}</p>
                            <p className="text-xs text-muted-foreground">
                              ${tx.amountUSD.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-sm text-muted-foreground">No earnings history yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Start staking to earn rewards
                </p>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
