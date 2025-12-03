import { Sheet, SheetContent } from '@/components/ui/sheet.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Card } from '@/components/ui/card.jsx'
import { Copy, Repeat, Send, Download, Coins, LogOut, Settings, Wallet, ChevronRight, Activity, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '@/contexts/wallet-context.jsx'
import { toast } from 'sonner'
import ActivityTab from '@/pages/wallet/components/activity-tab.jsx'
import StakeDialog from '@/pages/wallet/components/stake-dialog.jsx'
import SendDialog from '@/pages/wallet/components/send-dialog.jsx'
import BuyDialog from '@/pages/wallet/components/buy-dialog.jsx'
import WalletConnectionDialog from '@/components/wallet-connection-dialog.jsx'

export default function WalletSheet({ open, onOpenChange }) {
  const navigate = useNavigate()
  const { walletAddress, formatAddress, getTotalBalance, disconnectWallet, getWalletData, currentUser, currentWallet } = useWallet()
  const [activeTab, setActiveTab] = useState('balances')
  const [stakeDialogOpen, setStakeDialogOpen] = useState(false)
  const [sendDialogOpen, setSendDialogOpen] = useState(false)
  const [buyDialogOpen, setBuyDialogOpen] = useState(false)
  const [switchWalletDialogOpen, setSwitchWalletDialogOpen] = useState(false)

  const walletData = getWalletData()

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress)
    toast.success('Address copied to clipboard')
  }

  const handleDisconnect = () => {
    onOpenChange(false)
    navigate('/')
    // Disconnect wallet after navigation
    setTimeout(() => {
      disconnectWallet()
    }, 100)
  }

  const handleViewAll = () => {
    navigate('/wallet')
    onOpenChange(false)
  }

  const handleAssetClick = (chainId) => {
    // Map chainId to the correct route based on db.js special mappings
    const chainRoutes = {
      1: 'someone-else-chain',    // Onchain ENS
      2: 'my-chain',               // MyGameChain
      3: 'graduated-chain',        // Social Connect
      4: 'draft-chain',            // DeFi Protocol
      5: 'onchain-bnb',            // StreamVault
      6: 'defi-masters'            // DeFi Masters (add to db.js if needed)
    }

    const route = chainRoutes[chainId] || chainId
    navigate(`/chain/${route}`)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full sm:max-w-[420px] p-0 flex flex-col bg-card gap-0">
        {/* Header - Fixed */}
        <div className="p-6 space-y-4 border-b border-border">
          {/* Wallet Address & Actions */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#1dd13a] flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-bold text-white">C</span>
            </div>
            <div className="flex-1">
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

          {/* Total Balance */}
          <div>
            <button
              onClick={handleViewAll}
              className="flex items-center gap-1 text-sm text-muted-foreground mb-1 hover:text-foreground transition-colors cursor-pointer"
            >
              Estimated Balance
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <h2 className="text-4xl font-bold text-foreground mb-1">
              ${getTotalBalance().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-4 gap-2">
            <Button variant="outline" className="flex flex-col gap-1 h-auto py-3 px-2">
              <Repeat className="w-5 h-5" />
              <span className="text-xs">Swap</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col gap-1 h-auto py-3 px-2"
              onClick={() => setBuyDialogOpen(true)}
            >
              <Download className="w-5 h-5" />
              <span className="text-xs">Buy</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col gap-1 h-auto py-3 px-2"
              onClick={() => setSendDialogOpen(true)}
            >
              <Send className="w-5 h-5" />
              <span className="text-xs">Send</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col gap-1 h-auto py-3 px-2"
              onClick={() => setStakeDialogOpen(true)}
            >
              <Coins className="w-5 h-5" />
              <span className="text-xs">Stake</span>
            </Button>
          </div>
        </div>

        {/* Tabs - Scrollable */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
            <TabsList className="w-full justify-start bg-transparent p-0 px-6 border-b border-border rounded-none h-auto flex-shrink-0">
              <TabsTrigger
                value="balances"
                className="py-3 px-0 mr-6 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent bg-transparent data-[state=active]:text-foreground"
              >
                Balances
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="py-3 px-0 mr-6 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent bg-transparent text-muted-foreground data-[state=active]:text-foreground"
              >
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="balances" className="flex-1 overflow-y-auto mt-0 data-[state=inactive]:hidden">
              <div className="p-6">
                {walletData.assets.length === 0 ? (
                  /* Empty State */
                  <Card className="p-12 border-0">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="p-4 bg-muted rounded-full">
                        <Wallet className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">No assets yet</h3>
                        <p className="text-sm text-muted-foreground max-w-md">
                          Start your blockchain journey by creating or investing in chains on the launchpad.
                        </p>
                      </div>
                      <Button
                        onClick={() => {
                          navigate('/')
                          onOpenChange(false)
                        }}
                        className="mt-2"
                      >
                        Go to Launchpad
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-muted-foreground">TOP ASSETS</h3>
                      <Button
                        variant="link"
                        className="text-green-400 h-auto p-0 text-sm hover:text-green-400/80"
                        onClick={handleViewAll}
                      >
                        VIEW ALL
                      </Button>
                    </div>

                    {/* Assets List */}
                    <div className="space-y-3">
                      {walletData.assets.slice(0, 5).map((asset) => (
                        <button
                          key={asset.id}
                          onClick={() => handleAssetClick(asset.chainId)}
                          className="w-full flex items-center justify-between py-2 hover:bg-muted/50 rounded-lg px-2 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: asset.color }}
                            >
                              <span className="text-sm font-bold text-white">
                                {asset.symbol.slice(0, 1)}
                              </span>
                            </div>
                            <div className="text-left">
                              <div className="font-medium text-foreground">{asset.name} <span className="text-muted-foreground">{asset.symbol}</span></div>
                              <div className="text-sm text-muted-foreground">
                                {asset.balance.toLocaleString()} {asset.symbol}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-foreground">
                              ${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              ${asset.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="activity" className="flex-1 overflow-y-auto mt-0 data-[state=inactive]:hidden">
              <div className="p-6">
                {walletData.transactions.length === 0 ? (
                  /* Empty State */
                  <Card className="p-12 border-0">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="p-4 bg-muted rounded-full">
                        <Activity className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">No activity yet</h3>
                        <p className="text-sm text-muted-foreground max-w-md">
                          Start your blockchain journey by creating or investing in chains on the launchpad.
                        </p>
                      </div>
                      <Button
                        onClick={() => {
                          navigate('/')
                          onOpenChange(false)
                        }}
                        className="mt-2"
                      >
                        Go to Launchpad
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <ActivityTab transactions={walletData.transactions} compact={true} />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer - Fixed */}
        <div className="p-5 border-t border-border space-y-3">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 hover:bg-muted"
            onClick={() => {
              navigate('/wallet/settings')
              onOpenChange(false)
            }}
          >
            <Settings className="w-5 h-5" />
            <span>Wallet settings</span>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-red-500 hover:text-red-500 hover:bg-red-500/10"
            onClick={handleDisconnect}
          >
            <LogOut className="w-5 h-5" />
            <span>Disconnect wallet</span>
          </Button>
        </div>
      </SheetContent>

      {/* Stake Dialog */}
      <StakeDialog
        open={stakeDialogOpen}
        onOpenChange={setStakeDialogOpen}
        selectedChain={null}
        availableChains={walletData.stakes}
        assets={walletData.assets}
      />

      {/* Send Dialog */}
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
    </Sheet>
  )
}
