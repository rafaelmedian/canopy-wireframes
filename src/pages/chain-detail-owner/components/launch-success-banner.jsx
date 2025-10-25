import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, Link, Rocket } from 'lucide-react'
import { toast } from 'sonner'

export default function LaunchSuccessBanner({ onDismiss, chainName, chainUrl }) {
  const [isVisible, setIsVisible] = useState(true)

  const handleDismiss = () => {
    setIsVisible(false)
    if (onDismiss) onDismiss()
  }

  const handleShare = () => {
    // Copy chain URL to clipboard
    navigator.clipboard.writeText(window.location.href)
    toast.success('Chain link copied to clipboard!')
  }

  if (!isVisible) return null

  return (
    <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/50 mb-6">
      <div className="flex items-center gap-4 p-4">
        {/* Icon */}
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/20">
          <Rocket className="w-5 h-5 text-green-500" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Congratulations! Your chain is now live
          </h3>
          <p className="text-sm text-muted-foreground">
            {chainName} has been successfully launched. Share it with your community to start building momentum and attract holders.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleShare}
          >
            <Link className="w-4 h-4" />
            Share
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleDismiss}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
