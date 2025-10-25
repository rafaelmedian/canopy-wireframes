// Database-like query functions for mock data
// All data is separated in JSON files and related by IDs

import chainsData from './chains.json'
import holdersData from './holders.json'
import transactionsData from './transactions.json'
import blocksData from './blocks.json'
import priceHistoryData from './price-history.json'
import milestonesData from './milestones.json'
import milestoneLogsData from './milestone-logs.json'
import { Globe, Github } from 'lucide-react'

// ============ HELPER FUNCTIONS ============

/**
 * Generate URL slug from chain name
 */
function generateSlug(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

/**
 * Add computed fields to chain object (url, goal, change24h, milestones)
 */
function enrichChain(chain) {
  return {
    ...chain,
    url: `/chain/${generateSlug(chain.name)}`,
    goal: chain.graduationThreshold || 50000,
    change24h: chain.priceChange24h || 0,
    milestones: getMilestonesByChainId(chain.id)
  }
}

// ============ CHAINS ============

export function getChainById(chainId) {
  const chain = chainsData.find(chain => chain.id === chainId)
  return chain ? enrichChain(chain) : null
}

export function getAllChains() {
  return chainsData.map(enrichChain)
}

export function getChainsByCreator(creatorAddress) {
  return chainsData
    .filter(chain => chain.creator.toLowerCase() === creatorAddress.toLowerCase())
    .map(enrichChain)
}

export function getChainsByOwner(ownerAddress) {
  return chainsData
    .filter(chain => chain.owner && chain.owner.toLowerCase() === ownerAddress.toLowerCase())
    .map(enrichChain)
}

export function getVirtualChains() {
  return chainsData
    .filter(chain => chain.isVirtual === true)
    .map(enrichChain)
}

export function getGraduatedChains() {
  return chainsData
    .filter(chain => chain.isGraduated === true)
    .map(enrichChain)
}

export function getDraftChains() {
  return chainsData
    .filter(chain => chain.isDraft === true)
    .map(enrichChain)
}

// ============ HOLDERS ============

export function getHoldersByChainId(chainId) {
  return holdersData.filter(holder => holder.chainId === chainId)
}

export function getHolderByAddress(chainId, address) {
  return holdersData.find(
    holder => holder.chainId === chainId &&
              holder.address.toLowerCase() === address.toLowerCase()
  ) || null
}

export function getTopHolders(chainId, limit = 10) {
  return holdersData
    .filter(holder => holder.chainId === chainId)
    .sort((a, b) => b.balance - a.balance)
    .slice(0, limit)
}

// ============ TRANSACTIONS ============

export function getTransactionsByChainId(chainId) {
  return transactionsData.filter(tx => tx.chainId === chainId)
}

export function getRecentTransactions(chainId, limit = 10) {
  return transactionsData
    .filter(tx => tx.chainId === chainId)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit)
}

export function getTransactionByHash(hash) {
  return transactionsData.find(
    tx => tx.hash.toLowerCase() === hash.toLowerCase()
  ) || null
}

export function getTransactionsByAddress(chainId, address) {
  return transactionsData.filter(
    tx => tx.chainId === chainId &&
          (tx.from.toLowerCase() === address.toLowerCase() ||
           tx.to.toLowerCase() === address.toLowerCase())
  )
}

export function getTransactionsByBlockNumber(chainId, blockNumber) {
  return transactionsData.filter(
    tx => tx.chainId === chainId && tx.blockNumber === blockNumber
  )
}

// ============ BLOCKS ============

export function getBlocksByChainId(chainId) {
  return blocksData.filter(block => block.chainId === chainId)
}

export function getRecentBlocks(chainId, limit = 10) {
  return blocksData
    .filter(block => block.chainId === chainId)
    .sort((a, b) => b.number - a.number)
    .slice(0, limit)
}

export function getBlockByNumber(chainId, blockNumber) {
  return blocksData.find(
    block => block.chainId === chainId && block.number === blockNumber
  ) || null
}

export function getBlockByHash(hash) {
  return blocksData.find(
    block => block.hash.toLowerCase() === hash.toLowerCase()
  ) || null
}

// ============ PRICE HISTORY ============

export function getPriceHistoryByChainId(chainId) {
  return priceHistoryData.filter(price => price.chainId === chainId)
}

export function getLatestPrice(chainId) {
  const history = priceHistoryData.filter(price => price.chainId === chainId)
  return history.length > 0 ? history[history.length - 1].price : 0
}

// ============ MILESTONES ============

