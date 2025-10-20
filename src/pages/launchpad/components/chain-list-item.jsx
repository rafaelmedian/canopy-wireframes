import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useNavigate } from 'react-router-dom'

export default function ChainListItem({ chain }) {
  const navigate = useNavigate()

  const progress = (chain.marketCap / chain.goal) * 100

  const handleClick = () => {
    navigate(chain.url)
  }

  return (
    <Card
      onClick={handleClick}
      className="p-4 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
    >
      <div className="grid grid-cols-[200px_1fr_120px_120px_120px_120px_100px] gap-6 items-center">
        {/* Chain Name & Logo */}
        <div className="flex items-center gap-3">
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
              <span className="text-sm font-bold text-black">
                {chain.ticker[0]}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold truncate">{chain.name}</h3>
            <p className="text-xs text-muted-foreground">${chain.ticker}</p>
          </div>
        </div>

        {/* Market Cap & Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Market Cap</span>
            <span className="text-sm font-medium">
              ${(chain.marketCap / 1000).toFixed(1)}k / ${(chain.goal / 1000).toFixed(0)}k
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Price Change (24h) */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Change (24h)</p>
          {chain.change24h !== undefined ? (
            <p className={`text-sm font-semibold ${chain.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {chain.change24h >= 0 ? '+' : ''}{chain.change24h}%
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">-</p>
          )}
        </div>

        {/* Volume (24h) */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">VOL (24h)</p>
          <p className="text-sm font-medium">
            ${((chain.volume || 0) / 1000).toFixed(1)}k
          </p>
        </div>

        {/* Holders */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Holders</p>
          <p className="text-sm font-medium">{chain.holderCount || 0}</p>
        </div>

        {/* Liquidity */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">
            {chain.marketCap >= chain.goal ? 'Liquidity' : 'Virtual Liq'}
          </p>
          <p className="text-sm font-medium">
            ${((chain.marketCap * 0.4 || 0) / 1000).toFixed(1)}k
          </p>
        </div>

        {/* Age */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Age</p>
          <p className="text-sm font-semibold">{chain.age || '2d'}</p>
        </div>
      </div>
    </Card>
  )
}
