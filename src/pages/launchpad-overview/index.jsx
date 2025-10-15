import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function LaunchpadOverview() {
  const navigate = useNavigate()

  const handleGetStarted = () => {
    navigate('/launchpad/language')
  }

  const handleClose = () => {
    navigate('/')
  }

  const steps = [
    'Choose your favorite programming language',
    'Fork our template to your GitHub',
    'Customize it with your unique features (Optional - you can use it as-is!)',
    'Come back here and connect your repository',
    'Configure your chain details and launch!'
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <img
            src="/svg/logo.svg"
            alt="Canopy"
            className="h-4 invert"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">
              Let's Get Your Chain Ready!
            </h1>
            <p className="text-lg text-muted-foreground">
              Before you can launch, you'll need to set up your code. Don't worry - we'll guide you through it!
            </p>
          </div>

          {/* Steps Card */}
          <Card>
            <CardHeader>
              <CardTitle>Here's what you'll do:</CardTitle>
              <CardDescription>
                Follow these simple steps to launch your blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 list-decimal list-inside">
                {steps.map((step, index) => (
                  <li key={index} className="text-muted-foreground">
                    <span className="font-medium text-foreground ml-2">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Action Section */}
          <div className="flex justify-end">
            <Button
              onClick={handleGetStarted}
              size="lg"
            >
              Let's Get Started
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}