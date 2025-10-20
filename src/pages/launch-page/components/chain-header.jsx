import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Upload, Star, Users, TrendingUp, Zap, Target, Sparkles, Crown, Trophy } from 'lucide-react'
import { toast } from 'sonner'

export default function ChainHeader({ chainData }) {
  const [isFavorited, setIsFavorited] = useState(false)

  const handleShare = () => {
    // Copy chain URL to clipboard
    navigator.clipboard.writeText(window.location.href)
    toast.success('Chain link copied to clipboard!')
  }

  // Define all milestones with their requirements
  const milestones = [
    {
      id: 1,
      icon: Users,
      title: 'First 10 holders',
      requirement: 10,
      current: chainData.holderCount || 0,
      type: 'holders'
    },
    {
      id: 2,
      icon: TrendingUp,
      title: '$1k market cap',
      requirement: 1000,
      current: chainData.marketCap || 0,
      type: 'marketcap'
    },
    {
      id: 3,
      icon: Users,
      title: '50 holders milestone',
      requirement: 50,
      current: chainData.holderCount || 0,
      type: 'holders'
    },
    {
      id: 4,
      icon: Zap,
      title: '1,000 transactions',
      requirement: 1000,
      current: chainData.explorer?.totalTransactions || 0,
      type: 'transactions'
    },
    {
      id: 5,
      icon: TrendingUp,
      title: '$5k market cap',
      requirement: 5000,
      current: chainData.marketCap || 0,
      type: 'marketcap'
    },
    {
      id: 6,
      icon: Users,
      title: '100 holders club',
      requirement: 100,
      current: chainData.holderCount || 0,
      type: 'holders'
    },
    {
      id: 7,
      icon: Target,
      title: '$10k market cap',
      requirement: 10000,
      current: chainData.marketCap || 0,
      type: 'marketcap'
    },
    {
      id: 8,
      icon: Sparkles,
      title: '500 holders strong',
      requirement: 500,
      current: chainData.holderCount || 0,
      type: 'holders'
    },
    {
      id: 9,
      icon: Crown,
      title: '$25k market cap',
      requirement: 25000,
      current: chainData.marketCap || 0,
      type: 'marketcap'
    },
    {
      id: 10,
      icon: Trophy,
      title: 'Graduation ready',
      requirement: 50000,
      current: chainData.marketCap || 0,
      type: 'marketcap'
    }
  ]

  // Get completed milestones
  const completedMilestones = milestones.filter(m => m.current >= m.requirement)
  const displayedMilestones = completedMilestones.slice(0, 6)
  const remainingCount = completedMilestones.length - 6

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Logo Placeholder */}
          <div className="w-8 h-8 rounded-full bg-[#10b981] flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-black">
              {chainData.ticker[0]}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-medium">{chainData.name}</h2>

              {/* Milestone Badges */}
              {completedMilestones.length > 0 && (
                <TooltipProvider>
                  <div className="flex items-center gap-1">
                    {displayedMilestones.map((milestone) => {
                      const Icon = milestone.icon
                      return (
                        <Tooltip key={milestone.id}>
                          <TooltipTrigger asChild>
                            <div className="relative w-5 h-5 flex items-center justify-center cursor-help">
                              {/* Hexagon SVG */}
                              <svg
                                viewBox="0 0 100 100"
                                className="absolute inset-0 w-full h-full"
                              >
                                <polygon
                                  points="50 0, 93.3 25, 93.3 75, 50 100, 6.7 75, 6.7 25"
                                  className="fill-primary/20 stroke-primary"
                                  strokeWidth="4"
                                />
                              </svg>
                              {/* Icon */}
                              <Icon className="w-2.5 h-2.5 relative z-10 text-primary" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{milestone.title}</p>
                          </TooltipContent>
                        </Tooltip>
                      )
                    })}

                    {/* Remaining count badge */}
                    {remainingCount > 0 && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="relative w-5 h-5 flex items-center justify-center cursor-help">
                            {/* Hexagon SVG */}
                            <svg
                              viewBox="0 0 100 100"
                              className="absolute inset-0 w-full h-full"
                            >
                              <polygon
                                points="50 0, 93.3 25, 93.3 75, 50 100, 6.7 75, 6.7 25"
                                className="fill-primary/20 stroke-primary"
                                strokeWidth="4"
                              />
                            </svg>
                            {/* Count */}
                            <span className="text-[8px] font-bold relative z-10 text-primary">
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
            <p className="text-xs text-gray-400">
              ${chainData.ticker} on {chainData.name} • {chainData.isDraft ? 'edited' : 'created'} 13m ago
            </p>
          </div>
        </div>

        {!chainData.isDraft && (
          <div className="flex items-center gap-3">
            {/* Favorite Button */}
            <Button
              variant="outline"
              size="icon"
              className="h-[30px] w-[30px] rounded-lg"
              onClick={() => setIsFavorited(!isFavorited)}
            >
              <Star className={`w-4 h-4 ${isFavorited ? 'fill-yellow-500 text-yellow-500' : ''}`} />
            </Button>

            {/* Share Button */}
            <Button
              variant="outline"
              size="icon"
              className="h-[30px] w-[30px] rounded-lg"
              onClick={handleShare}
            >
              <Upload className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
