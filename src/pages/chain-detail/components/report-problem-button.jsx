import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Flag } from 'lucide-react'
import ReportProblemDialog from './report-problem-dialog.jsx'

export default function ReportProblemButton({ chainData }) {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <div className="flex justify-center">
        <Button
          variant="ghost"
          className="gap-2 text-muted-foreground"
          onClick={() => setDialogOpen(true)}
        >
          <Flag className="w-4 h-4" />
          Flag Project
        </Button>
      </div>

      <ReportProblemDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        chainData={chainData}
      />
    </>
  )
}
