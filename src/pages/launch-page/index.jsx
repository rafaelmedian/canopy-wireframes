import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useNavigate } from 'react-router-dom'
import MainSidebar from '@/components/main-sidebar'
import ChainHeader from './components/chain-header'
import PriceChart from './components/price-chart'
import OverviewTab from './components/overview-tab'
import CodeTab from './components/code-tab'
import HoldersTab from './components/holders-tab'
import BlockExplorerTab from './components/block-explorer-tab'
import MilestonesTab from './components/milestones-tab'
import TradingPanel from './components/trading-panel'
import ReportProblemButton from './components/report-problem-button'
import { getChainDetails } from '@/data/db'

// Get chain data from database (ID 1 = Onchain ENS - Virtual chain)
const mockChainData = getChainDetails(1)

export default function LaunchPage() {
  const navigate = useNavigate()
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('overview')

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
            <span className="text-foreground">Onchain ENS</span>
            <Badge variant="outline" className="border-purple-500/50 text-purple-500 ml-2">
              Virtual
            </Badge>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6 pt-3">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              <ChainHeader chainData={mockChainData} />
              <PriceChart chainData={mockChainData} />

              {/* Tabs Section */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="holders">Holders (21)</TabsTrigger>
                  <TabsTrigger value="milestones">Milestones</TabsTrigger>
                  <TabsTrigger value="code">Code</TabsTrigger>
                  <TabsTrigger value="block-explorer">Block Explorer</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <OverviewTab
                    chainData={mockChainData}
                    currentGalleryIndex={currentGalleryIndex}
                    setCurrentGalleryIndex={setCurrentGalleryIndex}
                    onNavigateToTab={setActiveTab}
                  />
                </TabsContent>

                <TabsContent value="holders">
                  <HoldersTab
                    holders={mockChainData.holders}
                    ticker={mockChainData.ticker}
                    totalHolders={mockChainData.holderCount}
                  />
                </TabsContent>

                <TabsContent value="milestones">
                  <MilestonesTab chainData={mockChainData} />
                </TabsContent>

                <TabsContent value="code">
                  <CodeTab chainData={mockChainData} />
                </TabsContent>

                <TabsContent value="block-explorer">
                  <BlockExplorerTab chainData={mockChainData} />
                </TabsContent>
              </Tabs>

              {/* Report a Problem Button */}
              <ReportProblemButton chainData={mockChainData} />
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              <TradingPanel chainData={mockChainData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
