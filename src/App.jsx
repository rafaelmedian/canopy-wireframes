import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LaunchpadOverview from '@/pages/launchpad-overview'
import LanguageSelection from '@/pages/language-selection'
import ConnectRepo from '@/pages/connect-repo'
import { Button } from '@/components/ui/button'

function HomePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Canopy Launcher</h1>
          <p className="text-lg text-muted-foreground">
            Launch your blockchain network in minutes
          </p>
        </div>
        <Button asChild size="lg">
          <a href="/launchpad">
            Start Launching
          </a>
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
        <Route path="/launchpad" element={<LaunchpadOverview />} />
        {/* Placeholder routes for future steps */}
        <Route path="/launchpad/language" element={<LanguageSelection />} />
        <Route path="/launchpad/repository" element={<ConnectRepo />} />
        <Route path="/launchpad/configure" element={<div className="p-8">Step 3: Configure Chain (Coming Soon)</div>} />
        <Route path="/launchpad/branding" element={<div className="p-8">Step 4: Add Branding (Coming Soon)</div>} />
        <Route path="/launchpad/trust" element={<div className="p-8">Step 5: Build Trust (Coming Soon)</div>} />
        <Route path="/launchpad/settings" element={<div className="p-8">Step 6: Launch Settings (Coming Soon)</div>} />
        <Route path="/launchpad/review" element={<div className="p-8">Step 7: Review & Payment (Coming Soon)</div>} />
        <Route path="/launchpad/success" element={<div className="p-8">Launch Complete! (Coming Soon)</div>} />
      </Routes>
    </Router>
  )
}

export default App
