import { useState, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, ChevronRight, ChevronDown, ArrowDown, Check, Zap, Wallet, AlertTriangle, Minus } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useWallet } from '@/contexts/wallet-context'
import { toast } from 'sonner'
import BridgeTokenDialog from '@/components/bridge-token-dialog'
import ConvertTransactionDialog from '@/components/trading-module/convert-transaction-dialog'
import SellOrderConfirmationDialog from '@/components/trading-module/sell-order-confirmation-dialog'
import YourOrdersCard from '@/components/trading-module/your-orders-card'
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
  const { 
    isConnected, 
    getCnpyBalance, 
    updateCnpyBalance, 
    getExternalBalances, 
    updateExternalBalance,
    connectExternalWallet 
  } = useWallet()
  
  const [showBridgeDialog, setShowBridgeDialog] = useState(false)
  const [sourceToken, setSourceToken] = useState(null)
  const [destinationToken, setDestinationToken] = useState(null)
  const [amount, setAmount] = useState('')
  const [sortMode, setSortMode] = useState('best_price')
  const [showOrders, setShowOrders] = useState(false)
  const [isShaking, setIsShaking] = useState(false)
  const [showTransactionDialog, setShowTransactionDialog] = useState(false)
  const [direction, setDirection] = useState('buy') // 'buy' = stablecoin→CNPY, 'sell' = CNPY→stablecoin
  const [sellMode, setSellMode] = useState('instant') // 'instant' or 'create'
  const [orderPrice, setOrderPrice] = useState(null) // null = use preset
  const [pricePreset, setPricePreset] = useState('market') // 'market', 'minus1', 'minus2', 'minus5', 'custom'
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false)
  const [expandedCard, setExpandedCard] = useState(null) // 'instant' | 'create' | null
  const [userOrders, setUserOrders] = useState(() => {
    // Load user orders from localStorage
    try {
      const stored = localStorage.getItem('userSellOrders')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })
  
  // Get CNPY balance from context
  const cnpyBalance = getCnpyBalance()
  
  // Get external wallet balances from context
  const connectedWallets = getExternalBalances()

  // Price presets for create order (CNPY market price = $2.00)
  const pricePresets = {
    market: 2.00,    // Current market price (100%)
    minus1: 1.98,    // -1% below market
    minus2: 1.96,    // -2% below market
    minus5: 1.90     // -5% below market
  }

  // Calculate instant sell values
  const calculateInstantSell = () => {
    const cnpyAmount = parseFloat(amount) || 0
    if (cnpyAmount <= 0) return { received: 0, rate: 0, fee: 0, feeAmount: 0 }
    
    const instantSellFee = 0.10 // 10% fee
    const cnpyMarketPrice = 2.0 // CNPY market price
    const instantSellRate = cnpyMarketPrice * (1.0 - instantSellFee) // $1.80 per CNPY (10% fee)
    const received = cnpyAmount * instantSellRate
    const feeAmount = cnpyAmount * instantSellFee
    
    return {
      received,
      rate: instantSellRate,
      fee: instantSellFee,
      feeAmount
    }
  }

  // Calculate create order values
  const calculateCreateOrder = () => {
    const cnpyAmount = parseFloat(amount) || 0
    if (cnpyAmount <= 0) return { received: 0, rate: 0, fee: 0, feeAmount: 0 }
    
    let selectedPrice
    if (orderPrice !== null) {
      selectedPrice = orderPrice
    } else if (pricePreset === 'custom') {
      selectedPrice = pricePresets.market // Default to normal if custom but no price set
    } else {
      selectedPrice = pricePresets[pricePreset]
    }
    
    const createOrderFee = 0.00 // 0% fee (no fees)
    const received = cnpyAmount * selectedPrice
    const feeAmount = 0 // No fee
    
    return {
      received: received, // No fee deducted
      rate: selectedPrice,
      fee: createOrderFee,
      feeAmount,
      grossReceived: received
    }
  }

  const instantSell = calculateInstantSell()
  const createOrder = calculateCreateOrder()

  const handleConnectWallet = async (chainId) => {
    await connectExternalWallet(chainId)
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
      // Reset sell mode to instant when switching to sell direction
      if (newDirection === 'sell') {
        setSellMode('instant')
        setPricePreset('market')
        setOrderPrice(null)
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
      
      // Different button text based on sell mode
      if (sellMode === 'instant') {
        return { disabled: false, text: `Sell ${parseFloat(amount).toLocaleString()} CNPY`, variant: 'convert' }
      } else {
        return { disabled: false, text: 'Create Order', variant: 'convert' }
      }
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
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Wallet className="w-3 h-3" />
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
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Wallet className="w-3 h-3" />
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

            {/* USD value and market rate display - only show when amount is entered */}
            {parseFloat(amount) > 0 && direction === 'sell' && (
              <div className="space-y-1 text-center">
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <span>${parseFloat(amount).toFixed(0)}</span>
                  <span>•</span>
                  <span>$2.00/CNPY</span>
                </div>
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
          <ArrowDown className="w-4 h-4" />
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
                    <button 
                      onClick={handleUseMax}
                      className="text-sm text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer"
                    >
                      <Wallet className="w-3 h-3" />
                      {cnpyBalance.toLocaleString()} CNPY
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base font-semibold">
                    {selection.cnpyReceived > 0 ? selection.cnpyReceived.toLocaleString() : '0'}
                  </p>
                  {selection.cnpyReceived > 0 && selection.totalCost > 0 ? (
                    <p className="text-sm text-muted-foreground">
                      ~${selection.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({(((selection.totalCost / selection.cnpyReceived) - 1) * 100).toFixed(1)}%)
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">$0.00</p>
                  )}
                </div>
              </div>

              {/* Collapsible Orders Section */}
              {sourceToken && (
                <div className="mt-4 pt-4 border-t border-border">
                  {/* Progress Summary - Always visible */}
                  {selection.totalCost > 0 && parseFloat(amount) > 0 && (
                    <div className="bg-muted/30 rounded-lg p-3 mb-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <span>{((selection.totalCost / parseFloat(amount)) * 100).toFixed(0)}% filled</span>
                        <span>${selection.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} of ${parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-foreground/40 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((selection.totalCost / parseFloat(amount)) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

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
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleUseMax(); }}
                          className="text-sm text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer"
                        >
                          <Wallet className="w-3 h-3" />
                          {destinationToken.balance.toLocaleString()} {destinationToken.symbol}
                        </button>
                      </div>
                    </button>
                    <div className="text-right">
                      {sellMode === 'instant' && parseFloat(amount) > 0 ? (
                        <>
                          <p className="text-base font-semibold">
                            ${instantSell.received.toFixed(2)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            @${instantSell.rate.toFixed(3)}/CNPY
                          </p>
                        </>
                      ) : sellMode === 'create' && parseFloat(amount) > 0 ? (
                        <>
                          <p className="text-base font-semibold">
                            ${createOrder.received.toFixed(2)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            @${createOrder.rate.toFixed(3)}/CNPY
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-base font-semibold">
                            {selection.totalReceived > 0 ? `$${selection.totalReceived.toFixed(2)}` : '$0.00'}
                          </p>
                          {selection.totalReceived > 0 && selection.cnpySold > 0 && (
                            <p className="text-sm text-muted-foreground">
                              @${(selection.totalReceived / selection.cnpySold).toFixed(3)}/CNPY
                            </p>
                          )}
                        </>
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

              {/* Sell Mode Toggle and UI */}
              {destinationToken && (
                <div className="mt-4 pt-4 border-t border-border">
                  {/* Mode Toggle */}
                  <div className="flex gap-1 p-1 bg-muted/50 rounded-lg mb-4">
                    <button
                      onClick={() => {
                        setSellMode('instant')
                        setExpandedCard(null) // Reset expanded state when switching modes
                      }}
                      className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all flex flex-col items-center ${
                        sellMode === 'instant'
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" />
                        Instant
                      </span>
                      {parseFloat(amount) > 0 && createOrder.received > instantSell.received && (
                        <span className="text-[10px] text-muted-foreground font-medium mt-0.5">
                          -${(createOrder.received - instantSell.received).toFixed(2)}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setSellMode('create')
                        setExpandedCard(null) // Reset expanded state when switching modes
                      }}
                      className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all flex flex-col items-center ${
                        sellMode === 'create'
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <span>Create Order</span>
                      {parseFloat(amount) > 0 && createOrder.received > instantSell.received && (
                        <span className="text-[10px] text-green-500 font-medium mt-0.5">
                          +${(createOrder.received - instantSell.received).toFixed(2)}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Instant Sell Mode */}
                  {sellMode === 'instant' && (
                    <div className="bg-muted/30 rounded-lg p-3">
                      {parseFloat(amount) > 0 ? (
                        <>
                          {/* Clickable header area */}
                          <button
                            onClick={() => setExpandedCard(expandedCard === 'instant' ? null : 'instant')}
                            className="w-full text-left cursor-pointer"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs text-muted-foreground mb-0.5">You receive</p>
                                <p className="text-2xl font-bold">
                                  ${instantSell.received.toFixed(2)} {destinationToken.symbol}
                                </p>
                              </div>
                              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expandedCard === 'instant' ? 'rotate-180' : ''}`} />
                            </div>
                            
                            {/* Fee - always visible */}
                            <div className="mt-2 text-xs text-muted-foreground">
                              Fee: <span className="font-medium text-foreground">{(instantSell.fee * 100).toFixed(0)}% (${instantSell.feeAmount.toFixed(2)})</span>
                            </div>
                          </button>
                          
                          {/* Expanded details */}
                          {expandedCard === 'instant' && (
                            <div className="mt-3 pt-3 border-t border-border space-y-2">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>Rate: <span className="font-medium text-foreground">${instantSell.rate.toFixed(3)}/CNPY</span></span>
                              </div>
                              
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Check className="w-3 h-3 text-green-500" />
                                  Instant
                                </span>
                                <span className="flex items-center gap-1">
                                  <Check className="w-3 h-3 text-green-500" />
                                  Guaranteed
                                </span>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-xs text-muted-foreground text-center py-2">
                          Enter an amount to see instant sell details
                        </p>
                      )}
                    </div>
                  )}

                  {/* Create Order Mode */}
                  {sellMode === 'create' && (
                    <div className="bg-muted/30 rounded-lg p-3">
                      {parseFloat(amount) > 0 ? (
                        <>
                          {/* Clickable header area */}
                          <button
                            onClick={() => setExpandedCard(expandedCard === 'create' ? null : 'create')}
                            className="w-full text-left cursor-pointer"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs text-muted-foreground mb-0.5">You receive (if filled)</p>
                                <p className="text-2xl font-bold">
                                  ${createOrder.received.toFixed(2)} {destinationToken.symbol}
                                </p>
                              </div>
                              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expandedCard === 'create' ? 'rotate-180' : ''}`} />
                            </div>
                            
                            {/* Est. fill time - always visible */}
                            <div className="mt-2 text-xs text-muted-foreground">
                              Est. fill time: <span className="font-medium text-foreground">24 hours</span>
                            </div>
                          </button>
                          
                          {/* Expanded details */}
                          {expandedCard === 'create' && (
                            <div className="mt-3 pt-3 border-t border-border space-y-2.5">
                              <div>
                                <p className="text-xs text-muted-foreground mb-1.5">Set your price:</p>
                                <div className="flex items-center gap-2">
                                  <Select
                                    value={pricePreset === 'custom' || orderPrice !== null ? 'custom' : pricePreset}
                                    onValueChange={(value) => {
                                      if (value === 'custom') {
                                        setPricePreset('custom')
                                        // Set default price if none exists
                                        if (orderPrice === null) {
                                          setOrderPrice(pricePresets.market)
                                        }
                                      } else {
                                        setPricePreset(value)
                                        setOrderPrice(null)
                                      }
                                    }}
                                  >
                                    <SelectTrigger className="w-24 h-9 text-xs flex-shrink-0">
                                      <SelectValue>
                                        {pricePreset === 'custom' || orderPrice !== null
                                          ? 'Custom'
                                          : pricePreset === 'market'
                                            ? 'Market'
                                            : pricePreset === 'minus1'
                                              ? '-1%'
                                              : pricePreset === 'minus2'
                                                ? '-2%'
                                                : pricePreset === 'minus5'
                                                  ? '-5%'
                                                  : 'Select...'
                                        }
                                      </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="market">
                                        Market (${pricePresets.market.toFixed(2)})
                                      </SelectItem>
                                      <SelectItem value="minus1">
                                        -1% (${pricePresets.minus1.toFixed(2)})
                                      </SelectItem>
                                      <SelectItem value="minus2">
                                        -2% (${pricePresets.minus2.toFixed(2)})
                                      </SelectItem>
                                      <SelectItem value="minus5">
                                        -5% (${pricePresets.minus5.toFixed(2)})
                                      </SelectItem>
                                      <SelectItem value="custom">
                                        Custom
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                    <span className="text-xs text-muted-foreground flex-shrink-0">$</span>
                                    <div className="flex items-center gap-0.5 flex-1 min-w-0">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const currentPrice = orderPrice !== null ? orderPrice : pricePresets[pricePreset] || pricePresets.market
                                          const newPrice = Math.max(0.001, currentPrice - 0.001)
                                          setOrderPrice(newPrice)
                                          setPricePreset('custom')
                                        }}
                                        className="w-6 h-6 flex items-center justify-center rounded border border-border bg-background hover:bg-muted transition-colors flex-shrink-0"
                                      >
                                        <Minus className="w-3 h-3" />
                                      </button>
                                      <input
                                        type="text"
                                        inputMode="decimal"
                                        value={orderPrice !== null ? orderPrice.toString() : (pricePresets[pricePreset] || pricePresets.market).toString()}
                                        onChange={(e) => {
                                          const value = e.target.value
                                          if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                            const numValue = value === '' ? pricePresets.market : parseFloat(value)
                                            setOrderPrice(numValue)
                                            setPricePreset('custom')
                                          }
                                        }}
                                        placeholder={pricePresets.market.toFixed(3)}
                                        className="flex-1 min-w-0 bg-background border border-border rounded-md px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-center overflow-visible"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const currentPrice = orderPrice !== null ? orderPrice : pricePresets[pricePreset] || pricePresets.market
                                          const newPrice = Math.min(1.5, currentPrice + 0.001)
                                          setOrderPrice(newPrice)
                                          setPricePreset('custom')
                                        }}
                                        className="w-6 h-6 flex items-center justify-center rounded border border-border bg-background hover:bg-muted transition-colors flex-shrink-0"
                                      >
                                        <Plus className="w-3 h-3" />
                                      </button>
                                    </div>
                                    <span className="text-xs text-muted-foreground flex-shrink-0">/CNPY</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>Rate: <span className="font-medium text-foreground">${createOrder.rate.toFixed(3)}/CNPY</span></span>
                                  <span>•</span>
                                  <span className="text-green-500">No fees</span>
                                </div>
                                <div className="flex items-center gap-1.5 pt-1">
                                  <span className="text-xs">⚠️</span>
                                  <span className="text-xs text-muted-foreground">May not fill immediately</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-xs text-muted-foreground text-center py-2">
                          Enter an amount to see create order details
                        </p>
                      )}
                    </div>
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
              if (direction === 'sell' && sellMode === 'create') {
                // Show order confirmation dialog for create order
                setShowOrderConfirmation(true)
              } else {
                // Show transaction dialog for instant sell or buy
                setShowTransactionDialog(true)
              }
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
      
      {direction === 'sell' && destinationToken && (
        <>
          {sellMode === 'instant' && instantSell.received > 0 && (
            <div className="px-4 pb-4">
              <div className="flex items-center justify-center text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5" />
                  <span>
                    {parseFloat(amount).toLocaleString()} CNPY → ${instantSell.received.toFixed(2)} {destinationToken.symbol}
                  </span>
                </div>
              </div>
            </div>
          )}
          {sellMode === 'create' && createOrder.received > 0 && (
            <div className="px-4 pb-4">
              <div className="flex items-center justify-center text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5" />
                  <span>
                    {parseFloat(amount).toLocaleString()} CNPY → ${createOrder.received.toFixed(2)} {destinationToken.symbol} (if filled)
                  </span>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Your Orders Card */}
      {direction === 'sell' && userOrders.length > 0 && (
        <div className="px-4 pb-4">
          <YourOrdersCard
            orders={userOrders.filter(o => o.status === 'active')}
            onEdit={(order) => {
              // TODO: Implement edit functionality
              console.log('Edit order', order)
            }}
            onCancel={(order) => {
              // Remove order
              const updatedOrders = userOrders.map(o => 
                o.id === order.id ? { ...o, status: 'cancelled' } : o
              )
              setUserOrders(updatedOrders)
              try {
                localStorage.setItem('userSellOrders', JSON.stringify(updatedOrders))
              } catch (e) {
                console.error('Failed to update orders in localStorage', e)
              }
            }}
            onViewAll={() => {
              // TODO: Navigate to wallet page orders section
              console.log('View all orders')
            }}
          />
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
          onClose={(wasSuccessful) => {
            setShowTransactionDialog(false)
            
            // Update balances after successful transaction
            if (wasSuccessful !== false) {
              if (direction === 'buy' && sourceToken) {
                // Buy: spent stablecoin, received CNPY
                updateExternalBalance(sourceToken.chain, sourceToken.symbol, -selection.totalCost)
                updateCnpyBalance(selection.cnpyReceived)
                // Update the sourceToken's balance in local state for immediate UI feedback
                setSourceToken(prev => prev ? { ...prev, balance: prev.balance - selection.totalCost } : null)
              } else if (direction === 'sell' && destinationToken && sellMode === 'instant') {
                // Instant Sell: spent CNPY, received stablecoin
                const cnpyAmount = parseFloat(amount) || 0
                updateCnpyBalance(-cnpyAmount)
                updateExternalBalance(destinationToken.chain, destinationToken.symbol, instantSell.received)
                // Update the destinationToken's balance in local state for immediate UI feedback
                setDestinationToken(prev => prev ? { ...prev, balance: prev.balance + instantSell.received } : null)
              }
            }
            
            // Reset form after transaction
            setAmount('')
          }}
          direction={direction}
          sourceToken={direction === 'buy' ? sourceToken : null}
          destinationToken={direction === 'sell' ? destinationToken : null}
          cnpyAmount={direction === 'sell' ? parseFloat(amount) || 0 : selection.cnpyReceived}
          stablecoinAmount={direction === 'buy' ? selection.totalCost : (sellMode === 'instant' ? instantSell.received : createOrder.received)}
          totalSavings={selection.totalSavings || 0}
          ordersMatched={direction === 'buy' ? selection.selectedOrders.length : 0}
        />
      )}

      {/* Sell Order Confirmation Dialog */}
      {showOrderConfirmation && destinationToken && (
        <SellOrderConfirmationDialog
          open={showOrderConfirmation}
          onClose={() => setShowOrderConfirmation(false)}
          onConfirm={() => {
            // Save order to user orders
            const pricePerCnpy = orderPrice !== null ? orderPrice : (pricePreset === 'custom' ? pricePresets.market : pricePresets[pricePreset])
            const newOrder = {
              id: `order-${Date.now()}`,
              type: 'sell',
              cnpyAmount: parseFloat(amount) || 0,
              pricePerCnpy: pricePerCnpy,
              destinationToken: destinationToken.symbol,
              destinationChain: destinationToken.chain,
              expectedReceive: createOrder.received,
              fee: createOrder.fee,
              feeAmount: createOrder.feeAmount,
              status: 'active',
              createdAt: new Date().toISOString()
            }
            
            const updatedOrders = [newOrder, ...userOrders]
            setUserOrders(updatedOrders)
            
            // Save to localStorage
            try {
              localStorage.setItem('userSellOrders', JSON.stringify(updatedOrders))
            } catch (e) {
              console.error('Failed to save order to localStorage', e)
            }
            
            // Show toast notification
            toast.success('Order created successfully', {
              description: `Selling ${parseFloat(amount).toLocaleString()} CNPY at $${pricePerCnpy.toFixed(3)}/CNPY`,
              action: {
                label: 'View Orders',
                onClick: () => {
                  // Navigate to wallet orders tab
                  window.location.href = '/wallet?tab=orders'
                }
              }
            })
            
            setShowOrderConfirmation(false)
            // Reset form
            setAmount('')
          }}
          cnpyAmount={parseFloat(amount) || 0}
          pricePerCnpy={orderPrice !== null ? orderPrice : (pricePreset === 'custom' ? pricePresets.market : pricePresets[pricePreset])}
          destinationToken={destinationToken}
          expectedReceive={createOrder.received}
          fee={createOrder.fee}
          feeAmount={createOrder.feeAmount}
        />
      )}
    </>
  )
}
