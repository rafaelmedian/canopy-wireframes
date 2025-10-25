import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, X, Edit, AlertCircle, Github, Globe, FileText, Link as LinkIcon, Eye } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import MainSidebar from '@/components/main-sidebar'
import LaunchpadSidebar from '@/components/launchpad-sidebar'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { useLaunchFlow } from '@/contexts/launch-flow-context'
import { BLOCK_TIME_OPTIONS } from '@/data/mock-config'
import PreviewSideSheet from '../components/preview-side-sheet'
import { useState } from 'react'

// Social platform icons mapping (same as step 5)
const PLATFORM_ICONS = {
  website: Globe,
  twitter: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  telegram: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
    </svg>
  ),
  discord: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  ),
  github: Github
}

export default function Review() {
  const navigate = useNavigate()
  const location = useLocation()
  const { getFlowData } = useLaunchFlow()
  const [showPreview, setShowPreview] = useState(false)

  // Get all data from context
  const language = getFlowData('language')
  const repository = getFlowData('repository')
  const chainConfig = getFlowData('chainConfig')
  const branding = getFlowData('branding')
  const links = getFlowData('links')
  const launchSettings = getFlowData('launchSettings')

  // Check if repo is connected
  const repoConnected = launchSettings ? true : false

  // Check if coming from review countdown (edit mode)
  const isEditMode = location.state?.fromReviewCountdown === true

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Build chain data from context (fallback to defaults if needed)
  const chainData = {
    language: language?.name || 'TypeScript',
    repository: repository?.name || 'https://github.com/username/mygamechain',
    repositoryName: repository?.name || 'eliezerpujols/mygamechain',
    chainName: chainConfig?.chainName || 'MyGameChain',
    tokenName: chainConfig?.tokenName || 'GAME',
    ticker: chainConfig?.ticker || 'GAME',
    tokenSupply: chainConfig?.tokenSupply || '1,000,000,000',
    halvingDays: chainConfig?.halvingDays || '365',
    blockTime: chainConfig?.blockTime || '10',
    logo: branding?.logo || null,
    brandColor: branding?.brandColor || '#6366f1',
    description: branding?.description || 'A revolutionary blockchain for gaming communities, enabling fast transactions and seamless in-game economies.',
    gallery: branding?.gallery || [],
    socialLinks: links?.social?.map(link => ({
      platform: link.platform,
      label: link.platform,
      url: link.url
    })) || [
      { platform: 'website', label: 'Website', url: 'https://mygamechain.org' }
    ],
    resources: links?.resources || [],
    graduationThreshold: launchSettings?.graduationThreshold || 50000,
    initialPurchase: launchSettings?.initialPurchase || 0
  }

  const creationFee = 100 // Fixed creation fee in CNPY
  const totalCost = creationFee + chainData.initialPurchase

  const handleBack = () => {
    navigate('/launchpad/settings')
  }

  const handleEdit = (step) => {
    const routes = {
      language: '/launchpad/language',
      repository: '/launchpad/repository',
      configure: '/launchpad/configure',
      branding: '/launchpad/branding',
      links: '/launchpad/links',
      settings: '/launchpad/settings'
    }
    navigate(routes[step])
  }

  const handleClose = () => {
    navigate('/')
  }

  const handlePayment = () => {
    if (isEditMode) {
      // Save changes and return to chain detail
      navigate('/chain/my-chain?success=true')
    } else {
      // In production, this would connect wallet and process payment
      // For now, navigate to the owner chain page with success banner
      navigate('/chain/my-chain?success=true')
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <MainSidebar variant="compact" />
      <LaunchpadSidebar
        currentStep={7}
        completedSteps={[1, 2, 3, 4, 5, 6]}
        repoConnected={repoConnected}
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
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">
                  Review your configuration
                </h1>
                <p className="text-muted-foreground">
                  Review all details before launching your chain
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowPreview(true)}
                className="gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview
              </Button>
            </div>

            {/* Review Sections */}
            <div className="space-y-6">
              {/* Language & Repository */}
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold mb-1">Language & Repository</h2>
                    <p className="text-sm text-muted-foreground">Template and source code</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit('language')}
                    className="gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Language:</span>
                    <Badge variant="secondary">{chainData.language}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Github className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{chainData.repositoryName}</span>
                  </div>
                </div>
              </Card>

              {/* Chain Details */}
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold mb-1">Chain Details</h2>
                    <p className="text-sm text-muted-foreground">Core configuration</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit('configure')}
                    className="gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Chain Name</p>
                    <p className="font-medium">{chainData.chainName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Token Name</p>
                    <p className="font-medium">{chainData.tokenName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ticker</p>
                    <p className="font-medium">${chainData.ticker}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Supply</p>
                    <p className="font-medium">{chainData.tokenSupply} {chainData.ticker}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Halving Schedule</p>
                    <p className="font-medium">Every {chainData.halvingDays} days</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Block Time</p>
                    <p className="font-medium">
                      {BLOCK_TIME_OPTIONS.find(opt => opt.value === chainData.blockTime)?.label || chainData.blockTime}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Branding */}
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold mb-1">Branding & Media</h2>
                    <p className="text-sm text-muted-foreground">Visual identity</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit('branding')}
                    className="gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                      <span className="text-2xl font-bold">{chainData.ticker[0]}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Brand Color</p>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border border-border"
                          style={{ backgroundColor: chainData.brandColor }}
                        />
                        <span className="font-medium font-mono text-sm">{chainData.brandColor}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Description</p>
                    <p className="text-sm">{chainData.description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Gallery</p>
                    <p className="text-sm font-medium">
                      {chainData.gallery.length > 0 ? `${chainData.gallery.length} items` : 'No gallery items'}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Links & Documentation */}
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold mb-1">Links & Documentation</h2>
                    <p className="text-sm text-muted-foreground">Social presence</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit('links')}
                    className="gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Social Links</p>
                    <div className="space-y-2">
                      {chainData.socialLinks.map((link, index) => {
                        const Icon = PLATFORM_ICONS[link.platform]
                        return (
                          <div key={index} className="flex items-center gap-2">
                            {Icon && (typeof Icon === 'function' ? <Icon /> : <Icon className="w-4 h-4 text-muted-foreground" />)}
                            <span className="text-sm font-medium">{link.label}:</span>
                            <span className="text-sm text-muted-foreground">{link.url}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  {chainData.resources.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Resources</p>
                      <div className="space-y-2">
                        {chainData.resources.map((paper, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            {paper.type === 'file' ? (
                              <FileText className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <LinkIcon className="w-4 h-4 text-muted-foreground" />
                            )}
                            <span>{paper.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Launch Settings */}
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold mb-1">Launch Settings</h2>
                    <p className="text-sm text-muted-foreground">Graduation and initial purchase</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit('settings')}
                    className="gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Graduation Threshold</p>
                    <p className="font-medium">${chainData.graduationThreshold.toLocaleString()} market cap</p>
                  </div>
                  {chainData.initialPurchase > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground">Initial Purchase</p>
                      <p className="font-medium">{chainData.initialPurchase} CNPY</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        You will receive {chainData.initialPurchase.toLocaleString()} ${chainData.ticker}
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              <Separator />

              {/* Payment Summary */}
              <Card className="p-6 bg-card">
                <h2 className="text-lg font-semibold mb-4">Payment Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Creation Fee:</span>
                    <span className="font-medium">{creationFee} CNPY</span>
                  </div>
                  {chainData.initialPurchase > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Initial Purchase:</span>
                      <span className="font-medium">{chainData.initialPurchase} CNPY</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold">{totalCost} CNPY</span>
                  </div>
                </div>

                {/* Important Notice */}
                <Card className="mt-6 p-4 bg-background border-primary/20">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="space-y-2">
                      <p className="font-semibold text-sm">Important</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Starts as virtual chain (test mode)</li>
                        <li>• Becomes real at ${chainData.graduationThreshold.toLocaleString()} market cap</li>
                        <li>• Settings cannot be changed after launch</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4">
              <Button
                size="lg"
                className="w-full"
                onClick={handlePayment}
              >
                {isEditMode ? 'Save Changes' : 'Connect Wallet & Pay'}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleBack}
                className="w-full gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Side Sheet */}
      <PreviewSideSheet
        open={showPreview}
        onOpenChange={setShowPreview}
        formData={{
          // Build from all context data
          name: chainConfig?.chainName || 'Untitled Chain',
          ticker: chainConfig?.ticker || 'UNTD',
          description: branding?.description || '',
          tokenName: chainConfig?.tokenName || 'Token',
          totalSupply: parseInt(chainConfig?.tokenSupply || 1000000000),
          consensus: 'Proof of Stake',
          blockTime: parseInt(chainConfig?.blockTime || 10),
          maxValidators: 100,
          halvingDays: parseInt(chainConfig?.halvingDays || 365),
          brandColor: branding?.brandColor || '#10b981',
          logo: branding?.logo || null,
          bannerImage: branding?.gallery?.[0]?.preview || null,
          links: links?.social || [],
          launchType: 'fair',
          initialPrice: launchSettings?.initialPurchase ? parseFloat(launchSettings.initialPurchase) / 1000000 : 0.01,
          repository: repository
        }}
      />
    </div>
  )
}
