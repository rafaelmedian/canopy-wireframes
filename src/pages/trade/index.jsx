import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import MainSidebar from '@/components/main-sidebar'
import TradingModule from '@/components/trading-module'

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

