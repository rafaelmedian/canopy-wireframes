import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  AlertCircle,
  ChevronRight,
  Clock,
  Check,
  X,
  AlertTriangle,
  TrendingUp,
  Users,
  Shield
} from 'lucide-react'
import governanceData from '@/data/governance.json'
import chainsData from '@/data/chains.json'

// Helper function to get chain by ID
const getChainById = (chainId) => {
  return chainsData.find(chain => chain.id === chainId) || null
}

// Mock data for proposals with chain info
const mockProposals = governanceData.proposals.map(proposal => {
  const chain = getChainById(proposal.chainId)
  return {
    ...proposal,
    network: chain?.name || 'Unknown Network',
    chainLogo: chain?.logo,
    chainColor: chain?.brandColor || '#1dd13a'
  }
})


export default function GovernanceTab({ userVotingPower = 2500 }) {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all') // all, active, passed, failed

  const handleProposalClick = (proposal) => {
    navigate(`/governance/${proposal.id}`)
  }

  const getUrgencyBadge = (urgency) => {
    if (urgency === 'urgent') {
      return (
        <Badge variant="outline" className="border-orange-500/50 text-orange-500 gap-1">
          <AlertCircle className="w-3 h-3" />
          URGENT
        </Badge>
      )
    }
    return null
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'passed':
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            Passed
          </Badge>
        )
      case 'failed':
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            Not Passed
          </Badge>
        )
      default:
        return null
    }
  }

  const getFilteredProposals = () => {
    if (filter === 'all') return mockProposals
    return mockProposals.filter(p => p.status === filter)
  }

  const activeProposalsCount = mockProposals.filter(p => p.status === 'active').length
  const votedProposalsCount = mockProposals.filter(p => p.userVote !== null).length

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Voting Power</p>
                <p className="text-2xl font-bold">{userVotingPower.toLocaleString()} CNPY</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Proposals</p>
                <p className="text-2xl font-bold">{activeProposalsCount}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Votes Cast</p>
                <p className="text-2xl font-bold">{votedProposalsCount}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All Proposals
        </Button>
        <Button
          variant={filter === 'active' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('active')}
        >
          Active ({activeProposalsCount})
        </Button>
        <Button
          variant={filter === 'passed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('passed')}
        >
          Passed
        </Button>
        <Button
          variant={filter === 'failed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('failed')}
        >
          Not Passed
        </Button>
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        {getFilteredProposals().map((proposal) => (
          <Card
            key={proposal.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleProposalClick(proposal)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {getUrgencyBadge(proposal.urgency)}
                    {getStatusBadge(proposal.status)}
                    {proposal.status === 'active' && (
                      <Badge variant="outline" className="gap-1">
                        <Clock className="w-3 h-3" />
                        Ends in {proposal.endsIn}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{proposal.title}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  {proposal.userVote && (
                    <Badge variant="secondary" className="text-xs">
                      Your Vote: {proposal.userVote === 'for' ? '✓' : '✗'}
                    </Badge>
                  )}
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{proposal.description}</p>

              {/* Network info with avatar */}
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: proposal.chainColor }}
                >
                  {proposal.network.charAt(0)}
                </div>
                <span className="text-sm text-muted-foreground">{proposal.network}</span>
              </div>

              {/* Voting Progress - Show for all statuses */}
              <div className="space-y-2">
                {/* Progress Bar */}
                <div className="relative h-2 flex gap-0.5 rounded-full overflow-hidden bg-transparent">
                  {/* For Section */}
                  <div
                    className={`rounded-full transition-all ${
                      proposal.status === 'active'
                        ? 'bg-green-500/70'
                        : proposal.status === 'passed'
                          ? 'bg-green-500/70'
                          : 'bg-green-500/20'
                    }`}
                    style={{ width: `${proposal.votesFor}%` }}
                  />
                  {/* Gap */}
                  <div className="w-0.5" />
                  {/* Against Section */}
                  <div
                    className={`rounded-full transition-all ${
                      proposal.status === 'active'
                        ? 'bg-red-500/60'
                        : proposal.status === 'passed'
                          ? 'bg-red-500/15'
                          : 'bg-red-500/60'
                    }`}
                    style={{ width: `${proposal.votesAgainst}%` }}
                  />
                </div>

                {/* Labels Below */}
                <div className="flex justify-between text-xs">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Check className="w-3 h-3 text-green-600" />
                    <span className="font-medium">For</span>
                    <span>({proposal.votesFor}%) · {((proposal.totalVotes * proposal.votesFor) / 100).toLocaleString()} CNPY</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <span>{((proposal.totalVotes * proposal.votesAgainst) / 100).toLocaleString()} CNPY · ({proposal.votesAgainst}%)</span>
                    <span className="font-medium">Against</span>
                    <X className="w-3 h-3 text-red-600" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}