import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card } from '@/components/ui/card.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.jsx'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { HelpCircle } from 'lucide-react'

export default function PriceChart({ chainData }) {
  const [selectedPeriod, setSelectedPeriod] = useState('1D')
  const [metricView, setMetricView] = useState('price') // For graduated chains: 'price', 'marketcap', 'volume'

  const graduationProgress = chainData.isGraduated
    ? 100
    : (chainData.marketCap / chainData.graduationThreshold) * 100

  const remainingToGraduation = chainData.graduationThreshold - chainData.marketCap

  // Generate chart data based on selected period
  const getChartData = () => {
    const basePrice = chainData.currentPrice
    const variation = basePrice * 0.15 // 15% variation

    switch (selectedPeriod) {
      case '1H':
        // Hourly data - every 5 minutes
        return Array.from({ length: 12 }, (_, i) => ({
          time: `${Math.floor(i * 5 / 60)}:${(i * 5 % 60).toString().padStart(2, '0')}`,
          price: basePrice + (Math.random() - 0.5) * variation
        }))

      case '1D':
        // Daily data - every 2 hours
        return (chainData.priceHistory && chainData.priceHistory.length > 0)
          ? chainData.priceHistory
          : Array.from({ length: 12 }, (_, i) => ({
              time: `${i * 2}:00`,
              price: basePrice + (Math.random() - 0.5) * variation
            }))

      case '1W':
        // Weekly data - daily
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        return days.map(day => ({
          time: day,
          price: basePrice + (Math.random() - 0.5) * variation
        }))

      case '1M':
        // Monthly data - every 3 days
        return Array.from({ length: 10 }, (_, i) => ({
          time: `${(i * 3) + 1}`,
          price: basePrice + (Math.random() - 0.5) * variation
        }))

      case '1Y':
        // Yearly data - monthly
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        return months.map(month => ({
          time: month,
          price: basePrice + (Math.random() - 0.5) * variation
        }))

      case 'ALL':
        // All time - quarterly or major milestones
        return Array.from({ length: 8 }, (_, i) => ({
          time: `Q${(i % 4) + 1} '${23 + Math.floor(i / 4)}`,
          price: basePrice * (0.3 + (i * 0.1)) // Show growth over time
        }))

      default:
        return chainData.priceHistory
    }
  }

  const chartData = getChartData()

  return (
    <Card className="p-1">
      <div className="space-y-2">
        {/* Top Section: Metrics Display */}
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: Metric Display */}
          {chainData.isGraduated ? (
            // Graduated chains: Show segmented control and selected metric
            <div className="space-y-2 flex-1">
              {/* Segmented Control */}
              <div className="flex gap-1 p-1 bg-muted/50 rounded-lg w-fit">
                <Button
                  variant={metricView === 'price' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="h-7 text-xs px-3"
                  onClick={() => setMetricView('price')}
                >
                  Price
                </Button>
                <Button
                  variant={metricView === 'marketcap' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="h-7 text-xs px-3"
                  onClick={() => setMetricView('marketcap')}
                >
                  Market Cap
                </Button>
                <Button
                  variant={metricView === 'volume' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="h-7 text-xs px-3"
                  onClick={() => setMetricView('volume')}
                >
                  Volume
                </Button>
              </div>

              {/* Selected Metric Value */}
              <div className="flex items-baseline gap-2">
                {metricView === 'price' && (
                  <>
                    <h3 className="text-2xl font-semibold">${chainData.currentPrice.toFixed(4)}</h3>
                    {chainData.priceChange24h !== 0 && (
                      <span className={`text-xs font-medium ${chainData.priceChange24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {chainData.priceChange24h > 0 ? '+' : ''}{chainData.priceChange24h}%
                      </span>
                    )}
                  </>
                )}
                {metricView === 'marketcap' && (
                  <h3 className="text-2xl font-semibold">${(chainData.marketCap / 1000).toFixed(1)}k</h3>
                )}
                {metricView === 'volume' && (
                  <>
                    <h3 className="text-2xl font-semibold">${(chainData.volume / 1000).toFixed(1)}k</h3>
                    <span className="text-xs text-muted-foreground">24h</span>
                  </>
                )}
              </div>
            </div>
          ) : (
            // Virtual chains: Show market cap (current behavior)
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Marketcap</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-semibold">${(chainData.marketCap / 1000).toFixed(0)}k</h3>
                {chainData.priceChange24h !== 0 && (
                  <span className="text-xs text-muted-foreground">+${chainData.priceChange24h}</span>
                )}
              </div>
            </div>
          )}

          {/* Right: Graduation Progress (only for virtual chains) */}
          {!chainData.isGraduated && (
            <div className="space-y-2 w-[216px]">
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-end gap-1.5 cursor-help">
                      <p className="text-xs text-muted-foreground text-right">
                        ${(remainingToGraduation / 1000).toFixed(1)}k until graduation
                      </p>
                      <HelpCircle className="w-3 h-3 text-muted-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-[260px]">
                    <p className="text-xs">
                      This chain starts as virtual (test mode). When market cap reaches ${(chainData.graduationThreshold / 1000).toFixed(0)}k, it will graduate to a real blockchain with permanent on-chain transactions.
                    </p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>
              <Progress value={graduationProgress} className="h-2.5" />
            </div>
          )}
        </div>

        {/* Chart Section */}
        <Card className="relative h-[272px] bg-muted/40">
          {/* Time Period Buttons */}
          <div className="absolute left-4 top-2.5 z-10 flex gap-0.5 p-0.5 bg-muted/50 rounded-lg">
            <Button
              variant={selectedPeriod === '1H' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8 text-xs px-3"
              onClick={() => setSelectedPeriod('1H')}
            >
              1H
            </Button>
            <Button
              variant={selectedPeriod === '1D' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8 text-xs px-3"
              onClick={() => setSelectedPeriod('1D')}
            >
              1D
            </Button>
            <Button
              variant={selectedPeriod === '1W' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8 text-xs px-3"
              onClick={() => setSelectedPeriod('1W')}
            >
              1W
            </Button>
            <Button
              variant={selectedPeriod === '1M' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8 text-xs px-3"
              onClick={() => setSelectedPeriod('1M')}
            >
              1M
            </Button>
            <Button
              variant={selectedPeriod === '1Y' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8 text-xs px-3"
              onClick={() => setSelectedPeriod('1Y')}
            >
              1Y
            </Button>
            <Button
              variant={selectedPeriod === 'ALL' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8 text-xs px-3"
              onClick={() => setSelectedPeriod('ALL')}
            >
              ALL
            </Button>
          </div>

          {/* Chart */}
          <div className="h-full pt-12 px-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                <XAxis
                  dataKey="time"
                  tick={{ fill: '#71717a', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  padding={{ left: 20, right: 20 }}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke={chainData.brandColor}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Live Updates Stats Bar */}
        <Card className="bg-muted/40">
          <div className="flex items-center gap-6 px-5 py-3.5">
            <p className="text-sm font-medium">Live updates</p>
            <div className="flex flex-1 items-center justify-between text-sm">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs text-muted-foreground">VOL (24h)</span>
                <span className="font-medium">${chainData.volume}</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs text-muted-foreground">MCap</span>
                <span className="font-medium">${(chainData.marketCap / 1000).toFixed(1)}k</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs text-muted-foreground">
                  {chainData.isGraduated ? 'Liquidity' : 'Virtual Liq'}
                </span>
                <span className="font-medium">${chainData.virtualLiq}</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs text-muted-foreground">HOLD</span>
                <span className="font-medium">{chainData.holderCount}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Card>
  )
}
