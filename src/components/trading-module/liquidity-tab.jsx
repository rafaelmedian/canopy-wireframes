import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Plus, ChevronRight, Zap, Info } from 'lucide-react'
import liquidityPoolsData from '@/data/liquidity-pools.json'
import LiquidityConfirmationDialog from './liquidity-confirmation-dialog'
import LiquidityWithdrawDialog from './liquidity-withdraw-dialog'

export default function LiquidityTab({ 
  tokenA = null,
  tokenB = null,
  isPreview = false, 
  onSelectToken 
}) {
  const [mode, setMode] = useState('deposit') // 'deposit' or 'withdraw'
  const [amountA, setAmountA] = useState('')
  const [amountB, setAmountB] = useState('')
  const [inputModeA, setInputModeA] = useState('token') // 'token' or 'usd'
  const [inputModeB, setInputModeB] = useState('token') // 'token' or 'usd'
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showWithdrawConfirmation, setShowWithdrawConfirmation] = useState(false)
  const [hasLiquidity, setHasLiquidity] = useState(false) // Track if user has added liquidity
  const [withdrawPercent, setWithdrawPercent] = useState(0) // 0-100 percentage to withdraw

  // Find pool if both tokens are selected
  const pool = tokenA && tokenB 
    ? liquidityPoolsData.find(p => 
        (p.tokenA === tokenA.symbol && p.tokenB === tokenB.symbol) ||
        (p.tokenA === tokenB.symbol && p.tokenB === tokenA.symbol)
      )
    : null

  // Mock user's existing liquidity position (would come from blockchain in real app)
  const userLiquidity = hasLiquidity ? {
    lpTokens: 125.45,
    valueUSD: 250.90,
    initialValueUSD: 238.56, // What they deposited
    tokenAAmount: 12.5,
    tokenBAmount: 125.45,
    share: 0.221,
    earnings: 12.34, // valueUSD - initialValueUSD
    depositDate: '2024-11-15'
  } : null

  // Calculate withdrawal amounts based on percentage
  const getWithdrawAmounts = () => {
    if (!userLiquidity || withdrawPercent <= 0) {
      return { tokenA: 0, tokenB: 0, totalUSD: 0, earnings: 0 }
    }
    const fraction = withdrawPercent / 100
    const tokenAWithdraw = userLiquidity.tokenAAmount * fraction
    const tokenBWithdraw = userLiquidity.tokenBAmount * fraction
    const totalUSD = userLiquidity.valueUSD * fraction
    const earningsWithdraw = userLiquidity.earnings * fraction
    return { tokenA: tokenAWithdraw, tokenB: tokenBWithdraw, totalUSD, earnings: earningsWithdraw }
  }

  const withdrawAmounts = getWithdrawAmounts()

  // Mock wallet balances (would come from wallet in real app)
  const getWalletBalance = (token) => {
    if (!token) return 0
    // Mock balances for demo
    const mockBalances = {
      'CNPY': 5000,
      'MGC': 1250,
      'OBNB': 500,
      'SOCN': 2500,
    }
    return mockBalances[token.symbol] || 100
  }

  const balanceA = tokenA ? getWalletBalance(tokenA) : 0
  const balanceB = tokenB ? getWalletBalance(tokenB) : 0

  // Handle max button click
  const handleMaxA = () => {
    if (tokenA && balanceA > 0) {
      setInputModeA('token')
      handleAmountAChange(balanceA.toString())
    }
  }

  const handleMaxB = () => {
    if (tokenB && balanceB > 0) {
      setInputModeB('token')
      handleAmountBChange(balanceB.toString())
    }
  }

  const toggleMode = () => {
    setMode(mode === 'deposit' ? 'withdraw' : 'deposit')
    setAmountA('')
    setAmountB('')
  }

  // Get token amount in tokens (regardless of input mode)
  const getTokenAmount = (amount, inputMode, token) => {
    if (!amount || amount === '' || !token) return 0
    const inputAmount = parseFloat(amount)
    if (inputMode === 'token') {
      return inputAmount
    } else {
      const price = token.currentPrice || 0
      return price > 0 ? inputAmount / price : 0
    }
  }

  // Get display values for a token
  const getDisplayValues = (amount, inputMode, token) => {
    if (!amount || amount === '' || !token) {
      return { tokenAmount: '0', usdAmount: '$0.00' }
    }
    const inputAmount = parseFloat(amount)
    const price = token.currentPrice || 0

    if (inputMode === 'token') {
      const usdValue = inputAmount * price
      return {
        tokenAmount: amount,
        usdAmount: `$${usdValue.toFixed(2)}`
      }
    } else {
      const tokenValue = price > 0 ? inputAmount / price : 0
      return {
        tokenAmount: tokenValue.toLocaleString('en-US', { maximumFractionDigits: 6 }),
        usdAmount: `$${inputAmount.toFixed(2)}`
      }
    }
  }

  const displayValuesA = getDisplayValues(amountA, inputModeA, tokenA)
  const displayValuesB = getDisplayValues(amountB, inputModeB, tokenB)

  // Toggle input mode for token A
  const toggleInputModeA = () => {
    if (!tokenA) return
    const price = tokenA.currentPrice || 0
    if (price === 0) return

    if (amountA && amountA !== '') {
      const currentAmount = parseFloat(amountA)
      if (inputModeA === 'token') {
        const usdValue = currentAmount * price
        setAmountA(usdValue.toFixed(2))
      } else {
        const tokenValue = currentAmount / price
        setAmountA(tokenValue.toString())
      }
    }
    setInputModeA(inputModeA === 'token' ? 'usd' : 'token')
  }

  // Toggle input mode for token B
  const toggleInputModeB = () => {
    if (!tokenB) return
    const price = tokenB.currentPrice || 0
    if (price === 0) return

    if (amountB && amountB !== '') {
      const currentAmount = parseFloat(amountB)
      if (inputModeB === 'token') {
        const usdValue = currentAmount * price
        setAmountB(usdValue.toFixed(2))
      } else {
        const tokenValue = currentAmount / price
        setAmountB(tokenValue.toString())
      }
    }
    setInputModeB(inputModeB === 'token' ? 'usd' : 'token')
  }

  const handleAmountAChange = (value) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmountA(value)
      // Auto-calculate amount B based on pool ratio
      if (pool && value && parseFloat(value) > 0 && tokenA && tokenB) {
        const tokenAmountA = getTokenAmount(value, inputModeA, tokenA)
        const ratio = pool.tokenBReserve / pool.tokenAReserve
        const tokenAmountB = tokenAmountA * ratio
        
        // Set amountB in the current inputModeB format
        if (inputModeB === 'token') {
          setAmountB(tokenAmountB.toFixed(6))
        } else {
          const usdValueB = tokenAmountB * (tokenB.currentPrice || 0)
          setAmountB(usdValueB.toFixed(2))
        }
      } else {
        setAmountB('')
      }
    }
  }

  const handleAmountBChange = (value) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmountB(value)
      // Auto-calculate amount A based on pool ratio
      if (pool && value && parseFloat(value) > 0 && tokenA && tokenB) {
        const tokenAmountB = getTokenAmount(value, inputModeB, tokenB)
        const ratio = pool.tokenAReserve / pool.tokenBReserve
        const tokenAmountA = tokenAmountB * ratio
        
        // Set amountA in the current inputModeA format
        if (inputModeA === 'token') {
          setAmountA(tokenAmountA.toFixed(6))
        } else {
          const usdValueA = tokenAmountA * (tokenA.currentPrice || 0)
          setAmountA(usdValueA.toFixed(2))
        }
      } else {
        setAmountA('')
      }
    }
  }

  return (
    <div className="relative overflow-visible">
      {mode === 'deposit' ? (
        <>
          {/* Token Cards with spacing */}
          <div className="space-y-3">
            {/* Token A to Deposit */}
            <div className="px-4">
              {tokenA ? (
              <Card className="bg-muted/30 p-4">
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => onSelectToken && onSelectToken('tokenA')}
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: tokenA.brandColor || '#10b981' }}
                    >
                      {tokenA.logo ? (
                        <img src={tokenA.logo} alt={tokenA.symbol} className="w-full h-full rounded-full" />
                      ) : (
                        <span className="text-base font-bold text-white">{tokenA.symbol[0]}</span>
                      )}
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <p className="text-base font-semibold">{tokenA.symbol}</p>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleMaxA(); }}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Balance: {balanceA.toLocaleString()}
                      </button>
                    </div>
                  </button>
                  {/* Right side: Input with two lines */}
                  <div className="flex flex-col items-end gap-0.5">
                    <div className="flex items-center gap-1">
                      {inputModeA === 'usd' && <span className="text-base font-semibold text-muted-foreground">$</span>}
                      <input
                        type="text"
                        inputMode="decimal"
                        value={amountA}
                        onChange={(e) => handleAmountAChange(e.target.value)}
                        placeholder="0"
                        className="text-base font-semibold bg-transparent border-0 outline-none p-0 h-auto text-right w-20 placeholder:text-muted-foreground"
                      />
                    </div>
                    <button
                      onClick={toggleInputModeA}
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {inputModeA === 'token' ? (
                        <span>{displayValuesA.usdAmount}</span>
                      ) : (
                        <span>{displayValuesA.tokenAmount}</span>
                      )}
                      <Zap className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card 
                className="bg-muted/30 p-4 hover:bg-muted/40 transition-colors cursor-pointer"
                onClick={() => onSelectToken && onSelectToken('tokenA')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-muted flex items-center justify-center">
                      <Plus className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-base font-semibold">Select token</p>
                      <p className="text-sm text-muted-foreground">First token to deposit</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
                </Card>
              )}
            </div>

            {/* Token B to Deposit (Always CNPY - fixed) */}
            <div className="px-4">
              <Card className="bg-muted/30 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: tokenB?.brandColor || '#10b981' }}
                    >
                      {tokenB?.logo ? (
                        <img src={tokenB.logo} alt={tokenB.symbol} className="w-full h-full rounded-full" />
                      ) : (
                        <span className="text-base font-bold text-white">{tokenB?.symbol?.[0] || 'C'}</span>
                      )}
                    </div>
                    <div className="text-left">
                      <p className="text-base font-semibold">{tokenB?.symbol || 'CNPY'}</p>
                      <button 
                        onClick={handleMaxB}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Balance: {balanceB.toLocaleString()}
                      </button>
                    </div>
                  </div>
                  {/* Right side: Input with two lines */}
                  <div className="flex flex-col items-end gap-0.5">
                    <div className="flex items-center gap-1">
                      {inputModeB === 'usd' && <span className="text-base font-semibold text-muted-foreground">$</span>}
                      <input
                        type="text"
                        inputMode="decimal"
                        value={amountB}
                        onChange={(e) => handleAmountBChange(e.target.value)}
                        placeholder="0"
                        className="text-base font-semibold bg-transparent border-0 outline-none p-0 h-auto text-right w-20 placeholder:text-muted-foreground"
                      />
                    </div>
                    <button
                      onClick={toggleInputModeB}
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {inputModeB === 'token' ? (
                        <span>{displayValuesB.usdAmount}</span>
                      ) : (
                        <span>{displayValuesB.tokenAmount}</span>
                      )}
                      <Zap className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-4 pt-1 pb-3">
            {hasLiquidity ? (
              // Show both buttons when user has existing liquidity
              <div className="flex gap-2">
                <Button 
                  variant="secondary"
                  className="flex-1 h-10" 
                  size="lg" 
                  disabled={isPreview}
                  onClick={() => setMode('withdraw')}
                >
                  Withdraw
                </Button>
                <Button 
                  className="flex-1 h-10" 
                  size="lg" 
                  disabled={isPreview || !tokenA || !amountA || !amountB}
                  onClick={() => tokenA && amountA && amountB && setShowConfirmation(true)}
                >
                  {!amountA || !amountB ? 'Input amount' : 'Deposit'}
                </Button>
              </div>
            ) : (
              // Single button when no existing liquidity
              <Button 
                className="w-full h-11" 
                size="lg" 
                disabled={isPreview || !tokenA || !amountA || !amountB}
                onClick={() => tokenA && amountA && amountB && setShowConfirmation(true)}
              >
                {isPreview 
                  ? 'Preview Mode' 
                  : !tokenA 
                  ? 'Select token' 
                  : !amountA || !amountB 
                  ? 'Input amount' 
                  : 'Add Liquidity'}
              </Button>
            )}
          </div>

          {/* Pool Info */}
          {pool && (
            <div className="px-4 pb-3">
              <Card className="bg-muted/20 p-3 space-y-2">
                {/* User's Position - only show when user has liquidity */}
                {userLiquidity && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Your Position</span>
                      <span className="font-semibold">${userLiquidity.valueUSD.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">LP Tokens</span>
                      <span className="font-semibold">{userLiquidity.lpTokens.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Earnings</span>
                      <span className="font-semibold text-green-500">+${userLiquidity.earnings.toFixed(2)}</span>
                    </div>
                  </>
                )}
                
                {/* Share of Pool - dynamic based on deposit amount */}
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted-foreground">Share of pool</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="text-muted-foreground hover:text-foreground transition-colors">
                          <Info className="w-3.5 h-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[240px] p-3 space-y-2">
                        <p className="font-semibold text-sm">Pool Statistics</p>
                        <p className="text-xs text-muted-foreground">
                          Your share represents the percentage of the total pool liquidity you own.
                        </p>
                        <div className="space-y-1 pt-1 border-t border-border">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Total Liquidity</span>
                            <span>${pool.totalLiquidity.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">24h Volume In</span>
                            <span>${(pool.volume24h * 0.52).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">24h Volume Out</span>
                            <span>${(pool.volume24h * 0.48).toLocaleString()}</span>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="font-semibold">
                    {(() => {
                      // Calculate share based on deposit amount
                      const depositUSD = (parseFloat(amountA) || 0) * (tokenA?.currentPrice || 0) + 
                                        (parseFloat(amountB) || 0) * (tokenB?.currentPrice || 0)
                      const currentShare = userLiquidity?.share || 0
                      const additionalShare = pool.totalLiquidity > 0 
                        ? (depositUSD / (pool.totalLiquidity + depositUSD)) * 100 
                        : 0
                      const newShare = currentShare + additionalShare
                      
                      if (depositUSD > 0) {
                        return (
                          <>
                            {currentShare.toFixed(3)}% → <span className="text-green-500">{newShare.toFixed(3)}%</span>
                          </>
                        )
                      }
                      return `${currentShare.toFixed(3)}%`
                    })()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pool APR</span>
                  <span className="font-semibold text-green-500">{pool.apr}%</span>
                </div>
              </Card>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Withdraw Mode */}
          <div className="space-y-3">
            {/* Pool Header with Position Info */}
            <div className="px-4">
              {pool && userLiquidity ? (
                <Card className="bg-muted/30 p-4 space-y-4">
                  {/* Pool Identity */}
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center border-2 border-background"
                        style={{ backgroundColor: tokenA.brandColor || '#10b981' }}
                      >
                        <span className="text-sm font-bold text-white">{tokenA.symbol[0]}</span>
                      </div>
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center border-2 border-background"
                        style={{ backgroundColor: tokenB.brandColor || '#10b981' }}
                      >
                        <span className="text-sm font-bold text-white">{tokenB.symbol[0]}</span>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="text-base font-semibold">{tokenA.symbol}/{tokenB.symbol} Pool</p>
                      <p className="text-sm text-muted-foreground">
                        Your position: ${userLiquidity.valueUSD.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Percentage Display */}
                  <div className="text-center py-2">
                    <span className="text-4xl font-bold">{withdrawPercent}%</span>
                  </div>

                  {/* Slider */}
                  <div className="px-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={withdrawPercent}
                      onChange={(e) => setWithdrawPercent(parseInt(e.target.value))}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>

                  {/* Preset Buttons */}
                  <div className="flex gap-2">
                    {[25, 50, 75, 100].map((percent) => (
                      <button
                        key={percent}
                        onClick={() => setWithdrawPercent(percent)}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                          withdrawPercent === percent
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        {percent === 100 ? 'Max' : `${percent}%`}
                      </button>
                    ))}
                  </div>
                </Card>
              ) : (
                <Card className="bg-muted/30 p-4">
                  <div className="text-center text-sm text-muted-foreground">
                    No liquidity position to withdraw
                  </div>
                </Card>
              )}
            </div>

            {/* You'll Receive Preview */}
            {pool && userLiquidity && withdrawPercent > 0 && (
              <div className="px-4">
                <Card className="bg-muted/30 p-4 space-y-3">
                  <div className="text-sm font-medium text-muted-foreground">You'll receive</div>
                  
                  {/* Token A */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: tokenA.brandColor || '#10b981' }}
                      >
                        <span className="text-sm font-bold text-white">{tokenA.symbol[0]}</span>
                      </div>
                      <span className="text-base">{tokenA.symbol}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-semibold">
                        {withdrawAmounts.tokenA.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        ${(withdrawAmounts.tokenA * (tokenA.currentPrice || 0)).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Token B */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: tokenB.brandColor || '#10b981' }}
                      >
                        <span className="text-sm font-bold text-white">{tokenB.symbol[0]}</span>
                      </div>
                      <span className="text-base">{tokenB.symbol}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-semibold">
                        {withdrawAmounts.tokenB.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        ${(withdrawAmounts.tokenB * (tokenB.currentPrice || 0)).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="pt-3 border-t border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Value</span>
                      <span className="text-base font-semibold">
                        ${withdrawAmounts.totalUSD.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Your Earnings</span>
                      <span className="text-base font-semibold text-green-500">
                        +${withdrawAmounts.earnings.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Pool APR</span>
                      <span className="text-sm font-medium text-green-500">{pool.apr}%</span>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>

          {/* Withdraw Buttons */}
          <div className="px-4 pt-3 pb-3 flex gap-2">
            <Button 
              variant="outline"
              className="flex-1 h-11" 
              size="lg" 
              onClick={() => {
                setMode('deposit')
                setWithdrawPercent(0)
              }}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 h-11" 
              size="lg" 
              disabled={isPreview || !pool || !userLiquidity || withdrawPercent <= 0}
              onClick={() => pool && userLiquidity && withdrawPercent > 0 && setShowWithdrawConfirmation(true)}
            >
              {isPreview ? 'Preview Mode' : withdrawPercent <= 0 ? 'Select amount' : `Withdraw ${withdrawPercent}%`}
            </Button>
          </div>
        </>
      )}

      {/* Liquidity Confirmation Dialog */}
      {showConfirmation && (
        <LiquidityConfirmationDialog
          open={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          onConfirm={() => {
            console.log('Liquidity deposit confirmed')
            setHasLiquidity(true) // User now has liquidity in this pool
            setAmountA('') // Reset amounts
            setAmountB('')
            setShowConfirmation(false)
          }}
          tokenA={tokenA}
          tokenB={tokenB}
          amountA={amountA}
          amountB={amountB}
          pool={pool}
        />
      )}

      {/* Liquidity Withdraw Dialog */}
      {showWithdrawConfirmation && (
        <LiquidityWithdrawDialog
          open={showWithdrawConfirmation}
          onClose={() => setShowWithdrawConfirmation(false)}
          onConfirm={() => {
            console.log('Liquidity withdrawal confirmed')
            setWithdrawPercent(0) // Reset
            setShowWithdrawConfirmation(false)
          }}
          tokenA={tokenA}
          tokenB={tokenB}
          amountA={withdrawAmounts.tokenA}
          amountB={withdrawAmounts.tokenB}
          withdrawPercent={withdrawPercent}
          earnings={withdrawAmounts.earnings}
          totalUSD={withdrawAmounts.totalUSD}
          pool={pool}
        />
      )}
    </div>
  )
}


