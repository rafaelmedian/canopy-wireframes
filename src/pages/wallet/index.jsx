import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import MainSidebar from '@/components/main-sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Send,
  Download,
  Repeat,
  Coins,
  Settings,
  LogOut,
  Copy
} from 'lucide-react'
import AssetsTab from './components/assets-tab'
import StakingTab from './components/staking-tab'
import ActivityTab from './components/activity-tab'
import GovernanceTab from './components/governance-tab'
import StakeDialog from './components/stake-dialog'
import CnpyStakeDialog from './components/cnpy-stake-dialog'
import SendDialog from './components/send-dialog'
import BuyDialog from './components/buy-dialog'
import WalletConnectionDialog from '@/components/wallet-connection-dialog'
import { useWallet } from '@/contexts/wallet-context'
import { toast } from 'sonner'

export default function Wallet() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const tabParam = searchParams.get('tab') || 'assets'
  const [activeTab, setActiveTab] = useState(tabParam)
  const [stakeDialogOpen, setStakeDialogOpen] = useState(false)
  const [cnpyStakeDialogOpen, setCnpyStakeDialogOpen] = useState(false)
  const [selectedCnpyStake, setSelectedCnpyStake] = useState(null)
  const [sendDialogOpen, setSendDialogOpen] = useState(false)
  const [buyDialogOpen, setBuyDialogOpen] = useState(false)
  const [switchWalletDialogOpen, setSwitchWalletDialogOpen] = useState(false)
  const { isConnected, connectWallet, walletAddress, formatAddress, disconnectWallet, getWalletData, currentUser, currentWallet } = useWallet()

  const walletData = getWalletData()

  useEffect(() => {
    window.scrollTo(0, 0)
    // Auto-connect wallet when visiting wallet page
    if (!isConnected) {
      connectWallet()
    }
  }, [isConnected, connectWallet])

  // Update active tab when URL changes
  useEffect(() => {
    setActiveTab(tabParam)
  }, [tabParam])

  // Update URL when tab changes
  const handleTabChange = (newTab) => {
    setActiveTab(newTab)
    navigate(`/wallet?tab=${newTab}`)
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress)
    toast.success('Address copied to clipboard')
  }

  const handleDisconnect = () => {
    navigate('/')
    // Disconnect wallet after navigation
    setTimeout(() => {
      disconnectWallet()
    }, 100)
  }

  const handleCnpySelected = (cnpyChain) => {
    setSelectedCnpyStake(cnpyChain)
    setCnpyStakeDialogOpen(true)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <MainSidebar />

      <div className="flex-1 p-6 pt-4">
        <div className="max-w-[1024px] mx-auto flex gap-12">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Wallet Header */}
            <div className="flex items-center justify-between ">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#1dd13a] flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-white">C</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="text-base font-semibold text-foreground">{formatAddress(walletAddress)}</div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 hover:bg-muted"
                      onClick={copyAddress}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-muted-foreground">{currentWallet?.nickname || 'My Wallet'}</div>
                    <span className="text-muted-foreground">•</span>
                    <Button
                      variant="link"
                      className="h-auto p-0 text-sm text-primary hover:text-primary/80"
                      onClick={() => setSwitchWalletDialogOpen(true)}
                    >
                      Switch Wallet
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-full hover:bg-muted"
                  onClick={() => navigate('/wallet/settings')}
                >
                  <Settings className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-full text-red-500 hover:text-red-500 hover:bg-red-500/10"
                  onClick={handleDisconnect}
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Tabs at Top */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
              <TabsList className="h-auto w-full justify-start bg-transparent p-0 border-b rounded-none">
                <TabsTrigger
                  value="assets"
                  className="py-4 px-0 mr-8 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent bg-transparent"
                >
                  Assets
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="py-4 px-0 mr-8 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent bg-transparent"
                >
                  Activity
                </TabsTrigger>
                <TabsTrigger
                  value="staking"
                  className="py-4 px-0 mr-8 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent bg-transparent"
                >
                  Staking
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
                  earningsHistory={walletData.earningsHistory}
                />
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity">
                <ActivityTab transactions={walletData.transactions} />
              </TabsContent>

              {/* Governance Tab */}
              <TabsContent value="governance">
                <GovernanceTab userVotingPower={walletData.totalValue || 2500} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Quick Actions Card - Right Side */}
          <div className="w-64 shrink-0 pt-[158px]">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2"
                  onClick={() => setSendDialogOpen(true)}
                >
                  <Send className="w-5 h-5" />
                  <span className="text-sm">Send</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2"
                  onClick={() => setBuyDialogOpen(true)}
                >
                  <Download className="w-5 h-5" />
                  <span className="text-sm">Buy</span>
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
          onCnpySelected={handleCnpySelected}
        />

        {/* CNPY Multi-Chain Stake Dialog for Quick Actions */}
        <CnpyStakeDialog
          open={cnpyStakeDialogOpen}
          onOpenChange={setCnpyStakeDialogOpen}
          cnpyStake={selectedCnpyStake}
          cnpyAsset={walletData.assets?.find(a => a.chainId === 0)}
          allChains={walletData.stakes.filter(s => !s.isCnpy)}
        />

        {/* Send Dialog for Quick Actions */}
        <SendDialog
          open={sendDialogOpen}
          onOpenChange={setSendDialogOpen}
          selectedAsset={null}
          assets={walletData.assets}
        />

        {/* Buy Dialog */}
        <BuyDialog
          open={buyDialogOpen}
          onOpenChange={setBuyDialogOpen}
          assets={walletData.assets}
        />

        {/* Switch Wallet Dialog */}
        <WalletConnectionDialog
          open={switchWalletDialogOpen}
          onOpenChange={setSwitchWalletDialogOpen}
          initialStep={2.3}
        />
      </div>
    </div>
  )
}
