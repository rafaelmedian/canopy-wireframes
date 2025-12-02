# Canopy Application Page Recap

This document provides a comprehensive overview of all pages in the Canopy application, detailing what each page presents to users and the information displayed.

---

## Table of Contents

1. [Explorer - Home](#1-explorer---home)
   - [1a. Nested Chains](#1a-nested-chains)
   - [1b. Blocks](#1b-blocks)
   - [1c. Staking](#1c-staking)
   - [1d. Transactions](#1d-transactions)
   - [1e. Accounts](#1e-accounts)
2. [Trade - AMM](#2-trade---amm)
   - [2a. Pool - Provide Liquidity](#2a-pool---provide-liquidity)
3. [Launch - Gallery View (Launchpad Home)](#3-launch---gallery-view-launchpad-home)
   - [3a. Launchpad Wizard - Create a Chain](#3a-launchpad-wizard---create-a-chain)
   - [3b. Project Page - Buy/Sell](#3b-project-page---buysell)
4. [Wallet](#4-wallet)

---

## 1. Explorer - Home

### What does this page present to the user?

The Explorer Home serves as the primary navigation hub for viewing blockchain activity across Canopy and its nested chains. It acts as a traditional block explorer, but has the capability to dive into chains that Canopy secures. Users can monitor real-time chain metrics, discover chains ranked by various criteria (total stake, trending volume, new launches, LP fees), and access comprehensive blockchain data. It provides a unified interface to explore the entire Canopy ecosystem.

### What information is presented on this page?

- Summary of blocks, transactions, accounts, and staking activity, highlighting key metrics for the user
- Nested chain table with multi-dimensional rankings (total CNPY staked, trending volumes, launch status)
- Launchpad table, giving a tease to what's happening on the launchpad
- Real-time data aggregation with sub-second updates for critical metrics
- Historical trending data (7-day, 30-day, 90-day analysis)

---

## 1a. Nested Chains

### What does this page present to the user?

This page displays detailed information about chains within the Canopy ecosystem (excluding the main Canopy chain). Users can drill down into specific nested chains to view their unique activity, validators, transactions, and performance metrics.

### What information is presented on this page?

- Chain-specific blockchain data (blocks, transactions, validators)
- Chain health and validator metrics
- Transaction volume and activity patterns
- Staking statistics specific to the nested chain
- Developer activity metrics (GitHub commits?) - *optional*
- Chain-specific governance proposals and voting status

---

## 1b. Blocks

### What does this page present to the user?

A chronological view of blocks produced on the selected chain (Canopy or nested chain), allowing users to explore block details, proposers, and transaction counts.

### What information is presented on this page?

- Block height/number
- Block timestamp
- Block proposer (validator address)
- Number of transactions in each block
- Block hash
- Gas used/limit
- Block rewards distributed
- Block size and processing time

---

## 1c. Staking

### What does this page present to the user?

A comprehensive staking interface where users can discover staking opportunities, view validator performance, and manage their delegations across all chains. Includes both validator and delegator dashboards.

### What information is presented on this page?

#### Validator Dashboard
*A view of this should also be present within the wallet*

- Portfolio aggregation across all staking positions (Canopy and Nested Chains)
- Slashing history with severity classifications
- Block-by-block reward accumulation
- Unstaking status tracking with timing information
- Performance benchmarking (of a selected address) vs. chain averages

#### Delegator Dashboard
*A view of this should also be present within the wallet*

- All staking positions across chains
- Reward tracking and accumulation
- Performance vs. top validators
- Unstaking timeline management

---

## 1d. Transactions

### What does this page present to the user?

A detailed transaction history view showing all transactions on the selected chain, with filtering and search capabilities. Users can track transaction status and view comprehensive transaction details.

### What information is presented on this page?

- Transaction hash
- Transaction status (pending, confirmed, failed)
- Sender and receiver addresses
- Transaction amount and token type
- Transaction timestamp
- Gas fees paid
- Block height where transaction was included
- Transaction type (transfer, stake, swap, etc.)
- Real-time transaction tracking across chains

---

## 1e. Accounts

### What does this page present to the user?

Account detail pages showing wallet balances, transaction history, staking positions, and other account-specific information for any address on the selected chain.

### What information is presented on this page?

- Account address
- Total balance across all tokens
- Token holdings breakdown
- Transaction history for the account
- Staking positions (validator or delegator)
- LP positions and yield farming participation
- Account activity metrics (total transactions, first activity date)

---

## 2. Trade - AMM

### What does this page present to the user?

The AMM trading interface allows users to swap tokens across chains through a single unified interface. All pools use CNPY as the hub asset, simplifying cross-chain trading. Users can execute swaps, view price charts, and access trading analytics.

### What information is presented on this page?

- Token swap interface with chain abstraction (users select assets without worrying about chains)
- Real-time price data and charts for trading pairs
- Available liquidity for each pool
- Slippage estimates and routing calculations
- Trading fee
- Price impact indicators
- Recent transaction history
- Automatic network switching for optimal execution
- Cross-chain swap tracking

---

## 2a. Pool - Provide Liquidity

### What does this page present to the user?

The liquidity provision interface where users can add liquidity to AMM pools and view analytics on their LP positions. Users can compare yield opportunities and manage their liquidity across multiple chains.

### What information is presented on this page?

- Available liquidity pools (all paired with CNPY)
- Pool TVL (Total Value Locked)
- Pool volume metrics (24h, 7d, 30d)
- Fee earnings for each pool
- Fee reward calculations
- User's LP positions across all chains
- Impermanent loss calculations
- Add/remove liquidity interface
- Yield farming opportunities ranked by rewards/fees
- Historical pool performance data

---

## 3. Launch - Gallery View (Launchpad Home)

### What does this page present to the user?

The launchpad discovery dashboard is where users can browse and support launching projects. The launchpad should look and act as a standalone site. This platform acts as a curated marketplace showing projects in their virtual chain phase, displaying metrics, social proof, and trading activity to help users identify promising chains.

### What information is presented on this page?

- Virtual pool listings for launching chains
- **Project cards showing:**
  - Chain name and token ticker
  - Project description
  - Template used
  - Social proof (GitHub, Twitter, Telegram, website, whitepaper)
  - Current market cap on bonding curve
  - Bonding curve progress toward graduation threshold
  - Summary of top holders
  - Recent trading activity
  - Launch date/time or time since launch
- Filtering and sorting options (trending, new, near graduation)
- Community buy-in metrics (volume, holder count)
- Real-time price and supply data from bonding curves

---

## 3a. Launchpad Wizard - Create a Chain

### What does this page present to the user?

A step-by-step wizard guiding builders through the chain creation process, from template selection to virtual pool deployment. The interface simplifies complex blockchain deployment into a user-friendly workflow. Users may draft projects, but must sign in when they want to launch it.

### What information is presented on this page?

#### Step 1 - Template Selection

- Available templates (Simple, Advanced, Custom)
- Language options (C++, Java, Python, Go, C#, Ruby, Objective-C, PHP, Dart, JavaScript, Kotlin, Swift)

#### Step 2 - Chain Configuration

- Chain name input
- Token name
- Token ticker input
- Chain description
- Parameter customization:
  - Token supply
  - Block times (select from 5/10/20/30/60 seconds, 2, 5, 10, 30 min)
  - Upgrade block height
  - Output: block reward amount
- GitHub repository connection for auto-upgrade
- *Nice to have:* A visualized curve of block reward over time (a visual of the halving schedule)

#### Step 3 - Supporting Materials

- Image/video upload for token
- Social media links (Twitter, Telegram)
- Website URL
- Whitepaper upload

#### Step 4 - Virtual Pool Setup

- Initial purchase amount (builder's stake)
- Creation fee display (100 CNPY + purchase amount)
- Bonding curve parameters and graduation threshold
- Deployment preview with cost breakdown

---

## 3b. Project Page - Buy/Sell

### What does this page present to the user?

The detailed project page for a launching chain, where users can buy/sell tokens during the virtual pool phase, view comprehensive project information, and track progress toward graduation.

### What information is presented on this page?

- Price chart showing bonding curve progression
- Current market cap and token price
- Bonding curve progress bar (showing progress to graduation threshold, e.g., 48.0%)

#### Buy/Sell Interface

- Input amount in CNPY
- Calculated token output based on bonding curve
- Slippage display (0%)
- Available balance

#### Project Details

- Chain description
- Template information
- GitHub repository link
- Social media links
- Website
- Whitepaper
- Launch date
- Visuals provided (banner/logo)

#### Holder Information

- Top holders list with percentages
- Holder distribution chart
- Trading history (recent buys/sells)
- Graduation criteria

---

## 4. Wallet

### What does this page present to the user?

A comprehensive wallet management interface providing unified control over multi-chain assets, balances, transactions, and account settings. Users can manage funding, view portfolio analytics, track their launched chains, and configure wallet security.

### What information is presented on this page?

#### Balance & Portfolio

- Unified balance view across all accounts and chains
- Real-time updates (<5-second intervals)
- Asset allocation charts by chain, protocol, and asset type
- Position tracking (LP positions, staked assets)
- Historical performance with P&L calculations
- Time-series portfolio analytics

#### Funding

- Send interface (single form for any Canopy chain)
- Receive interface (address display with QR codes)
- Cross-account transfer capabilities
- Transaction history

#### My Launches

- List of chains launched by the user

#### Settings

- Account management (labels, categorization)
- Address Nicknames
- Security features and key management
- Notification preferences

#### Staking Management
*A tailored view of the staking page above*

- Staking discovery interface with chain rankings
- All staking positions across chains
- Validator performance tracking
- Unstaking timeline and status
- Reward compounding options



