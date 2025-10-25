import { useState } from 'react'
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
import { useNavigate } from 'react-router-dom'
import MainSidebar from '@/components/main-sidebar'
import ChainHeader from '@/pages/chain-detail/components/chain-header'
import PriceChart from '@/pages/chain-detail/components/price-chart'
import OverviewTab from '@/pages/chain-detail/components/overview-tab'
import CodeTab from '@/pages/chain-detail/components/code-tab'
import ReportProblemButton from '@/pages/chain-detail/components/report-problem-button'
import { Globe, Github, MoreVertical, Trash2 } from 'lucide-react'
import DraftHoldersTab from './components/draft-holders-tab'
import DraftBlockExplorerTab from './components/draft-block-explorer-tab'
import DraftProgressPanel from './components/draft-progress-panel'
import TradingPanel from '@/pages/chain-detail/components/trading-panel'
import MilestonesTab from '@/pages/chain-detail/components/milestones-tab'
import { toast } from 'sonner'
import { getChainDetails } from "@/data/db"

export default function LaunchPageDraft({ chainData, isPreview = false }) {
  const navigate = useNavigate()
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('overview')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Use provided chainData or fetch from database
  const draftChainData = chainData || getChainDetails(4)

  const handleDeleteDraft = () => {
    toast.success('Draft chain deleted successfully')
    setShowDeleteDialog(false)
    // Navigate back to launchpad after deletion
    setTimeout(() => {
      navigate('/launchpad')
    }, 1000)
  }

  return (
    <div className={isPreview ? "bg-background" : "flex min-h-screen bg-background"}>
      {/* Sidebar - hide in preview mode */}
      {!isPreview && <MainSidebar />}

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar - hide in preview mode */}
        {!isPreview && (
          <div className="px-6 py-3 pt-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <button onClick={() => navigate('/')} className="hover:text-foreground">
                  Launchpad
                </button>
                <span>/</span>
                <span className="text-foreground">{draftChainData.name}</span>
                <Badge variant="outline" className="border-orange-500/50 text-orange-500 ml-2">
                  Draft
                </Badge>
              </div>

              {/* More Menu */}
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
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-6 py-6 pt-3">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              <ChainHeader chainData={draftChainData} />
              <PriceChart chainData={draftChainData} />

              {/* Tabs Section */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="holders">Holders</TabsTrigger>
                  <TabsTrigger value="milestones">Milestones</TabsTrigger>
                  <TabsTrigger value="code">Code</TabsTrigger>
                  <TabsTrigger value="block-explorer">Block Explorer</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <OverviewTab
                    chainData={draftChainData}
                    currentGalleryIndex={currentGalleryIndex}
                    setCurrentGalleryIndex={setCurrentGalleryIndex}
                    onNavigateToTab={setActiveTab}
                    isDraft={draftChainData.isDraft}
                  />
                </TabsContent>

                <TabsContent value="holders">
                  <DraftHoldersTab chainData={draftChainData} />
                </TabsContent>

                <TabsContent value="milestones">
                  <MilestonesTab chainData={draftChainData} isOwner={true} />
                </TabsContent>

                <TabsContent value="code">
                  <CodeTab chainData={draftChainData} />
                </TabsContent>

                <TabsContent value="block-explorer">
                  <DraftBlockExplorerTab chainData={draftChainData} />
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Sidebar - Trading Panel in preview mode, Progress Panel otherwise */}
            <div className="space-y-6">
              {isPreview ? (
                <TradingPanel chainData={draftChainData} isPreview={true} />
              ) : (
                <DraftProgressPanel chainData={draftChainData} />
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
              This action cannot be undone. This will permanently delete your draft chain "{draftChainData.name}" and remove all associated configuration data.
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
