import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { useNavigate, useSearchParams } from 'react-router-dom'
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
import LaunchSuccessBanner from './components/launch-success-banner'
import { Globe, Github } from 'lucide-react'
import { getChainDetails } from "@/data/db"

// Get chain data from database (ID 2 = MyGameChain - Owner view, newly launched)
const newChainData = getChainDetails(2)

export default function LaunchPageOwner() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('overview')
  const [showSuccessBanner, setShowSuccessBanner] = useState(false)

  // Check if coming from successful payment
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShowSuccessBanner(true)
      // Remove the success param from URL
      searchParams.delete('success')
      setSearchParams(searchParams, { replace: true })
      // Scroll to top
      window.scrollTo(0, 0)
    }
  }, [searchParams, setSearchParams])

  const handleDismissBanner = () => {
    setShowSuccessBanner(false)
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <MainSidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="px-6 py-3 pt-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <button onClick={() => navigate('/')} className="hover:text-foreground">
              Launchpad
            </button>
            <span>/</span>
            <span className="text-foreground">MyGameChain</span>
            <Badge variant="outline" className="border-purple-500/50 text-purple-500 ml-2">
              Virtual
            </Badge>
          </div>
        </div>

        {/* Success Banner */}
        {showSuccessBanner && (
          <div className="px-6 pt-2">
            <LaunchSuccessBanner
                chainName={newChainData.name}
                onDismiss={handleDismissBanner}
            />
          </div>
        )}

        <div className="max-w-7xl mx-auto px-6 py-6 pt-3">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              <ChainHeader chainData={newChainData} />
              <PriceChart chainData={newChainData} />

              {/* Tabs Section */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="holders">Holders (1)</TabsTrigger>
                  <TabsTrigger value="milestones">Milestones</TabsTrigger>
                  <TabsTrigger value="code">Code</TabsTrigger>
                  <TabsTrigger value="block-explorer">Block Explorer</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <OverviewTab
                    chainData={newChainData}
                    currentGalleryIndex={currentGalleryIndex}
                    setCurrentGalleryIndex={setCurrentGalleryIndex}
                    onNavigateToTab={setActiveTab}
                  />
                </TabsContent>

                <TabsContent value="holders">
                  <HoldersTab
                    holders={newChainData.holders}
                    ticker={newChainData.ticker}
                    totalHolders={newChainData.holderCount}
                  />
                </TabsContent>

                <TabsContent value="milestones">
                  <MilestonesTab chainData={newChainData} isOwner={true} />
                </TabsContent>

                <TabsContent value="code">
                  <CodeTab chainData={newChainData} />
                </TabsContent>

                <TabsContent value="block-explorer">
                  <BlockExplorerTab chainData={newChainData} />
                </TabsContent>
              </Tabs>

              {/* Report a Problem Button */}
              <ReportProblemButton chainData={newChainData} />
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              <TradingPanel chainData={newChainData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
