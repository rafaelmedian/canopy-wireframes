import { Card } from '@/components/ui/card'
import { Activity } from 'lucide-react'

export default function DraftBlockExplorerTab() {
  return (
    <div className="space-y-6 mt-4">
      {/* Empty State */}
      <Card className="p-12">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-muted rounded-full">
            <Activity className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Blockchain not active yet</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Once your chain graduates, it will start producing blocks and people will be able to search blocks and transactions.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
