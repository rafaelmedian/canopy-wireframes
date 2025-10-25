import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function DraftProgressPanel({ chainData }) {
  const navigate = useNavigate()
  const { currentStep, totalSteps, completedSteps } = chainData

  const progress = (currentStep / totalSteps) * 100

  const allSteps = [
    { number: 1, name: 'Language Selection', route: '/launchpad/language' },
    { number: 2, name: 'Repository Connection', route: '/launchpad/repository' },
    { number: 3, name: 'Chain Configuration', route: '/launchpad/configure' },
    { number: 4, name: 'Branding', route: '/launchpad/branding' },
    { number: 5, name: 'Links & Documentation', route: '/launchpad/links' },
    { number: 6, name: 'Launch Settings', route: '/launchpad/settings' },
    { number: 7, name: 'Review & Payment', route: '/launchpad/review' }
  ]

  const handleContinue = () => {
    // Navigate to next incomplete step
    const nextStep = allSteps[currentStep]
    if (nextStep) {
      navigate(nextStep.route)
    }
  }

  return (
    <Card className="p-6 sticky top-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Launch Progress</h3>
          <p className="text-sm text-muted-foreground">
            You're on step {currentStep + 1} of {totalSteps}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-right">
            {Math.round(progress)}% complete
          </p>
        </div>

        {/* Steps List */}
        <div className="space-y-3">
          {allSteps.map((step) => {
            const isCompleted = step.number <= currentStep
            const isCurrent = step.number === currentStep + 1

            return (
              <div
                key={step.number}
                className={`flex items-start gap-3 ${
                  isCurrent ? 'text-foreground' : isCompleted ? 'text-muted-foreground' : 'text-muted-foreground/50'
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${isCurrent ? 'font-medium' : ''}`}>
                    {step.name}
                  </p>
                  {isCurrent && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Current step
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t">
          <Button
            className="w-full gap-2"
            onClick={handleContinue}
          >
            Continue Setup
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Info Note */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            Complete all steps and make your initial purchase to launch your chain. Your configuration is automatically saved as you progress.
          </p>
        </div>
      </div>
    </Card>
  )
}
