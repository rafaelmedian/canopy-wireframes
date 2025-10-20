import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  TrendingUp,
  Zap,
  Award,
  Target,
  Rocket,
  Crown,
  Star,
  Sparkles,
  Trophy
} from 'lucide-react'

export default function MilestonesTab({ chainData, isOwner = false }) {
  // Define all milestones with their requirements
  const milestones = [
    {
      id: 1,
      icon: Users,
      title: 'First 10 holders',
      description: 'Reach 10 unique token holders',
      requirement: 10,
      current: chainData.holderCount || 0,
      type: 'holders'
    },
    {
      id: 2,
      icon: TrendingUp,
      title: '$1k market cap',
      description: 'Achieve $1,000 in market capitalization',
      requirement: 1000,
      current: chainData.marketCap || 0,
      type: 'marketcap'
    },
    {
      id: 3,
      icon: Users,
      title: '50 holders milestone',
      description: 'Build a community of 50 token holders',
      requirement: 50,
      current: chainData.holderCount || 0,
      type: 'holders'
    },
    {
      id: 4,
      icon: Zap,
      title: '1,000 transactions',
      description: 'Process 1,000 total transactions',
      requirement: 1000,
      current: chainData.explorer?.totalTransactions || 0,
      type: 'transactions'
    },
    {
      id: 5,
      icon: TrendingUp,
      title: '$5k market cap',
      description: 'Reach $5,000 market capitalization',
      requirement: 5000,
      current: chainData.marketCap || 0,
      type: 'marketcap'
    },
    {
      id: 6,
      icon: Users,
      title: '100 holders club',
      description: 'Join the 100 holders club',
      requirement: 100,
      current: chainData.holderCount || 0,
      type: 'holders'
    },
    {
      id: 7,
      icon: Target,
      title: '$10k market cap',
      description: 'Hit $10,000 in market cap',
      requirement: 10000,
      current: chainData.marketCap || 0,
      type: 'marketcap'
    },
    {
      id: 8,
      icon: Sparkles,
      title: '500 holders strong',
      description: 'Grow to 500 token holders',
      requirement: 500,
      current: chainData.holderCount || 0,
      type: 'holders'
    },
    {
      id: 9,
      icon: Crown,
      title: '$25k market cap',
      description: 'Achieve $25,000 market cap',
      requirement: 25000,
      current: chainData.marketCap || 0,
      type: 'marketcap'
    },
    {
      id: 10,
      icon: Trophy,
      title: 'Graduation ready',
      description: 'Reach $50,000 and graduate to mainnet',
      requirement: 50000,
      current: chainData.marketCap || 0,
      type: 'marketcap'
    }
  ]

  // Calculate progress for each milestone
  const getMilestoneStatus = (milestone) => {
    const progress = Math.min((milestone.current / milestone.requirement) * 100, 100)
    const isCompleted = progress >= 100
    const isLocked = milestone.id > 1 && milestones[milestone.id - 2].current < milestones[milestone.id - 2].requirement

    return { progress, isCompleted, isLocked }
  }

  const formatValue = (value, type) => {
    if (type === 'marketcap') {
      return `$${value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value}`
    }
    return value.toLocaleString()
  }

  return (
    <Card className="p-6 mt-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-1">Chain Milestones</h3>
        <p className="text-sm text-muted-foreground">
          {isOwner ? 'Unlock achievements as your blockchain grows' : 'Track this blockchain\'s achievements and progress'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {milestones.map((milestone) => {
          const { progress, isCompleted, isLocked } = getMilestoneStatus(milestone)
          const Icon = milestone.icon

          return (
            <Card
              key={milestone.id}
              className={`p-6 ${
                isLocked ? 'opacity-50' : ''
              } ${isCompleted ? 'border-primary/50 bg-primary/5' : ''}`}
            >
              {/* Header with badges */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  {isCompleted && (
                    <Badge variant="outline" className="border-green-500/50 text-green-500 text-xs">
                      Completed
                    </Badge>
                  )}
                </div>
                {isLocked && (
                  <Badge variant="outline" className="text-xs text-muted-foreground">
                    Locked
                  </Badge>
                )}
              </div>

              {/* Hexagonal badge with icon */}
              <div className="flex flex-col items-center mb-4">
                <div className={`relative w-24 h-24 flex items-center justify-center ${
                  isLocked ? 'opacity-30' : ''
                }`}>
                  {/* Hexagon SVG */}
                  <svg
                    viewBox="0 0 100 100"
                    className="absolute inset-0 w-full h-full"
                  >
                    <polygon
                      points="50 0, 93.3 25, 93.3 75, 50 100, 6.7 75, 6.7 25"
                      className={`${
                        isCompleted
                          ? 'fill-primary/20 stroke-primary'
                          : 'fill-muted/50 stroke-border'
                      }`}
                      strokeWidth="2"
                    />
                  </svg>
                  {/* Icon */}
                  <Icon
                    className={`w-10 h-10 relative z-10 ${
                      isCompleted ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  />
                </div>
              </div>

              {/* Title and description */}
              <div className="text-center mb-4">
                <h4 className="font-semibold text-base mb-1">{milestone.title}</h4>
                <p className="text-sm text-muted-foreground">{milestone.description}</p>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {formatValue(milestone.current, milestone.type)} of {formatValue(milestone.requirement, milestone.type)}
                  </span>
                  <span className="font-medium">{progress.toFixed(0)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </Card>
          )
        })}
      </div>
    </Card>
  )
}
