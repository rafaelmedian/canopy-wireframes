import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Info } from 'lucide-react'
import StakeDialog from './stake-dialog'

export default function StakingTab({ stakes, assets, totalInterestEarned = 20.00 }) {
  const [stakeDialogOpen, setStakeDialogOpen] = useState(false)
  const [selectedStake, setSelectedStake] = useState(null)

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

      {/* Staking Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Chain</TableHead>
              <TableHead>Annual yield</TableHead>
              <TableHead>Current Earned Balance</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stakes.length > 0 ? (
              stakes.map((stake) => (
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
                        <Button size="sm" variant="outline" className="h-9">
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
    </div>

    {/* Stake Dialog */}
    <StakeDialog
      open={stakeDialogOpen}
      onOpenChange={setStakeDialogOpen}
      selectedChain={selectedStake}
    />
    </TooltipProvider>
  )
}
