import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { ChevronDown, Edit2, X, ExternalLink } from 'lucide-react'

export default function YourOrdersCard({ orders = [], onEdit, onCancel, onViewAll }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [orderToCancel, setOrderToCancel] = useState(null)

  if (!orders || orders.length === 0) {
    return null
  }

  return (
    <Card className="mt-4 p-4">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm font-semibold hover:text-foreground transition-colors"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
            <span>Your Orders</span>
            <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
              {orders.length}
            </span>
          </button>
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              View all
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Orders List */}
        {isExpanded && (
          <div className="space-y-2 pt-2 border-t border-border">
            {orders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold">
                      {order.cnpyAmount.toLocaleString()} CNPY
                    </span>
                    <span className="text-xs text-muted-foreground">→</span>
                    <span className="text-sm font-medium">
                      ${order.expectedReceive.toFixed(2)} {order.destinationToken}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>Price: ${order.pricePerCnpy.toFixed(3)}/CNPY</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                    <span className={`${
                      order.status === 'active' ? 'text-green-500' : 
                      order.status === 'pending' ? 'text-yellow-500' : 
                      'text-muted-foreground'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => onEdit(order)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  )}
                  {onCancel && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      onClick={() => setOrderToCancel(order)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {orders.length > 3 && (
              <p className="text-xs text-center text-muted-foreground pt-2">
                +{orders.length - 3} more orders
              </p>
            )}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={!!orderToCancel} onOpenChange={(open) => !open && setOrderToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this order for {orderToCancel?.cnpyAmount.toLocaleString()} CNPY?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Order</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => { 
                onCancel(orderToCancel)
                setOrderToCancel(null)
              }} 
              className="bg-red-500 hover:bg-red-600"
            >
              Cancel Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
