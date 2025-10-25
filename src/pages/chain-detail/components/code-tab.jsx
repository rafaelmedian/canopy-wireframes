import { Button } from '@/components/ui/button.jsx'
import { Card } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.jsx'
import { Github, Star, GitFork, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react'

export default function CodeTab({ chainData }) {
  // Debug: Check what we're receiving
  console.log('=== CodeTab Debug ===');
  console.log('Full chainData:', chainData);
  console.log('chainData.language:', chainData.language);
  console.log('typeof chainData.language:', typeof chainData.language);

  // Check all properties that might be objects
  Object.keys(chainData).forEach(key => {
    if (typeof chainData[key] === 'object' && chainData[key] !== null && !Array.isArray(chainData[key])) {
      console.log(`chainData.${key} is an object:`, chainData[key]);
    }
  });

  // Ensure language is always a string
  const languageName = typeof chainData.language === 'string'
    ? chainData.language
    : (chainData.language?.name || 'TypeScript');

  // Ensure name is always a string
  const chainName = typeof chainData.name === 'string'
    ? chainData.name
    : (chainData.name?.name || 'Chain');

  // Ensure repositoryName is always a string
  const repoName = typeof chainData.repositoryName === 'string'
    ? chainData.repositoryName
    : (chainData.repositoryName?.name || 'repository');

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
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-semibold">
                  {repoName}
                </h3>
                {/* Deployment Status Badge */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {chainData.isGraduated ? (
                        <Badge variant="outline" className="border-green-500/50 text-green-500 gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Deployed
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-orange-500/50 text-orange-500 gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Not Deployed
                        </Badge>
                      )}
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[260px]">
                      {chainData.isGraduated ? (
                        <p className="text-xs">
                          This repository code is deployed and running on the real blockchain. The chain has graduated and is fully operational.
                        </p>
                      ) : (
                        <p className="text-xs">
                          This repository code is not yet deployed. The chain is currently virtual (test mode). It will be deployed to the real blockchain after graduation.
                        </p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
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
          <a
            href={`https://github.com/${repoName}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="w-4 h-4" />
              View on GitHub
            </Button>
          </a>
        </div>

        <div className="h-px bg-border" />

        {/* Language & Tech Stack */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Primary Language</p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <p className="text-lg font-semibold">
                {languageName}
              </p>
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
            This repository contains the core blockchain implementation for {chainName}.
            Built with {languageName}, it provides a robust foundation for decentralized
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
              {languageName.toLowerCase()}
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
