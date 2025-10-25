import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import MainSidebar from '@/components/main-sidebar'
import ChainHeader from '@/pages/chain-detail/components/chain-header'
import PriceChart from '@/pages/chain-detail/components/price-chart'
import OverviewTab from '@/pages/chain-detail/components/overview-tab'
import CodeTab from '@/pages/chain-detail/components/code-tab'
import HoldersTab from '@/pages/chain-detail/components/holders-tab'
import BlockExplorerTab from '@/pages/chain-detail/components/block-explorer-tab'
import MilestonesTab from '@/pages/chain-detail/components/milestones-tab'
import TradingPanel from '@/pages/chain-detail/components/trading-panel'
import ReportProblemButton from '@/pages/chain-detail/components/report-problem-button'
import DraftHoldersTab from '@/pages/chain-detail-draft/components/draft-holders-tab'
import DraftBlockExplorerTab from '@/pages/chain-detail-draft/components/draft-block-explorer-tab'
import DraftProgressPanel from '@/pages/chain-detail-draft/components/draft-progress-panel'
import ReviewCountdownPanel from '@/pages/chain-detail-owner/components/review-countdown-panel'
import LaunchSuccessBanner from '@/pages/chain-detail-owner/components/launch-success-banner'
import { getChainDetailsBySlug } from '@/data/db'
import { MoreVertical, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function ChainDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('overview')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Check URL params for success flag
  const searchParams = new URLSearchParams(location.search)
  const isSuccessFlow = searchParams.get('success') === 'true'

  // State to manage review period
  const [showReviewCountdown, setShowReviewCountdown] = useState(isSuccessFlow)
  const [showSuccessBanner, setShowSuccessBanner] = useState(false)

  // Get chain data from database using slug
  const chainData = getChainDetailsBySlug(slug)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleCountdownComplete = () => {
    setShowReviewCountdown(false)
    setShowSuccessBanner(true)
    // Remove success param from URL
    navigate(location.pathname, { replace: true })
  }

  // If chain not found, show 404
  if (!chainData) {
    return (
      <div className="flex min-h-screen bg-background">
        <MainSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p className="text-muted-foreground mb-6">Chain not found</p>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Back to Launchpad
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Determine chain status badge
  const getStatusBadge = () => {
    if (chainData.isGraduated) {
      return (
        <Badge variant="outline" className="border-green-500/50 text-green-500 ml-2">
          Graduated
        </Badge>
      )
    }
    if (chainData.isDraft || showReviewCountdown) {
      return (
        <Badge variant="outline" className="border-gray-500/50 text-gray-500 ml-2">
          Draft
        </Badge>
      )
    }
    if (chainData.isVirtual) {
      return (
        <Badge variant="outline" className="border-purple-500/50 text-purple-500 ml-2">
          Virtual
        </Badge>
      )
    }
    return null
  }

  // Check if current user is the owner (simplified - in real app would check wallet)
  const isOwner = chainData.owner === '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199'

  const handleDeleteDraft = () => {
    toast.success('Draft chain deleted successfully')
    setShowDeleteDialog(false)
    // Navigate back to launchpad after deletion
    setTimeout(() => {
      navigate('/')
    }, 1000)
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <MainSidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="px-6 py-3 pt-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <button onClick={() => navigate('/')} className="hover:text-foreground">
                Launchpad
              </button>
              <span>/</span>
              <span className="text-foreground">{chainData.name}</span>
              {getStatusBadge()}
            </div>

            {/* More Menu (only for draft chains owned by user) */}
            {chainData.isDraft && isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive cursor-pointer"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete draft chain
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6 pt-3">
          {/* Success Banner */}
          {showSuccessBanner && (
            <LaunchSuccessBanner
              onDismiss={() => setShowSuccessBanner(false)}
              chainName={chainData.name}
              chainUrl={window.location.href}
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              <ChainHeader chainData={chainData} isOwner={isOwner} />
              <PriceChart chainData={chainData} />

              {/* Tabs Section */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="holders">
                    Holders ({chainData.holderCount})
                  </TabsTrigger>
                  <TabsTrigger value="milestones">Milestones</TabsTrigger>
                  <TabsTrigger value="code">Code</TabsTrigger>
                  <TabsTrigger value="block-explorer">Block Explorer</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <OverviewTab
                    chainData={chainData}
                    currentGalleryIndex={currentGalleryIndex}
                    setCurrentGalleryIndex={setCurrentGalleryIndex}
                    onNavigateToTab={setActiveTab}
                    isOwner={isOwner}
                    isDraft={chainData.isDraft}
                    isVirtual={chainData.isVirtual}
                  />
                </TabsContent>

                <TabsContent value="holders">
                  {chainData.isDraft ? (
                    <DraftHoldersTab chainData={chainData} />
                  ) : (
                    <HoldersTab
                      holders={chainData.holders}
                      ticker={chainData.ticker}
                      totalHolders={chainData.holderCount}
                      currentPrice={chainData.currentPrice}
                      creatorAddress={chainData.creator}
                    />
                  )}
                </TabsContent>

                <TabsContent value="milestones">
                  <MilestonesTab chainData={chainData} isOwner={isOwner} />
                </TabsContent>

                <TabsContent value="code">
                  <CodeTab chainData={chainData} />
                </TabsContent>

                <TabsContent value="block-explorer">
                  {chainData.isDraft || chainData.isVirtual ? (
                    <DraftBlockExplorerTab chainData={chainData} />
                  ) : (
                    <BlockExplorerTab chainData={chainData} />
                  )}
                </TabsContent>
              </Tabs>

              {/* Report a Problem Button - hidden for draft chains */}
              {!chainData.isDraft && (
                <ReportProblemButton chainData={chainData} />
              )}
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {showReviewCountdown ? (
                <ReviewCountdownPanel
                  chainData={chainData}
                  onCountdownComplete={handleCountdownComplete}
                />
              ) : chainData.isDraft ? (
                <DraftProgressPanel chainData={chainData} />
              ) : (
                <TradingPanel chainData={chainData} isOwner={isOwner} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete draft chain?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your draft chain "{chainData.name}" and remove all associated configuration data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteDraft}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
