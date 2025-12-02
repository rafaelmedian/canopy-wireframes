import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import MainSidebar from '@/components/main-sidebar'
import TradingModule from '@/components/trading-module'
import { Button } from '@/components/ui/button'
import { Share2, LayoutGrid } from 'lucide-react'
import { useWallet } from '@/contexts/wallet-context'
import YourPositionCard from '@/components/trading-module/your-position-card'
import LiquidityWithdrawDialog from '@/components/trading-module/liquidity-withdraw-dialog'

export default function TradePage() {
  const { tokenPair } = useParams()
  const { isConnected, getWalletData } = useWallet()
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false)
  const [selectedLiquidityPool, setSelectedLiquidityPool] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Get user's LP positions
  const walletData = getWalletData()
  
  // Get position for the selected liquidity pool
  const selectedPoolPosition = useMemo(() => {
    if (!isConnected || !walletData?.lpPositions || !selectedLiquidityPool) return null
    return walletData.lpPositions.find(pos => pos.poolId === selectedLiquidityPool.id)
  }, [isConnected, walletData, selectedLiquidityPool])

  const handleWithdraw = () => {
    setShowWithdrawDialog(true)
  }

  const handleLiquidityPoolChange = (pool) => {
    setSelectedLiquidityPool(pool)
  }

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
      
      <div className="flex-1 flex flex-col">
        {/* Header Navigation */}
        <header className="border-b border-border sticky top-0 bg-background z-10">
          <div className="flex items-center justify-between h-14 px-6">
            <div className="flex items-center gap-3">
              <LayoutGrid className="w-5 h-5 text-muted-foreground" />
              <h1 className="text-base font-semibold">Trade</h1>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1">
          <div className="max-w-[480px] mx-auto px-8 py-8 space-y-4">
            <TradingModule
              variant="trade"
              defaultTokenPair={{ from, to }}
              defaultTab="swap"
              onLiquidityPoolChange={handleLiquidityPoolChange}
            />

            {/* Selected Pool Position */}
            {isConnected && selectedPoolPosition && selectedLiquidityPool && (
              <YourPositionCard
                position={selectedPoolPosition}
                pool={selectedLiquidityPool}
                onWithdraw={handleWithdraw}
              />
            )}
          </div>
        </div>
      </div>

      {/* Withdraw Dialog */}
      {showWithdrawDialog && selectedPoolPosition && selectedLiquidityPool && (
        <LiquidityWithdrawDialog
          open={showWithdrawDialog}
          onClose={() => setShowWithdrawDialog(false)}
          pool={selectedLiquidityPool}
          position={selectedPoolPosition}
        />
      )}
    </div>
  )
}

