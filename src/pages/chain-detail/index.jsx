import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import MainSidebar from '@/components/main-sidebar'
import ChainHeader from '../launch-page/components/chain-header'
import PriceChart from '../launch-page/components/price-chart'
import OverviewTab from '../launch-page/components/overview-tab'
import CodeTab from '../launch-page/components/code-tab'
import HoldersTab from '../launch-page/components/holders-tab'
import BlockExplorerTab from '../launch-page/components/block-explorer-tab'
import MilestonesTab from '../launch-page/components/milestones-tab'
import TradingPanel from '../launch-page/components/trading-panel'
import ReportProblemButton from '../launch-page/components/report-problem-button'
import { getChainDetailsBySlug } from '@/data/db'

export default function ChainDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('overview')

  // Get chain data from database using slug
  const chainData = getChainDetailsBySlug(slug)

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
    if (chainData.isDraft) {
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
            <span className="text-foreground">{chainData.name}</span>
            {getStatusBadge()}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6 pt-3">
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
                  />
                </TabsContent>

                <TabsContent value="holders">
                  <HoldersTab
                    holders={chainData.holders}
                    ticker={chainData.ticker}
                    totalHolders={chainData.holderCount}
                  />
                </TabsContent>

                <TabsContent value="milestones">
                  <MilestonesTab chainData={chainData} isOwner={isOwner} />
                </TabsContent>

                <TabsContent value="code">
                  <CodeTab chainData={chainData} />
                </TabsContent>

                <TabsContent value="block-explorer">
                  <BlockExplorerTab chainData={chainData} />
                </TabsContent>
              </Tabs>

              {/* Report a Problem Button */}
              <ReportProblemButton chainData={chainData} />
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              <TradingPanel chainData={chainData} isOwner={isOwner} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
