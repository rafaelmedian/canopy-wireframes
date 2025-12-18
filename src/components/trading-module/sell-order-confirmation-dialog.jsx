import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { X, AlertTriangle, Clock } from 'lucide-react'

export default function SellOrderConfirmationDialog({ 
  open, 
  onClose,
  onConfirm,
  cnpyAmount,
  pricePerCnpy,
  destinationToken,
  expectedReceive,
  fee,
  feeAmount
}) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        setIsAnimating(true)
      })
    } else {
      setIsAnimating(false)
    }
  }, [open])

  // Calculate dynamic fill time estimate based on price
  const getEstimatedFillTime = () => {
    if (!pricePerCnpy) return '2-4 hours'
    
    if (pricePerCnpy >= 1.95) return '4-8 hours'
    if (pricePerCnpy >= 1.90) return '1-2 hours'
    if (pricePerCnpy >= 1.84) return '30-60 min'
    return '< 30 min'
  }

  const estimatedFillTime = getEstimatedFillTime()

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/80 z-10 transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Confirmation Content */}
      <div 
        className={`absolute inset-x-0 bottom-0 z-20 bg-background rounded-t-2xl transition-transform duration-300 ease-out ${
          isAnimating ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>

        <div className="p-6 pt-4 pb-4">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Clock className="w-7 h-7 text-yellow-500" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-1.5 mb-4">
            <h2 className="text-xl font-bold">
              Create Sell Order
            </h2>
            <p className="text-sm text-muted-foreground">
              Your order will be posted to the order book
            </p>
          </div>
        </div>

        {/* Order Details */}
        <div className="px-6 space-y-3 pb-4">
          {/* Amount */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Selling</span>
              <span className="text-sm font-semibold">{cnpyAmount.toLocaleString()} CNPY</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Price</span>
              <span className="text-sm font-semibold">${pricePerCnpy.toFixed(3)}/CNPY</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-sm text-muted-foreground">You receive (if filled)</span>
              <span className="text-base font-bold">
                ${expectedReceive.toFixed(2)} {destinationToken?.symbol || ''}
              </span>
            </div>
          </div>

          {/* Fee */}
          <div className="flex items-center justify-between py-2 border-t border-border">
            <span className="text-sm text-muted-foreground">Fee</span>
            <div className="text-right">
              {fee > 0 ? (
                <p className="text-sm font-semibold">
                  ${feeAmount.toFixed(2)} ({(fee * 100).toFixed(1)}%)
                </p>
              ) : (
                <p className="text-sm font-semibold text-green-500">No fees</p>
              )}
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-medium text-yellow-500 mb-1">Order may not fill immediately</p>
              <p className="text-xs text-muted-foreground">
                Your order will remain active until filled or cancelled. Estimated fill time: {estimatedFillTime}.
              </p>
            </div>
          </div>
        </div>

        {/* Confirm Button */}
        <div className="p-6 pt-4">
          <Button 
            className="w-full h-11 text-base"
            size="lg"
            onClick={onConfirm}
          >
            Confirm Order
          </Button>
        </div>
      </div>
    </>
  )
}
