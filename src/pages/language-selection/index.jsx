import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import LaunchpadSidebar from '@/components/LaunchpadSidebar'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

const languages = [
  { id: 'python', name: 'Python', icon: '🐍' },
  { id: 'java', name: 'Java', icon: '☕' },
  { id: 'kotlin', name: 'Kotlin', icon: '🎯' },
  { id: 'go', name: 'Go', icon: '🐹' },
  { id: 'csharp', name: 'C#', icon: '🔷' },
  { id: 'ruby', name: 'Ruby', icon: '💎' },
  { id: 'dart', name: 'Dart', icon: '🎯' },
  { id: 'javascript', name: 'JavaScript', icon: '🟨' },
]

export default function LanguageSelection() {
  const navigate = useNavigate()
  const [selectedLanguage, setSelectedLanguage] = useState(null)

  const handleBack = () => {
    navigate('/launchpad')
  }

  const handleContinue = () => {
    if (selectedLanguage) {
      navigate('/launchpad/repository')
    }
  }

  const handleClose = () => {
    navigate('/')
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <LaunchpadSidebar currentStep={1} completedSteps={[]} />
      
      <SidebarInset>
        {/* Header */}
        <div className="flex justify-end p-2 border-b mb-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">
                Choose Your Programming Language
              </h1>
              <p className="text-muted-foreground">
                Pick the language you're most comfortable with:
              </p>
            </div>

            {/* Language Grid */}
            <div className="grid grid-cols-3 gap-4">
              {languages.map((lang) => (
                <Card
                  key={lang.id}
                  className={cn(
                    "p-6 cursor-pointer transition-all hover:border-primary/50",
                    selectedLanguage === lang.id && "border-primary bg-primary/5"
                  )}
                  onClick={() => setSelectedLanguage(lang.id)}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className="text-4xl">{lang.icon}</div>
                    <span className="font-medium">{lang.name}</span>
                  </div>
                </Card>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-8">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              
              <Button
                onClick={handleContinue}
                disabled={!selectedLanguage}
                className="gap-2"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}