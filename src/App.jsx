import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Launchpad from '@/pages/launchpad'
import LanguageSelection from '@/pages/launch-chain/language-selection'
import ConnectRepo from '@/pages/launch-chain/connect-repo'
import ConfigureChain from '@/pages/launch-chain/configure-chain'
import Branding from '@/pages/launch-chain/branding'
import Links from '@/pages/launch-chain/links'
import LaunchSettings from '@/pages/launch-chain/launch-settings'
import Review from '@/pages/launch-chain/review'
import ChainDetail from '@/pages/chain-detail'
import TransactionPage from '@/pages/transaction-page'
import BlockPage from '@/pages/block-page'
import Wallet from '@/pages/wallet'
import { Toaster } from '@/components/ui/sonner'
import { LaunchFlowProvider, useLaunchFlow } from '@/contexts/launch-flow-context'
import { WalletProvider } from '@/contexts/wallet-context'

function RouteWatcher() {
  const location = useLocation()
  const { clearFlowData } = useLaunchFlow()

  useEffect(() => {
    // Clear launch flow data when navigating away from /launchpad/* routes
    if (!location.pathname.startsWith('/launchpad')) {
      clearFlowData()
    }
  }, [location.pathname, clearFlowData])

  return null
}

function AppContent() {
  return (
    <>
      <RouteWatcher />
      <Routes>
        <Route path="/" element={<Launchpad />} />
        {/* Dynamic chain detail route - handles all chains from database */}
        <Route path="/chain/:slug" element={<ChainDetail />} />
        {/* Transaction and Block detail routes */}
        <Route path="/transaction/:hash" element={<TransactionPage />} />
        <Route path="/block/:blockHash" element={<BlockPage />} />
        {/* Wallet route */}
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/launchpad/language" element={<LanguageSelection />} />
        <Route path="/launchpad/repository" element={<ConnectRepo />} />
        <Route path="/launchpad/configure" element={<ConfigureChain />} />
        <Route path="/launchpad/branding" element={<Branding />} />
        <Route path="/launchpad/links" element={<Links />} />
        <Route path="/launchpad/settings" element={<LaunchSettings />} />
        <Route path="/launchpad/review" element={<Review />} />
      </Routes>
      <Toaster />
    </>
  )
}

function App() {
  return (
    <Router>
      <WalletProvider>
        <LaunchFlowProvider>
          <AppContent />
        </LaunchFlowProvider>
      </WalletProvider>
    </Router>
  )
}

export default App
