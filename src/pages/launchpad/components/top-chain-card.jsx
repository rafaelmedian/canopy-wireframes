import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Users, TrendingUp, Zap, Target, Sparkles, Crown, Trophy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function TopChainCard({ chain }) {
  const navigate = useNavigate()
  const progress = (chain.marketCap / chain.goal) * 100

  // Define milestones
  const milestones = [
    { id: 1, icon: Users, title: 'First 10 holders', requirement: 10, current: chain.holderCount || 0 },
    { id: 2, icon: TrendingUp, title: '$1k market cap', requirement: 1000, current: chain.marketCap || 0 },
    { id: 3, icon: Users, title: '50 holders milestone', requirement: 50, current: chain.holderCount || 0 },
    { id: 4, icon: Zap, title: '1,000 transactions', requirement: 1000, current: 0 },
    { id: 5, icon: TrendingUp, title: '$5k market cap', requirement: 5000, current: chain.marketCap || 0 },
    { id: 6, icon: Users, title: '100 holders club', requirement: 100, current: chain.holderCount || 0 },
    { id: 7, icon: Target, title: '$10k market cap', requirement: 10000, current: chain.marketCap || 0 },
    { id: 8, icon: Sparkles, title: '500 holders strong', requirement: 500, current: chain.holderCount || 0 },
    { id: 9, icon: Crown, title: '$25k market cap', requirement: 25000, current: chain.marketCap || 0 },
    { id: 10, icon: Trophy, title: 'Graduation ready', requirement: 50000, current: chain.marketCap || 0 }
  ]

  const completedMilestones = milestones.filter(m => m.current >= m.requirement)
  const displayedMilestones = completedMilestones.slice(0, 6)
  const remainingCount = completedMilestones.length - 6

  // Helper function to get avatar color
  const getAvatarColor = (index) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-orange-500'
    ]
    return colors[index % colors.length]
  }

  // Generate weekly trend chart data
  const chartData = chain.priceHistory || Array.from({ length: 50 }, (_, i) => {
    const baseValue = chain.currentPrice * 0.6 // Start lower
    const growthFactor = (i / 50) * 0.8 // Strong upward trend
    const volatility = (Math.sin(i / 3) + Math.random() - 0.5) * 0.15 // Add volatility
    return {
      value: baseValue + (chain.currentPrice * growthFactor) + (chain.currentPrice * volatility)
    }
  })

  return (
    <Card
      className="p-6 pb-0 bg-gradient-to-br from-card to-muted/20 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
      onClick={() => navigate(chain.url)}
    >
      <div className="grid grid-cols-[1fr_400px] gap-8">
        {/* Left Side: Info */}
        <div className="space-y-6">
          {/* Header: Logo, Name, Created */}
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: chain.brandColor || '#10b981' }}
            >
              {chain.logo ? (
                <img
                  src={chain.logo}
                  alt={chain.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-base font-bold text-black">
                  {chain.ticker[0]}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium">${chain.ticker}</h3>

                {/* Milestone Badges */}
                {completedMilestones.length > 0 && (
                  <TooltipProvider>
                    <div className="flex items-center gap-1">
                      {displayedMilestones.map((milestone) => {
                        const Icon = milestone.icon
                        return (
                          <Tooltip key={milestone.id}>
                            <TooltipTrigger asChild>
                              <div className="relative w-4 h-4 flex items-center justify-center cursor-help">
                                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                                  <polygon
                                    points="50 0, 93.3 25, 93.3 75, 50 100, 6.7 75, 6.7 25"
                                    className="fill-primary/20 stroke-primary"
                                    strokeWidth="4"
                                  />
                                </svg>
                                <Icon className="w-2 h-2 relative z-10 text-primary" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{milestone.title}</p>
                            </TooltipContent>
                          </Tooltip>
                        )
                      })}

                      {remainingCount > 0 && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="relative w-4 h-4 flex items-center justify-center cursor-help">
                              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                                <polygon
                                  points="50 0, 93.3 25, 93.3 75, 50 100, 6.7 75, 6.7 25"
                                  className="fill-primary/20 stroke-primary"
                                  strokeWidth="4"
                                />
                              </svg>
                              <span className="text-[7px] font-bold relative z-10 text-primary">
                                +{remainingCount}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{remainingCount} more milestone{remainingCount > 1 ? 's' : ''}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TooltipProvider>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {chain.name} • created 29 mins ago
              </p>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold leading-tight">
            {chain.tagline || `${chain.name} on the blockchain`}
          </h2>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {chain.description || `Buy an initial chain supply with $700 in crypto on your take everything on-chain.`}
          </p>

          {/* Progress Bar with Label */}
          <div className="space-y-2">
            <Progress
              value={progress}
              className="h-3"
              style={{
                '--progress-foreground': chain.brandColor || '#10b981'
              }}
            />
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">
                ${(chain.marketCap / 1000).toFixed(0)}k / ${(chain.goal / 1000).toFixed(0)}k until graduation
              </span>
              {chain.change24h !== undefined && (
                <span className={chain.change24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                  {chain.change24h >= 0 ? '+' : ''}{chain.change24h}%
                </span>
              )}
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-6 pt-2 border-t border-border/50 pb-4">
            {/* Holder Avatars */}
            <div className="flex items-center">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`w-6 h-6 rounded-full border-2 border-card flex items-center justify-center text-[10px] font-semibold text-white ${getAvatarColor(i)}`}
                  >
                    {chain.ticker.slice(0, 1)}{i}
                  </div>
                ))}
              </div>
              <span className="ml-3 text-xs text-muted-foreground">
                {chain.holderCount || 0}+ all
              </span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-xs">
              <div>
                <span className="text-muted-foreground">VOL (24h) </span>
                <span className="font-medium">${((chain.volume || 0) / 1000).toFixed(1)}k</span>
              </div>
              <div>
                <span className="text-muted-foreground">MCap </span>
                <span className="font-medium">${((chain.marketCap || 0) / 1000).toFixed(1)}k</span>
              </div>
              <div>
                <span className="text-muted-foreground">Age </span>
                <span className="font-medium">{chain.age || '2d'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Chart */}
        <div className="flex items-center">
          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={chain.brandColor || '#10b981'}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>
  )
}
