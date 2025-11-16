# AMM/DEX Trading Module - Planning Document

## Overview

This document outlines the planning and architecture for the AMM/DEX trading system implemented in Canopy. The system provides a flexible trading module that adapts to different contexts (standalone Trade page, Chain detail pages, and Liquidity pages).

## Architecture

### Core Components

#### 1. TradingModule (`/src/components/trading-module.jsx`)
The main wrapper component that orchestrates all trading functionality.

**Props:**
- `variant`: `'trade' | 'chain' | 'liquidity'` - Determines which tabs to show
- `chainData`: Chain data object (required for 'chain' variant)
- `defaultTokenPair`: `{ from: string, to: string }` - Initial token selection
- `defaultTab`: Starting active tab
- `isPreview`: Boolean for preview mode

**Variants:**
- **trade**: Shows Swap / Liquidity / Convert tabs
- **chain**: Shows Buy / Sell / Convert tabs
- **liquidity**: Shows Liquidity / Swap / Convert tabs

#### 2. TokenSelectionDialog (`/src/components/token-selection-dialog.jsx`)
Modal dialog for searching and selecting tokens.

**Features:**
- Search by name, symbol, or address
- Recent token selections (stored in localStorage)
- Token exclusion (prevent selecting same token twice)
- Displays token price and 24h change

#### 3. Tab Components

##### SwapTab (`/src/components/trading-module/swap-tab.jsx`)
Token-to-token swapping interface.

**Features:**
- Select any two tokens
- "Select token" state when no token chosen
- Automatic price calculation based on token prices
- Exchange rate display

##### LiquidityTab (`/src/components/trading-module/liquidity-tab.jsx`)
Add/remove liquidity to pools.

**Features:**
- Deposit mode: Select two tokens to add to pool
- Withdrawal mode: Select pool to withdraw from
- Toggle button (↓/↑) to switch between deposit/withdraw
- Auto-calculation of paired amounts based on pool ratios
- Pool statistics (APR, TVL, 24h volume)

##### BuySellTab (`/src/components/trading-module/buy-sell-tab.jsx`)
Simplified buy/sell for chain tokens.

**Features:**
- Buy: CNPY → Chain token
- Sell: Chain token → CNPY
- Price conversion display
- "Use max" button

##### ConvertTab (`/src/components/trading-module/convert-tab.jsx`)
Cross-chain token conversion.

**Features:**
- Select source and destination tokens
- Token selection cards
- Simplified UI for basic conversions

### Pages

#### Trade Page (`/src/pages/trade/index.jsx`)
Route: `/trade/:tokenPair`

**Layout:**
- Sidebar navigation
- Trading module (left column, 1/3 width)
- Statistics and info cards (right columns, 2/3 width)

**Features:**
- 24h volume, total liquidity, active pairs stats
- Top trading pairs list
- About DEX information

#### Liquidity Page (`/src/pages/liquidity/index.jsx`)
Route: `/liquidity/:tokenPair`

**Layout:**
- Sidebar navigation
- Trading module (left column, 1/3 width)
- Pool statistics and info (right columns, 2/3 width)

**Features:**
- Total liquidity, avg APR, 24h fees stats
- Top liquidity pools list
- About liquidity providing information
- Impermanent loss warning

### Data Structures

#### Tokens (`/src/data/tokens.json`)
Contains metadata for all tradeable tokens:
- CNPY (native token)
- All chain tokens (OENS, MGC, SOCN, DEFI, SVLT)

**Fields:**
- `symbol`: Token ticker
- `name`: Full name
- `address`: Contract address
- `decimals`: Token decimals (18)
- `brandColor`: UI color
- `currentPrice`: Price in USD
- `priceChange24h`: 24h price change percentage
- `volume24h`: 24h trading volume
- `marketCap`: Market capitalization

#### Liquidity Pools (`/src/data/liquidity-pools.json`)
Defines available liquidity pools:

**Fields:**
- `id`: Pool identifier
- `tokenA`, `tokenB`: Pool token pair
- `tokenAReserve`, `tokenBReserve`: Token reserves
- `totalLiquidity`: Total value locked (TVL)
- `apr`: Annual percentage rate
- `volume24h`: 24h trading volume
- `fees24h`: 24h fees earned

### Routing

New routes added to `/src/App.jsx`:
- `/trade/:tokenPair` - Trade page
- `/liquidity/:tokenPair` - Liquidity page

**Token Pair Format:**
- `cnpy-oens` - Trade CNPY for OENS
- `cnpy-select` - Start with CNPY selected, prompting user to select second token

### Navigation

Updated `/src/components/main-sidebar.jsx`:
- Trade button navigates to `/trade/cnpy-select`
- Active state detection for `/trade/*` and `/liquidity/*` routes
- Both compact and default sidebar variants updated

