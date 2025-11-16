import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import MainSidebar from '@/components/main-sidebar'
import TradingModule from '@/components/trading-module'
import { Droplet } from 'lucide-react'

export default function LiquidityPage() {
  const { tokenPair } = useParams()

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
        <div className="max-w-[480px] mx-auto px-8 py-8">
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

          {/* Trading Module - Centered */}
          <TradingModule
            variant="liquidity"
            defaultTokenPair={{ from: tokenA, to: tokenB }}
            defaultTab="liquidity"
          />
        </div>
      </div>
    </div>
  )
}

