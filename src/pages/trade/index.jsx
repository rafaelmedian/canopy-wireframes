import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import MainSidebar from '@/components/main-sidebar'
import TradingModule from '@/components/trading-module'
import { Card } from '@/components/ui/card'
import { TrendingUp, Droplet, BarChart3 } from 'lucide-react'

export default function TradePage() {
  const { tokenPair } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Parse token pair from URL (e.g., "cnpy-oens")
  // If no tokenPair, default to CNPY with "select" state
  const parseTokenPair = () => {
    if (!tokenPair) return { from: null, to: 'CNPY' }
    
    const [to, from] = tokenPair.split('-').map(t => t.toUpperCase())
    
    return { from, to }
  }

  const { from, to } = parseTokenPair()

  return (
    <div className="flex min-h-screen bg-background">
      <MainSidebar />
      
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Trade</h1>
                <p className="text-muted-foreground">
                  Swap tokens and manage liquidity across chains
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Trading Module - Takes 1 column */}
            <div className="lg:col-span-1">
              <TradingModule
                variant="trade"
                defaultTokenPair={{ from, to }}
                defaultTab="swap"
              />
            </div>

            {/* Info Cards - Takes 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">24h Volume</span>
                  </div>
                  <p className="text-2xl font-bold">$2.4M</p>
                  <p className="text-xs text-green-500 mt-1">+12.3%</p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Droplet className="w-4 h-4 text-blue-500" />
                    </div>
                    <span className="text-sm text-muted-foreground">Total Liquidity</span>
                  </div>
                  <p className="text-2xl font-bold">$8.7M</p>
                  <p className="text-xs text-green-500 mt-1">+5.6%</p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-purple-500" />
                    </div>
                    <span className="text-sm text-muted-foreground">Active Pairs</span>
                  </div>
                  <p className="text-2xl font-bold">24</p>
                  <p className="text-xs text-muted-foreground mt-1">Trading pairs</p>
                </Card>
              </div>

              {/* Top Trading Pairs */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Top Trading Pairs</h2>
                <div className="space-y-3">
                  {[
                    { pair: 'CNPY/OENS', volume: '$125.4K', change: '+15.6%', positive: true },
                    { pair: 'CNPY/SOCN', volume: '$98.2K', change: '+8.7%', positive: true },
                    { pair: 'CNPY/MGC', volume: '$76.8K', change: '-3.2%', positive: false },
                    { pair: 'CNPY/SVLT', volume: '$54.1K', change: '+5.4%', positive: true },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => navigate(`/trade/${item.pair.toLowerCase().replace('/', '-')}`)}
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium w-8 text-muted-foreground">#{idx + 1}</span>
                        <span className="font-medium">{item.pair}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">{item.volume}</span>
                        <span className={`text-sm font-medium ${item.positive ? 'text-green-500' : 'text-red-500'}`}>
                          {item.change}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>

              {/* About Trading */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-3">About Canopy DEX</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Trade tokens seamlessly across all chains on Canopy. Our automated market maker (AMM) 
                  ensures efficient price discovery and minimal slippage for your trades.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Low Fees</p>
                      <p className="text-xs text-muted-foreground">0.3% trading fee</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Deep Liquidity</p>
                      <p className="text-xs text-muted-foreground">Best prices guaranteed</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Fast Swaps</p>
                      <p className="text-xs text-muted-foreground">Instant execution</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Secure</p>
                      <p className="text-xs text-muted-foreground">Audited smart contracts</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

