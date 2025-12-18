import { useState, useMemo, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Check, TrendingDown } from 'lucide-react'
import orderBookData from '@/data/order-book.json'

// Calculate auto-selected WHOLE orders based on input amount
// No partial fills - each order is either fully selected or not
// Order "amount" = CNPY face value, Order "price" = fraction of face value you pay
// E.g., $100 order at price 0.93 (-7%) means you pay $93 to get $100 CNPY
function calculateOrderSelection(orders, inputAmount, sortMode) {
  if (!inputAmount || inputAmount <= 0) {
    return { selectedOrders: [], totalSavings: 0, totalSelected: 0, totalCost: 0, cnpyReceived: 0, fillPercentage: 0, gap: 0 }
  }

  // Sort orders based on mode
  const sortedOrders = [...orders].sort((a, b) => {
    if (sortMode === 'best_price') {
      // Best price = lowest price (highest discount)
      return a.price - b.price
    } else {
      // Best fill = largest amounts first for fewer transactions
      return b.amount - a.amount
    }
  })

  let remainingBudget = inputAmount
  const selectedOrders = []
  let totalSavings = 0
  let totalCost = 0 // What you actually pay in USD
  let cnpyReceived = 0 // CNPY tokens you receive (face value of orders)

  // Greedy selection: pick whole orders until we can't fit another
  for (const order of sortedOrders) {
    // Calculate what this order would cost (amount * price)
    const orderCost = order.amount * order.price
    
    // Only select if we can afford this order with remaining budget
    if (orderCost <= remainingBudget) {
      const savings = order.amount - orderCost // Difference between face value and cost

      selectedOrders.push({
        ...order,
        cost: orderCost,
        savings
      })

      totalSavings += savings
      totalCost += orderCost
      cnpyReceived += order.amount // You get the full face value in CNPY
      remainingBudget -= orderCost
    }
  }

  const fillPercentage = (totalCost / inputAmount) * 100
  const gap = inputAmount - totalCost // Unused budget

  return {
    selectedOrders,
    totalSavings,
    totalSelected: totalCost, // For backward compat - this is what you spend
    totalCost,
    cnpyReceived, // This is what you GET in CNPY
    fillPercentage,
    gap,
    isFullyFilled: gap < 1, // Consider filled if gap is less than $1
    isOverTarget: false
  }
}

function OrderRow({ order, isSelected, index }) {
  return (
    <div
      className={`relative p-3 rounded-lg border transition-all duration-200 ease-out ${
        isSelected
          ? 'bg-muted/50 border-primary/30 scale-[1.01]'
          : 'bg-muted/20 border-transparent opacity-40 scale-100'
      }`}
      style={{
        transitionDelay: isSelected ? `${index * 30}ms` : '0ms'
      }}
    >
      {/* Full width highlight for selected orders */}
      <div
        className={`absolute inset-0 bg-primary/5 rounded-lg transition-all duration-300 ease-out ${
          isSelected ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ 
          transitionDelay: isSelected ? `${index * 30 + 50}ms` : '0ms'
        }}
      />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Selection indicator with animation */}
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 ease-out ${
              isSelected
                ? 'bg-primary text-primary-foreground scale-100'
                : 'bg-muted border border-border scale-90'
            }`}
          >
            <Check 
              className={`w-3 h-3 transition-all duration-150 ${
                isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
              }`} 
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">${order.amount.toLocaleString()}</span>
              <span className="text-sm text-green-500 font-medium">
                {order.discount}%
              </span>
            </div>
          </div>
        </div>

        <div
          className={`text-right transition-all duration-200 ease-out ${
            isSelected ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
          }`}
          style={{
            transitionDelay: isSelected ? `${index * 30 + 100}ms` : '0ms'
          }}
        >
          <p className="text-sm font-medium text-green-500">
            +${order.savings?.toFixed(2) || '0.00'}
          </p>
          <p className="text-xs text-muted-foreground">saved</p>
        </div>
      </div>
    </div>
  )
}

