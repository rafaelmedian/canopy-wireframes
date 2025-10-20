import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { useNavigate } from 'react-router-dom'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Users, TrendingUp, Zap, Target, Sparkles, Crown, Trophy } from 'lucide-react'

export default function ChainCard({ chain }) {
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
  const displayedMilestones = completedMilestones.slice(0, 4) // Show fewer in grid view
  const remainingCount = completedMilestones.length - 4

  // Generate mini chart data
  const chartData = Array.from({ length: 20 }, (_, i) => ({
    value: chain.currentPrice + (Math.random() - 0.5) * (chain.currentPrice * 0.15)
  }))

  const handleClick = () => {
    navigate(chain.url)
  }

  return (
    <Card
      onClick={handleClick}
      className="p-4 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all group"
    >
      <div className="space-y-3">
        {/* Logo and Name */}
        <div className="flex items-center gap-3">
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
              <span className="text-sm font-bold text-black">
                {chain.ticker[0]}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-semibold truncate">{chain.name}</h3>

              {/* Milestone Badges */}
              {completedMilestones.length > 0 && (
                <TooltipProvider>
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    {displayedMilestones.map((milestone) => {
                      const Icon = milestone.icon
                      return (
                        <Tooltip key={milestone.id}>
                          <TooltipTrigger asChild>
                            <div className="relative w-3.5 h-3.5 flex items-center justify-center cursor-help">
                              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                                <polygon
                                  points="50 0, 93.3 25, 93.3 75, 50 100, 6.7 75, 6.7 25"
                                  className="fill-primary/20 stroke-primary"
                                  strokeWidth="4"
                                />
                              </svg>
                              <Icon className="w-1.5 h-1.5 relative z-10 text-primary" />
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
                          <div className="relative w-3.5 h-3.5 flex items-center justify-center cursor-help">
                            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                              <polygon
                                points="50 0, 93.3 25, 93.3 75, 50 100, 6.7 75, 6.7 25"
                                className="fill-primary/20 stroke-primary"
                                strokeWidth="4"
                              />
                            </svg>
                            <span className="text-[6px] font-bold relative z-10 text-primary">
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
            <p className="text-xs text-muted-foreground">${chain.ticker}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 h-8">
          {chain.description}
        </p>

        {/* Progress */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              ${(chain.marketCap / 1000).toFixed(1)}k / ${(chain.goal / 1000).toFixed(0)}k
            </span>
            {chain.change24h && (
              <span className={chain.change24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                {chain.change24h >= 0 ? '+' : ''}{chain.change24h}%
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
