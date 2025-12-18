import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

export default function LpEarningsHistorySheet({ open, onOpenChange, lpEarningsHistory, lpPositions }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Earnings History</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">Earnings history - to be implemented</p>
        </div>
      </SheetContent>
    </Sheet>
  )
}

