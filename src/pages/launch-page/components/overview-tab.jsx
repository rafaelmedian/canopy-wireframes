import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Globe, Github, FileText, Link as LinkIcon, ExternalLink, Coins, BookOpen, Layers, Clock, Calendar, TrendingUp, Users, Code2, Activity, ArrowRight, Zap, Target, Sparkles, Crown, Trophy } from 'lucide-react'

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

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export default function OverviewTab({ chainData, currentGalleryIndex, setCurrentGalleryIndex, onNavigateToTab, isDraft = false }) {
  const getSocialIcon = (platform) => {
    switch(platform) {
      case 'twitter': return <TwitterIcon />
      case 'discord': return <DiscordIcon />
      case 'website': return <Globe className="w-4 h-4" />
      case 'github': return <Github className="w-4 h-4" />
      default: return null
    }
  }

  // Define all milestones with their requirements
  const milestones = [
    {
      id: 1,
      icon: Users,
      title: 'First 10 holders',
      requirement: 10,
      current: chainData.holderCount || 0,
      type: 'holders'
    },
    {
      id: 2,
      icon: TrendingUp,
      title: '$1k market cap',
      requirement: 1000,
      current: chainData.marketCap || 0,
      type: 'marketcap'
    },
    {
      id: 3,
      icon: Users,
      title: '50 holders milestone',
      requirement: 50,
      current: chainData.holderCount || 0,
      type: 'holders'
    },
    {
      id: 4,
      icon: Zap,
      title: '1,000 transactions',
      requirement: 1000,
      current: chainData.explorer?.totalTransactions || 0,
      type: 'transactions'
    },
    {
      id: 5,
      icon: TrendingUp,
      title: '$5k market cap',
      requirement: 5000,
      current: chainData.marketCap || 0,
      type: 'marketcap'
    },
    {
      id: 6,
      icon: Users,
      title: '100 holders club',
      requirement: 100,
      current: chainData.holderCount || 0,
      type: 'holders'
    },
    {
      id: 7,
      icon: Target,
      title: '$10k market cap',
      requirement: 10000,
      current: chainData.marketCap || 0,
      type: 'marketcap'
    },
    {
      id: 8,
      icon: Sparkles,
      title: '500 holders strong',
      requirement: 500,
      current: chainData.holderCount || 0,
      type: 'holders'
    },
    {
      id: 9,
      icon: Crown,
      title: '$25k market cap',
      requirement: 25000,
      current: chainData.marketCap || 0,
      type: 'marketcap'
    },
    {
      id: 10,
      icon: Trophy,
      title: 'Graduation ready',
      requirement: 50000,
      current: chainData.marketCap || 0,
      type: 'marketcap'
    }
  ]

  // Get completed milestones
  const completedMilestones = milestones.filter(m => m.current >= m.requirement)

  const navigateGallery = (direction) => {
    if (direction === 'prev') {
      setCurrentGalleryIndex(prev => prev === 0 ? chainData.gallery.length - 1 : prev - 1)
    } else {
      setCurrentGalleryIndex(prev => prev === chainData.gallery.length - 1 ? 0 : prev + 1)
    }
  }

  // Helper function to get avatar color
  const getAvatarColor = (address) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-orange-500'
    ]
    const hash = address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }

  return (
    <div className="space-y-6 mt-4">
      {/* About and Gallery Card */}
      <Card className="p-6">
        <div className="space-y-6">
          {/* About Section */}
          <div className="space-y-3">
            <TooltipProvider>
              <div className="flex items-center gap-2">
                {isDraft ? (
                  // Dimmed placeholders for draft chains
                  ['website', 'twitter', 'discord', 'github'].map(platform => (
                    <Tooltip key={platform}>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-muted/30 rounded-full border border-dashed border-muted-foreground/30 opacity-50 cursor-help">
                          {getSocialIcon(platform)}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        This is where your social media links will appear
                      </TooltipContent>
                    </Tooltip>
                  ))
                ) : (
                  // Active social links
                  chainData.socialLinks.slice(0, 4).map((link, idx) => {
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
                  })
                )}
              </div>
            </TooltipProvider>
            <h3 className="text-lg font-semibold">
              {chainData.title}
            </h3>

            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {chainData.description}
            </p>
          </div>

          {/* Milestone Badges Summary */}
          {!isDraft && completedMilestones.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <button
                  onClick={() => onNavigateToTab('milestones')}
                  className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group cursor-pointer"
                >
                  Achievements
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="flex flex-wrap gap-2">
                  {completedMilestones.map((milestone) => {
                    const Icon = milestone.icon
                    return (
                      <div
                        key={milestone.id}
                        className="flex items-center gap-2 px-3 py-2 bg-primary/5 border border-primary/20 rounded-lg"
                      >
                        {/* Hexagon Badge */}
                        <div className="relative w-6 h-6 flex items-center justify-center flex-shrink-0">
                          <svg
                            viewBox="0 0 100 100"
                            className="absolute inset-0 w-full h-full"
                          >
                            <polygon
                              points="50 0, 93.3 25, 93.3 75, 50 100, 6.7 75, 6.7 25"
                              className="fill-primary/20 stroke-primary"
                              strokeWidth="4"
                            />
                          </svg>
                          <Icon className="w-3 h-3 relative z-10 text-primary" />
                        </div>
                        <span className="text-sm font-medium">{milestone.title}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Gallery Section */}
          <div className="space-y-4">
            {/* Main Gallery Display */}
            <div className="relative aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
              <span className="text-muted-foreground">Gallery Image {currentGalleryIndex + 1}</span>

              {/* Navigation Arrows */}
              {chainData.gallery.length > 1 && (
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
            <div className="flex gap-3 p-1 overflow-x-auto">
              {chainData.gallery.map((_, idx) => (
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

      {/* Quick Stats Grid */}
      {!isDraft && (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Holders Summary */}
        <Card className="flex flex-col">
          <div className="flex items-start gap-3 p-5">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Holders</p>
              <p className="text-2xl font-bold">{chainData.holderCount?.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-5 pt-0">
            <div className="flex -space-x-2">
              {chainData.holders?.slice(0, 5).map((holder, idx) => (
                <div
                  key={idx}
                  className={`w-8 h-8 rounded-full border-2 border-card flex items-center justify-center text-xs font-semibold text-white ${getAvatarColor(holder.address)}`}
                >
                  {holder.address.slice(2, 4).toUpperCase()}
                </div>
              ))}
            </div>
            {chainData.holders?.length > 5 && (
              <span className="text-xs text-muted-foreground">+{chainData.holders.length - 5} more</span>
            )}
          </div>
          <div className="px-3 pb-3 flex-1 flex items-end">
            <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between group"
                onClick={() => onNavigateToTab('holders')}
            >
              View All Holders
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </Card>

        {/* Code Summary */}
        <Card className="flex flex-col">
          <div className="flex items-start gap-3 p-5">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Code2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Repository</p>
              <p className="text-xl font-bold">{chainData.language}</p>
            </div>
          </div>
          <div className="space-y-2 p-5 pt-0">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Stars</span>
              <span className="font-medium">{isDraft ? 0 : 23}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Forks</span>
              <span className="font-medium">{isDraft ? 0 : 8}</span>
            </div>
          </div>
          <div className="px-3 pb-3 flex-1 flex items-end">
            <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between group"
                onClick={() => onNavigateToTab('code')}
            >
              View Repository
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </Card>

        {/* Block Explorer Summary */}
        <Card className="flex flex-col">
          <div className="flex items-start gap-3 p-5">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Block Height</p>
              <p className="text-2xl font-bold">{chainData.explorer?.currentBlock?.toLocaleString()}</p>
            </div>
          </div>
          <div className="space-y-2 p-5 pt-0">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Transactions</span>
              <span className="font-medium">{chainData.explorer?.totalTransactions?.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Avg Block Time</span>
              <span className="font-medium">
                {chainData.tokenomics?.blockTime >= 60
                  ? `${chainData.tokenomics.blockTime / 60}m`
                  : `${chainData.tokenomics?.blockTime || 0}s`}
              </span>
            </div>
          </div>
          <div className="px-3 pb-3 flex-1 flex items-end">
            <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between group"
                onClick={() => onNavigateToTab('block-explorer')}
            >
              View Explorer
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </Card>
      </div>
      )}

      {/* Tokenomics Section */}
      {chainData.tokenomics && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Coins className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Tokenomics</h3>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Layers className="w-4 h-4" />
                  <span>Total Supply</span>
                </div>
                <p className="text-lg font-semibold">
                  {parseInt(chainData.tokenomics.totalSupply).toLocaleString()} {chainData.ticker}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Block Time</span>
                </div>
                <p className="text-lg font-semibold">
                  {chainData.tokenomics.blockTime >= 60
                    ? `${chainData.tokenomics.blockTime / 60} min`
                    : `${chainData.tokenomics.blockTime} sec`}
                </p>
              </div>
            </div>

            <div className="h-px bg-border" />

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Halving Schedule</span>
              </div>
              <p className="text-lg font-semibold">
                Every {chainData.tokenomics.halvingDays} days
              </p>
            </div>

            <div className="h-px bg-border" />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Layers className="w-4 h-4" />
                  <span>Blocks per Day</span>
                </div>
                <p className="text-lg font-semibold">
                  {Math.floor((24 * 60 * 60) / chainData.tokenomics.blockTime).toLocaleString()}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="w-4 h-4" />
                  <span>Est. Year 1 Emission</span>
                </div>
                <p className="text-lg font-semibold">
                  ~{chainData.tokenomics.yearOneEmission.toLocaleString()} {chainData.ticker}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Resources Section */}
      {chainData.resources && chainData.resources.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Resources & Documentation</h3>
          </div>
          <div className="space-y-3">
            {chainData.resources.map((item, idx) => (
              <a
                key={idx}
                href={item.type === 'url' ? item.url : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors group"
              >
                <div className="p-2 bg-background rounded-md">
                  {item.type === 'file' ? (
                    <FileText className="w-5 h-5 text-primary" />
                  ) : (
                    <LinkIcon className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate group-hover:text-primary transition-colors">
                    {item.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.type === 'file'
                      ? `${(item.size / 1024).toFixed(2)} KB`
                      : item.description || 'External link'
                    }
                  </p>
                </div>
                {item.type === 'url' && (
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                )}
              </a>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
