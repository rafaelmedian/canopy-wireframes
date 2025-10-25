import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Copy, CheckCircle2, ArrowRightLeft, Clock, XCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getTransactionsByBlockNumber } from '@/data/db.js'

export default function BlockDetailSheet({ block, chainData, open, onOpenChange, onTransactionClick }) {
  const [copiedHash, setCopiedHash] = useState(false)
  const [copiedPrevHash, setCopiedPrevHash] = useState(false)
  const [blockTransactions, setBlockTransactions] = useState([])

  // Load all transactions for this block
  useEffect(() => {
    if (block && chainData) {
      const transactions = getTransactionsByBlockNumber(chainData.id, block.number)
      setBlockTransactions(transactions)
    }
  }, [block, chainData])

  if (!block) return null

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

  // Calculate block reward
  const calculateBlockReward = (blockNumber) => {
    if (!chainData.tokenomics) return 0

    const { totalSupply, blockTime, halvingDays } = chainData.tokenomics
    const blocksPerHalving = (halvingDays * 24 * 60 * 60) / blockTime
    const initialBlockSubsidy = parseInt(totalSupply) / (blocksPerHalving * 2)

    const halvingsPassed = Math.floor(blockNumber / blocksPerHalving)
    const currentReward = initialBlockSubsidy / Math.pow(2, halvingsPassed)

    return currentReward.toFixed(2)
  }

  // Truncate hash
  const truncateHash = (hash) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`
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
          <SheetTitle className="text-xl font-semibold">Block #{block.number}</SheetTitle>
        </SheetHeader>

        <div className="px-4">
          <Tabs defaultValue="overview">
            <TabsList className="w-full">
              <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
              <TabsTrigger value="transactions" className="flex-1">
                Transactions ({blockTransactions.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-5 mt-6">
              {/* Block Number */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Block Number</p>
                <p className="text-2xl font-bold">#{block.number.toLocaleString()}</p>
              </div>

              <div className="h-px bg-border" />

              {/* Timestamp */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Timestamp</p>
                <div>
                  <p className="text-sm font-medium">{formatTimeAgo(block.timestamp)}</p>
                  <p className="text-xs text-muted-foreground">{formatTimestamp(block.timestamp)}</p>
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* Transactions & Reward */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Transactions</p>
                  <p className="text-lg font-semibold">{block.transactions}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Block Reward</p>
                  <p className="text-lg font-semibold">
                    {calculateBlockReward(block.number)} {chainData.ticker}
                  </p>
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* Block Hash */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Block Hash</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm font-mono bg-muted px-3 py-2 rounded-md break-all">
                    {block.hash}
                  </code>
                  <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(block.hash, setCopiedHash)}
                  >
                    {copiedHash ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                        <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Previous Block Hash */}
              {block.number > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Previous Block Hash</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-sm font-mono bg-muted px-3 py-2 rounded-md break-all">
                        {block.prevHash || `0x${(block.number - 1).toString(16).padStart(64, '0')}`}
                      </code>
                      <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(
                              block.prevHash || `0x${(block.number - 1).toString(16).padStart(64, '0')}`,
                              setCopiedPrevHash
                          )}
                      >
                        {copiedPrevHash ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                            <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
              )}
            </TabsContent>

            <TabsContent value="transactions" className="mt-6">
              <div className="space-y-4">
                {blockTransactions.length > 0 ? (
                    blockTransactions.map((tx) => (
                        <button
                            key={tx.hash}
                            onClick={() => {
                              onTransactionClick && onTransactionClick(tx)
                              onOpenChange(false)
                            }}
                            className="w-full flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors text-left"
                        >
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg flex-shrink-0">
                              <ArrowRightLeft className="w-5 h-5 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-mono text-sm font-medium truncate">
                                {truncateHash(tx.hash)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatTimeAgo(tx.timestamp)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-6 text-sm relative">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">From:</span>
                              <span className="font-mono text-xs">{truncateHash(tx.from)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">To:</span>
                              <span className="font-mono text-xs">{truncateHash(tx.to)}</span>
                            </div>
                            <div>
                              <span className="font-semibold">{tx.amount.toLocaleString()}</span>
                              <span className="text-xs text-muted-foreground ml-1">{chainData.ticker}</span>
                            </div>
                            <div className="absolute top-[-38px] right-0 bg-background">
                              {getStatusBadge(tx.status)}
                            </div>

                          </div>
                        </button>
                    ))
                ) : (
                    <div className="text-center py-12">
                      <p className="text-sm text-muted-foreground">No transactions in this block</p>
                    </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
}
