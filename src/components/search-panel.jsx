import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Search } from 'lucide-react'

export default function SearchPanel({ chains, searchQuery, onClose }) {
  const navigate = useNavigate()

  const handleChainClick = (chain) => {
    navigate(chain.url)
    onClose()
  }

  if (!searchQuery) return null

  return (
    <Card className="w-80 h-screen sticky top-0 border-l-0 border-t-0 rounded-none shadow-lg overflow-hidden flex flex-col">
      {/* Header - Only show if there are results */}
      {chains.length > 0 && (
        <div className="px-4 py-[22px] border-b">
          <p className="text-sm text-muted-foreground">
            {chains.length} {chains.length === 1 ? 'chain' : 'chains'} found
          </p>
        </div>
      )}

      {/* Results List */}
      <div className="flex-1 overflow-y-auto">
        {chains.length > 0 ? (
          <div className="p-2">
            {chains.map((chain) => (
              <button
                key={chain.id}
                onClick={() => handleChainClick(chain)}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
              >
                {/* Chain Avatar */}
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

                {/* Chain Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm truncate">{chain.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">${chain.ticker}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      ${(chain.marketCap / 1000).toFixed(1)}k
                    </span>
                  </div>
                </div>

                {/* Change Indicator */}
                {chain.change24h !== 0 && chain.change24h !== undefined && chain.change24h !== null && (
                  <span className={`text-xs font-semibold ${chain.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {chain.change24h >= 0 ? '+' : ''}{chain.change24h}%
                  </span>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <Search className="w-12 h-12 text-muted-foreground/50 mb-3" />
            <p className="text-sm font-medium">No chains found</p>
            <p className="text-xs text-muted-foreground mt-1">
              Try searching with a different keyword
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
