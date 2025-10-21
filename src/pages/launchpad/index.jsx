import { useState, useEffect } from 'react'
import MainSidebar from '@/components/main-sidebar'
import TopChainCarousel from './components/top-chain-carousel'
import FilterBar from './components/filter-bar'
import ChainCard from './components/chain-card'
import ChainListItem from './components/chain-list-item'
import { getAllChains } from '@/data/db'

export default function Launchpad() {
  // Get all chains from database
  const ALL_CHAINS = getAllChains()

  // Top chains are the ones with highest market cap (top 5)
  const TOP_CHAINS = [...ALL_CHAINS]
    .sort((a, b) => b.marketCap - a.marketCap)
    .slice(0, 5)

  const [activeFilter, setActiveFilter] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [filteredChains, setFilteredChains] = useState(ALL_CHAINS)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    // Filter chains based on active filter
    let filtered = [...ALL_CHAINS]

    switch (activeFilter) {
      case 'trending':
        filtered = filtered.filter(chain => chain.priceChange24h > 5)
        break
      case 'new':
        filtered = filtered.sort((a, b) => b.id - a.id).slice(0, 4)
        break
      case 'graduated':
        filtered = filtered.filter(chain => chain.isGraduated === true)
        break
      case 'scheduled':
        filtered = filtered.filter(chain => chain.isDraft === true)
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

      <div className="flex-1 p-6 pt-4 space-y-8">
        {/* Top Chains Carousel */}
        <div>
          <h1 className="text-[16px] font-bold mb-6">Top Chains</h1>
          <TopChainCarousel chains={TOP_CHAINS} />
        </div>

        {/* Filter Bar */}
        <FilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Chains Grid/List */}
        <div className="space-y-6">
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

          {/* Loading spinner at the bottom */}
          {filteredChains.length > 0 && (
            <div className="flex items-center justify-center py-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
