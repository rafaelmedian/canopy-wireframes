import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import MainSidebar from '@/components/main-sidebar'
import TradingModule from '@/components/trading-module'
import { Button } from '@/components/ui/button'
import { Share2, Droplet } from 'lucide-react'

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
      
      <div className="flex-1 flex flex-col">
        {/* Header Navigation */}
        <header className="border-b border-border sticky top-0 bg-background z-10">
          <div className="flex items-center justify-between h-14 px-6">
            <div className="flex items-center gap-3">
              <Droplet className="w-5 h-5 text-muted-foreground" />
              <h1 className="text-base font-semibold">Liquidity</h1>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1">
          <div className="max-w-[480px] mx-auto px-8 py-8">
            <TradingModule
              variant="liquidity"
              defaultTokenPair={{ from: tokenA, to: tokenB }}
              defaultTab="liquidity"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

