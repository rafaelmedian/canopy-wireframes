import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ArrowLeft, ArrowRight, X, Info, HelpCircle } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import LaunchpadSidebar from '@/components/launchpad-sidebar'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'

const blockTimeOptions = [
  { value: '5', label: '5 seconds' },
  { value: '10', label: '10 seconds' },
  { value: '30', label: '30 seconds' },
  { value: '60', label: '1 minute' },
  { value: '300', label: '5 minutes' },
]

export default function ConfigureChain() {
  const navigate = useNavigate()
  const location = useLocation()
  const [chainName, setChainName] = useState('')
  const [tokenName, setTokenName] = useState('')
  const [ticker, setTicker] = useState('')
  const [tokenSupply, setTokenSupply] = useState('1000000000')
  const [halvingDays, setHalvingDays] = useState('365')
  const [blockTime, setBlockTime] = useState('10')

  // Calculate tokens minted per year
  const calculateYearlyMinting = () => {
    if (!tokenSupply || !blockTime) return 0
    
    const blocksPerYear = (365 * 24 * 60 * 60) / parseInt(blockTime)
    const initialReward = parseInt(tokenSupply) / (blocksPerYear * 4) // Simplified calculation
    const yearlyMinting = initialReward * blocksPerYear
    
    return Math.floor(yearlyMinting).toLocaleString()
  }

  const handleBack = () => {
    navigate('/launchpad/repository')
  }

  const handleContinue = () => {
    if (chainName && tokenName && ticker && tokenSupply && halvingDays && blockTime) {
      navigate('/launchpad/branding', { 
        state: { 
          chainConfig: {
            chainName,
            tokenName,
            ticker,
            tokenSupply,
            halvingDays,
            blockTime
          }
        } 
      })
    }
  }

  const handleClose = () => {
    navigate('/')
  }

  const isFormValid = chainName && tokenName && ticker && tokenSupply && halvingDays && blockTime

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={true}>
        <LaunchpadSidebar currentStep={3} completedSteps={[1, 2]} />
        
        <SidebarInset>
        {/* Header */}
        <div className="flex justify-end p-2 border-b mb-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Title */}
            <div className="space-y-2"c>
              <h1 className="text-3xl font-bold">
                Configure your chain & token
              </h1>
              <p className="text-muted-foreground">
                Set up the core parameters for your blockchain network
              </p>
            </div>

            {/* Form */}
            <div className="space-y-8">
              {/* Basic Info Group */}
              <div className="space-y-6">
                {/* Chain Name */}
                <div className="space-y-2">
                  <Label htmlFor="chainName" className="flex items-center gap-2 text-sm font-medium">
                    Chain Name
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>The name of your blockchain network</p>
                        <p className="mt-1 text-xs text-muted-foreground">Example: "Ethereum", "Solana", "MyChain"</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Input
                    id="chainName"
                    placeholder="Enter chain name"
                    value={chainName}
                    onChange={(e) => setChainName(e.target.value)}
                  />
                </div>

                {/* Token Name */}
                <div className="space-y-2">
                  <Label htmlFor="tokenName" className="flex items-center gap-2 text-sm font-medium">
                    Token Name
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>The full name of your native token</p>
                        <p className="mt-1 text-xs text-muted-foreground">Example: "Ether", "Bitcoin", "MyToken"</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Input
                    id="tokenName"
                    placeholder="Enter your token name"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                  />
                </div>

                {/* Ticker */}
                <div className="space-y-2">
                  <Label htmlFor="ticker" className="flex items-center gap-2 text-sm font-medium">
                    Ticker
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>The trading symbol for your token</p>
                        <p className="mt-1 text-xs text-muted-foreground">Example: "ETH", "BTC", "USDC" (3-5 characters)</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Input
                    id="ticker"
                    placeholder="Enter your ticker"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value.toUpperCase())}
                    maxLength={10}
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Token Economics Group */}
              <div className="space-y-6">
                {/* Token Supply */}
                <div className="space-y-2">
                  <Label htmlFor="tokenSupply" className="flex items-center gap-2 text-sm font-medium">
                    Token Supply
                  </Label>
                  <Input
                    id="tokenSupply"
                    type="number"
                    value={tokenSupply}
                    readOnly
                    disabled
                    className="bg-muted opacity-75 cursor-not-allowed"
                  />
                  <p className="text-sm text-muted-foreground">
                    The total number of tokens that will ever exist. This cannot be changed after launch.
                  </p>
                </div>

                {/* Halving Schedule */}
                <div className="space-y-2">
                  <Label htmlFor="halvingDays" className="flex items-center gap-2 text-sm font-medium">
                    Halving Schedule (days)
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Halving reduces mining rewards by 50% at set intervals</p>
                        <p className="mt-1 text-xs text-muted-foreground">Like Bitcoin's 4-year halving cycle. Enter days between halvings.</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Input
                    id="halvingDays"
                    type="number"
                    placeholder="365"
                    value={halvingDays}
                    onChange={(e) => setHalvingDays(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    How many days between each halving event
                  </p>
                </div>

                {/* Block Time */}
                <div className="space-y-2">
                  <Label htmlFor="blockTime" className="flex items-center gap-2 text-sm font-medium">
                    Block Time
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Time between new blocks being added to the chain</p>
                        <p className="mt-1 text-xs text-muted-foreground">Bitcoin: ~10 min, Ethereum: ~12 sec. Faster = more transactions.</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Select value={blockTime} onValueChange={setBlockTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select block time" />
                    </SelectTrigger>
                    <SelectContent>
                      {blockTimeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Can be updated later to optimize network performance
                  </p>
                </div>
              </div>

              {/* Summary Card */}
              <Card className="p-6  bg-muted/50">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-muted-foreground" />
                    <h3 className="font-semibold">Network Summary</h3>
                  </div>
                  
                  <div className="grid gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Block Time:</span>
                      <span className="font-medium">
                        {blockTimeOptions.find(opt => opt.value === blockTime)?.label || '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Blocks per Day:</span>
                      <span className="font-medium">
                        {blockTime ? Math.floor((24 * 60 * 60) / parseInt(blockTime)).toLocaleString() : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Halving Schedule:</span>
                      <span className="font-medium">
                        {halvingDays ? `Every ${halvingDays} days` : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Est. Tokens Minted (Year 1):</span>
                      <span className="font-medium">
                        ~{calculateYearlyMinting()} {ticker || 'tokens'}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-8">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              
              <Button
                onClick={handleContinue}
                disabled={!isFormValid}
                className="gap-2"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
    </TooltipProvider>
  )
}