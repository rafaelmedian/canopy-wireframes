import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ArrowLeft, ArrowRight, X, Target, Coins, Info, HelpCircle, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import MainSidebar from '@/components/main-sidebar'
import LaunchpadSidebar from '@/components/launchpad-sidebar'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import {Badge} from "@/components/ui/badge.jsx";
import { useAutoSave } from '@/hooks/use-auto-save.js'
import { useLaunchFlow } from '@/contexts/launch-flow-context'
import PreviewSideSheet from '../components/preview-side-sheet'

export default function LaunchSettings() {
  const navigate = useNavigate()
  const { getFlowData, updateFlowData } = useLaunchFlow()

  // Initialize from context if available
  const savedSettings = getFlowData('launchSettings')
  const [initialPurchase, setInitialPurchase] = useState(
    savedSettings?.initialPurchase?.toString() || ''
  )
  const [showWhyBuy, setShowWhyBuy] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  // Check if repo is connected (from context)
  const repoConnected = getFlowData('links') ? true : false

  // Auto-save hook
  const { isSaving, lastSaved } = useAutoSave(
    [initialPurchase],
    repoConnected
  )

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const graduationThreshold = 50000 // Fixed at $50,000

  const handleBack = () => {
    navigate('/launchpad/links')
  }

  const handleContinue = () => {
    updateFlowData('launchSettings', {
      graduationThreshold,
      initialPurchase: initialPurchase ? parseFloat(initialPurchase) : 0
    })
    navigate('/launchpad/review')
  }

  const handleClose = () => {
    navigate('/')
  }

  return (
    <TooltipProvider>
      <div className="flex min-h-screen bg-background">
        <MainSidebar variant="compact" />
        <LaunchpadSidebar
          currentStep={6}
          completedSteps={[1, 2, 3, 4, 5]}
          repoConnected={repoConnected}
          isSaving={isSaving}
          lastSaved={lastSaved}
        />

        <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="flex justify-end p-2 border-b mb-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">
                Launch settings
              </h1>
              <p className="text-muted-foreground">
                Configure your chain's launch parameters
              </p>
            </div>

            {/* Form */}
            <div className="space-y-8">
              {/* Graduation Threshold */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-muted-foreground" />
                  <Label className="text-lg font-semibold">
                    Graduation Threshold
                  </Label>
                </div>
                <Card className="p-4">
                  <p className="text-muted-foreground">
                    Your chain becomes real at:{' '}
                    <span className="text-foreground font-bold text-lg">
                      ${graduationThreshold.toLocaleString()}
                    </span>
                  </p>
                </Card>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>
                    Your chain starts as a <span className="font-semibold text-foreground">virtual chain</span> —
                    a lightweight environment where users can buy and trade your tokens without the full blockchain infrastructure running yet.
                  </p>
                  <p>
                    Once total purchases reach <span className="font-semibold text-foreground">${graduationThreshold.toLocaleString()}</span>,
                    your chain <span className="font-semibold text-foreground">graduates</span>. At this point, we deploy
                    your repository and launch the full blockchain network, making it a real, operational chain on the Canopy ecosystem.
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Initial Purchase */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-muted-foreground" />
                  <Label className="text-lg font-semibold">
                    Initial Purchase{' '}
                  </Label>
                  <Badge variant="secondary" className="text-xs">Optional</Badge>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Buy tokens to show confidence.{' '}
                    <button
                      type="button"
                      onClick={() => setShowWhyBuy(!showWhyBuy)}
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <Info className="w-3 h-3" />
                      Why should I buy?
                    </button>
                  </p>

                  <div className="space-y-2 mt-8">
                    <Label htmlFor="initial-purchase" className="flex items-center gap-2 text-sm font-medium">
                      Amount in CNPY
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>CNPY is Canopy's native token. Your initial purchase uses CNPY to buy your chain's tokens, establishing liquidity and demonstrating commitment.</p>
                          <p className="mt-1 text-xs text-muted-foreground">This creates the initial trading pair for your token on the Canopy ecosystem.</p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <Input
                      id="initial-purchase"
                      type="number"
                      min="0"
                      step="0.01"
                      value={initialPurchase}
                      onChange={(e) => setInitialPurchase(e.target.value)}
                      placeholder="0000"
                      className="text-lg"
                    />
                    {initialPurchase && parseFloat(initialPurchase) > 0 && (
                      <p className="text-sm text-muted-foreground">
                        You will receive{' '}
                        <span className="font-semibold text-foreground">
                          {parseFloat(initialPurchase).toLocaleString()} $GAME
                        </span>
                        {' '}tokens (1:1 ratio)
                      </p>
                    )}
                  </div>
                </div>

                {/* Why Should I Buy? Section */}
                {showWhyBuy && (
                  <Card className="p-6 bg-muted/50 border-primary/20">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Info className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-lg">Why should I buy tokens?</h3>
                      </div>

                      <div className="space-y-3 text-sm text-muted-foreground">
                        <p>
                          Making an initial purchase of your chain's tokens demonstrates confidence and commitment to potential users and investors. Here's why it matters:
                        </p>

                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <span className="text-primary font-bold">•</span>
                            <div>
                              <span className="font-semibold text-foreground">Show Confidence:</span> Buying your own tokens signals that you believe in your project's success and are willing to invest your own capital.
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <span className="text-primary font-bold">•</span>
                            <div>
                              <span className="font-semibold text-foreground">Build Trust:</span> Community members are more likely to participate when they see the creators have "skin in the game."
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <span className="text-primary font-bold">•</span>
                            <div>
                              <span className="font-semibold text-foreground">Kickstart Liquidity:</span> Your initial purchase helps establish the starting liquidity pool, making it easier for others to buy and trade.
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <span className="text-primary font-bold">•</span>
                            <div>
                              <span className="font-semibold text-foreground">Accelerate Graduation:</span> Every purchase counts toward the ${graduationThreshold.toLocaleString()} graduation threshold, bringing your chain closer to full deployment.
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-border/50">
                          <p className="text-xs">
                            <span className="font-semibold text-foreground">Note:</span> This is entirely optional. You can launch your chain without an initial purchase, but many successful projects choose to make one as a demonstration of commitment.
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-8">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(true)}
                  className="gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </Button>
                <Button
                  onClick={handleContinue}
                  className="gap-2"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Preview Side Sheet */}
    <PreviewSideSheet
      open={showPreview}
      onOpenChange={setShowPreview}
      formData={{
        // From previous steps (context) - be specific about fields
        language: getFlowData('language')?.name,
        repository: getFlowData('repository'),
        name: getFlowData('chainConfig')?.chainName,
        ticker: getFlowData('chainConfig')?.ticker,
        tokenName: getFlowData('chainConfig')?.tokenName,
        totalSupply: parseInt(getFlowData('chainConfig')?.tokenSupply || 1000000000),
        blockTime: parseInt(getFlowData('chainConfig')?.blockTime || 10),
        halvingDays: parseInt(getFlowData('chainConfig')?.halvingDays || 365),
        logo: getFlowData('branding')?.logo,
        brandColor: getFlowData('branding')?.brandColor,
        title: getFlowData('branding')?.title,
        description: getFlowData('branding')?.description,
        gallery: getFlowData('branding')?.gallery,
        bannerImage: getFlowData('branding')?.gallery?.[0]?.preview,
        social: getFlowData('links')?.social,
        resources: getFlowData('links')?.resources,
        // From current step - these override any conflicts
        launchType: 'fair',
        initialPrice: initialPurchase ? parseFloat(initialPurchase) / 1000000 : 0.01,
        initialPurchase: initialPurchase ? parseFloat(initialPurchase) : 0,
        graduationThreshold: graduationThreshold
      }}
    />
    </TooltipProvider>
  )
}
