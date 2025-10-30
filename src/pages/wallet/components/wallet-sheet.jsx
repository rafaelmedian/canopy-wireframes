import { Sheet, SheetContent } from '@/components/ui/sheet.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Copy, Repeat, Send, Download, Coins, LogOut, Settings } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '@/contexts/wallet-context.jsx'
import { toast } from 'sonner'
import walletData from '@/data/wallet.json'
import ActivityTab from '@/pages/wallet/components/activity-tab.jsx'

export default function WalletSheet({ open, onOpenChange }) {
  const navigate = useNavigate()
  const { walletAddress, formatAddress, getTotalBalance, disconnectWallet } = useWallet()
  const [activeTab, setActiveTab] = useState('balances')

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress)
    toast.success('Address copied to clipboard')
  }

  const handleDisconnect = () => {
    disconnectWallet()
    onOpenChange(false)
  }

  const handleViewAll = () => {
    navigate('/wallet')
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
              <div className="text-sm text-[#1dd13a]">Connected</div>
            </div>
          </div>

          {/* Total Balance */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total balance</p>
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
            <Button variant="outline" className="flex flex-col gap-1 h-auto py-3 px-2">
              <Download className="w-5 h-5" />
              <span className="text-xs">Buy</span>
            </Button>
            <Button variant="outline" className="flex flex-col gap-1 h-auto py-3 px-2">
              <Send className="w-5 h-5" />
              <span className="text-xs">Send</span>
            </Button>
            <Button variant="outline" className="flex flex-col gap-1 h-auto py-3 px-2">
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
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-muted-foreground">TOP ASSETS</h3>
                    <Button
                      variant="link"
                      className="text-primary h-auto p-0 text-sm hover:text-primary/80"
                      onClick={handleViewAll}
                    >
                      VIEW ALL
                    </Button>
                  </div>

                  {/* Assets List */}
                  <div className="space-y-3">
                    {walletData.assets.slice(0, 5).map((asset) => (
                      <div key={asset.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: asset.color }}
                          >
                            <span className="text-sm font-bold text-white">
                              {asset.symbol.slice(0, 1)}
                            </span>
                          </div>
                          <div>
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
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="flex-1 overflow-y-auto mt-0 data-[state=inactive]:hidden">
              <div className="p-6">
                <ActivityTab transactions={walletData.transactions} compact={true} />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer - Fixed */}
        <div className="p-5 border-t border-border space-y-3">
          <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-muted">
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
    </Sheet>
  )
}
