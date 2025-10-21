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
import ChainHeader from '../launch-page/components/chain-header'
import PriceChart from '../launch-page/components/price-chart'
import OverviewTab from '../launch-page/components/overview-tab'
import CodeTab from '../launch-page/components/code-tab'
import ReportProblemButton from '../launch-page/components/report-problem-button'
import { Globe, Github, MoreVertical, Trash2 } from 'lucide-react'
import DraftHoldersTab from './components/draft-holders-tab'
import DraftBlockExplorerTab from './components/draft-block-explorer-tab'
import DraftProgressPanel from './components/draft-progress-panel'
import MilestonesTab from '../launch-page/components/milestones-tab'
import { toast } from 'sonner'
import { getChainDetails } from "@/data/db"

// Get chain data from database (ID 4 = DeFi Protocol - Draft, not yet deployed)
const draftChainData = getChainDetails(4)

export default function LaunchPageDraft() {
  const navigate = useNavigate()
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('overview')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDeleteDraft = () => {
    toast.success('Draft chain deleted successfully')
    setShowDeleteDialog(false)
    // Navigate back to launchpad after deletion
    setTimeout(() => {
      navigate('/launchpad')
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
              <span className="text-foreground">DeFi Protocol</span>
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

            {/* Right Sidebar - Progress Panel instead of Trading */}
            <div className="space-y-6">
              <DraftProgressPanel chainData={draftChainData} />
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
