import { useState, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, ChevronRight, ChevronDown, ArrowDown, Check, Zap } from 'lucide-react'
import { useWallet } from '@/contexts/wallet-context'
import BridgeTokenDialog from '@/components/bridge-token-dialog'
import ConvertTransactionDialog from '@/components/trading-module/convert-transaction-dialog'
import orderBookData from '@/data/order-book.json'

// CNPY Logo SVG Component
function CnpyLogo({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.7649 0.880227C12.658 0.827134 12.5342 0.905351 12.5342 1.02378V3.04351C12.5342 3.18794 12.7104 3.26027 12.8135 3.15814L14.069 1.91394C14.1383 1.84534 14.1317 1.73215 14.0535 1.67368C13.6439 1.36708 13.2123 1.10259 12.7649 0.880227Z" fill="currentColor"/>
      <path d="M10.4705 0.127791C10.5477 0.141319 10.6032 0.208239 10.6032 0.285896V5.28157C10.6032 5.32456 10.586 5.36579 10.5553 5.3962L8.90769 7.02887C8.80463 7.13099 8.62842 7.05867 8.62842 6.91423V0.163239C8.62842 0.0764816 8.69735 0.00493239 8.78487 0.00272091C9.34863 -0.0115243 9.91358 0.0301658 10.4705 0.127791Z" fill="currentColor"/>
      <path d="M6.64953 9.26628C6.68021 9.23588 6.69744 9.19464 6.69744 9.15164V0.531669C6.69744 0.424066 6.59358 0.346317 6.48993 0.37839C5.89636 0.562066 5.31929 0.812546 4.77074 1.12983C4.72107 1.15856 4.69092 1.21149 4.69092 1.26849V10.8158C4.69092 10.9602 4.86713 11.0325 4.97019 10.9304L6.64953 9.26628Z" fill="currentColor"/>
      <path d="M2.4827 3.0726C2.57734 2.95748 2.75983 3.02558 2.75983 3.17407L2.75984 13.0535C2.75984 13.0965 2.7426 13.1377 2.71192 13.1681L2.53426 13.3441C2.46504 13.4128 2.35058 13.4059 2.29159 13.3285C-0.0224758 10.292 0.0412298 6.04232 2.4827 3.0726Z" fill="currentColor"/>
      <path d="M10.3924 8.65513C10.2467 8.65513 10.1737 8.48052 10.2768 8.37839L11.9244 6.74572C11.9551 6.71532 11.9966 6.69824 12.04 6.69824H17.1031C17.1812 6.69824 17.2486 6.75292 17.2625 6.82908C17.3635 7.38074 17.408 7.94056 17.396 8.49942C17.3942 8.58642 17.3219 8.65513 17.234 8.65513H10.3924Z" fill="currentColor"/>
      <path d="M14.1825 4.50709C14.0795 4.60922 14.1525 4.78383 14.2982 4.78383H16.3466C16.4664 4.78383 16.5454 4.66045 16.4911 4.55456C16.2638 4.11067 15.9935 3.68279 15.6806 3.27689C15.6215 3.20007 15.5077 3.19389 15.4388 3.26223L14.1825 4.50709Z" fill="currentColor"/>
      <path d="M8.13428 10.5684C8.09089 10.5684 8.04928 10.5854 8.0186 10.6158L6.33926 12.28C6.2362 12.3821 6.30919 12.5567 6.45493 12.5567H16.1382C16.196 12.5567 16.2496 12.5265 16.2784 12.4769C16.5952 11.933 16.8447 11.3612 17.027 10.7733C17.0588 10.6707 16.9803 10.5684 16.8721 10.5684H8.13428Z" fill="currentColor"/>
      <path d="M3.91045 14.9412C3.83293 14.8825 3.82636 14.7696 3.89534 14.7013L4.08101 14.5173C4.11169 14.4868 4.1533 14.4697 4.19669 14.4697H14.2374C14.3867 14.4697 14.4559 14.6496 14.3406 14.7438C11.33 17.208 6.99201 17.2737 3.91045 14.9412Z" fill="currentColor"/>
    </svg>
  )
}

