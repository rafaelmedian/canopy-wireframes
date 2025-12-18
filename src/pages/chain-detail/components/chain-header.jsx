import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card } from '@/components/ui/card.jsx'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip.jsx'
import { Upload, Star, Flag } from 'lucide-react'
import { toast } from 'sonner'
import { getCompletedMilestones } from '@/utils/milestones'

export default function ChainHeader({ chainData }) {
  const [isFavorited, setIsFavorited] = useState(false)

  const handleShare = () => {
    // Copy chain URL to clipboard
    navigator.clipboard.writeText(window.location.href)
    toast.success('Chain link copied to clipboard!')
  }

  // Get completed milestones from chainData with icons
  const completedMilestones = getCompletedMilestones(chainData.milestones || [])
  const displayedMilestones = completedMilestones.slice(0, 6)
  const remainingCount = completedMilestones.length - 6

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Logo Placeholder */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: chainData.brandColor || '#10b981' }}
          >
            <span className="text-sm font-bold text-black">
              {chainData.ticker[0]}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-medium">{chainData.name}</h2>

              {/* Flag Badge - Show if chain has flags */}
              {chainData.flag && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center cursor-help">
                        <Flag
                          className={`w-4 h-4 ${
                            chainData.flag.severity === 'critical' ? 'text-red-500 fill-red-500/20' :
                            chainData.flag.severity === 'warning' ? 'text-yellow-500 fill-yellow-500/20' :
                            'text-blue-500 fill-blue-500/20'
                          }`}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium">{chainData.flag.reason}</p>
                      <p className="text-xs text-muted-foreground mt-1">{chainData.flag.count} community flag{chainData.flag.count !== 1 ? 's' : ''}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

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
