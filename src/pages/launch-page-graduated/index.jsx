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
import TradingPanel from '../launch-page/components/trading-panel'
import ReportProblemButton from '../launch-page/components/report-problem-button'
import { Globe, Github } from 'lucide-react'

// Mock data for graduated chain (reached threshold)
const graduatedChainData = {
  name: 'Onchain ENS',
  ticker: 'OENS',
  creator: 'Onchain ENS',
  title: 'Onchain ENS: Decentralized Naming for the Future',
  description: 'Integrated with Canopy\'s robust infrastructure, our platform is designed to enhance the way digital assets are managed and exchanged. Our technology enables seamless, transparent, and efficient transactions, unlocking new possibilities for users and developers alike. Experience unmatched security, flexibility, and interoperability with our innovative solution, tailored to meet the evolving needs of the blockchain ecosystem.',
  logo: null,
  brandColor: '#10b981',
  language: 'TypeScript',
  repositoryName: 'eliezerpujols/mygamechain',
  isVirtual: false, // No longer virtual
  isGraduated: true, // Flag to show graduated badge

  // Market data - graduated chains have higher values
  currentPrice: 0.011647,
  marketCap: 52000, // Above threshold
  mcap: 52,
  volume: 8500,
  virtualLiq: 0, // No virtual liquidity for graduated chains
  holderCount: 5021, // Total holders (showing top 21)
  priceChange24h: 15.6,

  // Launch settings - reached threshold
  graduationThreshold: 50000,
  remainingToGraduation: 0, // Graduated!

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
    },
    {
      id: 3,
      type: 'url',
      url: 'https://github.com/eliezerpujols/mygamechain/wiki/tokenomics',
      name: 'Tokenomics Documentation',
      description: 'github.com'
    }
  ],

  // Tokenomics
  tokenomics: {
    totalSupply: '1000000000',
    blockTime: 10,
    halvingDays: 365,
    yearOneEmission: 137442250
  },

  // Holders
  holders: [
    { address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1', balance: 150000000 },
    { address: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199', balance: 120000000 },
    { address: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0', balance: 95000000 },
    { address: '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E', balance: 80000000 },
    { address: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30', balance: 65000000 },
    { address: '0x95cED938F7991cd0dFcb48F0a06a40FA1aF46EBC', balance: 50000000 },
    { address: '0x3E5e9111Ae8eB78Fe1CC3bb8915d5D461F3Ef9A9', balance: 45000000 },
    { address: '0x28a8746e75304c0780E39d3a14F80f7E4fe3951C', balance: 40000000 },
    { address: '0xACa94ef8bD5ffEE41947b4585a84BdA5a3d3DA6E', balance: 35000000 },
    { address: '0x1dF62f291b2E969fB0849d99D9Ce41e2F137006e', balance: 30000000 },
    { address: '0x610B717796ad172B316836AC95a2ffad065CeaB4', balance: 28000000 },
    { address: '0x178169B423a011fff22B9e3F3abeA13414dDD0F1', balance: 25000000 },
    { address: '0xF7eB46Fa95CCfB7642fA4a2E3f3C9748F0a4a8D9', balance: 22000000 },
    { address: '0x07687e702b410Fa43f4cB4Af7fA097918ffD2730', balance: 20000000 },
    { address: '0x4E9ce36E442e55EcD9025B9a6E0D88485d628A67', balance: 18000000 },
    { address: '0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7', balance: 15000000 },
    { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', balance: 12000000 },
    { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', balance: 10000000 },
    { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', balance: 8000000 },
    { address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', balance: 5000000 },
    { address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', balance: 3000000 }
  ],

  // Chart data
  priceHistory: [
    { time: '00:00', price: 0.0098 },
    { time: '02:00', price: 0.0102 },
    { time: '04:00', price: 0.0105 },
    { time: '06:00', price: 0.0110 },
    { time: '08:00', price: 0.0113 },
    { time: '10:00', price: 0.0108 },
    { time: '12:00', price: 0.0115 },
    { time: '14:00', price: 0.0112 },
    { time: '16:00', price: 0.0118 },
    { time: '18:00', price: 0.0116 },
    { time: '20:00', price: 0.011647 }
  ],

  // Block Explorer data
  explorer: {
    currentBlock: 245789,
    totalTransactions: 2523847, // Higher for graduated chains
    recentBlocks: [
      { number: 245789, hash: '0x8f5c7d9a2b1e4f3c6a8d9e2f1b4c7a5d9e2f1b4c7a5d9e2f1b4c', transactions: 156, timestamp: 15 },
      { number: 245788, hash: '0x7e4b6c8a1d2f5e3c7b9a2d1f4e6c8a1d2f5e3c7b9a2d1f4e6c8a', transactions: 142, timestamp: 25 },
      { number: 245787, hash: '0x6d3a5b7c9e1f4d2c6a8b9e1d3f5c7a9e1d3f5c7a9e1d3f5c7a9e', transactions: 189, timestamp: 35 },
      { number: 245786, hash: '0x5c2b4a6d8e0f3c1b5a7d9e0c2f4b6d8e0c2f4b6d8e0c2f4b6d8e', transactions: 201, timestamp: 45 },
      { number: 245785, hash: '0x4b1a3c5d7e9f2b0c4a6d8e9c1f3b5d7e9c1f3b5d7e9c1f3b5d7e', transactions: 178, timestamp: 55 },
      { number: 245784, hash: '0x3a0b2c4d6e8f1a9c3b5d7e8c0f2b4d6e8c0f2b4d6e8c0f2b4d6e', transactions: 165, timestamp: 65 },
      { number: 245783, hash: '0x2c1a3b5d7e9f0c8a2b4d6e7c9f1b3d5e7c9f1b3d5e7c9f1b3d5e', transactions: 193, timestamp: 75 },
      { number: 245782, hash: '0x1b0a2c4d6e8f9b7c1a3d5e6c8f0b2d4e6c8f0b2d4e6c8f0b2d4e', transactions: 147, timestamp: 85 },
      { number: 245781, hash: '0x0a9b1c3d5e7f8a6b0c2d4e5c7f9b1d3e5c7f9b1d3e5c7f9b1d3e', transactions: 182, timestamp: 95 },
      { number: 245780, hash: '0x9a8b0c2d4e6f7a5b9c1d3e4c6f8b0d2e4c6f8b0d2e4c6f8b0d2e', transactions: 159, timestamp: 105 }
    ],
    recentTransactions: [
      {
        hash: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1a9d2f4e6c8a0b2d4e6c8a0b2',
        from: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
        to: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
        amount: 2500,
        status: 'success',
        timestamp: 8,
        blockNumber: 245789
      },
      {
        hash: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199b8d1f3e5c7a9b1d3f5e7c9a1',
        from: '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E',
        to: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
        amount: 15000,
        status: 'success',
        timestamp: 18,
        blockNumber: 245789
      },
      {
        hash: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0c7a0e2f4b6d8a0e2f4b6d8a0',
        from: '0x95cED938F7991cd0dFcb48F0a06a40FA1aF46EBC',
        to: '0x3E5e9111Ae8eB78Fe1CC3bb8915d5D461F3Ef9A9',
        amount: 8750,
        status: 'pending',
        timestamp: 28,
        blockNumber: 245788
      },
      {
        hash: '0xbDA5747bFD65F08deb54cb465eB87D40e51B197Ed6b9f1e3c5a7d9f1e3c5a7d9',
        from: '0x28a8746e75304c0780E39d3a14F80f7E4fe3951C',
        to: '0xACa94ef8bD5ffEE41947b4585a84BdA5a3d3DA6E',
        amount: 5200,
        status: 'success',
        timestamp: 38,
        blockNumber: 245787
      },
      {
        hash: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30e5a8d0f2b4c6e8d0f2b4c6e8',
        from: '0x1dF62f291b2E969fB0849d99D9Ce41e2F137006e',
        to: '0x610B717796ad172B316836AC95a2ffad065CeaB4',
        amount: 12000,
        status: 'success',
        timestamp: 48,
        blockNumber: 245786
      },
      {
        hash: '0x95cED938F7991cd0dFcb48F0a06a40FA1aF46EBCf4b7c9e1a3d5f7c9e1a3d5f7',
        from: '0x178169B423a011fff22B9e3F3abeA13414dDD0F1',
        to: '0xF7eB46Fa95CCfB7642fA4a2E3f3C9748F0a4a8D9',
        amount: 3300,
        status: 'failed',
        timestamp: 58,
        blockNumber: 245785
      },
      {
        hash: '0x3E5e9111Ae8eB78Fe1CC3bb8915d5D461F3Ef9A9a3c6d8f0b2e4a6c8f0b2e4a6',
        from: '0x07687e702b410Fa43f4cB4Af7fA097918ffD2730',
        to: '0x4E9ce36E442e55EcD9025B9a6E0D88485d628A67',
        amount: 6800,
        status: 'success',
        timestamp: 68,
        blockNumber: 245784
      },
      {
        hash: '0x28a8746e75304c0780E39d3a14F80f7E4fe3951Cb2e5d7f9a1c3e5d7f9a1c3e5',
        from: '0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7',
        to: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        amount: 9500,
        status: 'success',
        timestamp: 78,
        blockNumber: 245783
      },
      {
        hash: '0xACa94ef8bD5ffEE41947b4585a84BdA5a3d3DA6Ed1f4c6a8e0b2d4f6a8e0b2d4',
        from: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        to: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        amount: 18500,
        status: 'pending',
        timestamp: 88,
        blockNumber: 245782
      },
      {
        hash: '0x1dF62f291b2E969fB0849d99D9Ce41e2F137006ee0c3f5b7d9a1e3f5b7d9a1e3',
        from: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
        to: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
        amount: 4100,
        status: 'success',
        timestamp: 98,
        blockNumber: 245781
      }
    ]
  }
}

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
            <span className="text-foreground">Onchain ENS</span>
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
