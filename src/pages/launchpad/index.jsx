import { useState, useEffect } from 'react'
import MainSidebar from '@/components/main-sidebar'
import TopChainCarousel from './components/top-chain-carousel'
import FilterBar from './components/filter-bar'
import ChainCard from './components/chain-card'
import ChainListItem from './components/chain-list-item'

// Mock data for demonstration
const MOCK_TOP_CHAINS = [
  {
    id: 1,
    name: 'Onchain BNB',
    ticker: 'OBNB',
    logo: null,
    brandColor: '#f59e0b',
    tagline: 'Airbnb on the blockchain',
    description: 'Decentralized short-term rental marketplace. List your property, earn crypto, zero platform fees.',
    marketCap: 34200,
    goal: 50000,
    change24h: 15.3,
    currentPrice: 0.0068,
    holderCount: 287,
    volume: 12400,
    url: '/chain/onchain-bnb'
  },
  {
    id: 2,
    name: 'DeFi Masters',
    ticker: 'DFIM',
    logo: null,
    brandColor: '#8b5cf6',
    tagline: 'Master the DeFi universe',
    description: 'Next-gen DeFi protocol with auto-compounding yields and cross-chain liquidity pools.',
    marketCap: 47800,
    goal: 50000,
    change24h: 22.7,
    currentPrice: 0.0095,
    holderCount: 512,
    volume: 18900,
    url: '/chain/defi-masters'
  },
  {
    id: 3,
    name: 'NFT Galaxy',
    ticker: 'NFTG',
    logo: null,
    brandColor: '#ec4899',
    tagline: 'Your NFT marketplace reimagined',
    description: 'Zero-fee NFT marketplace with AI-powered discovery and instant royalty payments.',
    marketCap: 28600,
    goal: 50000,
    change24h: 8.4,
    currentPrice: 0.0057,
    holderCount: 423,
    volume: 15200,
    url: '/chain/nft-galaxy'
  },
  {
    id: 4,
    name: 'Green Energy Chain',
    ticker: 'GEC',
    logo: null,
    brandColor: '#10b981',
    tagline: 'Sustainable blockchain for tomorrow',
    description: 'Carbon-negative proof-of-stake blockchain. Every transaction plants a tree.',
    marketCap: 41300,
    goal: 50000,
    change24h: 18.9,
    currentPrice: 0.0083,
    holderCount: 658,
    volume: 21700,
    url: '/chain/green-energy'
  }
]

const MOCK_CHAINS = [
  {
    id: 5,
    name: 'MetaVerse Protocol',
    ticker: 'MVP',
    logo: null,
    brandColor: '#3b82f6',
    description: 'Building spatial computing infrastructure for immersive 3D experiences and virtual worlds.',
    marketCap: 24500,
    goal: 50000,
    change24h: 11.8,
    currentPrice: 0.0049,
    holderCount: 318,
    volume: 8900,
    url: '/chain/metaverse-protocol'
  },
  {
    id: 6,
    name: 'GameFi Chain',
    ticker: 'GFC',
    logo: null,
    brandColor: '#f97316',
    description: 'Play-to-earn gaming platform with skill-based tournaments and NFT item marketplace.',
    marketCap: 31200,
    goal: 50000,
    change24h: 7.2,
    currentPrice: 0.0062,
    holderCount: 445,
    volume: 13600,
    url: '/chain/gamefi-chain'
  },
  {
    id: 7,
    name: 'Social Connect',
    ticker: 'SOCL',
    logo: null,
    brandColor: '#06b6d4',
    description: 'Decentralized social network where creators own their content and earn from engagement.',
    marketCap: 19700,
    goal: 50000,
    change24h: 5.6,
    currentPrice: 0.0039,
    holderCount: 892,
    volume: 6800,
    url: '/chain/social-connect'
  },
  {
    id: 8,
    name: 'AI Trading Bot',
    ticker: 'AITB',
    logo: null,
    brandColor: '#a855f7',
    description: 'Machine learning powered trading algorithms with real-time market analysis.',
    marketCap: 43600,
    goal: 50000,
    change24h: 19.4,
    currentPrice: 0.0087,
    holderCount: 234,
    volume: 24100,
    url: '/chain/ai-trading'
  },
  {
    id: 9,
    name: 'Cross Chain Bridge',
    ticker: 'CCB',
    logo: null,
    brandColor: '#14b8a6',
    description: 'Instant cross-chain asset transfers with minimal fees and maximum security.',
    marketCap: 36800,
    goal: 50000,
    change24h: 13.2,
    currentPrice: 0.0074,
    holderCount: 567,
    volume: 19200,
    url: '/chain/cross-chain'
  },
  {
    id: 10,
    name: 'Privacy Shield',
    ticker: 'PRIV',
    logo: null,
    brandColor: '#6366f1',
    description: 'Zero-knowledge proof transactions ensuring complete anonymity and data privacy.',
    marketCap: 27400,
    goal: 50000,
    change24h: 9.1,
    currentPrice: 0.0055,
    holderCount: 189,
    volume: 11300,
    url: '/chain/privacy-shield'
  },
  {
    id: 11,
    name: 'Real Estate DAO',
    ticker: 'REDAO',
    logo: null,
    brandColor: '#84cc16',
    description: 'Tokenized property investments starting from $100. Earn rental income daily.',
    marketCap: 38900,
    goal: 50000,
    change24h: 14.7,
    currentPrice: 0.0078,
    holderCount: 421,
    volume: 16500,
    url: '/chain/real-estate-dao'
  },
  {
    id: 12,
    name: 'Music Rights Chain',
    ticker: 'MRC',
    logo: null,
    brandColor: '#f43f5e',
    description: 'Direct artist-to-fan music platform with instant royalty payments and NFT albums.',
    marketCap: 22100,
    goal: 50000,
    change24h: 6.3,
    currentPrice: 0.0044,
    holderCount: 734,
    volume: 9400,
    url: '/chain/music-rights'
  }
]

export default function Launchpad() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [filteredChains, setFilteredChains] = useState(MOCK_CHAINS)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    // Filter chains based on active filter
    let filtered = [...MOCK_CHAINS]

    switch (activeFilter) {
      case 'trending':
        filtered = filtered.filter(chain => chain.change24h > 5)
        break
      case 'new':
        filtered = filtered.sort((a, b) => b.id - a.id).slice(0, 4)
        break
      case 'graduated':
        filtered = filtered.filter(chain => chain.marketCap >= chain.goal)
        break
      case 'scheduled':
        filtered = [] // No scheduled chains in mock data
        break
      default:
        // 'all' - show all chains
        break
    }

    setFilteredChains(filtered)
  }, [activeFilter])

  return (
    <div className="flex min-h-screen bg-background">
      <MainSidebar />

      <div className="flex-1 p-8 space-y-8">
        {/* Top Chains Carousel */}
        <div>
          <h1 className="text-2xl font-bold mb-6">Top Chains</h1>
          <TopChainCarousel chains={MOCK_TOP_CHAINS} />
        </div>

        {/* Filter Bar */}
        <FilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Chains Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredChains.length > 0 ? (
              filteredChains.map((chain) => (
                <ChainCard key={chain.id} chain={chain} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">
                  No chains found for this filter.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredChains.length > 0 ? (
              filteredChains.map((chain) => (
                <ChainListItem key={chain.id} chain={chain} />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No chains found for this filter.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