// Chain badge component
function ChainBadge({ chain, size = 'sm' }) {
  const chainConfig = {
    ethereum: { color: '#627EEA', label: 'ETH' },
    solana: { color: '#9945FF', label: 'SOL' }
  }
  const config = chainConfig[chain] || chainConfig.ethereum
  const sizeClass = size === 'sm' ? 'w-4 h-4 text-[8px]' : 'w-5 h-5 text-[10px]'
  
  return (
    <div 
      className={`${sizeClass} rounded-full flex items-center justify-center font-bold text-white absolute -bottom-0.5 -right-0.5 border-2 border-background`}
      style={{ backgroundColor: config.color }}
    >
      {config.label[0]}
    </div>
  )
}

// Calculate order selection for BUY direction (stablecoin → CNPY)
function calculateOrderSelection(orders, inputAmount, sortMode) {
  if (!inputAmount || inputAmount <= 0) {
    return { selectedOrders: [], totalSavings: 0, totalCost: 0, cnpyReceived: 0, gap: 0 }
  }

  const sortedOrders = [...orders].sort((a, b) => {
    if (sortMode === 'best_price') return a.price - b.price
    return b.amount - a.amount
  })

  let remainingBudget = inputAmount
  const selectedOrders = []
  let totalSavings = 0
  let totalCost = 0
  let cnpyReceived = 0

  for (const order of sortedOrders) {
    const orderCost = order.amount * order.price
    if (orderCost <= remainingBudget) {
      const savings = order.amount - orderCost
      selectedOrders.push({ ...order, cost: orderCost, savings })
      totalSavings += savings
      totalCost += orderCost
      cnpyReceived += order.amount
      remainingBudget -= orderCost
    }
  }

  return {
    selectedOrders,
    totalSavings,
    totalCost,
    cnpyReceived,
    gap: inputAmount - totalCost,
    isFullyFilled: (inputAmount - totalCost) < 1
  }
}

// Calculate order selection for SELL direction (CNPY → stablecoin)
function calculateSellOrderSelection(orders, cnpyAmount, destinationToken, sortMode) {
  if (!cnpyAmount || cnpyAmount <= 0) {
    return { selectedOrders: [], totalReceived: 0, cnpySold: 0, gap: 0 }
  }

  // Filter orders by destination token if specified
  let filteredOrders = orders
  if (destinationToken) {
    filteredOrders = orders.filter(
      order => order.token === destinationToken.symbol && order.chain === destinationToken.chain
    )
  }

  // Sort by price - highest first is best for seller (they receive more)
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortMode === 'best_price') return b.price - a.price // Descending for sell
    return b.amount - a.amount
  })

  let remainingCnpy = cnpyAmount
  const selectedOrders = []
  let totalReceived = 0
  let cnpySold = 0

  for (const order of sortedOrders) {
    if (remainingCnpy <= 0) break
    
    const cnpyToSell = Math.min(order.amount, remainingCnpy)
    const stablecoinReceived = cnpyToSell * order.price
    
    selectedOrders.push({ 
      ...order, 
      cnpySold: cnpyToSell, 
      received: stablecoinReceived,
      // For display consistency with buy direction
      cost: cnpyToSell,
      savings: stablecoinReceived - cnpyToSell // negative = "loss" vs $1 peg
    })
    
    totalReceived += stablecoinReceived
    cnpySold += cnpyToSell
    remainingCnpy -= cnpyToSell
  }

  return {
    selectedOrders,
    totalReceived,
    cnpySold,
    gap: cnpyAmount - cnpySold,
    isFullyFilled: remainingCnpy < 1
  }
}

