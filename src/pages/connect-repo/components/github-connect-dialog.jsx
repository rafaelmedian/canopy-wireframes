import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Github, Search, Check } from 'lucide-react'

export default function GitHubConnectDialog({ open, onOpenChange, onConnect, language }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRepo, setSelectedRepo] = useState(null)

  // Fake repositories for demo
  const fakeRepos = [
    { id: 1, name: `chain-${language.toLowerCase()}`, fullName: `eliezerpujols/chain-${language.toLowerCase()}`, forked: true },
    { id: 2, name: 'my-blockchain', fullName: 'eliezerpujols/my-blockchain', forked: false },
    { id: 3, name: `${language.toLowerCase()}-template-fork`, fullName: `eliezerpujols/${language.toLowerCase()}-template-fork`, forked: true },
  ]

  const filteredRepos = fakeRepos.filter(repo => 
    repo.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleConnect = () => {
    if (selectedRepo) {
      onConnect(selectedRepo.fullName)
      setSelectedRepo(null)
      setSearchQuery('')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Github className="w-5 h-5" />
            Connect GitHub Repository
          </DialogTitle>
          <DialogDescription>
            Select the repository you forked from the {language} template
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Repository List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredRepos.map((repo) => (
              <div
                key={repo.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedRepo?.id === repo.id 
                    ? 'border-primary' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedRepo(repo)}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">{repo.fullName}</p>
                    <div className="flex items-center gap-2">
                      {repo.forked && (
                        <span className="text-xs text-muted-foreground">
                          Forked from canopy/chain-template-{language.toLowerCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  {selectedRepo?.id === repo.id && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false)
                setSelectedRepo(null)
                setSearchQuery('')
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConnect}
              disabled={!selectedRepo}
            >
              Connect Repository
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}