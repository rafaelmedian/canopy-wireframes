import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LaunchpadOverview from '@/pages/launch-chain/launchpad-overview'
import LanguageSelection from '@/pages/launch-chain/language-selection'
import ConnectRepo from '@/pages/launch-chain/connect-repo'
import ConfigureChain from '@/pages/launch-chain/configure-chain'
import Branding from '@/pages/launch-chain/branding'
import Links from '@/pages/launch-chain/links'
import LaunchSettings from '@/pages/launch-chain/launch-settings'
import Review from '@/pages/launch-chain/review'
import LaunchPage from '@/pages/launch-page'
import LaunchPageOwner from '@/pages/launch-page-owner'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { useNavigate } from 'react-router-dom'

function HomePage() {
  const navigate = useNavigate()

  const handleGetStarted = () => {
    navigate('/launchpad/')
  }
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Canopy Launcher</h1>
          <p className="text-lg text-muted-foreground">
            Launch your blockchain network in minutes
          </p>
        </div>
        <Button onClick={handleGetStarted} size="lg">
            Start Launching
        </Button>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chain/someone-else-chain" element={<LaunchPage />} />
        <Route path="/chain/my-chain" element={<LaunchPageOwner />} />
        <Route path="/launchpad" element={<LaunchpadOverview />} />
        <Route path="/launchpad/language" element={<LanguageSelection />} />
        <Route path="/launchpad/repository" element={<ConnectRepo />} />
        <Route path="/launchpad/configure" element={<ConfigureChain />} />
        <Route path="/launchpad/branding" element={<Branding />} />
        <Route path="/launchpad/links" element={<Links />} />
        <Route path="/launchpad/settings" element={<LaunchSettings />} />
        <Route path="/launchpad/review" element={<Review />} />
        <Route path="/launchpad/success" element={<div className="p-8">Launch Complete! (Coming Soon)</div>} />
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App
