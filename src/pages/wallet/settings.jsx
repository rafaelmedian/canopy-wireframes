import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MainSidebar from '@/components/main-sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  ArrowLeft,
  Shield,
  Eye,
  Bell,
  User,
  Wallet,
  Plus,
  Trash2,
  ChevronRight,
  X
} from 'lucide-react'
import { useWallet } from '@/contexts/wallet-context'
import { toast } from 'sonner'

const DEFAULT_SETTINGS = {
  // Security
  autoLockMinutes: 15,
  privacyMode: false,
  requireConfirmation: true,
  confirmationThreshold: 1000,

  // Display
  currency: 'USD',
  language: 'en',
  hideSmallBalances: false,
  smallBalanceThreshold: 1,
  assetSorting: 'value',

  // Notifications
  transactionAlerts: true,
  priceAlerts: false,
  governanceAlerts: true,
  stakingAlerts: true
}

export default function WalletSettings() {
  const navigate = useNavigate()
  const { walletAddress, formatAddress, currentUser } = useWallet()
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)

  // Track changes per section
  const [securityChanged, setSecurityChanged] = useState(false)
  const [displayChanged, setDisplayChanged] = useState(false)
  const [notificationsChanged, setNotificationsChanged] = useState(false)

  // External wallets state
  const [externalWallets, setExternalWallets] = useState([])
  const [showWalletSelect, setShowWalletSelect] = useState(false)

  // Get email from currentUser or localStorage
  const userEmail = currentUser?.email || localStorage.getItem('userEmail') || ''

  // Load external wallets from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('externalWallets')
    if (saved) {
      setExternalWallets(JSON.parse(saved))
    }
  }, [])

  const handleConnectExternalWallet = (provider) => {
    // Simulate wallet connection
    const mockWallet = {
      id: Date.now(),
      provider,
      address: '0x' + Math.random().toString(16).substr(2, 40),
      balances: {
        ETH: 0.5,
        USDC: 150.75
      }
    }

    const updated = [...externalWallets, mockWallet]
    setExternalWallets(updated)
    localStorage.setItem('externalWallets', JSON.stringify(updated))
    setShowWalletSelect(false)
    toast.success(`${provider} wallet connected`)
  }

  const handleDisconnectExternalWallet = (walletId) => {
    const updated = externalWallets.filter(w => w.id !== walletId)
    setExternalWallets(updated)
    localStorage.setItem('externalWallets', JSON.stringify(updated))
    toast.success('Wallet disconnected')
  }

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('walletSettings')
    if (saved) {
      setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) })
    }
  }, [])

  const updateSetting = (key, value, section) => {
    setSettings(prev => ({ ...prev, [key]: value }))

    // Mark the appropriate section as changed
    if (section === 'security') setSecurityChanged(true)
    if (section === 'display') setDisplayChanged(true)
    if (section === 'notifications') setNotificationsChanged(true)
  }

  const saveSection = (section) => {
    localStorage.setItem('walletSettings', JSON.stringify(settings))

    // Reset the changed flag for this section
    if (section === 'security') setSecurityChanged(false)
    if (section === 'display') setDisplayChanged(false)
    if (section === 'notifications') setNotificationsChanged(false)

    toast.success('Settings saved successfully')
  }

  return (
    <div className="flex min-h-screen bg-background">
      <MainSidebar />

      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate('/wallet')}
              className="mb-4 ml-[-14px]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Wallet
            </Button>
            <h1 className="text-3xl font-bold">Wallet Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your wallet preferences and security
            </p>
          </div>

          {/* Connected Wallets */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                <CardTitle>Connected Wallets</CardTitle>
              </div>
              <CardDescription>
                Manage your external wallets for funding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {externalWallets.length > 0 ? (
                <>
                  {/* Connected External Wallets */}
                  {externalWallets.map((wallet) => (
                    <div key={wallet.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${
                          wallet.provider === 'MetaMask' ? 'bg-orange-500' : 'bg-blue-500'
                        } flex items-center justify-center flex-shrink-0`}>
                          <Wallet className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{wallet.provider}</div>
                          <div className="text-sm text-muted-foreground font-mono">
                            {formatAddress(wallet.address)}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-500 hover:bg-red-500/10"
                        onClick={() => handleDisconnectExternalWallet(wallet.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Disconnect
                      </Button>
                    </div>
                  ))}

                  {/* Connect Additional Wallet */}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowWalletSelect(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Connect Another Wallet
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold">No external wallets connected</h3>
                      <p className="text-sm text-muted-foreground">
                        Connect wallets like MetaMask or WalletConnect to fund your account
                      </p>
                    </div>
                    <Button onClick={() => setShowWalletSelect(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Connect Wallet
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security & Privacy */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <CardTitle>Security & Privacy</CardTitle>
              </div>
              <CardDescription>
                Configure security settings and privacy options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Auto-Lock Timer</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically lock wallet after inactivity
                  </p>
                </div>
                <Select
                  value={settings.autoLockMinutes.toString()}
                  onValueChange={(value) => updateSetting('autoLockMinutes', parseInt(value), 'security')}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 min</SelectItem>
                    <SelectItem value="15">15 min</SelectItem>
                    <SelectItem value="30">30 min</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Privacy Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Hide balances and sensitive information
                  </p>
                </div>
                <Switch
                  checked={settings.privacyMode}
                  onCheckedChange={(checked) => updateSetting('privacyMode', checked, 'security')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Transaction Confirmation</Label>
                  <p className="text-sm text-muted-foreground">
                    Require confirmation for large transactions
                  </p>
                </div>
                <Switch
                  checked={settings.requireConfirmation}
                  onCheckedChange={(checked) => updateSetting('requireConfirmation', checked, 'security')}
                />
              </div>

              {settings.requireConfirmation && (
                <div className="space-y-2 pl-4 border-l-2">
                  <Label htmlFor="threshold">Confirmation Threshold (USD)</Label>
                  <Input
                    id="threshold"
                    type="number"
                    value={settings.confirmationThreshold}
                    onChange={(e) => updateSetting('confirmationThreshold', parseInt(e.target.value) || 0, 'security')}
                    placeholder="1000"
                  />
                  <p className="text-xs text-muted-foreground">
                    Confirm transactions above this amount
                  </p>
                </div>
              )}

              {securityChanged && (
                <Button
                  onClick={() => saveSection('security')}
                  className="w-full"
                >
                  Save Changes
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Display Preferences */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                <CardTitle>Display Preferences</CardTitle>
              </div>
              <CardDescription>
                Customize how information is displayed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="wallet-nickname">Wallet Nickname</Label>
                <Input
                  id="wallet-nickname"
                  type="text"
                  placeholder="e.g., Main Wallet, Trading, Savings"
                  value={settings.walletNickname || ''}
                  onChange={(e) => updateSetting('walletNickname', e.target.value, 'display')}
                  maxLength={30}
                />
                <p className="text-xs text-muted-foreground">
                  Customize the name displayed for your current wallet
                </p>
              </div>

              <div className="space-y-2">
                <Label>Display Currency</Label>
                <Select
                  value={settings.currency}
                  onValueChange={(value) => updateSetting('currency', value, 'display')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="JPY">JPY (¥)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Language</Label>
                <Select
                  value={settings.language}
                  onValueChange={(value) => updateSetting('language', value, 'display')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Hide Small Balances</Label>
                  <p className="text-sm text-muted-foreground">
                    Don't show assets below ${settings.smallBalanceThreshold}
                  </p>
                </div>
                <Switch
                  checked={settings.hideSmallBalances}
                  onCheckedChange={(checked) => updateSetting('hideSmallBalances', checked, 'display')}
                />
              </div>

              <div className="space-y-2">
                <Label>Asset Sorting</Label>
                <Select
                  value={settings.assetSorting}
                  onValueChange={(value) => updateSetting('assetSorting', value, 'display')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="value">By Value (High to Low)</SelectItem>
                    <SelectItem value="name">By Name (A-Z)</SelectItem>
                    <SelectItem value="custom">Custom Order</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {displayChanged && (
                <Button
                  onClick={() => saveSection('display')}
                  className="w-full"
                >
                  Save Changes
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                <CardTitle>Notifications</CardTitle>
              </div>
              <CardDescription>
                Configure alert preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Transaction Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify when transactions are confirmed
                  </p>
                </div>
                <Switch
                  checked={settings.transactionAlerts}
                  onCheckedChange={(checked) => updateSetting('transactionAlerts', checked, 'notifications')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Price Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify on significant price movements
                  </p>
                </div>
                <Switch
                  checked={settings.priceAlerts}
                  onCheckedChange={(checked) => updateSetting('priceAlerts', checked, 'notifications')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Governance Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify about new proposals and voting deadlines
                  </p>
                </div>
                <Switch
                  checked={settings.governanceAlerts}
                  onCheckedChange={(checked) => updateSetting('governanceAlerts', checked, 'notifications')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Staking Rewards</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify when staking rewards are earned
                  </p>
                </div>
                <Switch
                  checked={settings.stakingAlerts}
                  onCheckedChange={(checked) => updateSetting('stakingAlerts', checked, 'notifications')}
                />
              </div>

              {notificationsChanged && (
                <Button
                  onClick={() => saveSection('notifications')}
                  className="w-full"
                >
                  Save Changes
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                <CardTitle>Account Information</CardTitle>
              </div>
              <CardDescription>
                View your account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={userEmail}
                  readOnly
                  placeholder="user@example.com"
                  className="bg-muted cursor-default"
                />
                <p className="text-xs text-muted-foreground">
                  Changing your email address is not allowed at the moment.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Wallet Address</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={formatAddress(walletAddress)}
                    readOnly
                    className="font-mono bg-muted cursor-default"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(walletAddress)
                      toast.success('Address copied')
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Wallet Selection Dialog */}
      <Dialog open={showWalletSelect} onOpenChange={setShowWalletSelect}>
        <DialogContent className="sm:max-w-[400px] p-0 gap-0" hideClose>
          <div className="relative p-6 border-b">
            <h3 className="text-xl font-bold">Select Wallet</h3>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 rounded-full"
              onClick={() => setShowWalletSelect(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="p-6 space-y-3">
            <button
              onClick={() => handleConnectExternalWallet('MetaMask')}
              className="w-full p-4 bg-muted hover:bg-muted/70 rounded-xl flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium">MetaMask</p>
                  <p className="text-sm text-muted-foreground">EVM Compatible</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => handleConnectExternalWallet('WalletConnect')}
              className="w-full p-4 bg-muted hover:bg-muted/70 rounded-xl flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium">WalletConnect</p>
                  <p className="text-sm text-muted-foreground">Multi-chain</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