// Compact Order Row with fill percentage (BUY direction)
function OrderRow({ order, isSelected, index, percentOfBudget }) {
  return (
    <div
      className={`relative flex items-center justify-between py-2 px-3 rounded-lg transition-all duration-200 overflow-hidden ${
        isSelected
          ? 'border border-green-500/20'
          : 'opacity-40'
      }`}
      style={{ transitionDelay: isSelected ? `${index * 30}ms` : '0ms' }}
    >
      {/* Background fill showing % of budget */}
      {isSelected && (
        <div 
          className="absolute inset-0 bg-green-500/15 transition-all duration-300 ease-out"
          style={{ width: `${percentOfBudget}%` }}
        />
      )}
      
      <div className="relative flex items-center gap-2">
        <div
          className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
            isSelected ? 'bg-green-500 text-white' : 'border border-muted-foreground/30'
          }`}
        >
          {isSelected && <Check className="w-2.5 h-2.5" />}
        </div>
        <span className="text-sm font-medium">${order.amount}</span>
        <span className="text-xs text-green-500">{order.discount}%</span>
        {isSelected && (
          <span className="text-xs text-muted-foreground">({Math.round(percentOfBudget)}%)</span>
        )}
      </div>
      {isSelected && (
        <span className="relative text-xs text-green-500 font-medium">+${order.savings?.toFixed(2)}</span>
      )}
    </div>
  )
}

// Compact Order Row for SELL direction (CNPY → stablecoin)
function SellOrderRow({ order, isSelected, index, percentOfTotal }) {
  return (
    <div
      className={`relative flex items-center justify-between py-2 px-3 rounded-lg transition-all duration-200 overflow-hidden ${
        isSelected
          ? 'border border-green-500/20'
          : 'opacity-40'
      }`}
      style={{ transitionDelay: isSelected ? `${index * 30}ms` : '0ms' }}
    >
      {/* Background fill showing % of order filled */}
      {isSelected && (
        <div 
          className="absolute inset-0 bg-green-500/15 transition-all duration-300 ease-out"
          style={{ width: `${percentOfTotal}%` }}
        />
      )}
      
      <div className="relative flex items-center gap-2">
        <div
          className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
            isSelected ? 'bg-green-500 text-white' : 'border border-muted-foreground/30'
          }`}
        >
          {isSelected && <Check className="w-2.5 h-2.5" />}
        </div>
        <span className="text-sm font-medium">{order.amount} CNPY</span>
        <span className="text-xs text-green-500">${order.price}</span>
        {isSelected && (
          <span className="text-xs text-muted-foreground">({Math.round(percentOfTotal)}%)</span>
        )}
      </div>
      {isSelected && (
        <span className="relative text-xs text-green-500 font-medium">
          ${order.received?.toFixed(2) || (order.amount * order.price).toFixed(2)}
        </span>
      )}
    </div>
  )
}

