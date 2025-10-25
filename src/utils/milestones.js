import { Users, TrendingUp, ArrowRightLeft, Target, Sparkles, Crown, Trophy, Zap } from 'lucide-react'

/**
 * Map icon string names to actual Lucide React components
 */
const iconMap = {
  'Users': Users,
  'TrendingUp': TrendingUp,
  'ArrowRightLeft': ArrowRightLeft,
  'Target': Target,
  'Sparkles': Sparkles,
  'Crown': Crown,
  'Trophy': Trophy,
  'Zap': Zap
}

/**
 * Get the appropriate icon component from a milestone's icon string
 * @param {string} iconName - The icon name from milestone data
 * @returns {Component} - The Lucide icon component
 */
export function getIconComponent(iconName) {
  return iconMap[iconName] || Target // Default to Target if icon not found
}

/**
 * Enrich milestones data with icon components
 * Converts icon string names to actual React components
 * @param {Array} milestones - Array of milestone objects
 * @returns {Array} - Milestones with icon components added
 */
export function enrichMilestonesWithIcons(milestones) {
  if (!milestones || !Array.isArray(milestones)) {
    return []
  }

  return milestones.map(milestone => ({
    ...milestone,
    icon: getIconComponent(milestone.icon || 'Target')
  }))
}

/**
 * Get completed milestones with icons
 * @param {Array} milestones - Array of milestone objects
 * @returns {Array} - Completed milestones with icon components
 */
export function getCompletedMilestones(milestones) {
  return enrichMilestonesWithIcons(milestones).filter(m => m.completed)
}
