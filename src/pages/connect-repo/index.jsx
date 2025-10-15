import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, X, ExternalLink, Github } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import LaunchpadSidebar from '@/components/launchpad-sidebar'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import GitHubConnectDialog from './components/github-connect-dialog'

export default function ConnectRepo() {
  const navigate = useNavigate()
  const location = useLocation()
  const [connectedRepo, setConnectedRepo] = useState(null)
  const [showGitHubDialog, setShowGitHubDialog] = useState(false)
  
  // Get selected language from previous step (in real app, this would come from state management)
  const selectedLanguage = location.state?.language || 'Python'

  const handleBack = () => {
    navigate('/launchpad/language')
  }

  const handleContinue = () => {
    if (connectedRepo) {
      navigate('/launchpad/configure', { state: { repo: connectedRepo } })
    }
  }

  const handleClose = () => {
    navigate('/')
  }

  const handleOpenTemplate = () => {
    // In real app, this would open the actual GitHub template
    window.open('https://github.com/canopy/chain-template-python', '_blank')
  }

  const handleConnectRepo = (repoName) => {
    setConnectedRepo(repoName)
    setShowGitHubDialog(false)
  }

  const handleDisconnect = () => {
    setConnectedRepo(null)
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <LaunchpadSidebar currentStep={2} completedSteps={[1]} />
      
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
            <div className="flex flex-col gap-4">
              <img
                  src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${selectedLanguage.toLowerCase()}/${selectedLanguage.toLowerCase()}-plain.svg`}
                  alt={`${selectedLanguage} icon`}
                  className="w-10 h-10 brightness-0 invert"
              />
              <h1 className="text-3xl font-bold flex items-center gap-3">
                Fork {selectedLanguage} Template to Your GitHub

              </h1>
            </div>

            {/* Status Pills */}
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="py-1.5">
                ✓ Basic token functionality
              </Badge>
              <Badge variant="secondary" className="py-1.5">
                ✓ Consensus mechanism
              </Badge>
              <Badge variant="secondary" className="py-1.5">
                ✓ Ready to launch as-is
              </Badge>
              <Badge variant="secondary" className="py-1.5">
                ✓ Customizable
              </Badge>
            </div>

            {/* Steps Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">
                What happens next?
              </h2>

              {/* Step 1 */}
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                      1
                    </div>
                    <h3 className="font-semibold">Fork the {selectedLanguage} Template to your GitHub</h3>
                  </div>
                  <Button 
                    onClick={handleOpenTemplate}
                    className="w-full"
                    size="lg"
                    variant="secondary"
                  >
                    Open Template on GitHub
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </Card>

              {/* Step 2 */}
              <Card className="p-6">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-semibold shrink-0">
                    2
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Customize the code if you want (or leave it as-is)</h3>
                    <p className="text-sm text-muted-foreground">
                      If you're new to blockchain development, you can launch the template without changing anything! It's fully functional out of the box.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Step 3 */}
              <Card className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                    3
                  </div>
                  <h3 className="font-semibold">Connect your GitHub repository</h3>
                </div>
                
                <div className="border rounded-lg p-4">
                  {!connectedRepo ? (
                    <div className="flex flex-col items-center space-y-4">
                      <Github className="w-12 h-12 text-muted-foreground" />
                      <div className="text-center space-y-1">
                        <p className="font-medium">Connect Your Repository</p>
                        <p className="text-sm text-muted-foreground">
                          You can always update your code later.
                        </p>
                      </div>
                      <Button 
                        onClick={() => setShowGitHubDialog(true)}
                        variant="outline"
                        className="gap-2"
                      >
                        <Github className="w-4 h-4" />
                        Connect Repository
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Github className="w-8 h-8" />
                        <div>
                          <p className="font-medium">eliezerpujols / chain-python</p>
                          <p className="text-sm text-muted-foreground">Connected repository</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        onClick={handleDisconnect}
                        className="text-destructive hover:text-destructive"
                      >
                        Disconnect
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
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
                disabled={!connectedRepo}
                className="gap-2"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </SidebarInset>

      {/* GitHub Connect Dialog */}
      <GitHubConnectDialog 
        open={showGitHubDialog}
        onOpenChange={setShowGitHubDialog}
        onConnect={handleConnectRepo}
        language={selectedLanguage}
      />
    </SidebarProvider>
  )
}