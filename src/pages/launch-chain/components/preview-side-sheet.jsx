import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet.jsx'
import ChainDetailDraft from '@/pages/chain-detail-draft/index.jsx'

// Social platforms configuration
const SOCIAL_PLATFORMS = [
  { value: 'website', label: 'Website' },
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'discord', label: 'Discord' },
  { value: 'medium', label: 'Medium' },
  { value: 'reddit', label: 'Reddit' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'facebook', label: 'Facebook' }
]

export default function PreviewSideSheet({ open, onOpenChange, formData }) {
  // Calculate year one emission for tokenomics
  const calculateYearOneEmission = (totalSupply, blockTime, halvingDays) => {
    const blocksPerYear = (365 * 24 * 60 * 60) / blockTime
    const blocksPerHalving = (halvingDays * 24 * 60 * 60) / blockTime
    const initialBlockReward = totalSupply / (blocksPerHalving * 2)
    return Math.floor(blocksPerYear * initialBlockReward)
  }

  // Build preview chain data from form data
  const previewChainData = {
    // Basic info
    id: 'preview',
    name: formData?.name || 'Untitled Chain',
    ticker: formData?.ticker || 'UNTD',
    title: formData?.title || `${formData?.name || 'Untitled Chain'}: The Future of Blockchain`,
    description: formData?.description || 'No description provided yet.',

    // Chain config
    totalSupply: formData?.totalSupply || 1000000000,
    consensusType: formData?.consensus || 'Proof of Stake',
    blockTime: formData?.blockTime || 3,
    maxValidators: formData?.maxValidators || 100,

    // Tokenomics section
    tokenomics: formData?.totalSupply ? {
      totalSupply: formData.totalSupply || 1000000000,
      blockTime: formData.blockTime || 10,
      halvingDays: formData.halvingDays || 365,
      yearOneEmission: calculateYearOneEmission(
        formData.totalSupply || 1000000000,
        formData.blockTime || 10,
        formData.halvingDays || 365
      )
    } : null,

    // Branding
    brandColor: formData?.brandColor || '#10b981',
    logo: formData?.logo || null,
    bannerImage: formData?.bannerImage || null,
    gallery: formData?.gallery || [],

    // Transform social links with proper structure
    socialLinks: formData?.social?.filter(link => link?.url)?.map(link => ({
      platform: link.platform,
      label: SOCIAL_PLATFORMS.find(p => p.value === link.platform)?.label || link.platform,
      url: link.url
    })) || [],

    // Transform resources with proper structure
    resources: formData?.resources?.map(resource => ({
      type: resource.file ? 'file' : 'url',
      name: resource.name || resource.fileName || 'Resource',
      size: resource.file?.size || resource.size || 0,
      url: resource.url || '#',
      description: resource.description
    })) || [],

    // Repository
    language: formData?.language || 'Move',
    repository: formData?.repository || null,
    repositoryName: formData?.repository || null,

    // Launch settings
    launchType: formData?.launchType || 'fair',
    initialPrice: formData?.initialPrice || 0.01,
    graduationThreshold: formData?.graduationThreshold || 50000,
    initialPurchase: formData?.initialPurchase || 0,

    // State flags
    isDraft: true,
    isVirtual: false,
    isGraduated: false,

    // Default values for required fields
    creator: '0x0000000000000000000000000000000000000000',
    creatorName: 'You',
    marketCap: 0,
    holders: 0,
    totalTransactions: 0,
    currentBlock: 0,
    currentPrice: 0,
    priceChange24h: 0,
    volume24h: 0,

    // Preview mode flag
    isPreview: true
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[90%] p-0 overflow-y-auto">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle>Preview Your Chain</SheetTitle>
        </SheetHeader>
        <div className="h-[calc(100vh-73px)]">
          <ChainDetailDraft chainData={previewChainData} isPreview={true} />
        </div>
      </SheetContent>
    </Sheet>
  )
}