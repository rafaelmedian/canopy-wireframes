import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MainSidebar from '@/components/main-sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  Wallet
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
  const { formatAddress, evmAddress } = useWallet()
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)

  // Track changes per section
  const [securityChanged, setSecurityChanged] = useState(false)
  const [displayChanged, setDisplayChanged] = useState(false)
  const [notificationsChanged, setNotificationsChanged] = useState(false)

  // Get connected EVM provider from localStorage
  const connectedEvmProvider = localStorage.getItem('evmProvider') || 'MetaMask'

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

          {/* Wallet Linked to */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                <CardTitle>Wallet Linked to</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {evmAddress ? (
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      connectedEvmProvider === 'MetaMask' ? 'bg-[#F5841F]' : 'bg-[#3B99FC]'
                    }`}>
                      <img
                        src={connectedEvmProvider === 'MetaMask' ? '/svg/metamaskt.svg' : '/svg/walletconnect.svg'}
                        alt={connectedEvmProvider}
                        className="w-6 h-6"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{connectedEvmProvider}</div>
                      <div className="text-sm text-muted-foreground font-mono">
                        {formatAddress(evmAddress)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#1dd13a]">
                    <div className="w-2 h-2 rounded-full bg-[#1dd13a]" />
                    Connected
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold">No wallet connected</h3>
                      <p className="text-sm text-muted-foreground">
                        Connect your EVM wallet to use Canopy
                      </p>
                    </div>
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
                Configure security settings and privacy options for your Canopy wallet
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
                Customize how your Canopy wallet displays information
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
                Configure alert preferences for your Canopy wallet
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

        </div>
      </div>

    </div>
  )
}
