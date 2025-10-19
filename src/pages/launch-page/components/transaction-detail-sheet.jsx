import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Clock, XCircle, Copy, ExternalLink } from 'lucide-react'
import { useState } from 'react'

export default function TransactionDetailSheet({ transaction, ticker, open, onOpenChange, onBlockClick }) {
  const [copiedHash, setCopiedHash] = useState(false)
  const [copiedFrom, setCopiedFrom] = useState(false)
  const [copiedTo, setCopiedTo] = useState(false)

  if (!transaction) return null

  // Format timestamp
  const formatTimestamp = (seconds) => {
    const date = new Date(Date.now() - seconds * 1000)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })
  }

  const formatTimeAgo = (seconds) => {
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  // Copy to clipboard
  const copyToClipboard = (text, setCopied) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Get status badge
  const getStatusBadge = (status) => {
    if (status === 'success') {
      return (
        <Badge variant="outline" className="border-green-500/50 text-green-500">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Success
        </Badge>
      )
    }
    if (status === 'pending') {
      return (
        <Badge variant="outline" className="border-yellow-500/50 text-yellow-500">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="border-red-500/50 text-red-500">
        <XCircle className="w-3 h-3 mr-1" />
        Failed
      </Badge>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold">Transaction Details</SheetTitle>
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
              {getStatusBadge(transaction.status)}
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Timestamp</p>
              <div>
                <p className="text-sm font-medium">{formatTimeAgo(transaction.timestamp)}</p>
                <p className="text-xs text-muted-foreground">{formatTimestamp(transaction.timestamp)}</p>
              </div>
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Block Number */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Block</p>
            <Button
              variant="link"
              className="h-auto p-0 text-sm font-medium text-primary"
              onClick={() => {
                onBlockClick && onBlockClick(transaction.blockNumber)
                onOpenChange(false)
              }}
            >
              #{transaction.blockNumber}
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </div>

          <div className="h-px bg-border" />

          {/* From Address */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">From</p>
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
            <p className="text-sm text-muted-foreground">To</p>
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

          <div className="h-px bg-border" />

          {/* Amount & Fee */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="text-lg font-semibold">
                {transaction.amount.toLocaleString()} {ticker}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Transaction Fee</p>
              <p className="text-lg font-semibold">
                {transaction.fee ? `${transaction.fee} ${ticker}` : '< 0.001 ' + ticker}
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
