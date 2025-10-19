import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import MainSidebar from '@/components/main-sidebar'
import ChainHeader from '../launch-page/components/chain-header'
import PriceChart from '../launch-page/components/price-chart'
import OverviewTab from '../launch-page/components/overview-tab'
import CodeTab from '../launch-page/components/code-tab'
import HoldersTab from '../launch-page/components/holders-tab'
import BlockExplorerTab from '../launch-page/components/block-explorer-tab'
import TradingPanel from '../launch-page/components/trading-panel'
import ReportProblemButton from '../launch-page/components/report-problem-button'
import { Globe, Github } from 'lucide-react'

// Mock data for newly launched chain (owner view)
const newChainData = {
  name: 'MyGameChain',
  ticker: 'GAME',
  creator: 'eliezerpujols',
  title: 'MyGameChain: The Future of Gaming on Blockchain',
  description: 'A revolutionary blockchain designed specifically for gaming applications, enabling seamless in-game asset transactions, player rewards, and cross-game interoperability. Built on Canopy\'s infrastructure with performance and scalability in mind to handle millions of micro-transactions per day, empowering developers and gamers with true digital ownership and unprecedented gaming experiences.',
  logo: null,
  brandColor: '#8b5cf6',
  language: 'Rust',
  repositoryName: 'eliezerpujols/mygamechain',
  isVirtual: true, // Flag to show virtual badge

  // Market data - newly launched, minimal activity
  currentPrice: 0.005,
  marketCap: 500, // Just initial purchase
  mcap: 0.5,
  volume: 100, // Initial purchase volume
  virtualLiq: 400,
  holderCount: 1, // Only the owner
  priceChange24h: 0, // No price change yet

  // Launch settings
  graduationThreshold: 50000,
  remainingToGraduation: 49500, // Most of the way to go

  // Gallery
  gallery: [null, null, null],

  // Social links
  socialLinks: [
    { platform: 'website', label: 'Website', url: 'https://mygamechain.org', icon: Globe },
    { platform: 'twitter', label: 'Twitter/X', url: '@mygamechain', icon: null },
    { platform: 'discord', label: 'Discord', url: 'https://discord.gg/mygamechain', icon: null },
    { platform: 'github', label: 'GitHub', url: 'https://github.com/eliezerpujols/mygamechain', icon: Github }
  ],

  // Whitepapers
  whitepapers: [
    {
      id: 1,
      type: 'file',
      name: 'Technical Whitepaper.pdf',
      size: 2457600,
    },
    {
      id: 2,
      type: 'url',
      url: 'https://docs.mygamechain.org/architecture',
      name: 'System Architecture Overview',
      description: 'docs.mygamechain.org'
    }
  ],

  // Tokenomics
  tokenomics: {
    totalSupply: '1000000000',
    blockTime: 10,
    halvingDays: 365,
    yearOneEmission: 137442250
  },

  // Holders - only the owner who made initial purchase
  holders: [
    { address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1', balance: 100000 }, // Owner's initial purchase
  ],

  // Chart data - flat line, just launched
  priceHistory: [
    { time: '00:00', price: 0.005 },
    { time: '02:00', price: 0.005 },
    { time: '04:00', price: 0.005 },
    { time: '06:00', price: 0.005 },
    { time: '08:00', price: 0.005 },
    { time: '10:00', price: 0.005 },
    { time: '12:00', price: 0.005 },
    { time: '14:00', price: 0.005 },
    { time: '16:00', price: 0.005 },
    { time: '18:00', price: 0.005 },
    { time: '20:00', price: 0.005 }
  ],

  // Block Explorer data - minimal activity
  explorer: {
    currentBlock: 12,
    totalTransactions: 2,
    recentBlocks: [
      { number: 12, hash: '0x8f5c7d9a2b1e4f3c6a8d9e2f1b4c7a5d9e2f1b4c7a5d9e2f1b4c', transactions: 1, timestamp: 5 },
      { number: 11, hash: '0x7e4b6c8a1d2f5e3c7b9a2d1f4e6c8a1d2f5e3c7b9a2d1f4e6c8a', transactions: 0, timestamp: 15 },
      { number: 10, hash: '0x6d3a5b7c9e1f4d2c6a8b9e1d3f5c7a9e1d3f5c7a9e1d3f5c7a9e', transactions: 0, timestamp: 25 },
      { number: 9, hash: '0x5c2b4a6d8e0f3c1b5a7d9e0c2f4b6d8e0c2f4b6d8e0c2f4b6d8e', transactions: 0, timestamp: 35 },
      { number: 8, hash: '0x4b1a3c5d7e9f2b0c4a6d8e9c1f3b5d7e9c1f3b5d7e9c1f3b5d7e', transactions: 0, timestamp: 45 },
      { number: 7, hash: '0x3a0b2c4d6e8f1a9c3b5d7e8c0f2b4d6e8c0f2b4d6e8c0f2b4d6e', transactions: 0, timestamp: 55 },
      { number: 6, hash: '0x2c1a3b5d7e9f0c8a2b4d6e7c9f1b3d5e7c9f1b3d5e7c9f1b3d5e', transactions: 1, timestamp: 65 },
      { number: 5, hash: '0x1b0a2c4d6e8f9b7c1a3d5e6c8f0b2d4e6c8f0b2d4e6c8f0b2d4e', transactions: 0, timestamp: 75 },
      { number: 4, hash: '0x0a9b1c3d5e7f8a6b0c2d4e5c7f9b1d3e5c7f9b1d3e5c7f9b1d3e', transactions: 0, timestamp: 85 },
      { number: 3, hash: '0x9a8b0c2d4e6f7a5b9c1d3e4c6f8b0d2e4c6f8b0d2e4c6f8b0d2e', transactions: 0, timestamp: 95 }
    ],
    recentTransactions: [
      {
        hash: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1a9d2f4e6c8a0b2d4e6c8a0b2',
        from: '0x0000000000000000000000000000000000000000', // Genesis
        to: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
        amount: 100000,
        status: 'success',
        timestamp: 5,
        blockNumber: 12
      },
      {
        hash: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199b8d1f3e5c7a9b1d3f5e7c9a1',
        from: '0x0000000000000000000000000000000000000000', // Chain deployment
        to: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
        amount: 0,
        status: 'success',
        timestamp: 65,
        blockNumber: 6
      }
    ]
  }
}

export default function LaunchPageOwner() {
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
            <span className="text-foreground">MyGameChain</span>
            <Badge variant="outline" className="border-purple-500/50 text-purple-500 ml-2">
              Virtual
            </Badge>
          </div>
        </div>

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
                  <HoldersTab holders={newChainData.holders} ticker={newChainData.ticker} />
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