/**
 * Combine milestone definitions with milestone logs for a specific chain
 * Enriches milestone logs with icon and other metadata from definitions
 */
export function getMilestonesByChainId(chainId) {
  const logs = milestoneLogsData.filter(log => log.chainId === chainId)

  // Map each log to include the milestone definition data
  return logs.map(log => {
    // Find matching milestone definition by type and requirement
    const definition = milestonesData.find(
      m => m.type === log.type && m.requirement === log.requirement
    )

    // Combine log with definition, keeping log data as primary
    return {
      ...log,
      icon: definition?.icon || 'Target', // Use definition icon or default
      reward: definition?.reward,
      // Override title and description if definition exists
      title: definition?.title || log.title,
      description: definition?.description || log.description
    }
  })
}

export function getCompletedMilestones(chainId) {
  const milestones = getMilestonesByChainId(chainId)
  return milestones.filter(milestone => milestone.completed === true)
}

export function getPendingMilestones(chainId) {
  const milestones = getMilestonesByChainId(chainId)
  return milestones.filter(milestone => milestone.completed === false)
}

export function getMilestonesByType(chainId, type) {
  const milestones = getMilestonesByChainId(chainId)
  return milestones.filter(milestone => milestone.type === type)
}

// ============ COMPLEX QUERIES (JOINS) ============

/**
 * Get full chain details with all related data
 * Similar to SQL: SELECT * FROM chains JOIN holders JOIN transactions etc WHERE chain.id = ?
 */
export function getChainDetails(chainId) {
  const chain = getChainById(chainId)
  if (!chain) return null

  return {
    ...chain,
    // Add icons for social links
    socialLinks: chain.socialLinks.map(link => ({
      ...link,
      icon: link.platform === 'website' ? Globe : link.platform === 'github' ? Github : null
    })),
    // Related data
    holders: getHoldersByChainId(chainId),
    priceHistory: getPriceHistoryByChainId(chainId),
    milestones: getMilestonesByChainId(chainId),
    explorer: {
      currentBlock: chain.currentBlock,
      totalTransactions: chain.totalTransactions,
      recentBlocks: getRecentBlocks(chainId, 10),
      recentTransactions: getRecentTransactions(chainId, 10)
    }
  }
}

/**
 * Get chain details by URL slug
 * Dynamically finds chain by converting slug to name and searching
 */
export function getChainDetailsBySlug(slug) {
  // Special mappings for specific routes
  const specialMappings = {
    'someone-else-chain': 1,  // Onchain ENS
    'my-chain': 2,             // MyGameChain
    'graduated-chain': 3,      // Social Connect
    'draft-chain': 4,          // DeFi Protocol
    'onchain-bnb': 5,          // StreamVault (legacy URL)
  }

  // Check special mappings first
  if (specialMappings[slug]) {
    return getChainDetails(specialMappings[slug])
  }

  // Try to find chain by generating slugs from all chain names
  const chain = chainsData.find(c => generateSlug(c.name) === slug)

  if (chain) {
    return getChainDetails(chain.id)
  }

  // Not found
  return null
}

/**
 * Get holder details with their transaction history
 */
export function getHolderDetails(chainId, address) {
  const holder = getHolderByAddress(chainId, address)
  if (!holder) return null

  return {
    ...holder,
    transactions: getTransactionsByAddress(chainId, address)
  }
}

/**
 * Get block details with all transactions in it
 */
export function getBlockDetails(chainId, blockNumber) {
  const block = getBlockByNumber(chainId, blockNumber)
  if (!block) return null

  return {
    ...block,
    transactions: getTransactionsByBlockNumber(chainId, blockNumber)
  }
}

// Export all for convenience
export const db = {
  // Chains
  getChainById,
  getAllChains,
  getChainsByCreator,
  getChainsByOwner,
  getVirtualChains,
  getGraduatedChains,
  getDraftChains,

  // Holders
  getHoldersByChainId,
  getHolderByAddress,
  getTopHolders,

  // Transactions
  getTransactionsByChainId,
  getRecentTransactions,
  getTransactionByHash,
  getTransactionsByAddress,
  getTransactionsByBlockNumber,

  // Blocks
  getBlocksByChainId,
  getRecentBlocks,
  getBlockByNumber,
  getBlockByHash,

  // Price History
  getPriceHistoryByChainId,
  getLatestPrice,

  // Milestones
  getMilestonesByChainId,
  getCompletedMilestones,
  getPendingMilestones,
  getMilestonesByType,

  // Complex queries
  getChainDetails,
  getChainDetailsBySlug,
  getHolderDetails,
  getBlockDetails
}

export default db
