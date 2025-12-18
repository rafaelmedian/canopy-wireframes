import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

export default function ClaimFeesDialog({ open, onOpenChange, position }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Claim Fees</h2>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">Claim fees dialog - to be implemented</p>
      </DialogContent>
    </Dialog>
  )
}

