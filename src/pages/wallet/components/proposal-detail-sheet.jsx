import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  AlertCircle,
  Clock,
  Check,
  X,
  AlertTriangle,
  User,
  Calendar,
  BarChart,
  Shield,
  ArrowLeft,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'

export default function ProposalDetailSheet({ open, onOpenChange, proposal, userVotingPower }) {
  const [isVoting, setIsVoting] = useState(false)
  const [voteType, setVoteType] = useState(null)

  if (!proposal) return null

  const handleVote = async (type) => {
    setIsVoting(true)
    setVoteType(type)

    // Simulate voting delay
    setTimeout(() => {
      setIsVoting(false)
      setVoteType(null)
      proposal.userVote = type
      toast.success(`Successfully voted ${type === 'for' ? 'For' : 'Against'} the proposal`)
      onOpenChange(false)
    }, 2000)
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
    return (
      <Badge variant="outline" className="gap-1">
        <Clock className="w-3 h-3" />
        Ends in {proposal.endsIn}
      </Badge>
    )
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[540px] overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onOpenChange(false)}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <SheetTitle className="flex-1">Proposal Details</SheetTitle>
          </div>

          {/* Status Badges */}
          <div className="flex items-center gap-2">
            {isActive ? getUrgencyBadge() : getStatusBadge()}
          </div>

          {/* Title and Network */}
          <div>
            <h2 className="text-2xl font-bold mb-2">{proposal.title}</h2>
            <p className="text-sm text-muted-foreground">{proposal.network}</p>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Proposal Info */}
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

          <Separator />

          {/* Current Votes Section */}
          {isActive && (
            <>
              <div>
                <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                  <BarChart className="w-4 h-4" />
                  Current Votes
                </h3>

                <div className="space-y-4">
                  {/* Voting Progress - Single Bar Split Layout */}
                  <div className="space-y-3">
                    {/* Progress Bar */}
                    <div className="relative h-3 flex gap-1 rounded-full overflow-hidden bg-transparent">
                      {/* For Section */}
                      <div
                        className="bg-green-500/70 rounded-full transition-all"
                        style={{ width: `${proposal.votesFor}%` }}
                      />
                      {/* Gap */}
                      <div className="w-1" />
                      {/* Against Section */}
                      <div
                        className="bg-red-500/60 rounded-full transition-all"
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
                  <div className="p-3 bg-muted/50 rounded-lg">
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
                </div>
              </div>

              <Separator />
            </>
          )}

          {/* Final Results (for completed proposals) */}
          {!isActive && (
            <>
              <div>
                <h3 className="text-base font-semibold mb-4">Final Results</h3>
                <Card>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">For</span>
                        <span className="font-medium">{proposal.votesFor}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Against</span>
                        <span className="font-medium">{proposal.votesAgainst}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Total Votes</span>
                        <span className="font-medium">{proposal.totalVotes.toLocaleString()} CNPY</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Result</span>
                        {proposal.status === 'passed' ? (
                          <Badge className="bg-green-600">Passed</Badge>
                        ) : (
                          <Badge className="bg-red-600">Not Passed</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator />
            </>
          )}

          {/* Summary Section */}
          <div>
            <h3 className="text-base font-semibold mb-3">Summary</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {proposal.summary}
            </p>
          </div>

          {/* Impact Section */}
          <div>
            <h3 className="text-base font-semibold mb-3">Impact</h3>
            <Card className="bg-orange-500/5 border-orange-500/20">
              <CardContent className="pt-4">
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                  <p className="text-sm leading-relaxed">{proposal.impact}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Your Voting Power */}
          {isActive && (
            <div>
              <h3 className="text-base font-semibold mb-3">Your Voting Power</h3>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      <span className="text-sm">Available Voting Power</span>
                    </div>
                    <span className="text-lg font-bold">{userVotingPower.toLocaleString()} CNPY</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Vote Actions */}
          {isActive && !proposal.userVote && (
            <div className="grid grid-cols-2 gap-3 pt-4">
              <Button
                className="h-12"
                variant="outline"
                onClick={() => handleVote('for')}
                disabled={isVoting}
              >
                {isVoting && voteType === 'for' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Voting...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Vote For
                  </>
                )}
              </Button>
              <Button
                className="h-12"
                variant="outline"
                onClick={() => handleVote('against')}
                disabled={isVoting}
              >
                {isVoting && voteType === 'against' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Voting...
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Vote Against
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Already Voted */}
          {isActive && proposal.userVote && (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">You have already voted</span>
                  <Badge className="bg-primary">
                    {proposal.userVote === 'for' ? '✓ For' : '✗ Against'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* User's Past Vote (for completed proposals) */}
          {!isActive && proposal.userVote && (
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Your Vote</span>
                  <Badge variant="secondary">
                    {proposal.userVote === 'for' ? 'Voted For' : 'Voted Against'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}