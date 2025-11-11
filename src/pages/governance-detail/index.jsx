import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import {
  CheckCircle2,
  Clock,
  XCircle,
  Copy,
  ArrowLeft,
  User,
  Calendar,
  BarChart,
  Shield,
  Check,
  X,
  AlertCircle,
  AlertTriangle,
  Loader2
} from 'lucide-react'
import MainSidebar from '@/components/main-sidebar'
import governanceData from '@/data/governance.json'
import chainsData from '@/data/chains.json'
import { toast } from 'sonner'
import { useWallet } from '@/contexts/wallet-context'

// Helper function to get chain by ID
const getChainById = (chainId) => {
  return chainsData.find(chain => chain.id === chainId) || null
}

// Get proposal by ID
const getProposalById = (proposalId) => {
  const proposal = governanceData.proposals.find(p => p.id === parseInt(proposalId))
  if (proposal) {
    const chain = getChainById(proposal.chainId)
    return {
      ...proposal,
      network: chain?.name || 'Unknown Network',
      chainLogo: chain?.logo,
      chainColor: chain?.brandColor || '#1dd13a',
      chainUrl: `/chain/${chain?.name.toLowerCase().replace(/\s+/g, '-')}`
    }
  }
  return null
}

export default function GovernanceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [proposal, setProposal] = useState(null)
  const [isVoting, setIsVoting] = useState(false)
  const [voteType, setVoteType] = useState(null)
  const { getWalletData } = useWallet()
  const walletData = getWalletData()
  const userVotingPower = walletData.totalValue || 2500

  useEffect(() => {
    if (id) {
      const proposalData = getProposalById(id)
      setProposal(proposalData)
    }
  }, [id])

  if (!proposal) {
    return (
      <div className="flex min-h-screen bg-background">
        <MainSidebar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Proposal not found</p>
        </div>
      </div>
    )
  }

  const handleVote = async (type) => {
    setIsVoting(true)
    setVoteType(type)

    // Simulate voting delay
    setTimeout(() => {
      setIsVoting(false)
      setVoteType(null)
      // Update proposal with new vote
      setProposal({ ...proposal, userVote: type })
      toast.success(`Successfully voted ${type === 'for' ? 'For' : 'Against'} the proposal`)
    }, 2000)
  }

  const handleBackToWallet = () => {
    navigate('/wallet?tab=governance')
  }

  const getUrgencyBadge = () => {
    if (proposal.urgency === 'urgent') {
      return (
        <Badge variant="outline" className="border-orange-500/50 text-orange-500 gap-1">
          <AlertCircle className="w-3 h-3" />
          URGENT • Ends in {proposal.endsIn}
        </Badge>
      )
    }
    if (proposal.status === 'active') {
      return (
        <Badge variant="outline" className="gap-1">
          <Clock className="w-3 h-3" />
          Ends in {proposal.endsIn}
        </Badge>
      )
    }
    return null
  }

  const getStatusBadge = () => {
    switch (proposal.status) {
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

  const isActive = proposal.status === 'active'

  return (
    <div className="flex min-h-screen bg-background">
      <MainSidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={handleBackToWallet}
              className="mb-4 ml-[-14px]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Governance
            </Button>

            <div className="space-y-4">
              {/* Status Badges */}
              <div className="flex items-center gap-2">
                {isActive ? getUrgencyBadge() : getStatusBadge()}
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold">{proposal.title}</h1>

              {/* Description */}
              <p className="text-muted-foreground text-lg">
                {proposal.description}
              </p>

              {/* Network info with avatar */}
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: proposal.chainColor }}
                >
                  {proposal.network.charAt(0)}
                </div>
                <span className="text-muted-foreground">{proposal.network}</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Proposal Info Card */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>Proposed by: {proposal.proposedBy}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Created: {proposal.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Voting Ends: {proposal.endDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <BarChart className="w-4 h-4" />
                    <span>Total Votes: {proposal.totalVotes.toLocaleString()} CNPY</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Voting Progress Card */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <BarChart className="w-5 h-5" />
                  Voting Results
                </h3>

                {/* Progress Bar */}
                <div className="space-y-3">
                  <div className="relative h-4 flex gap-1 rounded-full overflow-hidden bg-transparent">
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
                    <div className="w-1" />
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
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="font-medium">For</span>
                      <span className="text-muted-foreground">
                        ({proposal.votesFor}%) · {((proposal.totalVotes * proposal.votesFor) / 100).toLocaleString()} CNPY
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        {((proposal.totalVotes * proposal.votesAgainst) / 100).toLocaleString()} CNPY · ({proposal.votesAgainst}%)
                      </span>
                      <span className="font-medium">Against</span>
                      <X className="w-4 h-4 text-red-600" />
                    </div>
                  </div>
                </div>

                {/* Quorum Status */}
                {isActive && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Quorum Status</span>
                      {proposal.quorumReached ? (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <Check className="w-3 h-3 mr-1" />
                          Reached ({proposal.quorumNeeded}% needed)
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Not Met ({proposal.quorumNeeded}% needed)
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Final Result for completed proposals */}
                {!isActive && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Final Result</span>
                      {proposal.status === 'passed' ? (
                        <Badge className="bg-green-600">Passed</Badge>
                      ) : (
                        <Badge className="bg-red-600">Not Passed</Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Summary Section */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Summary</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {proposal.summary}
                </p>
              </CardContent>
            </Card>

            {/* Impact Section */}
            <Card className="border-orange-500/20 bg-orange-500/5">
              <CardContent className="p-6">
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Impact</h3>
                    <p className="text-muted-foreground leading-relaxed">{proposal.impact}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Voting Section */}
            {isActive && (
              <Card>
                <CardContent className="p-6 space-y-6">
                  {/* Your Voting Power */}
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      <span className="font-medium">Your Voting Power</span>
                    </div>
                    <span className="text-xl font-bold">{userVotingPower.toLocaleString()} CNPY</span>
                  </div>

                  {/* Vote Actions or Already Voted */}
                  {!proposal.userVote ? (
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        size="lg"
                        variant="outline"
                        className="h-14"
                        onClick={() => handleVote('for')}
                        disabled={isVoting}
                      >
                        {isVoting && voteType === 'for' ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Voting...
                          </>
                        ) : (
                          <>
                            <Check className="w-5 h-5 mr-2" />
                            Vote For
                          </>
                        )}
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="h-14"
                        onClick={() => handleVote('against')}
                        disabled={isVoting}
                      >
                        {isVoting && voteType === 'against' ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Voting...
                          </>
                        ) : (
                          <>
                            <X className="w-5 h-5 mr-2" />
                            Vote Against
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">You have already voted</span>
                        <Badge className="bg-primary">
                          {proposal.userVote === 'for' ? '✓ For' : '✗ Against'}
                        </Badge>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* User's Vote for completed proposals */}
            {!isActive && proposal.userVote && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Your Vote</span>
                    <Badge variant="secondary" className="text-sm">
                      {proposal.userVote === 'for' ? 'Voted For' : 'Voted Against'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}