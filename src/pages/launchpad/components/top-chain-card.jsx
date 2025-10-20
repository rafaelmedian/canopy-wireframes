import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

export default function TopChainCard({ chain }) {
  const progress = (chain.marketCap / chain.goal) * 100

  // Generate weekly trend chart data
  const chartData = chain.priceHistory || Array.from({ length: 50 }, (_, i) => {
    const baseValue = chain.currentPrice * 0.6 // Start lower
    const growthFactor = (i / 50) * 0.8 // Strong upward trend
    const volatility = (Math.sin(i / 3) + Math.random() - 0.5) * 0.15 // Add volatility
    return {
      value: baseValue + (chain.currentPrice * growthFactor) + (chain.currentPrice * volatility)
    }
  })

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-muted/20">
      <div className="grid grid-cols-[1fr_400px] gap-8">
        {/* Left Side: Info */}
        <div className="space-y-6">
          {/* Header: Logo, Name, Created */}
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: chain.brandColor || '#10b981' }}
            >
              {chain.logo ? (
                <img
                  src={chain.logo}
                  alt={chain.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-base font-bold text-black">
                  {chain.ticker[0]}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium">${chain.ticker}</h3>
              <p className="text-xs text-muted-foreground">
                {chain.name} • created 29 mins ago
              </p>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold leading-tight">
            {chain.tagline || `${chain.name} on the blockchain`}
          </h2>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {chain.description || `Buy an initial chain supply with $700 in crypto on your take everything on-chain.`}
          </p>

          {/* Progress Bar with Label */}
          <div className="space-y-2">
            <Progress
              value={progress}
              className="h-3"
              style={{
                '--progress-foreground': chain.brandColor || '#10b981'
              }}
            />
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">
                ${(chain.marketCap / 1000).toFixed(0)}k / ${(chain.goal / 1000).toFixed(0)}k
              </span>
              {chain.change24h !== undefined && (
                <span className={chain.change24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                  {chain.change24h >= 0 ? '+' : ''}{chain.change24h}%
                </span>
              )}
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-6 pt-2 border-t border-border/50">
            {/* Holder Avatars */}
            <div className="flex items-center">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/60 to-primary/40 border-2 border-card"
                  />
                ))}
              </div>
              <span className="ml-3 text-xs text-muted-foreground">
                {chain.holderCount || 0}+ all
              </span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-xs">
              <div>
                <span className="text-muted-foreground">VOL (24h) </span>
                <span className="font-medium">${((chain.volume || 0) / 1000).toFixed(1)}k</span>
              </div>
              <div>
                <span className="text-muted-foreground">MCap </span>
                <span className="font-medium">${((chain.marketCap || 0) / 1000).toFixed(1)}k</span>
              </div>
              <div>
                <span className="text-muted-foreground">HOL </span>
                <span className="font-medium">{chain.holderCount || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Chart */}
        <div className="flex items-center">
          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={chain.brandColor || '#10b981'}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>
  )
}