export default function ConvertTab({ 
  chainData, 
  isPreview = false, 
  onSelectToken,
  onOpenWalletDialog,
  onAmountChange,
  onSourceTokenChange,
  orderBookSelection
}) {
  const { isConnected } = useWallet()
  
  const [showBridgeDialog, setShowBridgeDialog] = useState(false)
  const [sourceToken, setSourceToken] = useState(null)
  const [destinationToken, setDestinationToken] = useState(null)
  const [amount, setAmount] = useState('')
  const [sortMode, setSortMode] = useState('best_price')
  const [showOrders, setShowOrders] = useState(false)
  const [isShaking, setIsShaking] = useState(false)
  const [showTransactionDialog, setShowTransactionDialog] = useState(false)
  const [direction, setDirection] = useState('buy') // 'buy' = stablecoin→CNPY, 'sell' = CNPY→stablecoin
  
  // Mock CNPY balance for sell direction
  const cnpyBalance = 5000

  const [connectedWallets, setConnectedWallets] = useState({
    ethereum: {
      connected: true,
      address: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
      balances: { USDC: 1500.50, USDT: 850.25 }
    },
    solana: {
      connected: false,
      address: null,
      balances: { USDC: 0, USDT: 0 }
    }
  })

  const handleConnectWallet = async (chainId) => {
    await new Promise(resolve => setTimeout(resolve, 1500))
    setConnectedWallets(prev => ({
      ...prev,
      [chainId]: {
        connected: true,
        address: chainId === 'solana' 
          ? '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU'
          : '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
        balances: chainId === 'solana' 
          ? { USDC: 0, USDT: 500.75 }  // Solana USDC has 0 balance
          : { USDC: 2100.00, USDT: 500.75 }
      }
    }))
  }

  const handleTokenSelected = (token) => {
    if (direction === 'buy') {
      setSourceToken(token)
      onSourceTokenChange?.(token)
    } else {
      setDestinationToken(token)
    }
    setAmount('')
    onAmountChange?.(0)
  }

  const handleSwapDirection = () => {
    setDirection(d => {
      const newDirection = d === 'buy' ? 'sell' : 'buy'
      // When swapping, transfer token selection to the appropriate state
      if (newDirection === 'sell' && sourceToken) {
        setDestinationToken(sourceToken)
        setSourceToken(null)
      } else if (newDirection === 'buy' && destinationToken) {
        setSourceToken(destinationToken)
        setDestinationToken(null)
      }
      return newDirection
    })
    setAmount('')
    setShowOrders(false)
  }

  // Calculate order selection locally - for BUY direction
  const availableSellOrders = useMemo(() => {
    if (!sourceToken) return orderBookData.sellOrders
    return orderBookData.sellOrders.filter(
      order => order.token === sourceToken.symbol || !sourceToken.symbol
    )
  }, [sourceToken])

  // Calculate order selection for SELL direction
  const availableBuyOrders = useMemo(() => {
    return orderBookData.buyOrders || []
  }, [])

  // Selection based on direction
  const selection = useMemo(() => {
    if (direction === 'buy') {
      return calculateOrderSelection(availableSellOrders, parseFloat(amount) || 0, sortMode)
    } else {
      return calculateSellOrderSelection(availableBuyOrders, parseFloat(amount) || 0, destinationToken, sortMode)
    }
  }, [direction, availableSellOrders, availableBuyOrders, amount, sortMode, destinationToken])

  const selectedOrderIds = new Set(selection.selectedOrders.map(o => o.id))

  const displayOrders = useMemo(() => {
    const orders = direction === 'buy' ? availableSellOrders : availableBuyOrders
    
    // Filter by destination token for sell direction
    let filteredOrders = orders
    if (direction === 'sell' && destinationToken) {
      filteredOrders = orders.filter(
        order => order.token === destinationToken.symbol && order.chain === destinationToken.chain
      )
    }
    
    return [...filteredOrders].sort((a, b) => {
      if (sortMode === 'best_price') {
        return direction === 'buy' ? a.price - b.price : b.price - a.price
      }
      return b.amount - a.amount
    })
  }, [direction, availableSellOrders, availableBuyOrders, sortMode, destinationToken])

  // Notify parent
  useEffect(() => {
    onAmountChange?.(parseFloat(amount) || 0)
  }, [amount])

  const handleUseMax = () => {
    if (direction === 'buy' && sourceToken) {
      setAmount(sourceToken.balance.toString())
    } else if (direction === 'sell') {
      setAmount(cnpyBalance.toString())
    }
  }

  const getButtonState = () => {
    if (!isConnected) return { disabled: false, text: 'Connect Wallet', variant: 'connect' }
    
    if (direction === 'buy') {
      if (!sourceToken) return { disabled: true, text: 'Select token', variant: 'disabled' }
      if (!amount || parseFloat(amount) <= 0) return { disabled: true, text: 'Enter amount', variant: 'disabled' }
      if (parseFloat(amount) > sourceToken.balance) return { disabled: true, text: 'Insufficient balance', variant: 'error' }
      if (selection.selectedOrders.length === 0) return { disabled: true, text: 'No orders available', variant: 'disabled' }
      return { disabled: false, text: `Convert $${selection.totalCost.toFixed(2)}`, variant: 'convert' }
    } else {
      // Sell direction: CNPY → stablecoin
      if (!destinationToken) return { disabled: true, text: 'Select destination', variant: 'disabled' }
      if (!amount || parseFloat(amount) <= 0) return { disabled: true, text: 'Enter amount', variant: 'disabled' }
      if (parseFloat(amount) > cnpyBalance) return { disabled: true, text: 'Insufficient CNPY', variant: 'error' }
      if (selection.selectedOrders.length === 0) return { disabled: true, text: 'No orders available', variant: 'disabled' }
      return { disabled: false, text: `Convert ${parseFloat(amount).toLocaleString()} CNPY`, variant: 'convert' }
    }
  }

  const buttonState = getButtonState()

  // Get the current balance for shake validation
  const currentBalance = direction === 'buy' ? (sourceToken?.balance || 0) : cnpyBalance

  return (
    <>
      {/* Input Token Card */}
      <div className="px-4">
        {direction === 'buy' ? (
          // BUY DIRECTION: Stablecoin input
          sourceToken ? (
            <Card className="bg-muted/30 p-4 space-y-3">
              {/* Token Header */}
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setShowBridgeDialog(true)}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  {/* Token Avatar with Chain Badge */}
                  <div className="relative">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: sourceToken.color }}
                    >
                      {sourceToken.symbol === 'USDC' ? '$' : 'T'}
                    </div>
                    <ChainBadge chain={sourceToken.chain} />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <p className="text-base font-semibold">{sourceToken.symbol}</p>
                      <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground capitalize">
                        {sourceToken.chain}
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {sourceToken.balance.toLocaleString()} {sourceToken.symbol}
                    </p>
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

              {/* Budget Label */}
              {amount && parseFloat(amount) > 0 && (
                <div className="text-center">
                  <span className="text-xs text-muted-foreground tracking-wider">BUDGET</span>
                </div>
              )}

              {/* Amount Input - Centered */}
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={amount}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value === '' || /^\d*\.?\d*$/.test(value)) {
                        setAmount(value)
                        // Trigger shake when exceeding balance
                        if (parseFloat(value) > currentBalance && parseFloat(amount) <= currentBalance) {
                          setIsShaking(true)
                          setTimeout(() => setIsShaking(false), 400)
                        }
                      }
                    }}
                    placeholder="0"
                    className={`text-4xl font-bold bg-transparent border-0 outline-none p-0 h-auto text-center w-full placeholder:text-muted-foreground ${
                      isShaking ? 'animate-shake' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Spending Display */}
              {selection.totalCost > 0 && parseFloat(amount) > 0 && (
                <div className="space-y-1 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xs text-muted-foreground tracking-wider">SPENDING</span>
                    <span className="text-lg font-semibold text-green-500">
                      ${selection.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  {selection.gap > 0.01 && (
                    <div className="text-sm text-muted-foreground">
                      ${selection.gap.toFixed(2)} unused
                    </div>
                  )}
                </div>
              )}
            </Card>
          ) : (
            <Card 
              className="bg-muted/30 p-4 hover:bg-muted/40 transition-colors cursor-pointer"
              onClick={() => setShowBridgeDialog(true)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-muted flex items-center justify-center">
                    <Plus className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-base font-semibold">Select token</p>
                    <p className="text-sm text-muted-foreground">Choose USDC or USDT to convert</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </Card>
          )
        ) : (
          // SELL DIRECTION: CNPY input
          <Card className="bg-muted/30 p-4 space-y-3">
            {/* CNPY Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <CnpyLogo className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-base font-semibold">CNPY</p>
                  <p className="text-sm text-muted-foreground">
                    {cnpyBalance.toLocaleString()} CNPY
                  </p>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="h-7 text-xs"
                onClick={handleUseMax}
              >
                Use max
              </Button>
            </div>

            {/* Selling Label */}
            {amount && parseFloat(amount) > 0 && (
              <div className="text-center">
                <span className="text-xs text-muted-foreground tracking-wider">SELLING</span>
              </div>
            )}

            {/* Amount Input - Centered */}
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value === '' || /^\d*\.?\d*$/.test(value)) {
                      setAmount(value)
                      // Trigger shake when exceeding balance
                      if (parseFloat(value) > cnpyBalance && parseFloat(amount) <= cnpyBalance) {
                        setIsShaking(true)
                        setTimeout(() => setIsShaking(false), 400)
                      }
                    }
                  }}
                  placeholder="0"
                  className={`text-4xl font-bold bg-transparent border-0 outline-none p-0 h-auto text-center w-full placeholder:text-muted-foreground ${
                    isShaking ? 'animate-shake' : ''
                  }`}
                />
              </div>
            </div>

            {/* CNPY being sold display */}
            {selection.cnpySold > 0 && parseFloat(amount) > 0 && (
              <div className="space-y-1 text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs text-muted-foreground tracking-wider">MATCHED</span>
                  <span className="text-lg font-semibold text-green-500">
                    {selection.cnpySold.toLocaleString()} CNPY
                  </span>
                </div>
                {selection.gap > 0.5 && (
                  <div className="text-sm text-muted-foreground">
                    {selection.gap.toFixed(0)} CNPY unmatched
                  </div>
                )}
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Arrow Divider - Clickable to swap direction */}
      <div className="relative flex justify-center">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-8 w-8 bg-background border-2 hover:bg-muted transition-colors"
          onClick={handleSwapDirection}
        >
          <ArrowDown className={`w-4 h-4 transition-transform duration-200 ${direction === 'sell' ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      {/* Output Token Card with Orders */}
      <div className="px-4">
        <Card className="bg-muted/30 p-4">
          {direction === 'buy' ? (
            // BUY DIRECTION: CNPY output
            <>
              {/* CNPY Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <CnpyLogo className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-base font-semibold">CNPY</p>
                    <p className="text-sm text-muted-foreground">0 CNPY</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base font-semibold">
                    {selection.cnpyReceived > 0 ? selection.cnpyReceived.toLocaleString() : '0'}
                  </p>
                  {selection.totalSavings > 0 ? (
                    <p className="text-sm text-green-500">+${selection.totalSavings.toFixed(2)} bonus</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      ${selection.cnpyReceived > 0 ? selection.cnpyReceived.toFixed(2) : '0.00'}
                    </p>
                  )}
                </div>
              </div>

              {/* Collapsible Orders Section */}
              {sourceToken && (
                <div className="mt-4 pt-4 border-t border-border">
                  {/* Orders Header */}
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={() => setShowOrders(!showOrders)}
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${showOrders ? '' : '-rotate-90'}`} />
                      <span>Orders</span>
                      {selection.selectedOrders.length > 0 && (
                        <span className="text-xs bg-green-500/20 text-green-500 px-1.5 py-0.5 rounded">
                          {selection.selectedOrders.length} matched
                        </span>
                      )}
                    </button>
                    <div className="flex gap-1 p-0.5 bg-muted/50 rounded-md">
                      <button
                        onClick={() => setSortMode('best_price')}
                        className={`px-2 py-1 text-xs font-medium rounded transition-all ${
                          sortMode === 'best_price'
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground'
                        }`}
                      >
                        Best price
                      </button>
                      <button
                        onClick={() => setSortMode('best_fill')}
                        className={`px-2 py-1 text-xs font-medium rounded transition-all ${
                          sortMode === 'best_fill'
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground'
                        }`}
                      >
                        Best fill
                      </button>
                    </div>
                  </div>

                  {/* Order List */}
                  {showOrders && (
                    <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
                      {displayOrders.slice(0, 6).map((order, index) => {
                        const selectedOrder = selection.selectedOrders.find(o => o.id === order.id)
                        const isSelected = selectedOrderIds.has(order.id)
                        // Calculate what % of the total budget this order's cost represents
                        const orderCost = order.amount * order.price
                        const budgetAmount = parseFloat(amount) || 0
                        const percentOfBudget = budgetAmount > 0 ? (orderCost / budgetAmount) * 100 : 0
                        return (
                          <OrderRow
                            key={order.id}
                            order={selectedOrder || order}
                            isSelected={isSelected}
                            index={index}
                            percentOfBudget={percentOfBudget}
                          />
                        )
                      })}
                    </div>
                  )}

                  {/* No amount state */}
                  {(!amount || parseFloat(amount) <= 0) && showOrders && (
                    <p className="text-center text-xs text-muted-foreground py-3">
                      Enter an amount to see matched orders
                    </p>
                  )}
                </div>
              )}
            </>
          ) : (
            // SELL DIRECTION: Stablecoin output
            <>
              {/* Stablecoin Header */}
              <div className="flex items-center justify-between">
                {destinationToken ? (
                  <>
                    <button 
                      onClick={() => setShowBridgeDialog(true)}
                      className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                    >
                      <div className="relative">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: destinationToken.color }}
                        >
                          {destinationToken.symbol === 'USDC' ? '$' : 'T'}
                        </div>
                        <ChainBadge chain={destinationToken.chain} />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <p className="text-base font-semibold">{destinationToken.symbol}</p>
                          <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground capitalize">
                            {destinationToken.chain}
                          </span>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {destinationToken.balance.toLocaleString()} {destinationToken.symbol}
                        </p>
                      </div>
                    </button>
                    <div className="text-right">
                      <p className="text-base font-semibold">
                        {selection.totalReceived > 0 ? `$${selection.totalReceived.toFixed(2)}` : '$0.00'}
                      </p>
                      {selection.totalReceived > 0 && selection.cnpySold > 0 && (
                        <p className="text-sm text-muted-foreground">
                          @${(selection.totalReceived / selection.cnpySold).toFixed(3)}/CNPY
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <button 
                    onClick={() => setShowBridgeDialog(true)}
                    className="flex items-center gap-3 w-full hover:opacity-80 transition-opacity"
                  >
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                      <Plus className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-base font-semibold">Select destination</p>
                      <p className="text-sm text-muted-foreground">Choose where to receive funds</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </button>
                )}
              </div>

              {/* Collapsible Orders Section for sell direction */}
              {destinationToken && (
                <div className="mt-4 pt-4 border-t border-border">
                  {/* Orders Header */}
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={() => setShowOrders(!showOrders)}
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${showOrders ? '' : '-rotate-90'}`} />
                      <span>Orders</span>
                      {selection.selectedOrders.length > 0 && (
                        <span className="text-xs bg-green-500/20 text-green-500 px-1.5 py-0.5 rounded">
                          {selection.selectedOrders.length} matched
                        </span>
                      )}
                    </button>
                    <div className="flex gap-1 p-0.5 bg-muted/50 rounded-md">
                      <button
                        onClick={() => setSortMode('best_price')}
                        className={`px-2 py-1 text-xs font-medium rounded transition-all ${
                          sortMode === 'best_price'
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground'
                        }`}
                      >
                        Best price
                      </button>
                      <button
                        onClick={() => setSortMode('best_fill')}
                        className={`px-2 py-1 text-xs font-medium rounded transition-all ${
                          sortMode === 'best_fill'
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground'
                        }`}
                      >
                        Best fill
                      </button>
                    </div>
                  </div>

                  {/* Order List for sell direction */}
                  {showOrders && (
                    <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
                      {displayOrders.slice(0, 6).map((order, index) => {
                        const selectedOrder = selection.selectedOrders.find(o => o.id === order.id)
                        const isSelected = selectedOrderIds.has(order.id)
                        // For sell direction, show % of total CNPY being sold
                        const cnpyAmount = parseFloat(amount) || 0
                        const percentOfTotal = cnpyAmount > 0 ? ((selectedOrder?.cnpySold || order.amount) / cnpyAmount) * 100 : 0
                        return (
                          <SellOrderRow
                            key={order.id}
                            order={selectedOrder || order}
                            isSelected={isSelected}
                            index={index}
                            percentOfTotal={Math.min(percentOfTotal, 100)}
                          />
                        )
                      })}
                    </div>
                  )}

                  {/* No amount state */}
                  {(!amount || parseFloat(amount) <= 0) && showOrders && (
                    <p className="text-center text-xs text-muted-foreground py-3">
                      Enter an amount to see matched orders
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </Card>
      </div>

      {/* Action Button */}
      <div className="px-4 pt-4 pb-3">
        <Button 
          className={`w-full h-11 ${
            buttonState.variant === 'convert' 
              ? 'bg-gradient-to-b from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white' 
              : buttonState.variant === 'connect'
              ? 'bg-gradient-to-b from-cyan-500 to-cyan-700 hover:from-cyan-600 hover:to-cyan-800 text-white'
              : buttonState.variant === 'error'
              ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/15'
              : ''
          }`}
          size="lg" 
          disabled={buttonState.disabled || isPreview}
          onClick={() => {
            if (buttonState.variant === 'connect' && onOpenWalletDialog) {
              onOpenWalletDialog()
            } else if (buttonState.variant === 'convert') {
              setShowTransactionDialog(true)
            }
          }}
        >
          {isPreview ? 'Preview Mode' : buttonState.text}
        </Button>
      </div>

      {/* Exchange Rate Info */}
      {direction === 'buy' && sourceToken && selection.cnpyReceived > 0 && (
        <div className="px-4 pb-4">
          <div className="flex items-center justify-center text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" />
              <span>
                ${selection.totalCost.toFixed(2)} → {selection.cnpyReceived.toLocaleString()} CNPY
              </span>
            </div>
          </div>
        </div>
      )}
      
      {direction === 'sell' && destinationToken && selection.totalReceived > 0 && (
        <div className="px-4 pb-4">
          <div className="flex items-center justify-center text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" />
              <span>
                {selection.cnpySold.toLocaleString()} CNPY → ${selection.totalReceived.toFixed(2)} {destinationToken.symbol}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Bridge Token Selection Dialog */}
      <BridgeTokenDialog
        open={showBridgeDialog}
        onOpenChange={setShowBridgeDialog}
        onSelectToken={handleTokenSelected}
        connectedWallets={connectedWallets}
        onConnectWallet={handleConnectWallet}
        mode={direction === 'buy' ? 'source' : 'destination'}
      />

      {/* Convert Transaction Progress Dialog */}
      {showTransactionDialog && (
        <ConvertTransactionDialog
          open={showTransactionDialog}
          onClose={() => {
            setShowTransactionDialog(false)
            // Reset form after successful transaction
            setAmount('')
          }}
          direction={direction}
          sourceToken={direction === 'buy' ? sourceToken : null}
          destinationToken={direction === 'sell' ? destinationToken : null}
          cnpyAmount={direction === 'sell' ? selection.cnpySold : selection.cnpyReceived}
          stablecoinAmount={direction === 'buy' ? selection.totalCost : selection.totalReceived}
          totalSavings={selection.totalSavings || 0}
          ordersMatched={selection.selectedOrders.length}
        />
      )}
    </>
  )
}
