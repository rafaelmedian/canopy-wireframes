import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Activity, Box, ArrowRightLeft, Search, ExternalLink, CheckCircle2, Clock, XCircle } from 'lucide-react'
import TransactionDetailSheet from './transaction-detail-sheet'
import BlockDetailSheet from './block-detail-sheet'

export default function BlockExplorerTab({ chainData }) {
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [selectedBlock, setSelectedBlock] = useState(null)
  const [transactionSheetOpen, setTransactionSheetOpen] = useState(false)
  const [blockSheetOpen, setBlockSheetOpen] = useState(false)
  const [loadingMoreBlocks, setLoadingMoreBlocks] = useState(false)
  const [loadingMoreTransactions, setLoadingMoreTransactions] = useState(false)
  const [searchBlocksOpen, setSearchBlocksOpen] = useState(false)
  const [searchTransactionsOpen, setSearchTransactionsOpen] = useState(false)
  const [blockSearchQuery, setBlockSearchQuery] = useState('')
  const [transactionSearchQuery, setTransactionSearchQuery] = useState('')

  const handleTransactionClick = (tx) => {
    setSelectedTransaction({ ...tx, blockNumber: chainData.explorer?.currentBlock || 245789 })
    setTransactionSheetOpen(true)
  }

  const handleBlockClick = (block) => {
    setSelectedBlock(block)
    setBlockSheetOpen(true)
  }

  const handleBlockClickFromTransaction = (blockNumber) => {
    const block = chainData.explorer?.recentBlocks?.find(b => b.number === blockNumber)
    if (block) {
      setSelectedBlock(block)
      setBlockSheetOpen(true)
    }
  }

  const handleLoadMoreBlocks = () => {
    setLoadingMoreBlocks(true)
    // Simulate loading - in real app this would fetch more data
    setTimeout(() => {
      setLoadingMoreBlocks(false)
    }, 1500)
  }

  const handleLoadMoreTransactions = () => {
    setLoadingMoreTransactions(true)
    // Simulate loading - in real app this would fetch more data
    setTimeout(() => {
      setLoadingMoreTransactions(false)
    }, 1500)
  }

  // Search filter functions
  const filteredBlocks = (chainData.explorer?.recentBlocks || []).filter(block => {
    if (!blockSearchQuery) return true
    const query = blockSearchQuery.toLowerCase()
    return (
      block.number.toString().includes(query) ||
      block.hash.toLowerCase().includes(query)
    )
  })

  const filteredTransactions = (chainData.explorer?.recentTransactions || []).filter(tx => {
    if (!transactionSearchQuery) return true
    const query = transactionSearchQuery.toLowerCase()
    return (
      tx.hash.toLowerCase().includes(query) ||
      tx.from.toLowerCase().includes(query) ||
      tx.to.toLowerCase().includes(query)
    )
  })

  // Truncate hash/address to crypto standard format
  const truncateHash = (hash) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`
  }

  // Format relative time
  const formatTimeAgo = (seconds) => {
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  // Calculate block reward based on halving schedule
  const calculateBlockReward = (blockNumber) => {
    if (!chainData.tokenomics) return 0

    const { totalSupply, blockTime, halvingDays } = chainData.tokenomics
    const blocksPerHalving = (halvingDays * 24 * 60 * 60) / blockTime
    const initialBlockSubsidy = parseInt(totalSupply) / (blocksPerHalving * 2)

    const halvingsPassed = Math.floor(blockNumber / blocksPerHalving)
    const currentReward = initialBlockSubsidy / Math.pow(2, halvingsPassed)

    return currentReward.toFixed(2)
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
    <div className="space-y-6 mt-4">
      {/* Network Stats */}
      <Card className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Box className="w-4 h-4" />
              <span>Block Height</span>
            </div>
            <p className="text-2xl font-bold">
              {chainData.explorer?.currentBlock?.toLocaleString() || '0'}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="w-4 h-4" />
              <span>Avg Block Time</span>
            </div>
            <p className="text-2xl font-bold">
              {chainData.tokenomics?.blockTime >= 60
                ? `${chainData.tokenomics.blockTime / 60}m`
                : `${chainData.tokenomics?.blockTime || 0}s`}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowRightLeft className="w-4 h-4" />
              <span>Total Transactions</span>
            </div>
            <p className="text-2xl font-bold">
              {chainData.explorer?.totalTransactions?.toLocaleString() || '0'}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4" />
              <span>Network Status</span>
            </div>
            <Badge variant="outline" className="border-green-500/50 text-green-500 text-sm">
              Active
            </Badge>
          </div>
        </div>
      </Card>

      {/* Recent Blocks */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          {searchBlocksOpen ? (
            <div className="flex-1 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by block number or hash..."
                  value={blockSearchQuery}
                  onChange={(e) => setBlockSearchQuery(e.target.value)}
                  className="pl-10 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  autoFocus
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSearchBlocksOpen(false)
                  setBlockSearchQuery('')
                }}
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <Box className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Recent Blocks</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchBlocksOpen(true)}
              >
                <Search className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>

        <div className="overflow-x-auto">
          <div>
            {filteredBlocks.length > 0 ? (
              filteredBlocks.map((block, idx) => (
                <button
                  key={block.number}
                  onClick={() => handleBlockClick(block)}
                  className="w-full flex items-center justify-between py-4 border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                      <Box className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Block #{block.number}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimeAgo(block.timestamp)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 text-sm">
                    <div>
                      <span className="text-muted-foreground">Txns: </span>
                      <span className="font-medium">{block.transactions}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Reward: </span>
                      <span className="font-medium">
                        {calculateBlockReward(block.number)} {chainData.ticker}
                      </span>
                    </div>
                    <div className="font-mono text-xs text-muted-foreground">
                      {truncateHash(block.hash)}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-muted rounded-full">
                    <Search className="w-6 h-6 text-muted-foreground" />
                  </div>
                </div>
                <p className="text-sm font-medium text-muted-foreground mb-1">No blocks found</p>
                <p className="text-xs text-muted-foreground">Try searching with a different block number or hash</p>
              </div>
            )}
          </div>
        </div>

        {/* Show More Button */}
        {filteredBlocks.length >= 8 && !blockSearchQuery && (
          <div className="mt-4">
            {loadingMoreBlocks ? (
              <div className="flex items-center justify-center py-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                <span className="ml-2 text-sm text-muted-foreground">Loading more blocks...</span>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={handleLoadMoreBlocks}
              >
                Show More
              </Button>
            )}
          </div>
        )}
      </Card>

      {/* Recent Transactions */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          {searchTransactionsOpen ? (
            <div className="flex-1 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by hash, from address, or to address..."
                  value={transactionSearchQuery}
                  onChange={(e) => setTransactionSearchQuery(e.target.value)}
                  className="pl-10 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  autoFocus
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSearchTransactionsOpen(false)
                  setTransactionSearchQuery('')
                }}
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Recent Transactions</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchTransactionsOpen(true)}
              >
                <Search className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>

        <div className="overflow-x-auto">
          <div>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx, idx) => (
                <button
                  key={tx.hash}
                  onClick={() => handleTransactionClick(tx)}
                  className="w-full flex items-center justify-between py-4 border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer text-left"
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

                  <div className="flex items-center gap-6 text-sm">
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
                    {getStatusBadge(tx.status)}
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-muted rounded-full">
                    <Search className="w-6 h-6 text-muted-foreground" />
                  </div>
                </div>
                <p className="text-sm font-medium text-muted-foreground mb-1">No transactions found</p>
                <p className="text-xs text-muted-foreground">Try searching with a different hash or address</p>
              </div>
            )}
          </div>
        </div>

        {/* Show More Button */}
        {filteredTransactions.length >= 8 && !transactionSearchQuery && (
          <div className="mt-4">
            {loadingMoreTransactions ? (
              <div className="flex items-center justify-center py-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                <span className="ml-2 text-sm text-muted-foreground">Loading more transactions...</span>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={handleLoadMoreTransactions}
              >
                Show More
              </Button>
            )}
          </div>
        )}
      </Card>

      {/* Detail Sheets */}
      <TransactionDetailSheet
        transaction={selectedTransaction}
        ticker={chainData.ticker}
        open={transactionSheetOpen}
        onOpenChange={setTransactionSheetOpen}
        onBlockClick={handleBlockClickFromTransaction}
      />
      <BlockDetailSheet
        block={selectedBlock}
        chainData={chainData}
        open={blockSheetOpen}
        onOpenChange={setBlockSheetOpen}
        onTransactionClick={handleTransactionClick}
      />
    </div>
  )
}
