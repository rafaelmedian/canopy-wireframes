import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit, Clock, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function ReviewCountdownPanel({ chainData, onCountdownComplete }) {
  const navigate = useNavigate()
  const [timeRemaining, setTimeRemaining] = useState(30)

  const progress = ((30 - timeRemaining) / 30) * 100

  useEffect(() => {
    if (timeRemaining <= 0) {
      onCountdownComplete()
      return
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining, onCountdownComplete])

  const handleEdit = () => {
    // Navigate back to review page to edit with state flag
    navigate('/launchpad/review', { state: { fromReviewCountdown: true } })
  }

  const formatTime = (seconds) => {
    return `${seconds}s`
  }

  return (
    <Card className="p-6 sticky top-6 bg-gradient-to-br from-orange-500/10 to-amber-500/10 border-orange-500/50">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold">Review Period</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            You have {formatTime(timeRemaining)} to review and edit your chain before it launches
          </p>
        </div>

        {/* Countdown Circle */}
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            {/* Background circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted/20"
              />
              {/* Progress circle */}
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
                className="text-orange-500 transition-all duration-1000 ease-linear"
                strokeLinecap="round"
              />
            </svg>
            {/* Timer text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs text-muted-foreground mb-1">publish on</span>
              <span className="text-3xl font-bold text-orange-500">{timeRemaining}</span>
            </div>
          </div>
        </div>

        {/* Info Alert */}
        <Card className="p-4 bg-background/50 border-orange-500/20">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Last chance to edit</p>
              <p className="text-xs text-muted-foreground">
                Once the countdown ends, your chain will be launched and settings cannot be changed.
              </p>
            </div>
          </div>
        </Card>

        {/* Edit Button */}
        <div>
          <Button
            className="w-full gap-2"
            variant="outline"
            onClick={handleEdit}
          >
            <Edit className="w-4 h-4" />
            Edit Chain Configuration
          </Button>
        </div>
      </div>
    </Card>
  )
}
