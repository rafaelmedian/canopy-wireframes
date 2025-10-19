import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Github, Star, GitFork, ExternalLink } from 'lucide-react'

export default function CodeTab({ chainData }) {
  return (
    <Card className="p-6 mt-4">
      <div className="space-y-6">
        {/* Repository Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-muted rounded-lg">
              <Github className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">
                {chainData.repositoryName}
              </h3>
              {/* Stats */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium">23</span>
                  <span className="text-muted-foreground">stars</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <GitFork className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">8</span>
                  <span className="text-muted-foreground">forks</span>
                </div>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <ExternalLink className="w-4 h-4" />
            View on GitHub
          </Button>
        </div>

        <div className="h-px bg-border" />

        {/* Language & Tech Stack */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Primary Language</p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <p className="text-lg font-semibold">{chainData.language}</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">License</p>
            <p className="text-lg font-semibold">MIT</p>
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Repository Description */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">About</p>
          <p className="text-sm leading-relaxed">
            This repository contains the core blockchain implementation for {chainData.name}.
            Built with {chainData.language}, it provides a robust foundation for decentralized
            applications and smart contract execution.
          </p>
        </div>

        {/* Topics/Tags */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Topics</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
              blockchain
            </span>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
              {chainData.language.toLowerCase()}
            </span>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
              smart-contracts
            </span>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
              decentralized
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}
