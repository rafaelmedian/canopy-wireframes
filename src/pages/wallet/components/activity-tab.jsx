import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ArrowUpRight, ArrowDownLeft, Repeat, TrendingUp, TrendingDown, CheckCircle, ChevronDown, Activity } from 'lucide-react'
import TransactionDetailSheet from './transaction-detail-sheet'

export default function ActivityTab({ transactions, compact = false }) {
  const navigate = useNavigate()
  const [selectedTypes, setSelectedTypes] = useState([])
  const [selectedStatuses, setSelectedStatuses] = useState([])
  const [selectedAssets, setSelectedAssets] = useState([])
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [detailSheetOpen, setDetailSheetOpen] = useState(false)

  // Get unique assets from transactions
  const assets = ['all', ...new Set(transactions.map(tx => tx.symbol || tx.symbolFrom).filter(Boolean))]

  // Get token color based on chainId or symbol
  const getTokenColor = (tx) => {
    const colors = {
      'OENS': '#10b981',
      'GAME': '#8b5cf6',
      'SOCL': '#06b6d4',
      'STRM': '#f59e0b',
      'DFIM': '#ec4899'
    }
    return colors[tx.symbol] || colors[tx.symbolFrom] || '#6366f1'
  }

  // Get transaction type icon
  const getTransactionTypeIcon = (type) => {
    switch (type) {
      case 'sent':
        return <ArrowUpRight className="w-2.5 h-2.5" />
      case 'received':
        return <ArrowDownLeft className="w-2.5 h-2.5" />
      case 'swap':
        return <Repeat className="w-2.5 h-2.5" />
      case 'staked':
        return <TrendingUp className="w-2.5 h-2.5" />
      case 'unstaked':
        return <TrendingDown className="w-2.5 h-2.5" />
      case 'claimed':
        return <CheckCircle className="w-2.5 h-2.5" />
      default:
        return <ArrowUpRight className="w-2.5 h-2.5" />
    }
  }

  // Format transaction type for display
  const formatTransactionType = (tx) => {
    switch (tx.type) {
      case 'sent':
        return `Sent ${tx.symbol}`
      case 'received':
        return `Received ${tx.symbol}`
      case 'swap':
        return `Swapped ${tx.symbolFrom} to ${tx.symbolTo}`
      case 'staked':
        return `Staked ${tx.symbol}`
      case 'unstaked':
        return `Unstaked ${tx.symbol}`
      case 'claimed':
        return `Claimed ${tx.symbol}`
      default:
        return tx.type
    }
  }

  // Format amount display
  const formatAmount = (tx) => {
    // Get asset to calculate USD value
    const asset = tx.symbol ?
      { symbol: tx.symbol, price: 2.24 } : // Default price, should match from assets
      { symbol: tx.symbolFrom, price: 2.24 }

    if (tx.type === 'swap') {
      const usdValueFrom = Math.abs(tx.amountFrom) * asset.price
      return {
        primary: `$${usdValueFrom.toFixed(2)}`,
        secondary: `${Math.abs(tx.amountFrom)} ${tx.symbolFrom} → ${tx.amountTo} ${tx.symbolTo}`
      }
    }

    const sign = tx.amount > 0 ? '+' : '-'
    const usdValue = Math.abs(tx.amount) * asset.price

    return {
      primary: `${sign}$${usdValue.toFixed(2)}`,
      secondary: `${sign}${Math.abs(tx.amount)} ${tx.symbol}`
    }
  }

  const transactionTypes = [
    { value: 'sent', label: 'Sent' },
    { value: 'received', label: 'Received' },
    { value: 'swap', label: 'Swap' },
    { value: 'staked', label: 'Staked' },
    { value: 'unstaked', label: 'Unstaked' },
    { value: 'claimed', label: 'Claimed' }
  ]

  const statuses = [
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' }
  ]

  // Toggle functions for multi-select
  const toggleType = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  const toggleStatus = (status) => {
    setSelectedStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    )
  }

  const toggleAsset = (asset) => {
    setSelectedAssets(prev =>
      prev.includes(asset) ? prev.filter(a => a !== asset) : [...prev, asset]
    )
  }

  // Filter transactions
  const filteredTransactions = transactions.filter(tx => {
    if (selectedTypes.length > 0 && !selectedTypes.includes(tx.type)) return false
    if (selectedStatuses.length > 0 && !selectedStatuses.includes(tx.status)) return false
    if (selectedAssets.length > 0) {
      const txAsset = tx.symbol || tx.symbolFrom
      if (!selectedAssets.includes(txAsset)) return false
    }
    return true
  })

  const hasActiveFilters = selectedTypes.length > 0 || selectedStatuses.length > 0 || selectedAssets.length > 0

  const handleResetFilters = () => {
    setSelectedTypes([])
    setSelectedStatuses([])
    setSelectedAssets([])
  }

  // Get filter button labels
  const getTypeLabel = () => {
    if (selectedTypes.length === 0) return 'Type'
    if (selectedTypes.length === 1) return transactionTypes.find(t => t.value === selectedTypes[0])?.label
    return `Type (${selectedTypes.length})`
  }

  const getStatusLabel = () => {
    if (selectedStatuses.length === 0) return 'Status'
    if (selectedStatuses.length === 1) return statuses.find(s => s.value === selectedStatuses[0])?.label
    return `Status (${selectedStatuses.length})`
  }

  const getAssetLabel = () => {
    if (selectedAssets.length === 0) return 'Asset'
    if (selectedAssets.length === 1) return selectedAssets[0]
    return `Asset (${selectedAssets.length})`
  }

  const handleTransactionClick = (tx) => {
    setSelectedTransaction(tx)
    setDetailSheetOpen(true)
  }

  const Wrapper = compact ? 'div' : Card
  const wrapperProps = compact ? {} : { className: "p-4" }

  // Show empty state if no transactions
  if (transactions.length === 0) {
    return (
      <Wrapper {...wrapperProps}>
        <Card className="p-12 border-0">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 bg-muted rounded-full">
              <Activity className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">No activity yet</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Start your blockchain journey by creating or investing in chains on the launchpad.
              </p>
            </div>
            <Button
              onClick={() => navigate('/')}
              className="mt-2"
            >
              Go to Launchpad
            </Button>
          </div>
        </Card>
      </Wrapper>
    )
  }

  return (
    <Wrapper {...wrapperProps}>
      {/* Header */}
      {!compact && <h2 className="text-xl font-semibold mb-5">Activity</h2>}

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        {/* Type Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-9 rounded-full">
              {getTypeLabel()}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {transactionTypes.map((type) => (
              <DropdownMenuCheckboxItem
                key={type.value}
                checked={selectedTypes.includes(type.value)}
                onCheckedChange={() => toggleType(type.value)}
              >
                {type.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-9 rounded-full">
              {getStatusLabel()}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {statuses.map((status) => (
              <DropdownMenuCheckboxItem
                key={status.value}
                checked={selectedStatuses.includes(status.value)}
                onCheckedChange={() => toggleStatus(status.value)}
              >
                {status.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Asset Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-9 rounded-full">
              {getAssetLabel()}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {assets.filter(a => a !== 'all').map((asset) => {
              const tx = transactions.find(t => (t.symbol || t.symbolFrom) === asset)
              return (
                <DropdownMenuCheckboxItem
                  key={asset}
                  checked={selectedAssets.includes(asset)}
                  onCheckedChange={() => toggleAsset(asset)}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: getTokenColor(tx) }}
                    >
                      <span className="text-[10px] font-bold text-white">
                        {asset.substring(0, 1)}
                      </span>
                    </div>
                    <span>{asset}</span>
                  </div>
                </DropdownMenuCheckboxItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Reset Filters */}
        {hasActiveFilters && (
          <Button
            variant="link"
            className="h-9 px-0 text-primary"
            onClick={handleResetFilters}
          >
            Reset filters
          </Button>
        )}
      </div>

      {/* Table Headers */}
      {!compact && (
        <div className="grid grid-cols-3 gap-4 pb-3 border-b text-sm font-medium text-muted-foreground">
          <div>Details</div>
          <div className="text-right">Amount</div>
          <div className="text-right">Date</div>
        </div>
      )}

      {/* Transactions List */}
      <div>
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((tx) => {
            const amount = formatAmount(tx)
            return (
              <button
                key={tx.id}
                onClick={() => handleTransactionClick(tx)}
                className="w-full grid grid-cols-3 gap-4 py-4 border-b border-border last:border-0 items-center hover:bg-muted/30 transition-colors cursor-pointer text-left"
              >
                {/* Details */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: getTokenColor(tx) }}
                    >
                      <span className="text-xs font-bold text-white">
                        {(tx.symbol || tx.symbolFrom).substring(0, 1)}
                      </span>
                    </div>
                    {/* Transaction Type Badge */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-background border-2 border-card flex items-center justify-center">
                      {getTransactionTypeIcon(tx.type)}
                    </div>
                  </div>
                  <div className="font-medium text-sm">
                    {formatTransactionType(tx)}
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right">
                  <div className="font-medium text-sm">
                    {amount.primary}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {amount.secondary}
                  </div>
                </div>

                {/* Date */}
                <div className="text-right text-sm">
                  {tx.timestamp}
                </div>
              </button>
            )
          })
        ) : (
          <div className="text-center py-12">
            <p className="text-sm font-medium text-muted-foreground mb-1">No transactions found</p>
            <p className="text-xs text-muted-foreground">
              Try adjusting your filters
            </p>
          </div>
        )}
      </div>

      {/* Transaction Detail Sheet */}
      <TransactionDetailSheet
        transaction={selectedTransaction}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
      />
    </Wrapper>
  )
}
