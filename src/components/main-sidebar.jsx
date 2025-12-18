import { useState, useEffect } from 'react'
import { Separator } from '@/components/ui/separator'
import { Search, Plus, Zap, BarChart3, Droplets, TrendingUp, Home, PieChart, Repeat, MoreHorizontal, Wallet as WalletIcon } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import LaunchOverviewDialog from './launch-overview-dialog'
import CommandSearchDialog from './command-search-dialog'
import WalletConnectionDialog from './wallet-connection-dialog'
import { useWallet } from '@/contexts/wallet-context'

export default function MainSidebar({ variant = 'default' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [showDialog, setShowDialog] = useState(false)
  const [showCommandSearch, setShowCommandSearch] = useState(false)
  const [showWalletConnection, setShowWalletConnection] = useState(false)
  const { isConnected, walletAddress, getTotalBalance, formatAddress } = useWallet()

  // Check if we're on the launchpad (home page)
  const isLaunchpad = location.pathname === '/'
  const isTrade = location.pathname.startsWith('/trade')
  const isLiquidity = location.pathname.startsWith('/liquidity')

  const handleStartLaunch = () => {
    setShowDialog(false)
    navigate('/launchpad/language')
  }

  // Keyboard shortcut for search (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setShowCommandSearch(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Compact variant for launch flow
  if (variant === 'compact') {
    return (
      <>
        <div className="w-[73px] border-r border-zinc-800 bg-card flex flex-col justify-between pb-7 h-screen sticky top-0">
          <div className="space-y-4">
            {/* Logo */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center pt-6 pb-2 w-full hover:opacity-80 transition-opacity cursor-pointer"
            >
              <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.7649 0.880227C12.658 0.827134 12.5342 0.905351 12.5342 1.02378V3.04351C12.5342 3.18794 12.7104 3.26027 12.8135 3.15814L14.069 1.91394C14.1383 1.84534 14.1317 1.73215 14.0535 1.67368C13.6439 1.36708 13.2123 1.10259 12.7649 0.880227Z" fill="white"/>
                <path d="M10.4705 0.127791C10.5477 0.141319 10.6032 0.208239 10.6032 0.285896V5.28157C10.6032 5.32456 10.586 5.36579 10.5553 5.3962L8.90769 7.02887C8.80463 7.13099 8.62842 7.05867 8.62842 6.91423V0.163239C8.62842 0.0764816 8.69735 0.00493239 8.78487 0.00272091C9.34863 -0.0115243 9.91358 0.0301658 10.4705 0.127791Z" fill="white"/>
                <path d="M6.64953 9.26628C6.68021 9.23588 6.69744 9.19464 6.69744 9.15164V0.531669C6.69744 0.424066 6.59358 0.346317 6.48993 0.37839C5.89636 0.562066 5.31929 0.812546 4.77074 1.12983C4.72107 1.15856 4.69092 1.21149 4.69092 1.26849V10.8158C4.69092 10.9602 4.86713 11.0325 4.97019 10.9304L6.64953 9.26628Z" fill="white"/>
                <path d="M2.4827 3.0726C2.57734 2.95748 2.75983 3.02558 2.75983 3.17407L2.75984 13.0535C2.75984 13.0965 2.7426 13.1377 2.71192 13.1681L2.53426 13.3441C2.46504 13.4128 2.35058 13.4059 2.29159 13.3285C-0.0224758 10.292 0.0412298 6.04232 2.4827 3.0726Z" fill="white"/>
                <path d="M10.3924 8.65513C10.2467 8.65513 10.1737 8.48052 10.2768 8.37839L11.9244 6.74572C11.9551 6.71532 11.9966 6.69824 12.04 6.69824H17.1031C17.1812 6.69824 17.2486 6.75292 17.2625 6.82908C17.3635 7.38074 17.408 7.94056 17.396 8.49942C17.3942 8.58642 17.3219 8.65513 17.234 8.65513H10.3924Z" fill="white"/>
                <path d="M14.1825 4.50709C14.0795 4.60922 14.1525 4.78383 14.2982 4.78383H16.3466C16.4664 4.78383 16.5454 4.66045 16.4911 4.55456C16.2638 4.11067 15.9935 3.68279 15.6806 3.27689C15.6215 3.20007 15.5077 3.19389 15.4388 3.26223L14.1825 4.50709Z" fill="white"/>
                <path d="M8.13428 10.5684C8.09089 10.5684 8.04928 10.5854 8.0186 10.6158L6.33926 12.28C6.2362 12.3821 6.30919 12.5567 6.45493 12.5567H16.1382C16.196 12.5567 16.2496 12.5265 16.2784 12.4769C16.5952 11.933 16.8447 11.3612 17.027 10.7733C17.0588 10.6707 16.9803 10.5684 16.8721 10.5684H8.13428Z" fill="white"/>
                <path d="M3.91045 14.9412C3.83293 14.8825 3.82636 14.7696 3.89534 14.7013L4.08101 14.5173C4.11169 14.4868 4.1533 14.4697 4.19669 14.4697H14.2374C14.3867 14.4697 14.4559 14.6496 14.3406 14.7438C11.33 17.208 6.99201 17.2737 3.91045 14.9412Z" fill="white"/>
              </svg>
            </button>

            {/* Divider */}
            <Separator className="bg-zinc-800" />

            {/* Search and Create */}
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={() => setShowCommandSearch(true)}
                className="w-9 h-9 flex items-center justify-center hover:bg-white/5 rounded-lg transition-colors"
              >
                <Search className="w-4 h-4 text-white/50" />
              </button>

              <button
                onClick={() => setShowDialog(true)}
                className="w-[57px] h-9 flex items-center justify-center rounded-xl bg-white/10 text-sm font-medium text-white shadow-[0px_2px_3px_0px_rgba(0,0,0,0.1)] transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Divider */}
            <Separator className="bg-zinc-800" />

            {/* Navigation */}
            <nav className="flex flex-col items-center gap-2">
              <button
                onClick={() => navigate('/')}
                className={`w-[57px] flex flex-col items-center justify-center gap-1 py-2 rounded-xl text-sm font-medium text-white transition-colors ${
                  isLaunchpad ? 'bg-white/10 shadow-[0px_2px_3px_0px_rgba(0,0,0,0.1)]' : 'hover:bg-white/5'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span className="text-[10px]">Launchpad</span>
              </button>
              <button className="w-[57px] flex flex-col items-center justify-center gap-1 py-2 rounded-xl text-sm font-medium text-white hover:bg-white/5 transition-colors">
                <BarChart3 className="w-4 h-4" />
                <span className="text-[10px]">Explorer</span>
              </button>
              <button
                onClick={() => navigate('/liquidity')}
                className={`w-[57px] flex flex-col items-center justify-center gap-1 py-2 rounded-xl text-sm font-medium text-white transition-colors ${
                  isLiquidity ? 'bg-white/10 shadow-[0px_2px_3px_0px_rgba(0,0,0,0.1)]' : 'hover:bg-white/5'
                }`}
              >
                <Droplets className="w-4 h-4" />
                <span className="text-[10px]">Liquidity</span>
              </button>
              <button
                onClick={() => navigate('/trade')}
                className={`w-[57px] flex flex-col items-center justify-center gap-1 py-2 rounded-xl text-sm font-medium text-white transition-colors ${
                  isTrade ? 'bg-white/10 shadow-[0px_2px_3px_0px_rgba(0,0,0,0.1)]' : 'hover:bg-white/5'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span className="text-[10px]">Trade</span>
              </button>
            </nav>
          </div>

          {/* Bottom Section */}
          <div className="px-2">
            {isConnected ? (
              <button
                onClick={() => navigate('/wallet')}
                className="w-full h-11 rounded-xl bg-[#0e200e] border border-white/15 text-sm font-medium text-[#1dd13a] backdrop-blur transition-colors hover:bg-[#0e200e]/80 flex items-center justify-center"
              >
                <WalletIcon className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => setShowWalletConnection(true)}
                className="w-full h-11 rounded-xl bg-[#0e200e] border border-white/15 text-sm font-medium text-[#1dd13a] backdrop-blur transition-colors hover:bg-[#0e200e]/80 flex items-center justify-center"
              >
                <WalletIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <LaunchOverviewDialog
          open={showDialog}
          onClose={() => setShowDialog(false)}
          onStart={handleStartLaunch}
        />

        <CommandSearchDialog
          open={showCommandSearch}
          onOpenChange={setShowCommandSearch}
        />

        <WalletConnectionDialog
          open={showWalletConnection}
          onOpenChange={setShowWalletConnection}
        />
      </>
    )
  }

  // Default variant
  return (
    <>
      <div className="w-60 border-r border-zinc-800 bg-card flex flex-col justify-between pb-7 h-screen sticky top-0">
          <div className="space-y-4">
            {/* Logo */}
            <button
              onClick={() => navigate('/')}
              className="px-8 pt-6 pb-2 w-full text-left hover:opacity-80 transition-opacity cursor-pointer"
            >
              <img
                src="/svg/logo.svg"
                alt="Canopy"
                className="h-6"
              />
            </button>

            {/* Divider */}
            <Separator className="bg-zinc-800" />

            {/* Search and Create */}
            <div className="px-4 space-y-3">
              <button
                onClick={() => setShowCommandSearch(true)}
                className="w-full h-9 flex items-center justify-between pl-4 pr-2 rounded-full bg-transparent text-sm text-white/50 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Search className="w-4 h-4" />
                  <span>Search chains...</span>
                </div>
                <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded-2xl bg-white/10 px-1.5 font-mono text-[10px] font-medium text-white/70">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </button>

            <button
              onClick={() => setShowDialog(true)}
              className="w-full h-9 flex items-center gap-3 pl-4 rounded-full bg-transparent text-sm font-medium text-white hover:bg-white/5 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Create L1 chain</span>
            </button>
          </div>

            {/* Divider */}
            <Separator className="bg-zinc-800" />

            {/* Navigation */}
            <nav className="px-4 space-y-2">
              <button
                onClick={() => navigate('/')}
                className={`w-full h-9 flex items-center gap-3 px-4 rounded-xl text-sm font-medium text-white transition-colors ${
                  isLaunchpad ? 'bg-white/10 shadow-[0px_2px_3px_0px_rgba(0,0,0,0.1)]' : 'hover:bg-white/5'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>Launchpad</span>
              </button>
              <button className="w-full h-9 flex items-center gap-3 px-4 rounded-xl text-sm font-medium text-white hover:bg-white/5 transition-colors">
                <BarChart3 className="w-4 h-4" />
                <span>Explorer</span>
              </button>
              <button
                onClick={() => navigate('/liquidity')}
                className={`w-full h-9 flex items-center gap-3 px-4 rounded-xl text-sm font-medium text-white transition-colors ${
                  isLiquidity ? 'bg-white/10 shadow-[0px_2px_3px_0px_rgba(0,0,0,0.1)]' : 'hover:bg-white/5'
                }`}
              >
                <Droplets className="w-4 h-4" />
                <span>Liquidity</span>
              </button>
              <button
                onClick={() => navigate('/trade')}
                className={`w-full h-9 flex items-center gap-3 px-4 rounded-xl text-sm font-medium text-white transition-colors ${
                  isTrade ? 'bg-white/10 shadow-[0px_2px_3px_0px_rgba(0,0,0,0.1)]' : 'hover:bg-white/5'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Trade</span>
              </button>
            </nav>
          </div>

        {/* Bottom Section */}
        <div className="px-4 space-y-3">
          {/* Connect Wallet or Wallet Card */}
          {isConnected ? (
            <button
              onClick={() => navigate('/wallet')}
              className="w-full rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-700 p-4 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-medium text-white/70">Balance</span>
                <WalletIcon className="w-4 h-4 text-white/70" />
              </div>
              <div className="text-2xl text-left font-bold text-white mb-2">
                ${getTotalBalance().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#1dd13a] flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-bold text-white">C</span>
                </div>
                <span className="text-sm font-medium text-white/90">{formatAddress(walletAddress)}</span>
              </div>
            </button>
          ) : (
            <button
              onClick={() => setShowWalletConnection(true)}
              className="w-full h-11 rounded-xl bg-[#0e200e] border border-white/15 text-sm font-medium text-[#1dd13a] backdrop-blur transition-colors hover:bg-[#0e200e]/80"
            >
              Connect wallet
            </button>
          )}
        </div>
      </div>

      <LaunchOverviewDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        onStart={handleStartLaunch}
      />

      <CommandSearchDialog
        open={showCommandSearch}
        onOpenChange={setShowCommandSearch}
      />

      <WalletConnectionDialog
        open={showWalletConnection}
        onOpenChange={setShowWalletConnection}
      />
    </>
  )
}
