import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Users, TrendingUp, ArrowRightLeft, Trophy } from 'lucide-react'

// Icon mapping for milestone types
const MILESTONE_ICONS = {
  holders: Users,
  transactions: ArrowRightLeft,
  marketcap: TrendingUp
}

export default function MilestonesTab({ chainData, isOwner = false }) {
  // Get milestones from chainData (comes from database with current values already calculated)
  const milestones = (chainData.milestones || []).map(milestone => ({
    ...milestone,
    icon: MILESTONE_ICONS[milestone.type] || Trophy
  }))

  // Calculate progress for each milestone
  const getMilestoneStatus = (milestone) => {
    const progress = Math.min((milestone.current / milestone.requirement) * 100, 100)
    const isCompleted = milestone.completed || progress >= 100
    // Only lock milestones for owner chains (simplified - you can enhance this logic)
    const isLocked = false

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
