import { useState, useEffect } from 'react'
import MainSidebar from '@/components/main-sidebar'
import TopChainCarousel from './components/top-chain-carousel'
import FilterBar from './components/filter-bar'
import ChainCard from './components/chain-card'
import ChainListItem from './components/chain-list-item'
import { Button } from '@/components/ui/button'
import { Share2 } from 'lucide-react'
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
  const [sortBy, setSortBy] = useState('marketcap')
  const [filteredChains, setFilteredChains] = useState(ALL_CHAINS)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    // Filter chains based on active filter
    let filtered = [...ALL_CHAINS]

    switch (activeFilter) {
      case 'trending':
        filtered = filtered.filter(chain => chain.priceChange24h > 5 && !chain.isDraft)
        break
      case 'new':
        filtered = filtered.filter(chain => !chain.isDraft).sort((a, b) => b.id - a.id).slice(0, 4)
        break
      case 'graduated':
        filtered = filtered.filter(chain => chain.isGraduated === true && !chain.isDraft)
        break
      case 'scheduled':
        filtered = filtered.filter(chain => chain.isDraft === true)
        break
      default:
        // 'all' - show all chains except drafts (drafts only accessible via URL)
        filtered = filtered.filter(chain => !chain.isDraft)
        break
    }

    // Apply sorting
    switch (sortBy) {
      case 'marketcap':
        filtered = filtered.sort((a, b) => b.marketCap - a.marketCap)
        break
      case 'holders':
        filtered = filtered.sort((a, b) => b.holderCount - a.holderCount)
        break
      case 'volume':
        filtered = filtered.sort((a, b) => b.volume - a.volume)
        break
      case 'price':
        filtered = filtered.sort((a, b) => b.currentPrice - a.currentPrice)
        break
      case 'created':
        filtered = filtered.sort((a, b) => b.id - a.id)
        break
      default:
        break
    }

    setFilteredChains(filtered)
  }, [activeFilter, sortBy])

  return (
    <div className="flex min-h-screen bg-background">
      <MainSidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Header Navigation */}
        <header className="border-b border-border sticky top-0 bg-background z-10">
          <div className="flex items-center justify-between h-14 px-6">
            <div className="flex items-center gap-3">
              <h1 className="text-base font-semibold">Launchpad</h1>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 p-6 pt-4">
          <div className="max-w-[1024px] mx-auto space-y-8">
          {/* Filter Bar */}
        <FilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Chains Grid/List */}
        <div className="space-y-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
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
      </div>
    </div>
  )
}
