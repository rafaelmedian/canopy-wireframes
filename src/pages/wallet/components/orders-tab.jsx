import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit2, X, Clock, CheckCircle, XCircle, Filter } from 'lucide-react'

export default function OrdersTab() {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('all') // 'all', 'active', 'filled', 'cancelled'

  useEffect(() => {
    // Load orders from localStorage
    try {
      const stored = localStorage.getItem('userSellOrders')
      const loadedOrders = stored ? JSON.parse(stored) : []
      setOrders(loadedOrders)
    } catch (e) {
      console.error('Failed to load orders', e)
      setOrders([])
    }
  }, [])

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true
    return order.status === filter
  })

  const handleCancel = (order) => {
    const updatedOrders = orders.map(o => 
      o.id === order.id ? { ...o, status: 'cancelled' } : o
    )
    setOrders(updatedOrders)
    try {
      localStorage.setItem('userSellOrders', JSON.stringify(updatedOrders))
    } catch (e) {
      console.error('Failed to update orders', e)
    }
  }

  const handleEdit = (order) => {
    // TODO: Implement edit functionality - navigate to convert tab with pre-filled values
    console.log('Edit order', order)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'filled':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-yellow-500 bg-yellow-500/10'
      case 'filled':
        return 'text-green-500 bg-green-500/10'
      case 'cancelled':
        return 'text-red-500 bg-red-500/10'
      default:
        return 'text-muted-foreground bg-muted'
    }
  }

  if (orders.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
            <p className="text-sm text-muted-foreground">
              Create a sell order in the Convert tab to see it here
            </p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filter Buttons */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <div className="flex gap-2">
          {['all', 'active', 'filled', 'cancelled'].map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(status)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>
        <div className="ml-auto text-sm text-muted-foreground">
          {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                {/* Header */}
                <div className="flex items-center gap-3">
                  {getStatusIcon(order.status)}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-semibold">
                        {order.cnpyAmount.toLocaleString()} CNPY
                      </span>
                      <span className="text-muted-foreground">→</span>
                      <span className="text-base font-medium">
                        ${order.expectedReceive.toFixed(2)} {order.destinationToken}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>Price: ${order.pricePerCnpy.toFixed(3)}/CNPY</span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                      <span className="capitalize">{order.destinationChain}</span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                      <span>
                        {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                {/* Details */}
                <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Fee</p>
                    <p className="font-medium">${order.feeAmount.toFixed(2)} ({(order.fee * 100).toFixed(1)}%)</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Expected Receive</p>
                    <p className="font-medium">${order.expectedReceive.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Order ID</p>
                    <p className="font-mono text-xs">{order.id.slice(-8)}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {order.status === 'active' && (
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(order)}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    onClick={() => handleCancel(order)}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
