import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ArrowLeft, ArrowRight, X, Info, HelpCircle } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import MainSidebar from '@/components/main-sidebar'
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
  
  // Validation errors
  const [errors, setErrors] = useState({
    chainName: '',
    tokenName: '',
    ticker: '',
    halvingDays: ''
  })

  // Validation functions
  const validateChainName = (value) => {
    if (!value) return 'Chain name is required'
    if (value.length < 2) return 'Chain name must be at least 2 characters'
    if (value.length > 50) return 'Chain name must be less than 50 characters'
    if (!/^[a-zA-Z0-9\s]+$/.test(value)) return 'Only letters, numbers, and spaces allowed'
    return ''
  }

  const validateTokenName = (value) => {
    if (!value) return 'Token name is required'
    if (value.length < 2) return 'Token name must be at least 2 characters'
    if (value.length > 30) return 'Token name must be less than 30 characters'
    if (!/^[a-zA-Z0-9\s]+$/.test(value)) return 'Only letters, numbers, and spaces allowed'
    return ''
  }

  const validateTicker = (value) => {
    if (!value) return 'Ticker is required'
    if (value.length < 3) return 'Ticker must be at least 3 characters'
    if (value.length > 5) return 'Ticker must be 3-5 characters'
    if (!/^[A-Z0-9]+$/.test(value)) return 'Only uppercase letters and numbers allowed'
    return ''
  }

  const validateHalvingDays = (value) => {
    if (!value) return 'Halving schedule is required'
    const days = parseInt(value)
    if (isNaN(days)) return 'Must be a valid number'
    if (days < 1) return 'Must be at least 1 day'
    if (days > 10000) return 'Must be less than 10,000 days'
    return ''
  }

  // Handle input changes with validation
  const handleChainNameChange = (e) => {
    const value = e.target.value
    setChainName(value)
    setErrors(prev => ({ ...prev, chainName: validateChainName(value) }))
  }

  const handleTokenNameChange = (e) => {
    const value = e.target.value
    setTokenName(value)
    setErrors(prev => ({ ...prev, tokenName: validateTokenName(value) }))
  }

  const handleTickerChange = (e) => {
    const value = e.target.value.toUpperCase()
    setTicker(value)
    setErrors(prev => ({ ...prev, ticker: validateTicker(value) }))
  }

  const handleHalvingDaysChange = (e) => {
    const value = e.target.value
    setHalvingDays(value)
    setErrors(prev => ({ ...prev, halvingDays: validateHalvingDays(value) }))
  }

  // Calculate tokens minted per year
  const calculateYearlyMinting = () => {
    if (!tokenSupply || !blockTime || !halvingDays) return 0

    const supply = parseInt(tokenSupply)
    const blockTimeSec = parseInt(blockTime)
    const halvingInterval = parseInt(halvingDays)

    // Calculate blocks per year and blocks per halving interval
    const blocksPerYear = (365 * 24 * 60 * 60) / blockTimeSec
    const blocksPerHalving = (halvingInterval * 24 * 60 * 60) / blockTimeSec

    // Using Bitcoin's approach: geometric series where each halving period has half the rewards
    // Sum of series: total_supply = initial_subsidy * blocks_per_halving * (1 + 1/2 + 1/4 + 1/8 + ...)
    // The series converges to 2, so: total_supply = initial_subsidy * blocks_per_halving * 2
    // Therefore: initial_subsidy = total_supply / (blocks_per_halving * 2)

    const initialBlockSubsidy = supply / (blocksPerHalving * 2)

    // For Year 1, check if it spans the first halving
    if (365 <= halvingInterval) {
      // Year 1 is entirely within first halving period - use full initial subsidy
      const yearlyMinting = initialBlockSubsidy * blocksPerYear
      return Math.floor(yearlyMinting).toLocaleString()
    } else {
      // Year 1 spans multiple halvings - need to calculate pro-rata
      const daysInFirstPeriod = halvingInterval
      const blocksInFirstPeriod = (daysInFirstPeriod * 24 * 60 * 60) / blockTimeSec
      const tokensFromFirstPeriod = initialBlockSubsidy * blocksInFirstPeriod

      const daysRemaining = 365 - halvingInterval
      const blocksRemaining = (daysRemaining * 24 * 60 * 60) / blockTimeSec
      const tokensFromSecondPeriod = (initialBlockSubsidy / 2) * blocksRemaining

      const yearlyMinting = tokensFromFirstPeriod + tokensFromSecondPeriod
      return Math.floor(yearlyMinting).toLocaleString()
    }
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

  const isFormValid = chainName && tokenName && ticker && tokenSupply && halvingDays && blockTime &&
    !errors.chainName && !errors.tokenName && !errors.ticker && !errors.halvingDays

  return (
    <TooltipProvider>
      <div className="flex min-h-screen bg-background">
        <MainSidebar variant="compact" />
        <LaunchpadSidebar currentStep={3} completedSteps={[1, 2]} />

        <div className="flex-1 overflow-auto">
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
                    onChange={handleChainNameChange}
                    className={errors.chainName ? 'border-destructive' : ''}
                  />
                  {errors.chainName && (
                    <p className="text-sm text-destructive">{errors.chainName}</p>
                  )}
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
                    onChange={handleTokenNameChange}
                    className={errors.tokenName ? 'border-destructive' : ''}
                  />
                  {errors.tokenName && (
                    <p className="text-sm text-destructive">{errors.tokenName}</p>
                  )}
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
                    onChange={handleTickerChange}
                    maxLength={5}
                    className={errors.ticker ? 'border-destructive' : ''}
                  />
                  {errors.ticker && (
                    <p className="text-sm text-destructive">{errors.ticker}</p>
                  )}
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
                    The total number of tokens that will ever exist.
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
                    onChange={handleHalvingDaysChange}
                    className={errors.halvingDays ? 'border-destructive' : ''}
                  />
                  {errors.halvingDays && (
                    <p className="text-sm text-destructive">{errors.halvingDays}</p>
                  )}
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
      </div>
    </div>
    </TooltipProvider>
  )
}