### Integration with Existing Features

#### Chain Detail Pages
Updated `/src/pages/chain-detail/index.jsx`:
- Replaced `TradingPanel` with `TradingModule`
- Uses `variant="chain"` for Buy/Sell/Convert tabs
- Maintains existing functionality with new modular system

## User Flows

### Trade Flow
1. User clicks "Trade" in sidebar
2. Navigates to `/trade/cnpy-select`
3. Default: CNPY is pre-selected as "to" token
4. User clicks "Select token" to choose "from" token
5. Token selection dialog opens
6. User searches/selects token
7. Swap interface shows with both tokens
8. User enters amount and connects wallet to trade

### Liquidity Flow
1. User navigates to Liquidity page or clicks pool from Trade page
2. Default tab: "Liquidity" (deposit mode)
3. **Deposit mode:**
   - Select first token
   - Select second token
   - Enter amount for first token (second auto-calculates based on pool ratio)
   - Click "Add Liquidity"
4. **Withdraw mode (toggle ↑):**
   - Select pool
   - Enter LP token amount to withdraw
   - See preview of tokens to receive
   - Click "Remove Liquidity"

### Chain Page Trade Flow
1. User views chain detail page
2. Trading panel shows Buy/Sell/Convert tabs
3. **Buy tab**: CNPY → Chain token (default)
4. **Sell tab**: Chain token → CNPY
5. **Convert tab**: Any token → Any token
6. User enters amount and connects wallet

## Design Decisions

### 1. Flexible Variant System
The TradingModule uses a `variant` prop rather than separate components for each context. This:
- Reduces code duplication
- Ensures consistent behavior across contexts
- Makes maintenance easier
- Allows easy addition of new variants

### 2. Token Pair URL Parameters
Using `:tokenPair` in URLs allows:
- Deep linking to specific trading pairs
- Bookmarking favorite pairs
- Sharing specific swap configurations

### 3. Automatic Ratio Calculation
In liquidity pools, when user enters amount for one token, the other auto-calculates:
- Ensures correct pool ratios
- Prevents invalid deposits
- Improves UX

### 4. Recent Tokens in localStorage
Token selection dialog stores recent selections:
- Quick access to frequently used tokens
- Persists across sessions
- User-specific preferences

### 5. Toggle Button for Deposit/Withdraw
Single toggle button (instead of separate tabs):
- Cleaner UI
- Less visual clutter
- Clear state transition
- Matches common DEX patterns

## Technical Considerations

### State Management
- Token selection state managed in TradingModule
- Recent tokens stored in localStorage
- No global state management needed (kept simple)

### Price Calculations
- Swap: Uses token prices from tokens.json
- Liquidity: Uses pool reserves for ratios
- All calculations done client-side (mock data)

### Extensibility
The system is designed for easy extension:
- Add new variants by updating `getTabsConfig()`
- Add new tab components in `/src/components/trading-module/`
- Add new pools to `liquidity-pools.json`
- Add new tokens to `tokens.json`

## Future Enhancements

### Phase 2 Potential Features
1. **Slippage Settings**: Allow users to set max slippage tolerance
2. **Price Impact Warning**: Show price impact for large trades
3. **Chart Integration**: Add price charts to trade page
4. **Transaction History**: Show user's past trades
5. **LP Position Tracking**: Dashboard for liquidity provider positions
6. **Multi-hop Swaps**: Route through multiple pools for best price
7. **Limit Orders**: Set target prices for automatic execution
8. **Real-time Price Updates**: WebSocket integration for live prices
9. **Pool Creation**: Allow users to create new liquidity pools
10. **Rewards Dashboard**: Track trading fees earned as LP

### Technical Improvements
1. Real blockchain integration (replace mock data)
2. Smart contract interaction
3. Wallet balance checking
4. Transaction signing and submission
5. Gas estimation
6. Error handling and retry logic
7. Loading states and optimistic updates
8. Transaction confirmation tracking

## Testing Checklist

- [ ] Trade page loads with default state (CNPY selected)
- [ ] Token selection dialog opens and closes
- [ ] Token search filters correctly
- [ ] Recent tokens persist in localStorage
- [ ] Can select tokens for swap
- [ ] Price calculations update correctly
- [ ] Liquidity deposit mode calculates ratios
- [ ] Toggle button switches deposit/withdraw modes
- [ ] Liquidity withdraw mode shows correct preview
- [ ] Chain page Buy/Sell tabs work
- [ ] Navigation between pages preserves state appropriately
- [ ] Sidebar highlights active route
- [ ] Responsive layout works on mobile
- [ ] All tabs render without errors
- [ ] Exchange rates display correctly

## Dependencies

All components use existing UI components from `/src/components/ui/`:
- Button, Card, Input, Dialog
- No new external dependencies added
- Leverages existing design system

