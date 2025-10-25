import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet.jsx'
import ChainDetailDraft from '@/pages/chain-detail-draft/index.jsx'

export default function PreviewSideSheet({ open, onOpenChange, formData }) {
  // Build preview chain data from form data
  const previewChainData = {
    // Basic info
    id: 'preview',
    name: formData?.name || 'Untitled Chain',
    ticker: formData?.ticker || 'UNTD',
    description: formData?.description || 'No description provided yet.',

    // Chain config
    totalSupply: formData?.totalSupply || 1000000000,
    consensusType: formData?.consensus || 'Proof of Stake',
    blockTime: formData?.blockTime || 3,
    maxValidators: formData?.maxValidators || 100,

    // Branding
    brandColor: formData?.brandColor || '#10b981',
    logo: formData?.logo || null,
    bannerImage: formData?.bannerImage || null,
    gallery: formData?.gallery || [],

    // Social links
    socialLinks: formData?.links || [],

    // Repository
    language: formData?.language || 'Move',
    repository: formData?.repository || null,

    // Launch settings
    launchType: formData?.launchType || 'fair',
    initialPrice: formData?.initialPrice || 0.01,

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