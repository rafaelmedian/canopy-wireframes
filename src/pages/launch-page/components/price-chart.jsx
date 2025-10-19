import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function PriceChart({ chainData }) {
  const graduationProgress = chainData.isGraduated
    ? 100
    : (chainData.marketCap / chainData.graduationThreshold) * 100

  return (
    <Card className="p-1">
      <div className="space-y-2">
        {/* Top Section: Marketcap and Graduation */}
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: Marketcap */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Marketcap</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-semibold">${(chainData.marketCap / 1000).toFixed(0)}k</h3>
              {chainData.priceChange24h !== 0 && (
                <span className="text-xs text-muted-foreground">+${chainData.priceChange24h}</span>
              )}
            </div>
          </div>

          {/* Right: Graduation Progress */}
          <div className="space-y-2 w-[216px]">
            <p className="text-xs text-muted-foreground text-right">
              {chainData.isGraduated
                ? `$${(chainData.graduationThreshold / 1000).toFixed(0)}k graduated`
                : `$${(chainData.remainingToGraduation / 1000).toFixed(2)}k until graduation`
              }
            </p>
            <Progress value={graduationProgress} className="h-2.5" />
          </div>
        </div>

        {/* Chart Section */}
        <Card className="relative h-[272px] bg-muted/40">
          {/* Time Period Buttons */}
          <div className="absolute left-4 top-2.5 z-10 flex gap-0.5 p-0.5 bg-muted/50 rounded-lg">
            <Button variant="ghost" size="sm" className="h-8 text-xs px-3">1H</Button>
            <Button variant="secondary" size="sm" className="h-8 text-xs px-3">1D</Button>
            <Button variant="ghost" size="sm" className="h-8 text-xs px-3">1W</Button>
            <Button variant="ghost" size="sm" className="h-8 text-xs px-3">1M</Button>
            <Button variant="ghost" size="sm" className="h-8 text-xs px-3">1Y</Button>
            <Button variant="ghost" size="sm" className="h-8 text-xs px-3">ALL</Button>
          </div>

          {/* Chart */}
          <div className="h-full pt-12">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chainData.priceHistory}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                <XAxis
                  dataKey="time"
                  tick={{ fill: '#71717a', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
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
                <span className="font-medium">${chainData.mcap}</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs text-muted-foreground">Virtual Liq</span>
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
