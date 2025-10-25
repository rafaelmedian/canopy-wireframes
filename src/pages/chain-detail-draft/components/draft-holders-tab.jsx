import { Card } from '@/components/ui/card'
import { Users } from 'lucide-react'

export default function DraftHoldersTab({ chainData }) {
  return (
    <Card className="p-12 mt-4">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="p-4 bg-muted rounded-full">
          <Users className="w-8 h-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">No holders yet</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Once you launch your chain, token holders will appear here. Complete the remaining steps to launch and start building your community.
          </p>
        </div>
      </div>
    </Card>
  )
}
