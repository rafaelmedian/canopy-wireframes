# Mock Database Structure

This folder contains all mock data organized as a relational database, with separate JSON files related by IDs.

## File Structure

```
src/data/
├── chains.json          # Main chains table
├── holders.json         # Token holders related by chainId
├── transactions.json    # Transactions related by chainId
├── blocks.json          # Blocks related by chainId
├── price-history.json   # Price history related by chainId
├── milestones.json      # Milestone type definitions (templates)
├── milestone-logs.json  # Milestone progress logs by chainId
└── db.js               # Query helper functions (like an ORM)
```

## Database Schema

### chains.json
```json
{
  "id": 1,                    // PRIMARY KEY
  "name": "Onchain ENS",
  "ticker": "OENS",
  "creator": "0x742d...",     // Creator wallet address (who deployed)
  "creatorName": "Team Name",
  "owner": "0x742d...",       // Current owner wallet address
  "genesisBlock": 1250432,
  "genesisHash": "0x8f5c...",
  "currentBlock": 45789,
  "totalTransactions": 152847,
  "isVirtual": true,          // Virtual chain state
  "isGraduated": false,       // Graduated to mainnet
  "isDraft": false,           // Draft/pre-launch state
  ...
}
```

### holders.json
```json
{
  "id": 1,                    // PRIMARY KEY
  "chainId": 1,               // FOREIGN KEY -> chains.id
  "address": "0x742d...",
  "balance": 150000000
}
```

### transactions.json
```json
{
  "id": 1,                    // PRIMARY KEY
  "chainId": 1,               // FOREIGN KEY -> chains.id
  "hash": "0x742d...",
  "from": "0x8626...",
  "to": "0xdD2F...",
  "amount": 2500,
  "status": "success",
  "blockNumber": 45789        // Relacionado con blocks
}
```

### blocks.json
```json
{
  "id": 1,                    // PRIMARY KEY
  "chainId": 1,               // FOREIGN KEY -> chains.id
  "number": 45789,
  "hash": "0x8f5c...",
  "transactions": 156,
  "timestamp": 15
}
```

### price-history.json
```json
{
  "id": 1,                    // PRIMARY KEY
  "chainId": 1,               // FOREIGN KEY -> chains.id
  "time": "00:00",
  "price": 0.0098
}
```

### milestones.json (Type Definitions)
```json
{
  "id": 1,                    // PRIMARY KEY
  "title": "First 10 Holders",
  "description": "Reach your first 10 token holders",
  "type": "holders",          // holders | transactions | marketcap
  "requirement": 10,          // Target value
  "icon": "Users",            // Lucide icon name
  "reward": "Community Badge"
}
```

### milestone-logs.json (Progress Tracking)
```json
{
  "id": 1,                    // PRIMARY KEY
  "chainId": 1,               // FOREIGN KEY -> chains.id
  "type": "holders",          // Matches milestone type
  "requirement": 10,          // Matches milestone requirement
  "current": 21,              // Current progress
  "completed": true,
  "completedAt": "2024-01-15T10:30:00Z"
}
```

## Using Query Functions (db.js)

### Simple Queries

```javascript
import {
  getChainById,
  getHoldersByChainId,
  getRecentTransactions
} from '@/data/db'

// Get a chain by ID
const chain = getChainById(1)

// Get all holders for a chain
const holders = getHoldersByChainId(1)

// Get last 10 transactions
const recentTxs = getRecentTransactions(1, 10)
```

### Complex Queries (JOINs)

```javascript
import { getChainDetails, getHolderDetails, getBlockDetails } from '@/data/db'

// Get chain with ALL related data
// Similar to: SELECT * FROM chains
//            JOIN holders ON holders.chainId = chains.id
//            JOIN transactions ON transactions.chainId = chains.id
//            JOIN blocks ON blocks.chainId = chains.id
const fullChain = getChainDetails(1)
// Returns: { ...chain, holders: [...], priceHistory: [...], milestones: [...], explorer: {...} }

// Get holder with transaction history
const holderInfo = getHolderDetails(1, '0x742d...')
// Returns: { ...holder, transactions: [...] }

// Get block with all its transactions
const blockInfo = getBlockDetails(1, 45789)
// Returns: { ...block, transactions: [...] }
```

