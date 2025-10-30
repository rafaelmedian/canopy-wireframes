import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Info, ArrowUpDown, CheckCircle2 } from 'lucide-react'
import StakeDialog from './stake-dialog'
import ClaimDialog from './claim-dialog'
import UnstakeDialog from './unstake-dialog'
import UnstakingDetailSheet from './unstaking-detail-sheet'
import CancelUnstakeDialog from './cancel-unstake-dialog'

export default function StakingTab({ stakes, assets, unstaking, totalInterestEarned = 20.00 }) {
  const [stakeDialogOpen, setStakeDialogOpen] = useState(false)
  const [claimDialogOpen, setClaimDialogOpen] = useState(false)
  const [unstakeDialogOpen, setUnstakeDialogOpen] = useState(false)
  const [unstakingDetailOpen, setUnstakingDetailOpen] = useState(false)
  const [cancelUnstakeDialogOpen, setCancelUnstakeDialogOpen] = useState(false)
  const [selectedStake, setSelectedStake] = useState(null)
  const [selectedUnstaking, setSelectedUnstaking] = useState(null)
  const [sortBy, setSortBy] = useState('apy')
  const [sortOrder, setSortOrder] = useState('desc')
  const [activeStakingTab, setActiveStakingTab] = useState('available')
  const [canceledUnstakeIds, setCanceledUnstakeIds] = useState([])

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('desc')
    }
  }

  const sortedStakes = [...stakes].sort((a, b) => {
    let compareA, compareB

    switch (sortBy) {
      case 'apy':
        compareA = a.apy
        compareB = b.apy
        break
      case 'earnings':
        compareA = a.rewardsUSD || 0
        compareB = b.rewardsUSD || 0
        break
      default:
        compareA = a.apy
        compareB = b.apy
    }

    if (sortOrder === 'asc') {
      return compareA > compareB ? 1 : -1
    } else {
      return compareA < compareB ? 1 : -1
    }
  })

  const handleStakeClick = (stake) => {
    // Find the corresponding asset to get price and balance
    const asset = assets?.find(a => a.chainId === stake.chainId)
    const enrichedStake = {
      ...stake,
      price: asset?.price || 0,
      balance: asset?.balance || 0
    }
    setSelectedStake(enrichedStake)
    setStakeDialogOpen(true)
  }

  const handleClaimClick = (stake) => {
    setSelectedStake(stake)
    setClaimDialogOpen(true)
  }

  const handleUnstakeClick = (stake) => {
    // Find the corresponding asset to get price
    const asset = assets?.find(a => a.chainId === stake.chainId)
    const enrichedStake = {
      ...stake,
      price: asset?.price || 0
    }
    setSelectedStake(enrichedStake)
    setUnstakeDialogOpen(true)
  }

  const handleViewUnstakingDetails = (item) => {
    setSelectedUnstaking(item)
    setUnstakingDetailOpen(true)
  }

  const handleCancelUnstake = (item) => {
    setSelectedUnstaking(item)
    setCancelUnstakeDialogOpen(true)
  }

  const handleConfirmCancelUnstake = (item) => {
    // Add the item ID to the canceled list (removes it visually)
    setCanceledUnstakeIds(prev => [...prev, item.id])
    // TODO: Implement actual API call to cancel unstake
    console.log('Confirmed cancel unstake for:', item)
  }

  // Filter out canceled unstaking items
  const visibleUnstaking = unstaking?.filter(item => !canceledUnstakeIds.includes(item.id)) || []
  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Total Interest Earned Section */}
        <Card className="p-1">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="space-y-1">
              <p className="text-lg font-bold text-white">Total interest earned to date</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold">
                  ${totalInterestEarned.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
                <span className="text-sm text-muted-foreground">USD</span>
              </div>

              <div className="flex items-center gap-1.5 mt-4">
                <p className="text-sm text-muted-foreground">Earn up to 8.05% APY on your crypto. Redeem any time.</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Annual Percentage Yield (APY) varies by asset and network conditions.</p>
                    <p className="mt-1 text-xs text-muted-foreground">You can unstake and withdraw your funds at any time.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <Button variant="outline" className="h-10">
              View Earn Balances
            </Button>
          </div>
        </Card>

      {/* Staking Tabs */}
      <Tabs value={activeStakingTab} onValueChange={setActiveStakingTab}>
        <TabsList className="w-full justify-start mb-6">
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="active">
            Active Stakes
            <Badge variant="secondary" className="ml-2">
              {sortedStakes.filter(s => s.amount > 0).length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="queue">
            Unstaking Queue
            <Badge variant="secondary" className="ml-2">
              {visibleUnstaking.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Available Chains */}
        <TabsContent value="available">
          <Card>
            <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Chain</TableHead>
              <TableHead
                className="cursor-pointer hover:text-foreground"
                onClick={() => handleSort('apy')}
              >
                <div className="flex items-center gap-2">
                  Annual yield
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:text-foreground"
                onClick={() => handleSort('earnings')}
              >
                <div className="flex items-center gap-2">
                  Current Earned Balance
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedStakes.length > 0 ? (
              sortedStakes.map((stake) => (
                <TableRow key={stake.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: stake.color }}
                      >
                        <span className="text-sm font-bold text-white">
                          {stake.symbol.slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold">{stake.chain}</div>
                        <div className="text-sm text-muted-foreground">{stake.symbol}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{stake.apy}%</div>
                  </TableCell>
                  <TableCell>
                    {stake.rewards && stake.rewards > 0 ? (
                      <div>
                        <div className="font-medium">
                          {stake.rewards} {stake.symbol}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {stake.rewardsUSD ? `${stake.rewardsUSD.toFixed(2)} USD` : ''}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">Not yet earning</div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {stake.rewards > 0 && (
                        <Button size="sm" variant="outline" className="h-9" onClick={() => handleClaimClick(stake)}>
                          Claim
                        </Button>
                      )}
                      <Button size="sm" className="h-9" onClick={() => handleStakeClick(stake)}>
                        Stake
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12">
                  <div className="flex flex-col items-center">
                    <p className="text-sm font-medium text-muted-foreground mb-1">No staking positions</p>
                    <p className="text-xs text-muted-foreground">Start staking to earn rewards</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
        </TabsContent>

        {/* Tab 2: Active Stakes */}
        <TabsContent value="active">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Chain</TableHead>
                  <TableHead>Staked Amount</TableHead>
                  <TableHead>APY</TableHead>
                  <TableHead>Rewards Earned</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedStakes.filter(stake => stake.amount > 0).length > 0 ? (
                  sortedStakes.filter(stake => stake.amount > 0).map((stake) => {
                    const asset = assets?.find(a => a.chainId === stake.chainId)
                    const stakedValueUSD = (stake.amount || 0) * (asset?.price || 0)

                    return (
                      <TableRow key={stake.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: stake.color }}
                            >
                              <span className="text-sm font-bold text-white">
                                {stake.symbol.slice(0, 2)}
                              </span>
                            </div>
                            <div>
                              <div className="font-semibold">{stake.chain}</div>
                              <div className="text-sm text-muted-foreground">{stake.symbol}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{stake.amount} {stake.symbol}</div>
                          <div className="text-sm text-muted-foreground">
                            ${stakedValueUSD.toFixed(2)} USD
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{stake.apy}%</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{stake.rewards || 0} {stake.symbol}</div>
                          {stake.rewardsUSD > 0 && (
                            <div className="text-sm text-muted-foreground">
                              ${stake.rewardsUSD.toFixed(2)} USD
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-9"
                            onClick={() => handleUnstakeClick(stake)}
                          >
                            Unstake
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <div className="flex flex-col items-center">
                        <p className="text-sm font-medium text-muted-foreground mb-1">No active stakes</p>
                        <p className="text-xs text-muted-foreground">Start staking to earn rewards</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Tab 3: Unstaking Queue */}
        <TabsContent value="queue">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Chain</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Available In</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleUnstaking.length > 0 ? (
                  visibleUnstaking.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: stakes.find(s => s.chainId === item.chainId)?.color }}
                          >
                            <span className="text-sm font-bold text-white">
                              {item.symbol.slice(0, 2)}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold">{item.symbol}</div>
                            <Badge variant="secondary" className="mt-1">Pending</Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{item.amount} {item.symbol}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {item.daysRemaining} days, {item.hoursRemaining} hours
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-9"
                            onClick={() => handleViewUnstakingDetails(item)}
                          >
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-9"
                            onClick={() => handleCancelUnstake(item)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="p-4 bg-muted rounded-full">
                          <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">No pending unstakes</p>
                          <p className="text-xs text-muted-foreground">Unstaked funds will appear here during the unstaking period</p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>

    {/* Stake Dialog */}
    <StakeDialog
      open={stakeDialogOpen}
      onOpenChange={setStakeDialogOpen}
      selectedChain={selectedStake}
    />

    {/* Claim Dialog */}
    <ClaimDialog
      open={claimDialogOpen}
      onOpenChange={setClaimDialogOpen}
      selectedStake={selectedStake}
    />

    {/* Unstake Dialog */}
    <UnstakeDialog
      open={unstakeDialogOpen}
      onOpenChange={setUnstakeDialogOpen}
      selectedStake={selectedStake}
    />

    {/* Unstaking Detail Sheet */}
    <UnstakingDetailSheet
      unstakingItem={selectedUnstaking}
      stakes={stakes}
      open={unstakingDetailOpen}
      onOpenChange={setUnstakingDetailOpen}
      onCancel={handleCancelUnstake}
    />

    {/* Cancel Unstake Confirmation Dialog */}
    <CancelUnstakeDialog
      open={cancelUnstakeDialogOpen}
      onOpenChange={setCancelUnstakeDialogOpen}
      unstakingItem={selectedUnstaking}
      onConfirm={handleConfirmCancelUnstake}
    />
    </TooltipProvider>
  )
}
