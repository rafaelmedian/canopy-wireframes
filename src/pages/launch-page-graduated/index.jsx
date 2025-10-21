import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useNavigate } from 'react-router-dom'
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
import { Globe, Github } from 'lucide-react'
import { getChainDetails } from "@/data/db"

// Get chain data from database (ID 3 = Social Connect - Graduated chain)
const graduatedChainData = getChainDetails(3)

export default function LaunchPageGraduated() {
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
            <span className="text-foreground">Social Connect</span>
            <Badge variant="outline" className="border-green-500/50 text-green-500 ml-2">
              Graduated
            </Badge>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6 pt-3">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              <ChainHeader chainData={graduatedChainData} />
              <PriceChart chainData={graduatedChainData} />

              {/* Tabs Section */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="holders">Holders ({graduatedChainData.holderCount.toLocaleString()})</TabsTrigger>
                  <TabsTrigger value="milestones">Milestones</TabsTrigger>
                  <TabsTrigger value="code">Code</TabsTrigger>
                  <TabsTrigger value="block-explorer">Block Explorer</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <OverviewTab
                    chainData={graduatedChainData}
                    currentGalleryIndex={currentGalleryIndex}
                    setCurrentGalleryIndex={setCurrentGalleryIndex}
                    onNavigateToTab={setActiveTab}
                  />
                </TabsContent>

                <TabsContent value="holders">
                  <HoldersTab
                    holders={graduatedChainData.holders}
                    ticker={graduatedChainData.ticker}
                    totalHolders={graduatedChainData.holderCount}
                  />
                </TabsContent>

                <TabsContent value="milestones">
                  <MilestonesTab chainData={graduatedChainData} />
                </TabsContent>

                <TabsContent value="code">
                  <CodeTab chainData={graduatedChainData} />
                </TabsContent>

                <TabsContent value="block-explorer">
                  <BlockExplorerTab chainData={graduatedChainData} />
                </TabsContent>
              </Tabs>

              {/* Report a Problem Button */}
              <ReportProblemButton chainData={graduatedChainData} />
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              <TradingPanel chainData={graduatedChainData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
