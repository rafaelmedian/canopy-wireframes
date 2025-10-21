import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Launchpad from '@/pages/launchpad'
import LanguageSelection from '@/pages/launch-chain/language-selection'
import ConnectRepo from '@/pages/launch-chain/connect-repo'
import ConfigureChain from '@/pages/launch-chain/configure-chain'
import Branding from '@/pages/launch-chain/branding'
import Links from '@/pages/launch-chain/links'
import LaunchSettings from '@/pages/launch-chain/launch-settings'
import Review from '@/pages/launch-chain/review'
import ChainDetail from '@/pages/chain-detail'
import { Toaster } from '@/components/ui/sonner'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Launchpad />} />
        {/* Dynamic chain detail route - handles all chains from database */}
        <Route path="/chain/:slug" element={<ChainDetail />} />
        <Route path="/launchpad/language" element={<LanguageSelection />} />
        <Route path="/launchpad/repository" element={<ConnectRepo />} />
        <Route path="/launchpad/configure" element={<ConfigureChain />} />
        <Route path="/launchpad/branding" element={<Branding />} />
        <Route path="/launchpad/links" element={<Links />} />
        <Route path="/launchpad/settings" element={<LaunchSettings />} />
        <Route path="/launchpad/review" element={<Review />} />
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App
