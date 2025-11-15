import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  AlertCircle,
  ChevronRight,
  Clock,
  Check,
  X,
  AlertTriangle,
  ChevronDown
} from 'lucide-react'
import governanceData from '@/data/governance.json'
import chainsData from '@/data/chains.json'
import { useWallet } from '@/contexts/wallet-context'

// Helper function to get chain by ID
const getChainById = (chainId) => {
  return chainsData.find(chain => chain.id === chainId) || null
}

// Mock data for proposals with chain info
const mockProposals = governanceData.proposals.map(proposal => {
  const chain = getChainById(proposal.chainId)
  return {
    ...proposal,
    network: chain?.name || 'Unknown Network',
    chainLogo: chain?.logo,
    chainColor: chain?.brandColor || '#1dd13a',
    tokenSymbol: chain?.ticker || 'CNPY'
  }
})


export default function GovernanceTab() {
  const navigate = useNavigate()
  const { getTotalBalance, getWalletData } = useWallet()
  const [filter, setFilter] = useState('all') // all, active, passed, failed
  const [selectedChain, setSelectedChain] = useState(null) // null means "All Chains"
  const [showLeftGradient, setShowLeftGradient] = useState(false)
  const [showRightGradient, setShowRightGradient] = useState(true)
  const scrollContainerRef = useRef(null)

  const totalBalance = getTotalBalance()
  const walletData = getWalletData()

  // Get unique chain IDs that have governance proposals
  const governanceChainIds = [...new Set(mockProposals.map(p => p.chainId))]

  // Calculate voting power distribution for ALL chains with governance (even if balance is 0)
  const votingPowerByChain = governanceChainIds.map(chainId => {
    const asset = (walletData?.assets || []).find(a => a.chainId === chainId)
    const chain = getChainById(chainId)
    const balance = asset ? asset.value : 0

    return {
      chainId: chainId,
      chainName: chain?.name || 'Unknown',
      chainColor: chain?.brandColor || '#1dd13a',
      balance: balance,
      percentage: totalBalance > 0 ? (balance / totalBalance) * 100 : 0
    }
  }).sort((a, b) => b.balance - a.balance)

  // Get unique chains from proposals
  const uniqueChains = [...new Set(mockProposals.map(p => p.chainId))]
    .map(chainId => getChainById(chainId))
    .filter(Boolean)

  // Handle scroll to show/hide gradients
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
        setShowLeftGradient(scrollLeft > 0)
        setShowRightGradient(scrollLeft < scrollWidth - clientWidth - 10)
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      handleScroll() // Initial check
      container.addEventListener('scroll', handleScroll)
      // Also check on window resize
      window.addEventListener('resize', handleScroll)
      return () => {
        container.removeEventListener('scroll', handleScroll)
        window.removeEventListener('resize', handleScroll)
      }
    }
  }, [uniqueChains])

  const handleProposalClick = (proposal) => {
    navigate(`/governance/${proposal.id}`)
  }

  const handleChainClick = (chainId) => {
    setSelectedChain(selectedChain === chainId ? null : chainId)
  }

  const getStatusLabel = () => {
    switch (filter) {
      case 'all':
        return 'All Proposals'
      case 'active':
        return `Active (${activeProposalsCount})`
      case 'passed':
        return `Passed (${passedProposalsCount})`
      case 'failed':
        return `Not Passed (${failedProposalsCount})`
      default:
        return 'All Proposals'
    }
  }

  const getUrgencyBadge = (urgency) => {
    if (urgency === 'urgent') {
      return (
        <Badge variant="outline" className="border-orange-500/50 text-orange-500 gap-1">
          <AlertCircle className="w-3 h-3" />
          URGENT
        </Badge>
      )
    }
    return null
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'passed':
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            Passed
          </Badge>
        )
      case 'failed':
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            Not Passed
          </Badge>
        )
      default:
        return null
    }
  }

  const getFilteredProposals = () => {
    let filtered = mockProposals

    // Filter by status
    if (filter !== 'all') {
      filtered = filtered.filter(p => p.status === filter)
    }

    // Filter by selected chain
    if (selectedChain !== null) {
      filtered = filtered.filter(p => p.chainId === selectedChain)
    }

    return filtered
  }

  const activeProposalsCount = mockProposals.filter(p => p.status === 'active').length
  const passedProposalsCount = mockProposals.filter(p => p.status === 'passed').length
  const failedProposalsCount = mockProposals.filter(p => p.status === 'failed').length

  return (
    <div className="">
      {/* Voting Power Card - Compact */}
      <Card className="mb-6">
        <CardContent className="px-5 py-4">
          <div className="space-y-5">
            <div className="space-y-1">
              <p className="text-lg font-bold text-white">Total Voting Power</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold">${totalBalance.toLocaleString()}</p>
                <span className="text-sm text-muted-foreground">USD</span>
              </div>
            </div>
            {votingPowerByChain.length > 0 && (
              <TooltipProvider>
                <div className="flex items-center gap-2">
                  {votingPowerByChain.map((item) => (
                    <Tooltip key={item.chainId}>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1.5 text-xs cursor-pointer">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.chainColor }}
                          />
                          <span className="text-muted-foreground">${item.balance.toLocaleString()}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{item.chainName}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </TooltipProvider>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filters Section */}
      <div className="mt-10 mb-5">
        <div className="flex items-center justify-between gap-4 mb-4">
          {/* Chain Pills with Scroll Container */}
          <div className="relative flex-1 min-w-0 w-[300px]">
            {/* Left Gradient */}
            {showLeftGradient && (
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            )}

            {/* Scrollable Container */}
            <div
              ref={scrollContainerRef}
              className="flex items-center gap-2 overflow-x-auto scrollbar-hide"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {/* All Chains Pill */}
              <button
                onClick={() => handleChainClick(null)}
                className={`h-9 px-4 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
                  selectedChain === null
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                All Chains
              </button>

              {/* All Chain Pills (showing all, not just first 3) */}
              {uniqueChains.map((chain) => (
                <button
                  key={chain.id}
                  onClick={() => handleChainClick(chain.id)}
                  className={`h-9 px-4 rounded-full text-sm font-medium transition-colors flex items-center gap-2 flex-shrink-0 ${
                    selectedChain === chain.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: chain.brandColor }}
                  >
                    <span className="text-[8px] font-bold text-white">
                      {chain.name.substring(0, 1)}
                    </span>
                  </div>
                  <span>{chain.name}</span>
                </button>
              ))}
            </div>

            {/* Right Gradient */}
            {showRightGradient && (
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
            )}
          </div>

          {/* Status Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9 rounded-full">
                {getStatusLabel()}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={filter === 'all'}
                onCheckedChange={() => setFilter('all')}
              >
                All Proposals
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filter === 'active'}
                onCheckedChange={() => setFilter('active')}
              >
                <div className="flex items-center justify-between w-full">
                  <span>Active</span>
                  <Badge variant="secondary" className="ml-2">
                    {activeProposalsCount}
                  </Badge>
                </div>
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filter === 'passed'}
                onCheckedChange={() => setFilter('passed')}
              >
                <div className="flex items-center justify-between w-full">
                  <span>Passed</span>
                  <Badge variant="secondary" className="ml-2">
                    {passedProposalsCount}
                  </Badge>
                </div>
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filter === 'failed'}
                onCheckedChange={() => setFilter('failed')}
              >
                <div className="flex items-center justify-between w-full">
                  <span>Not Passed</span>
                  <Badge variant="secondary" className="ml-2">
                    {failedProposalsCount}
                  </Badge>
                </div>
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Proposals List */}
        <div className="space-y-4">
          {getFilteredProposals().length > 0 ? (
            getFilteredProposals().map((proposal) => (
              <Card
                key={proposal.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleProposalClick(proposal)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-4 flex-1">
                      {/* Network info with avatar */}
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold"
                          style={{ backgroundColor: proposal.chainColor }}
                        >
                          {proposal.network.charAt(0)}
                        </div>
                        <span className="font-semibold">{proposal.network}</span>
                      </div>

                      {/* Title - Made smaller */}
                      <CardTitle className="text-base font-semibold">{proposal.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pb-4">
                  <p className="text-sm text-muted-foreground">{proposal.description}</p>

                  {/* Voting Progress - Show for all statuses */}
                  <div className="space-y-2">
                    {/* Progress Bar */}
                    <div className="relative h-2 flex gap-0.5 rounded-full overflow-hidden bg-transparent">
                      {/* For Section */}
                      <div
                        className={`rounded-full transition-all ${
                          proposal.status === 'active'
                            ? 'bg-green-500/70'
                            : proposal.status === 'passed'
                              ? 'bg-green-500/70'
                              : 'bg-green-500/20'
                        }`}
                        style={{ width: `${proposal.votesFor}%` }}
                      />
                      {/* Gap */}
                      <div className="w-0.5" />
                      {/* Against Section */}
                      <div
                        className={`rounded-full transition-all ${
                          proposal.status === 'active'
                            ? 'bg-red-500/60'
                            : proposal.status === 'passed'
                              ? 'bg-red-500/15'
                              : 'bg-red-500/60'
                        }`}
                        style={{ width: `${proposal.votesAgainst}%` }}
                      />
                    </div>

                    {/* Labels Below */}
                    <div className="flex justify-between text-xs">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Check className="w-3 h-3 text-green-600" />
                        <span className="font-medium">For</span>
                        <span>({proposal.votesFor}%) · {((proposal.totalVotes * proposal.votesFor) / 100).toLocaleString()} {proposal.tokenSymbol}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <span>{((proposal.totalVotes * proposal.votesAgainst) / 100).toLocaleString()} {proposal.tokenSymbol} · ({proposal.votesAgainst}%)</span>
                        <span className="font-medium">Against</span>
                        <X className="w-3 h-3 text-red-600" />
                      </div>
                    </div>
                  </div>

                  {/* Divider Line */}
                  <div className="border-t" />

                  {/* Bottom Section: Badges on left, Vote + Chevron on right */}
                  <div className="flex items-center justify-between">
                    {/* Left: Badges */}
                    <div className="flex items-center gap-2">
                      {getUrgencyBadge(proposal.urgency)}
                      {getStatusBadge(proposal.status)}
                      {proposal.status === 'active' && (
                        <Badge variant="outline" className="gap-1">
                          <Clock className="w-3 h-3" />
                          Ends in {proposal.endsIn}
                        </Badge>
                      )}
                    </div>

                    {/* Right: Your Vote + Chevron */}
                    <div className="flex items-center gap-2">
                      {proposal.userVote && (
                        <Badge variant="secondary" className="text-xs">
                          Your Vote: {proposal.userVote === 'for' ? '✓' : '✗'}
                        </Badge>
                      )}
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            // Empty State
            <Card className="p-12 border-0">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-muted rounded-full">
                  <AlertTriangle className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">No proposals found</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    {selectedChain !== null || filter !== 'all'
                      ? 'Try adjusting your filters to see more proposals'
                      : 'There are no governance proposals at this time. Check back later for new proposals.'}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}