import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, ChevronRight, ArrowDown, Zap, Settings } from 'lucide-react'
import SlippageSettings from './slippage-settings'

export default function SwapTab({ 
  fromToken = null, 
  toToken = null, 
  isPreview = false, 
  onSelectToken,
  onSwapTokens
}) {
  const [amount, setAmount] = useState('')
  const [slippage, setSlippage] = useState(1.0) // Default 1% slippage
  const [showSlippageSettings, setShowSlippageSettings] = useState(false)

  // Calculate conversion based on token prices
  const calculateConversion = () => {
    if (!amount || amount === '0' || amount === '' || !fromToken || !toToken) {
      return { tokens: '0', usd: '$0.00' }
    }

    const inputAmount = parseFloat(amount)
    const fromPrice = fromToken.currentPrice || 0
    const toPrice = toToken.currentPrice || 0

    if (toPrice === 0) return { tokens: '0', usd: '$0.00' }

    // Calculate value in USD then convert to output token
    const usdValue = inputAmount * fromPrice
    const tokensReceived = usdValue / toPrice

    return {
      tokens: tokensReceived.toLocaleString('en-US', { maximumFractionDigits: 6 }),
      usd: `$${usdValue.toFixed(2)}`
    }
  }

  const conversion = calculateConversion()

  const handleUseMax = () => {
    // TODO: Set to max balance
    setAmount('100')
  }

  const handleSwapDirection = () => {
    // Swap the sell and buy tokens
    if (onSwapTokens) {
      onSwapTokens()
    }
  }

  return (
    <>
      {/* Input Token Card */}
      <div className="px-4">
        {fromToken ? (
          <Card className="bg-muted/30 p-4 space-y-3">
            {/* Token Header */}
            <div className="flex items-center justify-between">
              <button 
                onClick={() => onSelectToken && onSelectToken('from')}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                {/* Token Avatar */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: fromToken.brandColor || '#10b981' }}
                >
                  {fromToken.logo ? (
                    <img src={fromToken.logo} alt={fromToken.symbol} className="w-full h-full rounded-full" />
                  ) : (
                    <span className="text-sm font-bold text-white">
                      {fromToken.symbol[0]}
                    </span>
                  )}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{fromToken.symbol}</p>
                    <ChevronRight className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">0 {fromToken.symbol}</p>
                </div>
              </button>
              <Button
                variant="secondary"
                size="sm"
                className="h-7 text-xs"
                onClick={handleUseMax}
              >
                Use max
              </Button>
            </div>

            {/* Amount Input */}
            <div className="flex items-center justify-center">
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => {
                  const value = e.target.value
                  // Only allow numbers and decimal point
                  if (value === '' || /^\d*\.?\d*$/.test(value)) {
                    setAmount(value)
                  }
                }}
                placeholder="0"
                className="text-5xl font-bold bg-transparent border-0 outline-none p-0 h-auto text-center w-full placeholder:text-muted-foreground"
              />
            </div>

            {/* Token Amount in USD */}
            <div className="flex items-center justify-center gap-2">
              <p className="text-sm text-muted-foreground">
                {amount ? `$${(parseFloat(amount) * (fromToken.currentPrice || 0)).toFixed(2)}` : '$0.00'}
              </p>
              <Zap className="w-4 h-4 text-muted-foreground" />
            </div>
          </Card>
        ) : (
          <Card 
            className="bg-muted/30 p-4 hover:bg-muted/40 transition-colors cursor-pointer"
            onClick={() => onSelectToken && onSelectToken('from')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Plus className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-base font-medium">Select token</p>
                  <p className="text-sm text-muted-foreground">Choose token to swap</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Card>
        )}
      </div>

      {/* Swap Direction Button */}
      <div className="relative flex justify-center">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-8 w-8 bg-background border-2"
          onClick={handleSwapDirection}
          disabled={!fromToken || !toToken}
        >
          <ArrowDown className="w-4 h-4" />
        </Button>
      </div>

      {/* Output Token Card */}
      <div className="px-4">
        {toToken ? (
          <Card className="bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => onSelectToken && onSelectToken('to')}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                {/* Token Avatar */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: toToken.brandColor || '#10b981' }}
                >
                  {toToken.logo ? (
                    <img src={toToken.logo} alt={toToken.symbol} className="w-full h-full rounded-full" />
                  ) : (
                    <span className="text-sm font-bold text-white">
                      {toToken.symbol[0]}
                    </span>
                  )}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{toToken.symbol}</p>
                    <ChevronRight className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">0 {toToken.symbol}</p>
                </div>
              </button>
              <div className="text-right">
                <p className="text-sm font-medium">{conversion.tokens}</p>
                <p className="text-xs text-muted-foreground">{conversion.usd}</p>
              </div>
            </div>
          </Card>
        ) : (
          <Card 
            className="bg-muted/30 p-4 hover:bg-muted/40 transition-colors cursor-pointer"
            onClick={() => onSelectToken && onSelectToken('to')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Plus className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-base font-medium">Select token</p>
                  <p className="text-sm text-muted-foreground">Choose token to receive</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Card>
        )}
      </div>

      {/* Connect Wallet Button */}
      <div className="px-4 pb-3">
        <Button 
          className="w-full h-11" 
          size="lg" 
          disabled={isPreview || !fromToken || !toToken || !amount}
        >
          {isPreview ? 'Preview Mode' : !fromToken || !toToken ? 'Select tokens' : 'Connect Wallet'}
        </Button>
      </div>

      {/* Exchange Rate and Slippage */}
      {fromToken && toToken && (
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Zap className="w-3 h-3" />
              <span>
                1 {fromToken.symbol} = {((fromToken.currentPrice || 0) / (toToken.currentPrice || 1)).toFixed(6)} {toToken.symbol}
              </span>
            </div>
            <button
              onClick={() => setShowSlippageSettings(true)}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="font-medium">{slippage}%</span>
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Slippage Settings Dialog */}
      <SlippageSettings
        open={showSlippageSettings}
        onOpenChange={setShowSlippageSettings}
        slippage={slippage}
        onSlippageChange={setSlippage}
      />
    </>
  )
}

