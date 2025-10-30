import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet.jsx'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Copy } from 'lucide-react'
import { useState } from 'react'

export default function TransactionDetailSheet({ transaction, open, onOpenChange }) {
  const [copiedHash, setCopiedHash] = useState(false)
  const [copiedFrom, setCopiedFrom] = useState(false)
  const [copiedTo, setCopiedTo] = useState(false)

  if (!transaction) return null

  // Copy to clipboard
  const copyToClipboard = (text, setCopied) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Get transaction title
  const getTransactionTitle = () => {
    switch (transaction.type) {
      case 'sent':
        return 'Send Transaction'
      case 'received':
        return 'Receive Transaction'
      case 'swap':
        return 'Swap Transaction'
      case 'staked':
        return 'Stake Transaction'
      case 'unstaked':
        return 'Unstake Transaction'
      case 'claimed':
        return 'Claim Rewards Transaction'
      default:
        return 'Transaction Details'
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold">{getTransactionTitle()}</SheetTitle>
        </SheetHeader>

        <div className="px-4 space-y-5">
          {/* Transaction Hash */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Transaction Hash</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm font-mono bg-muted px-3 py-2 rounded-md break-all">
                {transaction.hash}
              </code>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(transaction.hash, setCopiedHash)}
              >
                {copiedHash ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Status & Timestamp */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant="outline" className="border-green-500/50 text-green-500">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                {transaction.status === 'completed' ? 'Completed' : 'Pending'}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Timestamp</p>
              <p className="text-sm font-medium">{transaction.timestamp}</p>
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Type-specific fields */}
          {transaction.type === 'swap' ? (
            <>
              {/* Swap From/To */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Swap Details</p>
                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">You Sent</span>
                    <span className="text-sm font-semibold">
                      {transaction.amountFrom} {transaction.symbolFrom}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">You Received</span>
                    <span className="text-sm font-semibold">
                      {transaction.amountTo} {transaction.symbolTo}
                    </span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* Swap Contract */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Swap Contract</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm font-mono bg-muted px-3 py-2 rounded-md break-all">
                    {transaction.to}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(transaction.to, setCopiedTo)}
                  >
                    {copiedTo ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          ) : transaction.type === 'staked' ? (
            <>
              {/* Staked Amount */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Amount Staked</p>
                <p className="text-2xl font-bold">
                  {Math.abs(transaction.amount)} {transaction.symbol}
                </p>
              </div>

              <div className="h-px bg-border" />

              {/* APY */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Annual Percentage Yield (APY)</p>
                <p className="text-lg font-semibold">{transaction.apy}%</p>
              </div>

              <div className="h-px bg-border" />

              {/* Staking Contract */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Staking Contract</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm font-mono bg-muted px-3 py-2 rounded-md break-all">
                    {transaction.to}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(transaction.to, setCopiedTo)}
                  >
                    {copiedTo ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          ) : transaction.type === 'unstaked' ? (
            <>
              {/* Unstaked Amount */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Amount Unstaked</p>
                <p className="text-2xl font-bold">
                  {Math.abs(transaction.amount)} {transaction.symbol}
                </p>
              </div>

              <div className="h-px bg-border" />

              {/* Rewards Earned */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Rewards Earned While Staked</p>
                <p className="text-lg font-semibold">
                  +{transaction.rewards} {transaction.symbol}
                </p>
              </div>

              <div className="h-px bg-border" />

              {/* Staking Contract */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Staking Contract</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm font-mono bg-muted px-3 py-2 rounded-md break-all">
                    {transaction.from}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(transaction.from, setCopiedFrom)}
                  >
                    {copiedFrom ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          ) : transaction.type === 'claimed' ? (
            <>
              {/* Claimed Rewards */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Rewards Claimed</p>
                <p className="text-2xl font-bold">
                  +{Math.abs(transaction.amount)} {transaction.symbol}
                </p>
              </div>

              <div className="h-px bg-border" />

              {/* Staking Contract */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Staking Contract</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm font-mono bg-muted px-3 py-2 rounded-md break-all">
                    {transaction.from}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(transaction.from, setCopiedFrom)}
                  >
                    {copiedFrom ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* Your Wallet */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Your Wallet</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm font-mono bg-muted px-3 py-2 rounded-md break-all">
                    {transaction.to}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(transaction.to, setCopiedTo)}
                  >
                    {copiedTo ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Sent/Received Amount */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="text-2xl font-bold">
                  {transaction.amount > 0 ? '+' : '-'}{Math.abs(transaction.amount)} {transaction.symbol}
                </p>
              </div>

              <div className="h-px bg-border" />

              {/* From Address */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{transaction.type === 'sent' ? 'Your Wallet' : 'From'}</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm font-mono bg-muted px-3 py-2 rounded-md break-all">
                    {transaction.from}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(transaction.from, setCopiedFrom)}
                  >
                    {copiedFrom ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* To Address */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{transaction.type === 'received' ? 'Your Wallet' : 'To'}</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm font-mono bg-muted px-3 py-2 rounded-md break-all">
                    {transaction.to}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(transaction.to, setCopiedTo)}
                  >
                    {copiedTo ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}

          <div className="h-px bg-border" />

          {/* Transaction Fee */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Transaction Fee</p>
            <p className="text-lg font-semibold">
              {transaction.fee ? `${transaction.fee} ${transaction.symbol || transaction.symbolFrom}` : `< 0.001 ${transaction.symbol || transaction.symbolFrom}`}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
