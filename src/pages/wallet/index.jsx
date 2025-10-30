import { useState, useEffect } from 'react'
import MainSidebar from '@/components/main-sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Send,
  Download,
  Repeat,
  Coins
} from 'lucide-react'
import AssetsTab from './components/assets-tab'
import StakingTab from './components/staking-tab'
import ActivityTab from './components/activity-tab'
import StakeDialog from './components/stake-dialog'
import walletData from '@/data/wallet.json'

export default function Wallet() {
  const [activeTab, setActiveTab] = useState('assets')
  const [stakeDialogOpen, setStakeDialogOpen] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="flex min-h-screen bg-background">
      <MainSidebar />

      <div className="flex-1 p-6 pt-4">
        <div className="max-w-[1024px] mx-auto flex gap-12">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Tabs at Top */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="h-auto w-full justify-start bg-transparent p-0 border-b rounded-none">
                <TabsTrigger
                  value="assets"
                  className="py-4 px-0 mr-8 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent bg-transparent"
                >
                  Assets
                </TabsTrigger>
                <TabsTrigger
                  value="staking"
                  className="py-4 px-0 mr-8 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent bg-transparent"
                >
                  Staking
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="py-4 px-0 mr-8 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent bg-transparent"
                >
                  Activity
                </TabsTrigger>
                <TabsTrigger
                  value="governance"
                  className="py-4 px-0 mr-8 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent bg-transparent"
                >
                  Governance
                </TabsTrigger>
              </TabsList>

              {/* Assets Tab */}
              <TabsContent value="assets">
                <AssetsTab
                  assets={walletData.assets}
                  totalValue={walletData.totalValue}
                />
              </TabsContent>

              {/* Staking Tab */}
              <TabsContent value="staking">
                <StakingTab
                  stakes={walletData.stakes}
                  assets={walletData.assets}
                  unstaking={walletData.unstaking}
                />
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity">
                <ActivityTab transactions={walletData.transactions} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Quick Actions Card - Right Side */}
          <div className="w-64 shrink-0 pt-[88px]">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <Send className="w-5 h-5" />
                  <span className="text-sm">Send</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <Download className="w-5 h-5" />
                  <span className="text-sm">Receive</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <Repeat className="w-5 h-5" />
                  <span className="text-sm">Swap</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2"
                  onClick={() => setStakeDialogOpen(true)}
                >
                  <Coins className="w-5 h-5" />
                  <span className="text-sm">Stake</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stake Dialog for Quick Actions */}
        <StakeDialog
          open={stakeDialogOpen}
          onOpenChange={setStakeDialogOpen}
          selectedChain={null}
          availableChains={walletData.stakes}
          assets={walletData.assets}
        />
      </div>
    </div>
  )
}
