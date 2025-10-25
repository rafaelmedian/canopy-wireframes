# Mock Data - Database Structure

All mock data is organized as a relational database with separate JSON files related by IDs.

## Files

### Data Files (JSON - like DB tables)
- **chains.json** - Main chains table (16 chains)
- **holders.json** - Token holders related by `chainId`
- **transactions.json** - Transactions related by `chainId`
- **blocks.json** - Blocks related by `chainId`
- **price-history.json** - Price history by `chainId`
- **milestones.json** - Milestone type definitions (9 types)
- **milestone-logs.json** - Milestone progress by `chainId`

### Query Files (JS - like an ORM)
- **db.js** - Helper functions for relational queries
- **mock-chains.js** - Launchpad data (uses db.js)
- **mock-config.js** - Configuration constants

### Documentation
- **DATABASE.md** - Complete schema and query documentation

## Basic Usage

```javascript
import { getChainDetails } from '@/data/db'

// Get chain with ALL related data
const chain = getChainDetails(1)

// Access related data
console.log(chain.holders)        // Array of holders
console.log(chain.transactions)   // In chain.explorer.recentTransactions
console.log(chain.milestones)     // Array of milestones
console.log(chain.priceHistory)   // Array of price history
```

## Main Chain IDs

- **ID 1**: Onchain ENS (Virtual, public, 21 holders)
- **ID 2**: MyGameChain (Virtual, owner, 1 holder)
- **ID 3**: Social Connect (Graduated, 5k+ holders)
- **ID 4**: DeFi Protocol (Draft, not deployed)
- **IDs 5-16**: Other chains with various states and progress

## Available Queries

See `DATABASE.md` for complete list of queries and usage examples.

Examples:
- `getChainById(1)` - Get a chain
- `getHoldersByChainId(1)` - Get holders for a chain
- `getRecentTransactions(1, 10)` - Last 10 transactions
- `getMilestonesByChainId(1)` - Milestones for a chain
- `getChainsByCreator('0x...')` - Chains by creator

## Structure as Real DB

```
chains (id)
  ├── holders (chainId → chains.id)
  ├── transactions (chainId → chains.id)
  ├── blocks (chainId → chains.id)
  ├── price-history (chainId → chains.id)
  └── milestone-logs (chainId → chains.id)
      └── milestones (type, requirement → milestone-logs)
```

Each JSON file is a table, related by foreign keys (chainId).

### Milestone System

The milestone system uses two tables:
- **milestones.json**: Defines the 9 milestone types (templates)
- **milestone-logs.json**: Tracks progress for each chain

Milestone logs are enriched with definition data (icons, rewards) through the `getMilestonesByChainId()` function in db.js.
