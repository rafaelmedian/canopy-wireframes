import { Sheet, SheetContent } from '@/components/ui/sheet.jsx'
import { Button } from '@/components/ui/button'
import { Copy, CheckCircle2, ArrowUpRight, ArrowDownLeft, Repeat, Lock, Unlock, Gift } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function TransactionDetailSheet({ transaction, open, onOpenChange }) {
  const [copiedHash, setCopiedHash] = useState(false)

  if (!transaction) return null

  // Copy to clipboard
  const copyHash = () => {
    navigator.clipboard.writeText(transaction.hash)
    setCopiedHash(true)
    toast.success('Transaction hash copied')
    setTimeout(() => setCopiedHash(false), 2000)
  }

  // Get transaction icon and title based on type
  const getTransactionInfo = () => {
    switch (transaction.type) {
      case 'sent':
        return {
          title: 'Send',
          subtitle: `${transaction.symbolFrom || transaction.symbol} → ${transaction.symbolTo || transaction.symbol}`,
          icon: <ArrowUpRight className="w-12 h-12 text-primary" />
        }
      case 'received':
        return {
          title: 'Receive',
          subtitle: `${transaction.symbolFrom || transaction.symbol} → ${transaction.symbolTo || transaction.symbol}`,
          icon: <ArrowDownLeft className="w-12 h-12 text-primary" />
        }
      case 'swap':
        return {
          title: 'Token Swap',
          subtitle: `${transaction.symbolFrom} → ${transaction.symbolTo}`,
          icon: <Repeat className="w-12 h-12 text-primary" />
        }
      case 'staked':
        return {
          title: 'Stake',
          subtitle: `${transaction.symbol}`,
          icon: <Lock className="w-12 h-12 text-primary" />
        }
      case 'unstaked':
        return {
          title: 'Unstake',
          subtitle: `${transaction.symbol}`,
          icon: <Unlock className="w-12 h-12 text-primary" />
        }
      case 'claimed':
        return {
          title: 'Claim Rewards',
          subtitle: `${transaction.symbol}`,
          icon: <Gift className="w-12 h-12 text-primary" />
        }
      default:
        return {
          title: 'Transaction',
          subtitle: '',
          icon: <ArrowUpRight className="w-12 h-12 text-primary" />
        }
    }
  }

  const { title, subtitle, icon } = getTransactionInfo()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0 overflow-y-auto bg-background">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-6 py-8 text-center">
            <h2 className="text-2xl font-bold mb-6">{title}</h2>

            {/* Icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              {icon}
            </div>

            <div className="text-3xl font-bold mb-1">
              {subtitle}
            </div>
          </div>

          {/* Transaction Info Card */}
          <div className="mx-6 mb-4 rounded-2xl bg-muted/30 overflow-hidden">
            {/* Date */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-border">
              <span className="text-sm text-muted-foreground">Date</span>
              <span className="text-sm font-medium">{transaction.timestamp}</span>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-border">
              <span className="text-sm text-muted-foreground">Status</span>
              <span className="text-sm font-medium text-green-500">
                {transaction.status === 'completed' ? 'Succeeded' : 'Pending'}
              </span>
            </div>

            {/* Network */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-border">
              <span className="text-sm text-muted-foreground">Network</span>
              <span className="text-sm font-medium">{transaction.network || 'Ethereum'}</span>
            </div>

            {/* Network Fee */}
            <div className="flex items-center justify-between px-4 py-4">
              <span className="text-sm text-muted-foreground">Network Fee</span>
              <span className="text-sm font-medium">
                {transaction.fee ? `${transaction.fee} ${transaction.symbol || transaction.symbolFrom}` : `~< 0.00001 ${transaction.symbol || transaction.symbolFrom}`}
              </span>
            </div>
          </div>

          {/* Type-specific Details */}
          {transaction.type === 'swap' && (
            <div className="mx-6 mb-4 rounded-2xl bg-muted/30 overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-muted/50">
                <h3 className="text-sm font-semibold">Swap Details</h3>
              </div>

              <div className="flex items-center justify-between px-4 py-4 border-b border-border">
                <span className="text-sm text-muted-foreground">Provider</span>
                <span className="text-sm font-medium">Unknown</span>
              </div>

              <div className="flex items-center justify-between px-4 py-4 border-b border-border">
                <span className="text-sm text-muted-foreground">You Paid</span>
                <span className="text-sm font-medium">-{transaction.amountFrom} {transaction.symbolFrom}</span>
              </div>

              <div className="flex items-center justify-between px-4 py-4">
                <span className="text-sm text-muted-foreground">You Received</span>
                <span className="text-sm font-medium text-green-500">+{transaction.amountTo} {transaction.symbolTo}</span>
              </div>
            </div>
          )}

          {transaction.type === 'staked' && (
            <div className="mx-6 mb-4 rounded-2xl bg-muted/30 overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-muted/50">
                <h3 className="text-sm font-semibold">Stake Details</h3>
              </div>

              <div className="flex items-center justify-between px-4 py-4 border-b border-border">
                <span className="text-sm text-muted-foreground">Amount Staked</span>
                <span className="text-sm font-medium">-{Math.abs(transaction.amount)} {transaction.symbol}</span>
              </div>

              <div className="flex items-center justify-between px-4 py-4 border-b border-border">
                <span className="text-sm text-muted-foreground">APY</span>
                <span className="text-sm font-medium">{transaction.apy}%</span>
              </div>

              <div className="flex items-center justify-between px-4 py-4">
                <span className="text-sm text-muted-foreground">Contract</span>
                <span className="text-sm font-medium font-mono">{transaction.to?.slice(0, 6)}...{transaction.to?.slice(-4)}</span>
              </div>
            </div>
          )}

          {transaction.type === 'unstaked' && (
            <div className="mx-6 mb-4 rounded-2xl bg-muted/30 overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-muted/50">
                <h3 className="text-sm font-semibold">Unstake Details</h3>
              </div>

              <div className="flex items-center justify-between px-4 py-4 border-b border-border">
                <span className="text-sm text-muted-foreground">Amount Unstaked</span>
                <span className="text-sm font-medium text-green-500">+{Math.abs(transaction.amount)} {transaction.symbol}</span>
              </div>

              <div className="flex items-center justify-between px-4 py-4 border-b border-border">
                <span className="text-sm text-muted-foreground">Rewards Earned</span>
                <span className="text-sm font-medium text-green-500">+{transaction.rewards} {transaction.symbol}</span>
              </div>

              <div className="flex items-center justify-between px-4 py-4">
                <span className="text-sm text-muted-foreground">Contract</span>
                <span className="text-sm font-mono text-sm">{transaction.from?.slice(0, 6)}...{transaction.from?.slice(-4)}</span>
              </div>
            </div>
          )}

          {transaction.type === 'claimed' && (
            <div className="mx-6 mb-4 rounded-2xl bg-muted/30 overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-muted/50">
                <h3 className="text-sm font-semibold">Claim Details</h3>
              </div>

              <div className="flex items-center justify-between px-4 py-4 border-b border-border">
                <span className="text-sm text-muted-foreground">Rewards Claimed</span>
                <span className="text-sm font-medium text-green-500">+{Math.abs(transaction.amount)} {transaction.symbol}</span>
              </div>

              <div className="flex items-center justify-between px-4 py-4 border-b border-border">
                <span className="text-sm text-muted-foreground">From Contract</span>
                <span className="text-sm font-mono">{transaction.from?.slice(0, 6)}...{transaction.from?.slice(-4)}</span>
              </div>

              <div className="flex items-center justify-between px-4 py-4">
                <span className="text-sm text-muted-foreground">To Wallet</span>
                <span className="text-sm font-mono">{transaction.to?.slice(0, 6)}...{transaction.to?.slice(-4)}</span>
              </div>
            </div>
          )}

          {(transaction.type === 'sent' || transaction.type === 'received') && (
            <div className="mx-6 mb-4 rounded-2xl bg-muted/30 overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-muted/50">
                <h3 className="text-sm font-semibold">Transfer Details</h3>
              </div>

              <div className="flex items-center justify-between px-4 py-4 border-b border-border">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className={`text-sm font-medium ${transaction.amount > 0 ? 'text-green-500' : ''}`}>
                  {transaction.amount > 0 ? '+' : ''}{Math.abs(transaction.amount)} {transaction.symbol}
                </span>
              </div>

              <div className="flex items-center justify-between px-4 py-4 border-b border-border">
                <span className="text-sm text-muted-foreground">{transaction.type === 'sent' ? 'From (You)' : 'From'}</span>
                <span className="text-sm font-mono">{transaction.from?.slice(0, 6)}...{transaction.from?.slice(-4)}</span>
              </div>

              <div className="flex items-center justify-between px-4 py-4">
                <span className="text-sm text-muted-foreground">{transaction.type === 'received' ? 'To (You)' : 'To'}</span>
                <span className="text-sm font-mono">{transaction.to?.slice(0, 6)}...{transaction.to?.slice(-4)}</span>
              </div>
            </div>
          )}

          {/* Copy Hash Button */}
          <div className="px-6 py-6 mt-auto">
            <Button
              variant="outline"
              className="w-full h-12 rounded-xl text-sm font-medium"
              onClick={copyHash}
            >
              {copiedHash ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Transaction Hash
                </>
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
