import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Button } from '@/components/ui/button.jsx'
import { toast } from 'sonner'
import { AlertTriangle, Ban, Shield, FileWarning, TrendingDown, Scale, Info } from 'lucide-react'

const reportReasons = {
  scam: {
    icon: Ban,
    label: 'Scam/Fraud',
    options: [
      'Suspect team identities',
      'Plagiarized whitepaper',
      'Impersonating existing project',
      'Pump and dump scheme indicators',
      'Exit scam patterns'
    ]
  },
  security: {
    icon: Shield,
    label: 'Security Concerns',
    options: [
      'Malicious code',
      'Known exploit vulnerabilities',
      'Backdoors in code'
    ]
  },
  misleading: {
    icon: FileWarning,
    label: 'Misleading Information',
    options: [
      'Exaggerated claims about partnerships',
      'False technical capabilities',
      'Unverifiable team credentials',
      'Misleading tokenomics',
      'Hidden fees or taxes'
    ]
  },
  legal: {
    icon: Scale,
    label: 'Legal/Copyright Issues',
    options: [
      'Copyright infringement',
      'Trademark violation',
      'Using others\' IP without permission',
      'Regulatory violations in specific jurisdictions'
    ]
  },
  manipulation: {
    icon: TrendingDown,
    label: 'Market Manipulation',
    options: [
      'Wash trading indicators',
      'Coordinated pump groups',
      'Artificial volume generation',
      'Sybil attack patterns'
    ]
  },
  inappropriate: {
    icon: AlertTriangle,
    label: 'Inappropriate Content',
    options: [
      'NSFW content without warning',
      'Offensive material',
      'Spam/low effort project'
    ]
  },
  technical: {
    icon: Info,
    label: 'Technical Concerns',
    options: [
      'No GitHub repository',
      'Template not customized',
      'Missing documentation'
    ]
  }
}

export default function ReportProblemDialog({ open, onOpenChange, chainData }) {
  const [mainReason, setMainReason] = useState('')
  const [specificReason, setSpecificReason] = useState('')
  const [additionalComments, setAdditionalComments] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!mainReason || !specificReason) {
      toast.error('Please select both main and specific reasons')
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      toast.success('Report submitted successfully', {
        description: 'Our team will review your report shortly.'
      })
      setIsSubmitting(false)
      handleClose()
    }, 1500)
  }

  const handleClose = () => {
    setMainReason('')
    setSpecificReason('')
    setAdditionalComments('')
    onOpenChange(false)
  }

  const handleMainReasonChange = (value) => {
    setMainReason(value)
    setSpecificReason('') // Reset specific reason when main reason changes
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Flag {chainData?.name}</DialogTitle>
          <DialogDescription>
            Help us keep the Canopy ecosystem safe by flagging chains that violate our policies.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-4">
          {/* Main Reason */}
          <div className="space-y-2">
            <Label className="block text-sm font-medium">Choose a reason</Label>
            <RadioGroup value={mainReason} onValueChange={handleMainReasonChange}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(reportReasons).map(([key, { icon: IconComponent, label }]) => (
                  <div key={key}>
                    <RadioGroupItem
                      value={key}
                      id={key}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={key}
                      className="flex items-center gap-3 p-4 rounded-lg border-1 border-muted bg-muted/30 hover:bg-muted/50 cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                    >
                      <IconComponent className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">{label}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Specific Reason - Only show when main reason is selected */}
          {mainReason && (
            <div className="space-y-2">
              <Label className="block text-sm font-medium">Specify the issue</Label>
              <RadioGroup value={specificReason} onValueChange={setSpecificReason}>
                <div className="space-y-3">
                  {reportReasons[mainReason].options.map((option) => (
                    <div key={option} className="flex items-center space-x-3">
                      <RadioGroupItem value={option} id={option} />
                      <Label
                        htmlFor={option}
                        className="font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Additional Comments */}
          {specificReason && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="comments" className="block text-sm font-medium">
                  Additional comments
                </Label>
                <Badge variant="secondary" className="text-xs">Optional</Badge>
              </div>
              <Textarea
                id="comments"
                placeholder="Provide any additional details that might help us investigate this report..."
                value={additionalComments}
                onChange={(e) => setAdditionalComments(e.target.value)}
                maxLength={500}
                rows={4}
                className="resize-none"
              />
              <p className="text-sm text-muted-foreground">
                {additionalComments.length}/500 characters
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!mainReason || !specificReason || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Flag'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
