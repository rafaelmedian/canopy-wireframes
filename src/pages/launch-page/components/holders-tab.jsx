import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { AVATAR_COLORS } from '@/data/mock-config'

export default function HoldersTab({ holders = [], ticker = 'tokens', totalHolders, currentPrice = 0.001 }) {
  // Safety check
  if (!Array.isArray(holders)) {
    console.error('HoldersTab: holders is not an array', holders)
    return (
      <Card className="p-6 mt-4">
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground">Unable to load holders data</p>
        </div>
      </Card>
    )
  }

  // Generate a deterministic color based on the address
  const getAvatarColor = (address) => {
    const hash = address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return AVATAR_COLORS[hash % AVATAR_COLORS.length]
  }

  // Get initials from address (first 2 chars after 0x)
  const getInitials = (address) => {
    return address.slice(2, 4).toUpperCase()
  }

  // Truncate address to show start and end (e.g., 0x742d...bEb1)
  const truncateAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Calculate percentage of total supply
  const totalTokens = holders.reduce((sum, holder) => sum + holder.balance, 0)
  const getPercentage = (balance) => {
    if (totalTokens === 0) return '0.00'
    return ((balance / totalTokens) * 100).toFixed(2)
  }

  // Calculate USD value
  const getUSDValue = (balance) => {
    return (balance * currentPrice).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  const showOthersCount = totalHolders && totalHolders > holders.length

  return (
    <Card className="p-6 mt-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Top Holders</h3>
          <p className="text-sm text-muted-foreground">{totalHolders || holders.length} holders</p>
        </div>

        <div>
          {holders.map((holder, idx) => (
            <div
              key={holder.address}
              className="flex items-center gap-4 py-4 border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
            >
              {/* Rank */}
              <div className="flex items-center justify-center w-8 h-8 text-sm font-semibold text-muted-foreground">
                #{idx + 1}
              </div>

              {/* Avatar */}
              <Avatar className="w-10 h-10">
                <AvatarFallback className={`${getAvatarColor(holder.address)} text-white font-semibold`}>
                  {getInitials(holder.address)}
                </AvatarFallback>
              </Avatar>

              {/* Address */}
              <div className="flex-1 min-w-0">
                <p className="font-mono text-sm font-medium">
                  {truncateAddress(holder.address)}
                </p>
              </div>

              {/* Balance Info */}
              <div className="text-right">
                <p className="font-semibold text-sm">
                  {getUSDValue(holder.balance)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {getPercentage(holder.balance)}% • {holder.balance.toLocaleString()} {ticker}
                </p>
              </div>
            </div>
          ))}
        </div>

        {showOthersCount && (
          <>
            <Separator className="my-4" />
            <p className="text-sm text-center text-muted-foreground">
              Among {(totalHolders - holders.length).toLocaleString()} others
            </p>
          </>
        )}

        {holders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">No holders yet</p>
          </div>
        )}
      </div>
    </Card>
  )
}