### Filter Queries

```javascript
import {
  getChainsByCreator,
  getVirtualChains,
  getGraduatedChains,
  getTopHolders,
  getTransactionsByAddress,
  getMilestonesByChainId
} from '@/data/db'

// WHERE creator = '0x...'
const myChains = getChainsByCreator('0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199')

// WHERE owner = '0x...' (chains you own)
const myOwnedChains = getChainsByOwner('0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199')

// WHERE isVirtual = true
const virtualChains = getVirtualChains()

// WHERE isGraduated = true
const graduatedChains = getGraduatedChains()

// ORDER BY balance DESC LIMIT 10
const topHolders = getTopHolders(1, 10)

// WHERE (from = '0x...' OR to = '0x...')
const myTransactions = getTransactionsByAddress(1, '0x742d...')

// Get milestones with enriched data (combines definitions + logs)
const milestones = getMilestonesByChainId(1)
// Returns milestone logs enriched with icon, reward from definitions
```

## Table Relationships

```
chains (id)
  │
  ├── ONE TO MANY ──> holders (chainId)
  │
  ├── ONE TO MANY ──> transactions (chainId)
  │                      │
  │                      └── MANY TO ONE ──> blocks (blockNumber)
  │
  ├── ONE TO MANY ──> blocks (chainId)
  │
  ├── ONE TO MANY ──> price-history (chainId)
  │
  └── ONE TO MANY ──> milestone-logs (chainId)
                         │
                         └── MANY TO ONE ──> milestones (type, requirement)
```

## Chain IDs

- **ID 1**: Onchain ENS (Virtual, public, 21 holders)
- **ID 2**: MyGameChain (Virtual, owner, 1 holder, recently launched)
- **ID 3**: Social Connect (Graduated, 5k+ holders)
- **ID 4**: DeFi Protocol (Draft, not deployed yet)
- **IDs 5-16**: Other chains with various states and progress

## Milestone System

The milestone system uses a two-table structure:

1. **milestones.json**: Defines milestone types (9 types total)
   - Holders: 10, 50, 100
   - Transactions: 1000, 10k, 100k
   - Market Cap: $10k, $25k, $50k

2. **milestone-logs.json**: Tracks progress for each chain
   - Links to milestone definitions by type + requirement
   - Tracks current progress and completion status

The `getMilestonesByChainId()` function combines both tables to return enriched milestone data with icons and rewards.

## Using in Components

**Before** (hardcoded data):
```javascript
const mockChainData = {
  name: 'Onchain ENS',
  // ... 200 more lines
}
```

**Now** (relational data):
```javascript
import { getChainDetails } from '@/data/db'

// Get chain with all related data
const chainData = getChainDetails(1)

// Access related data
console.log(chainData.holders)           // Array of holders
console.log(chainData.priceHistory)      // Array of prices
console.log(chainData.milestones)        // Array of milestones with icons
console.log(chainData.explorer.recentBlocks)  // Recent blocks
console.log(chainData.explorer.recentTransactions) // Recent transactions
```

## Advantages of this Structure

1. **Normalization**: No duplicate data
2. **Clear Relationships**: Like a real DB with foreign keys
3. **Flexible Queries**: Filter, sort, limit results
4. **Easy to Extend**: Adding new chains/transactions is simple
5. **API Ready**: Query functions are identical to what a real API would do

## Migration to Real API

When you have a real API, just change the imports:

```javascript
// Before (mock DB):
import { getChainDetails } from '@/data/db'
const chain = getChainDetails(1)

// After (real API):
import { getChainDetails } from '@/api/chains'
const chain = await getChainDetails(1)
```

Functions have the same signature, just add `async/await`.
