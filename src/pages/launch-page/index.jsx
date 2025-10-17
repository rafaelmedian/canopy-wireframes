import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  ArrowUpRight,
  Globe,
  Github,
  Activity,
  ChevronLeft,
  ChevronRight,
  Zap,
  Heart,
  Upload
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useNavigate } from 'react-router-dom'
import MainSidebar from '@/components/main-sidebar'

// Mock data - will be replaced by API calls
const mockChainData = {
  name: 'Onchain ENS',
  ticker: 'OENS',
  creator: 'Onchain ENS',
  description: 'Integrated with Ethereum\'s robust infrastructure, our platform is designed to enhance the way digital assets are managed and exchanged. Our technology enables seamless, transparent, and efficient transactions, unlocking new possibilities for users and developers alike. Experience unmatched security, flexibility, and interoperability with our innovative solution, tailored to meet the evolving needs of the blockchain ecosystem.',
  logo: null, // Will show placeholder
  brandColor: '#10b981',
  language: 'TypeScript',
  repositoryName: 'eliezerpujols/mygamechain',

  // Market data
  currentPrice: 0.011647,
  marketCap: 23000,
  mcap: 1.88,
  volume: 2328,
  virtualLiq: 2328,
  holders: 3318,
  priceChange24h: 15.6,

  // Launch settings
  graduationThreshold: 50000,
  remainingToGraduation: 233230,

  // Gallery
  gallery: [null, null, null], // Placeholders

  // Social links
  socialLinks: [
    { platform: 'website', label: 'Website', url: 'https://mygamechain.org', icon: Globe },
    { platform: 'twitter', label: 'Twitter/X', url: '@mygamechain', icon: null },
    { platform: 'discord', label: 'Discord', url: 'https://discord.gg/mygamechain', icon: null },
    { platform: 'github', label: 'GitHub', url: 'https://github.com/eliezerpujols/mygamechain', icon: Github }
  ],

  // Chart data
  priceHistory: [
    { time: '00:00', price: 0.0098 },
    { time: '02:00', price: 0.0102 },
    { time: '04:00', price: 0.0105 },
    { time: '06:00', price: 0.0110 },
    { time: '08:00', price: 0.0113 },
    { time: '10:00', price: 0.0108 },
    { time: '12:00', price: 0.0115 },
    { time: '14:00', price: 0.0112 },
    { time: '16:00', price: 0.0118 },
    { time: '18:00', price: 0.0116 },
    { time: '20:00', price: 0.011647 }
  ]
}

// Custom social icons
const TwitterIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const DiscordIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
)

