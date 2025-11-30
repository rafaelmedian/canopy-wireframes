import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowUpRight, ArrowDownRight, RotateCcw, Repeat, Droplet } from 'lucide-react'
import SwapTab from '@/components/trading-module/swap-tab'
import LiquidityTab from '@/components/trading-module/liquidity-tab'
import BuySellTab from '@/components/trading-module/buy-sell-tab'
import ConvertTab from '@/components/trading-module/convert-tab'
import TokenSelectionDialog from '@/components/token-selection-dialog'
import SwapConfirmationDialog from '@/components/trading-module/swap-confirmation-dialog'
import TransactionPendingDialog from '@/components/trading-module/transaction-pending-dialog'
import tokensData from '@/data/tokens.json'

/**
 * TradingModule - Flexible trading component that adapts based on variant
 * 
 * @param {Object} props
 * @param {'trade' | 'chain' | 'liquidity'} props.variant - Module type
 * @param {Object} props.chainData - Chain data (required for 'chain' variant)
 * @param {Object} props.defaultTokenPair - Default token pair { from, to }
 * @param {string} props.defaultTab - Default active tab
 * @param {boolean} props.isPreview - Preview mode flag
 */
export default function TradingModule({ 
  variant = 'trade', 
  chainData = null,
  defaultTokenPair = null,
  defaultTab = null,
  isPreview = false 
}) {
  // Determine tabs based on variant
  const getTabsConfig = () => {
    switch (variant) {
      case 'trade':
        return {
          tabs: ['swap', 'liquidity', 'convert'],
          defaultTab: defaultTab || 'swap'
        }
      case 'chain':
        return {
          tabs: ['buy', 'sell', 'convert'],
          defaultTab: defaultTab || 'buy'
        }
      case 'liquidity':
        return {
          tabs: ['liquidity', 'swap', 'convert'],
          defaultTab: defaultTab || 'liquidity'
        }
      default:
        return {
          tabs: ['swap', 'liquidity', 'convert'],
          defaultTab: 'swap'
        }
    }
  }

  const tabsConfig = getTabsConfig()
  const [activeTab, setActiveTab] = useState(tabsConfig.defaultTab)
  const [showTokenDialog, setShowTokenDialog] = useState(false)
  const [tokenDialogMode, setTokenDialogMode] = useState(null) // 'from', 'to', 'tokenA', 'tokenB'
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [confirmationData, setConfirmationData] = useState(null)
  const [showPending, setShowPending] = useState(false)

  // Token state for swap/liquidity
  const [fromToken, setFromToken] = useState(() => {
    // For trade variant, always start with no token selected (user must select)
    if (variant === 'trade') {
      return null
    }
    // For chain variant, default to CNPY
    if (variant === 'chain') {
      return tokensData.find(t => t.symbol === 'CNPY')
    }
    return null
  })

  const [toToken, setToToken] = useState(() => {
    // For trade variant, default to CNPY as receiving token
    if (variant === 'trade') {
      return tokensData.find(t => t.symbol === 'CNPY')
    }
    // For chain variant, use the chain's token
    if (variant === 'chain' && chainData) {
      return {
        symbol: chainData.ticker,
        name: chainData.name,
        brandColor: chainData.brandColor,
        currentPrice: chainData.currentPrice,
        ...chainData
      }
    }
    // Default fallback to CNPY
    return tokensData.find(t => t.symbol === 'CNPY')
  })

  const [tokenA, setTokenA] = useState(null)
  const [tokenB, setTokenB] = useState(() => {
    return tokensData.find(t => t.symbol === 'CNPY')
  })

  const handleSelectToken = (mode) => {
    setTokenDialogMode(mode)
    setShowTokenDialog(true)
  }

  const handleTokenSelected = (token) => {
    switch (tokenDialogMode) {
      case 'from':
        setFromToken(token)
        // For trade variant, if a non-CNPY token is selected, ensure toToken is CNPY
        if (variant === 'trade' && token.symbol !== 'CNPY') {
          setToToken(tokensData.find(t => t.symbol === 'CNPY'))
        }
        break
      case 'to':
        setToToken(token)
        // For trade variant, if a non-CNPY token is selected, ensure fromToken is CNPY
        if (variant === 'trade' && token.symbol !== 'CNPY') {
          setFromToken(tokensData.find(t => t.symbol === 'CNPY'))
        }
        break
      case 'tokenA':
        setTokenA(token)
        break
      case 'tokenB':
        setTokenB(token)
        break
    }
    setShowTokenDialog(false)
    setTokenDialogMode(null)
  }

  const handleSwapTokens = () => {
    // Swap fromToken and toToken
    const temp = fromToken
    setFromToken(toToken)
    setToToken(temp)
  }

  const handleShowConfirmation = (data) => {
    setConfirmationData(data)
    setShowConfirmation(true)
  }

  const handleCloseConfirmation = () => {
    setShowConfirmation(false)
    setConfirmationData(null)
  }

  const handleConfirmSwap = () => {
    // Execute swap transaction
    console.log('Swap confirmed:', confirmationData)
    // Show pending state immediately
    setShowPending(true)
    // Close confirmation dialog after a brief delay for seamless transition
    setTimeout(() => {
      setShowConfirmation(false)
    }, 50)
  }

  const handleClosePending = () => {
    setShowPending(false)
    setConfirmationData(null)
  }

  const renderTabButtons = () => {
    const getTabIcon = (tab) => {
      switch (tab) {
        case 'buy':
          return <ArrowUpRight className="w-4 h-4" />
        case 'sell':
          return <ArrowDownRight className="w-4 h-4" />
        case 'swap':
          return <Repeat className="w-4 h-4" />
        case 'liquidity':
          return <Droplet className="w-4 h-4" />
        case 'convert':
          return <RotateCcw className="w-4 h-4" />
        default:
          return null
      }
    }

    const getTabLabel = (tab) => {
      return tab.charAt(0).toUpperCase() + tab.slice(1)
    }

    return (
      <div className="bg-muted/50 p-1 rounded-lg flex gap-1">
        {tabsConfig.tabs.map(tab => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'default' : 'ghost'}
            size="sm"
            className={`flex-1 h-10 gap-2 ${activeTab === tab ? 'bg-primary text-primary-foreground' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {getTabIcon(tab)}
            <span className="text-sm font-medium">{getTabLabel(tab)}</span>
          </Button>
        ))}
      </div>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'buy':
        return (
          <BuySellTab
            mode="buy"
            chainData={chainData}
            isPreview={isPreview}
          />
        )
      case 'sell':
        return (
          <BuySellTab
            mode="sell"
            chainData={chainData}
            isPreview={isPreview}
          />
        )
      case 'swap':
        return (
          <SwapTab
            fromToken={fromToken}
            toToken={toToken}
            isPreview={isPreview}
            onSelectToken={handleSelectToken}
            onSwapTokens={handleSwapTokens}
            onShowConfirmation={handleShowConfirmation}
          />
        )
      case 'liquidity':
        return (
          <LiquidityTab
            tokenA={tokenA}
            tokenB={tokenB}
            isPreview={isPreview}
            onSelectToken={handleSelectToken}
          />
        )
      case 'convert':
        return (
          <ConvertTab
            chainData={chainData}
            isPreview={isPreview}
            onSelectToken={handleSelectToken}
          />
        )
      default:
        return null
    }
  }

  // Get excluded token for dialog
  const getExcludedToken = () => {
    // For trade variant, enforce CNPY pairing
    if (variant === 'trade') {
      // If selecting 'from' and 'to' is not CNPY, exclude it
      if (tokenDialogMode === 'from' && toToken && toToken.symbol !== 'CNPY') {
        return toToken.symbol
      }
      // If selecting 'to' and 'from' is not CNPY, exclude it
      if (tokenDialogMode === 'to' && fromToken && fromToken.symbol !== 'CNPY') {
        return fromToken.symbol
      }
    }
    
    // Standard exclusion for same token
    if (tokenDialogMode === 'from' && toToken) return toToken.symbol
    if (tokenDialogMode === 'to' && fromToken) return fromToken.symbol
    if (tokenDialogMode === 'tokenA' && tokenB) return tokenB.symbol
    if (tokenDialogMode === 'tokenB' && tokenA) return tokenA.symbol
    return null
  }

  return (
    <>
      <Card className="p-1 sticky top-6 overflow-visible">
        <div className="space-y-4">
          {/* Tab Navigation */}
          <div className="px-3 pt-3">
            {renderTabButtons()}
          </div>

          {/* Tab Content - with relative positioning for overlay */}
          <div className="relative overflow-visible">
            {renderTabContent()}
            
            {/* Swap Confirmation Overlay */}
            {showConfirmation && confirmationData && (
              <SwapConfirmationDialog
                open={showConfirmation}
                onClose={handleCloseConfirmation}
                onConfirm={handleConfirmSwap}
                {...confirmationData}
              />
            )}

            {/* Transaction Pending/Success Overlay */}
            {showPending && confirmationData && (
              <TransactionPendingDialog
                open={showPending}
                onClose={handleClosePending}
                fromToken={confirmationData.fromToken}
                toToken={confirmationData.toToken}
                fromAmount={confirmationData.fromAmount}
                toAmount={confirmationData.toAmount}
                amount={confirmationData.fromAmount}
                price={confirmationData.toToken?.currentPrice}
                networkFee={0.42}
              />
            )}
          </div>
        </div>
      </Card>

      {/* Token Selection Dialog */}
      <TokenSelectionDialog
        open={showTokenDialog}
        onOpenChange={setShowTokenDialog}
        onSelectToken={handleTokenSelected}
        excludeToken={getExcludedToken()}
      />
    </>
  )
}

