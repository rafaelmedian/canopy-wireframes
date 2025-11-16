import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import MainSidebar from '@/components/main-sidebar'
import TradingModule from '@/components/trading-module'
import { TrendingUp } from 'lucide-react'

export default function TradePage() {
  const { tokenPair } = useParams()

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
        <div className="max-w-[480px] mx-auto px-8 py-8">
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

          {/* Trading Module - Centered */}
          <TradingModule
            variant="trade"
            defaultTokenPair={{ from, to }}
            defaultTab="swap"
          />
        </div>
      </div>
    </div>
  )
}