// Progress bar component showing selected total vs target
function FillProgressBar({ totalSelected, targetAmount, fillPercentage, gap }) {
  const isComplete = gap === 0
  const cappedPercentage = Math.min(fillPercentage, 100)
  
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground">
          ${totalSelected.toLocaleString()} of ${targetAmount.toLocaleString()}
        </span>
        <span className={`text-xs font-medium transition-colors duration-300 ${
          isComplete ? 'text-green-500' : 'text-amber-500'
        }`}>
          {isComplete ? '✓ Exact match' : `$${gap.toLocaleString()} short`}
        </span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            isComplete 
              ? 'bg-gradient-to-r from-green-500 to-green-400' 
              : 'bg-gradient-to-r from-amber-500 to-amber-400'
          }`}
          style={{ width: `${cappedPercentage}%` }}
        />
      </div>
    </div>
  )
}

export default function OrderBookPanel({ inputAmount = 0, sourceToken, onSelectionChange }) {
  const [sortMode, setSortMode] = useState('best_price') // 'best_price' | 'best_fill'

  // Filter orders by source token if provided
  const availableOrders = useMemo(() => {
    if (!sourceToken) return orderBookData.sellOrders
    return orderBookData.sellOrders.filter(
      order => order.token === sourceToken.symbol || !sourceToken.symbol
    )
  }, [sourceToken])

  // Calculate selection based on input amount (whole orders only)
  const { selectedOrders, totalSavings, totalCost, cnpyReceived, fillPercentage, gap, isFullyFilled } = useMemo(
    () => calculateOrderSelection(availableOrders, inputAmount, sortMode),
    [availableOrders, inputAmount, sortMode]
  )

  // Notify parent of selection changes
  useEffect(() => {
    onSelectionChange?.({
      totalCost,
      cnpyReceived,
      totalSavings,
      selectedCount: selectedOrders.length,
      isFullyFilled
    })
  }, [totalCost, cnpyReceived, totalSavings, selectedOrders.length, isFullyFilled, onSelectionChange])

  // Create a set of selected order IDs for quick lookup
  const selectedOrderIds = new Set(selectedOrders.map(o => o.id))

  // Get all orders for display, sorted by current mode
  const displayOrders = useMemo(() => {
    const sorted = [...availableOrders].sort((a, b) => {
      if (sortMode === 'best_price') {
        return a.price - b.price
      }
      return b.amount - a.amount
    })
    return sorted
  }, [availableOrders, sortMode])

  return (
    <Card className="p-4">
      {/* Header with tabs */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1 p-1 bg-muted/50 rounded-lg">
          <button
            onClick={() => setSortMode('best_price')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-150 ${
              sortMode === 'best_price'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Best price
          </button>
          <button
            onClick={() => setSortMode('best_fill')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-150 ${
              sortMode === 'best_fill'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Best fill
          </button>
        </div>
      </div>

      {/* Progress bar - only shown when there's an amount */}
      {inputAmount > 0 && (
        <FillProgressBar 
          totalSelected={totalCost}
          targetAmount={inputAmount}
          fillPercentage={fillPercentage}
          gap={gap}
        />
      )}

      {/* Order list */}
      <div className="space-y-2 max-h-[280px] overflow-y-auto">
        {displayOrders.map((order, index) => {
          const selectedOrder = selectedOrders.find(o => o.id === order.id)
          const isSelected = selectedOrderIds.has(order.id)

          return (
            <OrderRow
              key={order.id}
              order={selectedOrder || order}
              isSelected={isSelected}
              index={index}
            />
          )
        })}
      </div>

      {/* Summary footer */}
      {inputAmount > 0 && selectedOrders.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingDown className={`w-4 h-4 transition-colors duration-300 ${
                  isFullyFilled ? 'text-green-500' : 'text-amber-500'
                }`} />
                <span>
                  {selectedOrders.length} order{selectedOrders.length !== 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Pay ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} → Get {cnpyReceived.toLocaleString()} CNPY
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-green-500">
                +${totalSavings.toFixed(2)} saved
              </p>
              {gap > 1 && (
                <p className="text-xs text-amber-500">
                  ${gap.toFixed(2)} unused
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* No orders can fit */}
      {inputAmount > 0 && selectedOrders.length === 0 && (
        <div className="mt-4 pt-4 border-t border-border text-center text-sm text-muted-foreground">
          No orders small enough to fit your amount
        </div>
      )}

      {/* Prompt to enter amount */}
      {(!inputAmount || inputAmount <= 0) && (
        <div className="mt-4 pt-4 border-t border-border text-center text-sm text-muted-foreground">
          Enter an amount above to see available orders
        </div>
      )}
    </Card>
  )
}
