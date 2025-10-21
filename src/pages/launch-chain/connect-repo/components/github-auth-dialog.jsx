import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { User, FileText, Activity, ExternalLink, Clock, Users, Check } from 'lucide-react'

export default function GitHubAuthDialog({ open, onOpenChange, onAuthorize }) {
  const handleCancel = () => {
    onOpenChange(false)
  }

  const handleAuthorize = () => {
    // Simulate authorization
    onAuthorize()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full w-screen h-screen p-0 gap-0 bg-[#0d1117] border-0" hideClose noAnimation>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-full max-w-lg">
            {/* Header with logos */}
            <div className="flex items-center justify-center gap-4 py-8">
              <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.7649 0.880227C12.658 0.827134 12.5342 0.905351 12.5342 1.02378V3.04351C12.5342 3.18794 12.7104 3.26027 12.8135 3.15814L14.069 1.91394C14.1383 1.84534 14.1317 1.73215 14.0535 1.67368C13.6439 1.36708 13.2123 1.10259 12.7649 0.880227Z" fill="white"/>
                  <path d="M10.4705 0.127791C10.5477 0.141319 10.6032 0.208239 10.6032 0.285896V5.28157C10.6032 5.32456 10.586 5.36579 10.5553 5.3962L8.90769 7.02887C8.80463 7.13099 8.62842 7.05867 8.62842 6.91423V0.163239C8.62842 0.0764816 8.69735 0.00493239 8.78487 0.00272091C9.34863 -0.0115243 9.91358 0.0301658 10.4705 0.127791Z" fill="white"/>
                  <path d="M6.64953 9.26628C6.68021 9.23588 6.69744 9.19464 6.69744 9.15164V0.531669C6.69744 0.424066 6.59358 0.346317 6.48993 0.37839C5.89636 0.562066 5.31929 0.812546 4.77074 1.12983C4.72107 1.15856 4.69092 1.21149 4.69092 1.26849V10.8158C4.69092 10.9602 4.86713 11.0325 4.97019 10.9304L6.64953 9.26628Z" fill="white"/>
                  <path d="M2.4827 3.0726C2.57734 2.95748 2.75983 3.02558 2.75983 3.17407L2.75984 13.0535C2.75984 13.0965 2.7426 13.1377 2.71192 13.1681L2.53426 13.3441C2.46504 13.4128 2.35058 13.4059 2.29159 13.3285C-0.0224758 10.292 0.0412298 6.04232 2.4827 3.0726Z" fill="white"/>
                  <path d="M10.3924 8.65513C10.2467 8.65513 10.1737 8.48052 10.2768 8.37839L11.9244 6.74572C11.9551 6.71532 11.9966 6.69824 12.04 6.69824H17.1031C17.1812 6.69824 17.2486 6.75292 17.2625 6.82908C17.3635 7.38074 17.408 7.94056 17.396 8.49942C17.3942 8.58642 17.3219 8.65513 17.234 8.65513H10.3924Z" fill="white"/>
                  <path d="M14.1825 4.50709C14.0795 4.60922 14.1525 4.78383 14.2982 4.78383H16.3466C16.4664 4.78383 16.5454 4.66045 16.4911 4.55456C16.2638 4.11067 15.9935 3.68279 15.6806 3.27689C15.6215 3.20007 15.5077 3.19389 15.4388 3.26223L14.1825 4.50709Z" fill="white"/>
                  <path d="M8.13428 10.5684C8.09089 10.5684 8.04928 10.5854 8.0186 10.6158L6.33926 12.28C6.2362 12.3821 6.30919 12.5567 6.45493 12.5567H16.1382C16.196 12.5567 16.2496 12.5265 16.2784 12.4769C16.5952 11.933 16.8447 11.3612 17.027 10.7733C17.0588 10.6707 16.9803 10.5684 16.8721 10.5684H8.13428Z" fill="white"/>
                  <path d="M3.91045 14.9412C3.83293 14.8825 3.82636 14.7696 3.89534 14.7013L4.08101 14.5173C4.11169 14.4868 4.1533 14.4697 4.19669 14.4697H14.2374C14.3867 14.4697 14.4559 14.6496 14.3406 14.7438C11.33 17.208 6.99201 17.2737 3.91045 14.9412Z" fill="white"/>
                </svg>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-0 border-t-[2px] border-dashed border-muted-foreground"></div>
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
                <div className="w-8 h-0 border-t-[2px] border-dashed border-muted-foreground"></div>
              </div>

              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-10 h-10" fill="#000">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
            </div>

            {/* Permission request */}
            <div className="px-8 pb-6">
              <h2 className="text-center text-lg mb-6">
                Canopy by <span className="text-blue-400">Canopy Network</span> would like permission to:
              </h2>

              {/* Permissions list */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <User className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Verify your GitHub identity (eliezerpujols)</span>
                </div>

                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <FileText className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Know which resources you can access</span>
                </div>

                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Activity className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <span>Act on your behalf</span>
                    <a href="#" className="flex items-center gap-1 text-blue-400 text-xs hover:underline">
                      <ExternalLink className="w-3 h-3" />
                      Learn more
                    </a>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#30363d] pt-4 mb-6">
                <a href="#" className="text-blue-400 text-sm hover:underline">
                  Learn more about Canopy
                </a>
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="secondary"
                    onClick={handleCancel}
                    className="bg-[#21262d] hover:bg-[#30363d] text-white border-[#30363d]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAuthorize}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Authorize Canopy
                  </Button>
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  Authorizing will redirect to<br/>
                  <span className="text-white">https://canopy.network</span>
                </p>
              </div>

              {/* Footer info */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#30363d] text-xs text-muted-foreground">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                    <path fillRule="evenodd" d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"/>
                    <path d="M8 4.5a.5.5 0 01.5.5v3a.5.5 0 01-1 0V5a.5.5 0 01.5-.5z"/>
                  </svg>
                  <div>
                    <div className="font-medium text-white">Not owned or</div>
                    <div>operated by GitHub</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-white">Created</div>
                    <div>6 months ago</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-white">More than 1K</div>
                    <div>GitHub users</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
