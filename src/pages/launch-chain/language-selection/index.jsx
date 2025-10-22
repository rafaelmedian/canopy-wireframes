import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import MainSidebar from '@/components/main-sidebar'
import LaunchpadSidebar from '@/components/launchpad-sidebar'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

const languages = [
  { id: 'python', name: 'Python', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-plain.svg' },
  { id: 'java', name: 'Java', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-plain.svg' },
  { id: 'kotlin', name: 'Kotlin', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kotlin/kotlin-plain.svg' },
  { id: 'go', name: 'Go', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-plain.svg' },
  { id: 'csharp', name: 'C#', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-plain.svg' },
  { id: 'ruby', name: 'Ruby', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ruby/ruby-plain.svg' },
  { id: 'dart', name: 'Dart', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dart/dart-plain.svg' },
  { id: 'javascript', name: 'JavaScript', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-plain.svg' },
]

export default function LanguageSelection() {
  const navigate = useNavigate()
  const [selectedLanguage, setSelectedLanguage] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleBack = () => {
    navigate('/launchpad')
  }

  const handleContinue = () => {
    if (selectedLanguage) {
      const language = languages.find(l => l.id === selectedLanguage)
      navigate('/launchpad/repository', { state: { language: language.name } })
    }
  }

  const handleClose = () => {
    navigate('/')
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Compact Main Sidebar */}
      <MainSidebar variant="compact" />

      {/* Launch Progress Sidebar */}
      <LaunchpadSidebar currentStep={1} completedSteps={[]} repoConnected={false} />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
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
                    <img
                      src={lang.iconUrl}
                      alt={`${lang.name} logo`}
                      className="w-12 h-12 object-contain brightness-0 invert"
                    />
                    <span className="font-medium">{lang.name}</span>
                  </div>
                </Card>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end pt-8">
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
      </div>
    </div>
  )
}