export default function LaunchPage() {
  const navigate = useNavigate()
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0)

  const graduationProgress = (mockChainData.marketCap / mockChainData.graduationThreshold) * 100

  const getSocialIcon = (platform) => {
    switch(platform) {
      case 'twitter': return <TwitterIcon />
      case 'discord': return <DiscordIcon />
      case 'website': return <Globe className="w-4 h-4" />
      case 'github': return <Github className="w-4 h-4" />
      default: return null
    }
  }

  const navigateGallery = (direction) => {
    if (direction === 'prev') {
      setCurrentGalleryIndex(prev => prev === 0 ? mockChainData.gallery.length - 1 : prev - 1)
    } else {
      setCurrentGalleryIndex(prev => prev === mockChainData.gallery.length - 1 ? 0 : prev + 1)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <MainSidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="px-6 py-3 pt-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <button onClick={() => navigate('/')} className="hover:text-foreground">
              Launchpad
            </button>
            <span>/</span>
            <span className="text-foreground">Onchain ENS</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6 pt-3">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Chain Header */}
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Logo Placeholder */}
                    <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-white">
                        {mockChainData.ticker[0]}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h2 className="text-base font-medium">{mockChainData.name}</h2>
                      <p className="text-xs text-gray-400">
                        ${mockChainData.ticker} on Onchain ENS • created 13m ago
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Share Button */}
                    <Button variant="outline" size="icon" className="h-[30px] w-[30px] rounded-lg">
                      <Upload className="w-4 h-4" />
                    </Button>
                    {/* Favorite Button */}
                    <Button variant="outline" size="icon" className="h-[30px] w-[30px] rounded-lg">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Price Chart and Graduation Progress */}
              <Card className="p-1">
                <div className="space-y-2">
                  {/* Top Section: Marketcap and Graduation */}
                  <div className="flex items-center justify-between px-4 py-3">
                    {/* Left: Marketcap */}
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Marketcap</p>
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-semibold">${(mockChainData.marketCap / 1000).toFixed(0)}k</h3>
                        <span className="text-xs text-muted-foreground">+${mockChainData.priceChange24h}</span>
                      </div>
                    </div>

                    {/* Right: Graduation Progress */}
                    <div className="space-y-2 w-[216px]">
                      <p className="text-xs text-muted-foreground text-right">
                        ${(mockChainData.remainingToGraduation / 1000).toFixed(2)}k until graduation
                      </p>
                      <Progress value={graduationProgress} className="h-2.5" />
                    </div>
                  </div>

                  {/* Chart Section */}
                  <Card className="relative h-[272px] bg-muted/40">
                    {/* Time Period Buttons */}
                    <div className="absolute left-4 top-2.5 z-10 flex gap-0.5 p-0.5 bg-muted/50 rounded-lg">
                      <Button variant="ghost" size="sm" className="h-8 text-xs px-3">1H</Button>
                      <Button variant="secondary" size="sm" className="h-8 text-xs px-3">1D</Button>
                      <Button variant="ghost" size="sm" className="h-8 text-xs px-3">1W</Button>
                      <Button variant="ghost" size="sm" className="h-8 text-xs px-3">1M</Button>
                      <Button variant="ghost" size="sm" className="h-8 text-xs px-3">1Y</Button>
                      <Button variant="ghost" size="sm" className="h-8 text-xs px-3">ALL</Button>
                    </div>

                    {/* Chart */}
                    <div className="h-full pt-12">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockChainData.priceHistory}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                          <XAxis
                            dataKey="time"
                            tick={{ fill: '#71717a', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis hide />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="price"
                            stroke={mockChainData.brandColor}
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  {/* Live Updates Stats Bar */}
                  <Card className="bg-muted/40">
                    <div className="flex items-center gap-6 px-5 py-3.5">
                      <p className="text-sm font-medium">Live updates</p>
                      <div className="flex flex-1 items-center justify-between text-sm">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xs text-muted-foreground">VOL (24h)</span>
                          <span className="font-medium">${mockChainData.volume}</span>
                        </div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xs text-muted-foreground">MCap</span>
                          <span className="font-medium">${mockChainData.mcap}</span>
                        </div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xs text-muted-foreground">Virtual Liq</span>
                          <span className="font-medium">${mockChainData.virtualLiq}</span>
                        </div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xs text-muted-foreground">HOLD</span>
                          <span className="font-medium">{mockChainData.holders}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </Card>

              {/* Tabs Section */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="holders">Holders (21)</TabsTrigger>
                  <TabsTrigger value="code">Code</TabsTrigger>
                  <TabsTrigger value="block-explorer">Block Explorer</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-4">
                  {/* About and Gallery Card */}
                  <Card className="p-6">
                    <div className="space-y-6">
                      {/* About Section */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          {mockChainData.socialLinks.slice(0, 4).map((link, idx) => {
                            const isGithub = link.platform === 'github'

                            return (
                                <a
                                    key={idx}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-2 py-1 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors"
                                >
                                  {getSocialIcon(link.platform)}
                                  {isGithub && (
                                      <span className="text-xs text-white">23 stars</span>
                                  )}
                                </a>
                            )
                          })}
                        </div>
                        <h3 className="text-lg font-semibold">
                          Token Chain Project: Revolutionizing Digital Asset Management
                        </h3>

                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                          {mockChainData.description}
                        </p>
                      </div>

                      <Separator />

                      {/* Gallery Section */}
                      <div className="space-y-4">
                        {/* Main Gallery Display */}
                        <div className="relative aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                          <span className="text-muted-foreground">Gallery Image {currentGalleryIndex + 1}</span>

                          {/* Navigation Arrows */}
                          {mockChainData.gallery.length > 1 && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                                onClick={() => navigateGallery('prev')}
                              >
                                <ChevronLeft className="w-5 h-5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                                onClick={() => navigateGallery('next')}
                              >
                                <ChevronRight className="w-5 h-5" />
                              </Button>
                            </>
                          )}
                        </div>

                        {/* Thumbnails */}
                        <div className="flex gap-3 overflow-x-auto">
                          {mockChainData.gallery.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentGalleryIndex(idx)}
                              className={`flex-shrink-0 w-24 h-16 rounded-lg bg-muted flex items-center justify-center transition-all ${
                                currentGalleryIndex === idx ? 'ring-2 ring-primary' : ''
                              }`}
                            >
                              <span className="text-xs text-muted-foreground">{idx + 1}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Notes Section */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Notes</h3>
                    <p className="text-sm text-muted-foreground">No notes yet...</p>
                  </Card>
                </TabsContent>

                <TabsContent value="holders" className="mt-4">
                  <Card className="p-6">
                    <p className="text-sm text-muted-foreground">Holders list coming soon...</p>
                  </Card>
                </TabsContent>

                <TabsContent value="code" className="mt-4">
                  <Card className="p-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Language</p>
                        <p className="font-medium">{mockChainData.language}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Repository</p>
                        <p className="font-medium">{mockChainData.repositoryName}</p>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="block-explorer" className="mt-4">
                  <Card className="p-6">
                    <p className="text-sm text-muted-foreground">Block explorer coming soon...</p>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Options Card */}
              <Card className="p-6">
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Zap className="w-4 h-4" />
                    <span className="flex-1 text-left">CNPY</span>
                    <span className="text-muted-foreground">Use max</span>
                  </Button>

                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <div className="text-3xl font-bold">$0</div>
                    <div className="text-sm text-muted-foreground mt-1">0 CNPY ⚡</div>
                  </div>

                  <div className="flex justify-center">
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <ArrowUpRight className="w-5 h-5 rotate-90" />
                    </Button>
                  </div>

                  <Button variant="outline" className="w-full justify-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-white">O</span>
                    </div>
                    <span className="flex-1 text-left">Onchain ENS</span>
                    <span className="text-muted-foreground">D</span>
                  </Button>

                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <div className="text-3xl font-bold">$0.00</div>
                  </div>

                  <Button className="w-full" size="lg">
                    Connect Wallet
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    1 CNPY = 1.00000 $OENS
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
