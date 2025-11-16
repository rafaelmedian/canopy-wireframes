import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import MainSidebar from '@/components/main-sidebar'
import TradingModule from '@/components/trading-module'
import { Card } from '@/components/ui/card'
import { Droplet, TrendingUp, Percent, DollarSign } from 'lucide-react'
import liquidityPoolsData from '@/data/liquidity-pools.json'

export default function LiquidityPage() {
  const { tokenPair } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Parse token pair from URL (e.g., "cnpy-oens")
  // If no tokenPair, default to null for both tokens
  const parseTokenPair = () => {
    if (!tokenPair) return { tokenA: null, tokenB: null }
    
    const [tokenA, tokenB] = tokenPair.split('-').map(t => t.toUpperCase())
    
    return { tokenA, tokenB }
  }

  const { tokenA, tokenB } = parseTokenPair()

  return (
    <div className="flex min-h-screen bg-background">
      <MainSidebar />
      
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Droplet className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Liquidity Pools</h1>
                <p className="text-muted-foreground">
                  Provide liquidity and earn trading fees
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Trading Module - Takes 1 column */}
            <div className="lg:col-span-1">
              <TradingModule
                variant="liquidity"
                defaultTokenPair={{ from: tokenA, to: tokenB }}
                defaultTab="liquidity"
              />
            </div>

            {/* Info Cards - Takes 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <Percent className="w-4 h-4 text-green-500" />
                    </div>
                    <span className="text-sm text-muted-foreground">Avg APR</span>
                  </div>
                  <p className="text-2xl font-bold">16.2%</p>
                  <p className="text-xs text-muted-foreground mt-1">Across all pools</p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-purple-500" />
                    </div>
                    <span className="text-sm text-muted-foreground">24h Fees</span>
                  </div>
                  <p className="text-2xl font-bold">$7.2K</p>
                  <p className="text-xs text-green-500 mt-1">+12.3%</p>
                </Card>
              </div>

              {/* Top Pools */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Top Liquidity Pools</h2>
                <div className="space-y-3">
                  {liquidityPoolsData
                    .sort((a, b) => b.totalLiquidity - a.totalLiquidity)
                    .map((pool, idx) => (
                      <button
                        key={pool.id}
                        onClick={() => navigate(`/liquidity/${pool.tokenA.toLowerCase()}-${pool.tokenB.toLowerCase()}`)}
                        className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium w-8 text-muted-foreground">#{idx + 1}</span>
                          <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-background flex items-center justify-center">
                              <span className="text-xs font-bold text-white">{pool.tokenA[0]}</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-background flex items-center justify-center">
                              <span className="text-xs font-bold text-white">{pool.tokenB[0]}</span>
                            </div>
                          </div>
                          <span className="font-medium">{pool.tokenA}/{pool.tokenB}</span>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">TVL</p>
                            <p className="text-sm font-medium">${pool.totalLiquidity.toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">APR</p>
                            <p className="text-sm font-medium text-green-500">{pool.apr}%</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">24h Volume</p>
                            <p className="text-sm font-medium">${pool.volume24h.toLocaleString()}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                </div>
              </Card>

              {/* About Liquidity */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-3">About Liquidity Providing</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Earn passive income by providing liquidity to trading pairs. As a liquidity provider, 
                  you'll earn a share of the trading fees proportional to your contribution to the pool.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Earn Fees</p>
                      <p className="text-xs text-muted-foreground">0.3% of all trades</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Flexible</p>
                      <p className="text-xs text-muted-foreground">Withdraw anytime</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Compound</p>
                      <p className="text-xs text-muted-foreground">Reinvest your earnings</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Transparent</p>
                      <p className="text-xs text-muted-foreground">Track your returns</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <p className="text-xs text-yellow-600 dark:text-yellow-500 font-medium">
                    ⚠️ Important: Providing liquidity involves impermanent loss risk. Make sure you understand 
                    how AMMs work before depositing funds.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

