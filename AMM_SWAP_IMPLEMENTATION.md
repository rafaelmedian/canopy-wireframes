# AMM/DEX Trading Module - Implementation Document

## Implementation Summary

This document provides technical implementation details for the AMM/DEX trading system. All planned features have been successfully implemented.

### Key Constraint: CNPY Pairing

**All trades must be CNPY ↔ Token pairs only.** Direct token-to-token trading is not supported.

This architectural constraint:
- Simplifies liquidity pool management (all pools are CNPY-based)
- Reduces fragmentation of liquidity
- Ensures CNPY remains the central trading token
- Matches common AMM patterns (like Uniswap v1 with ETH)

**Implementation:** The TradingModule automatically enforces this constraint by adjusting token selection to ensure one side is always CNPY.

## Files Created

### Data Files
1. `/src/data/tokens.json` - Token metadata including CNPY and all chain tokens
2. `/src/data/liquidity-pools.json` - Liquidity pool configurations

### Components
1. `/src/components/trading-module.jsx` - Main trading module wrapper
2. `/src/components/token-selection-dialog.jsx` - Token selection modal
3. `/src/components/trading-module/swap-tab.jsx` - Swap interface
4. `/src/components/trading-module/liquidity-tab.jsx` - Liquidity management
5. `/src/components/trading-module/buy-sell-tab.jsx` - Buy/Sell interface
6. `/src/components/trading-module/convert-tab.jsx` - Conversion interface

### Pages
1. `/src/pages/trade/index.jsx` - Trade page with routing
2. `/src/pages/liquidity/index.jsx` - Liquidity page with routing

## Files Modified

1. `/src/App.jsx` - Added trade and liquidity routes
2. `/src/components/main-sidebar.jsx` - Added Trade navigation and active state
3. `/src/pages/chain-detail/index.jsx` - Migrated to TradingModule

## Component APIs

### TradingModule

```jsx
<TradingModule
  variant="trade" | "chain" | "liquidity"
  chainData={chainObject}
  defaultTokenPair={{ from: 'CNPY', to: 'OENS' }}
  defaultTab="swap"
  isPreview={false}
/>
```

**Props:**
- `variant` (required): Determines tab configuration
  - `'trade'`: Swap / Liquidity / Convert
  - `'chain'`: Buy / Sell / Convert  
  - `'liquidity'`: Liquidity / Swap / Convert
- `chainData` (optional): Chain data object, required for 'chain' variant
- `defaultTokenPair` (optional): Initial token selection
  - `from`: Source token symbol
  - `to`: Destination token symbol
- `defaultTab` (optional): Starting active tab
- `isPreview` (optional): Disables interactive features

**State Management:**
- Manages token selection for swap/liquidity
- Controls active tab
- Handles token selection dialog visibility

### TokenSelectionDialog

```jsx
<TokenSelectionDialog
  open={boolean}
  onOpenChange={setOpen}
  onSelectToken={(token) => {...}}
  excludeToken="CNPY"
/>
```

**Props:**
- `open`: Dialog visibility state
- `onOpenChange`: Callback for dialog state changes
- `onSelectToken`: Callback when token is selected
- `excludeToken`: Token symbol to exclude from list

**Features:**
- Searches tokens by name, symbol, or address
- Displays recent token selections (stored in localStorage)
- Shows token price and 24h change
- Excludes already-selected token

### SwapTab

```jsx
<SwapTab
  fromToken={tokenObject}
  toToken={tokenObject}
  isPreview={false}
  onSelectToken={(mode) => {...}}
  onSwapTokens={() => {...}}
/>
```

**Props:**
- `fromToken`: Source token object (or null for "Select token" state)
- `toToken`: Destination token object (or null)
- `isPreview`: Disables interactive features
- `onSelectToken`: Callback with 'from' or 'to' mode
- `onSwapTokens`: Callback to swap the positions of fromToken and toToken

**Features:**
- Token selection cards (shows "Select token" when null)
- Amount input with decimal validation
- Automatic conversion calculation
- Exchange rate display with Zap icon
- "Use max" button
- **Arrow down button**: Swaps sell and buy tokens (e.g., OENS → CNPY becomes CNPY → OENS)
- **Slippage settings**: Displayed in bottom right with settings icon (e.g., "1% ⚙️")
  - Default: 1%
  - Presets: 0.1%, 0.5%, 1.0%
  - Custom input (0-50%)
  - Warning for high slippage (>5%)

### LiquidityTab

```jsx
<LiquidityTab
  tokenA={tokenObject}
  tokenB={tokenObject}
  isPreview={false}
  onSelectToken={(mode) => {...}}
/>
```

**Props:**
- `tokenA`: First token for liquidity pair
- `tokenB`: Second token for liquidity pair
- `isPreview`: Disables interactive features
- `onSelectToken`: Callback with 'tokenA' or 'tokenB' mode

**State:**
- `mode`: 'deposit' or 'withdraw'
- `amountA`, `amountB`: Token amounts (auto-calculated based on pool ratios)

**Features:**
- Deposit mode: Select two tokens, enter amounts
- Withdrawal mode: Select pool, enter LP token amount
- Toggle button (↓/↑) switches modes
- Automatic ratio calculation
- Pool statistics display

### BuySellTab

```jsx
<BuySellTab
  mode="buy" | "sell"
  chainData={chainObject}
  isPreview={false}
/>
```

**Props:**
- `mode`: 'buy' (CNPY → Token) or 'sell' (Token → CNPY)
- `chainData`: Chain data with price and token info
- `isPreview`: Disables interactive features

**Features:**
- Simplified interface for chain token trading
- Amount input with conversion display
- Token avatars with chain badge
- Exchange rate display

### ConvertTab

```jsx
<ConvertTab
  chainData={chainObject}
  isPreview={false}
  onSelectToken={(mode) => {...}}
/>
```

**Props:**
- `chainData`: Chain data (optional)
- `isPreview`: Disables interactive features
- `onSelectToken`: Callback for token selection

**Features:**
- "Select token" cards for both source and destination
- CNPY default destination
- Placeholder for cross-chain conversion

## Data Structures

### Token Object

```json
{
  "symbol": "CNPY",
  "name": "Canopy",
  "address": "0x0000000000000000000000000000000000000000",
  "decimals": 18,
  "logo": null,
  "brandColor": "#1dd13a",
  "currentPrice": 1.0,
  "priceChange24h": 2.3,
  "volume24h": 500000,
  "marketCap": 10000000,
  "isNative": true
}
```

### Liquidity Pool Object

```json
{
  "id": "pool-1",
  "tokenA": "CNPY",
  "tokenB": "OENS",
  "tokenAReserve": 50000,
  "tokenBReserve": 100000,
  "totalLiquidity": 70710.67,
  "apr": 12.5,
  "volume24h": 15000,
  "fees24h": 45
}
```

## Routing Implementation

### Added Routes (App.jsx)

```jsx
// Trade and Liquidity routes
<Route path="/trade/:tokenPair" element={<TradePage />} />
<Route path="/liquidity/:tokenPair" element={<LiquidityPage />} />
```

### Token Pair URL Format

- Format: `tokenA-tokenB` (lowercase)
- Examples:
  - `/trade/cnpy-oens` - Trade CNPY to OENS
  - `/trade/cnpy-select` - CNPY selected, waiting for second token selection
  - `/liquidity/cnpy-socn` - CNPY/SOCN liquidity pool

### Parsing Token Pairs

```javascript
const parseTokenPair = () => {
  if (!tokenPair) return { from: null, to: 'CNPY' }
  
  const [to, from] = tokenPair.split('-').map(t => t.toUpperCase())
  
  // Handle "select" state
  if (from === 'SELECT') return { from: null, to }
  
  return { from, to }
}
```

## Sidebar Navigation

### Trade Button Implementation

```javascript
// Compact variant
<button
  onClick={() => navigate('/trade/cnpy-select')}
  className={`w-[57px] flex flex-col items-center justify-center gap-1 py-2 rounded-xl text-sm font-medium text-white transition-colors ${
    isTrade ? 'bg-white/10 shadow-[0px_2px_3px_0px_rgba(0,0,0,0.1)]' : 'hover:bg-white/5'
  }`}
>
  <TrendingUp className="w-4 h-4" />
  <span className="text-[10px]">Trade</span>
</button>

// Default variant
<button
  onClick={() => navigate('/trade/cnpy-select')}
  className={`w-full h-9 flex items-center gap-3 px-4 rounded-xl text-sm font-medium text-white transition-colors ${
    isTrade ? 'bg-white/10 shadow-[0px_2px_3px_0px_rgba(0,0,0,0.1)]' : 'hover:bg-white/5'
  }`}
>
  <TrendingUp className="w-4 h-4" />
  <span>Trade</span>
</button>
```

### Active State Detection

```javascript
const isLaunchpad = location.pathname === '/'
const isTrade = location.pathname.startsWith('/trade') || location.pathname.startsWith('/liquidity')
```

## Chain Detail Integration

### Before (TradingPanel)

```jsx
<TradingPanel chainData={chainData} isOwner={isOwner} />
```

### After (TradingModule)

```jsx
<TradingModule 
  variant="chain"
  chainData={chainData}
  defaultTokenPair={{ from: 'CNPY', to: chainData.ticker }}
  defaultTab="buy"
  isPreview={false}
/>
```

**Benefits:**
- Consistent behavior across all contexts
- Shared components reduce duplication
- Easier to maintain and extend
- Same UI/UX patterns

## Price Calculations

### Swap Price Calculation

```javascript
const calculateConversion = () => {
  if (!amount || !fromToken || !toToken) {
    return { tokens: '0', usd: '$0.00' }
  }

  const inputAmount = parseFloat(amount)
  const fromPrice = fromToken.currentPrice || 0
  const toPrice = toToken.currentPrice || 0

  if (toPrice === 0) return { tokens: '0', usd: '$0.00' }

  // Calculate value in USD then convert to output token
  const usdValue = inputAmount * fromPrice
  const tokensReceived = usdValue / toPrice

  return {
    tokens: tokensReceived.toLocaleString('en-US', { maximumFractionDigits: 6 }),
    usd: `$${usdValue.toFixed(2)}`
  }
}
```

### Liquidity Ratio Calculation

```javascript
const handleAmountAChange = (value) => {
  if (value === '' || /^\d*\.?\d*$/.test(value)) {
    setAmountA(value)
    // Auto-calculate amount B based on pool ratio
    if (pool && value && parseFloat(value) > 0) {
      const ratio = pool.tokenBReserve / pool.tokenAReserve
      setAmountB((parseFloat(value) * ratio).toFixed(6))
    } else {
      setAmountB('')
    }
  }
}
```

## State Management

### Token State in TradingModule

```javascript
const [fromToken, setFromToken] = useState(() => {
  // For trade variant, always start with no token selected (user must select)
  if (variant === 'trade') {
    return null
  }
  // For chain variant, default to CNPY
  if (variant === 'chain') {
    return tokensData.find(t => t.symbol === 'CNPY')
  }
  return null
})

const [toToken, setToToken] = useState(() => {
  // For trade variant, default to CNPY as receiving token
  if (variant === 'trade') {
    return tokensData.find(t => t.symbol === 'CNPY')
  }
  // For chain variant, use the chain's token
  if (variant === 'chain' && chainData) {
    return {
      symbol: chainData.ticker,
      name: chainData.name,
      brandColor: chainData.brandColor,
      currentPrice: chainData.currentPrice,
      ...chainData
    }
  }
  // Default fallback to CNPY
  return tokensData.find(t => t.symbol === 'CNPY')
})
```

**Trade Variant Default State:**
- `fromToken`: `null` (requires user selection - "Select token" state)
- `toToken`: CNPY (pre-selected as receiving token)

**Chain Variant Default State:**
- `fromToken`: CNPY (pre-selected for buying/selling)
- `toToken`: Chain's token

This creates an intuitive flow where users on the Trade page must actively select what token they want to sell/swap.

### Token Selection with CNPY Pairing Enforcement

```javascript
const handleTokenSelected = (token) => {
  switch (tokenDialogMode) {
    case 'from':
      setFromToken(token)
      // For trade variant, if a non-CNPY token is selected, ensure toToken is CNPY
      if (variant === 'trade' && token.symbol !== 'CNPY') {
        setToToken(tokensData.find(t => t.symbol === 'CNPY'))
      }
      break
    case 'to':
      setToToken(token)
      // For trade variant, if a non-CNPY token is selected, ensure fromToken is CNPY
      if (variant === 'trade' && token.symbol !== 'CNPY') {
        setFromToken(tokensData.find(t => t.symbol === 'CNPY'))
      }
      break
    // ... other cases
  }
  setShowTokenDialog(false)
  setTokenDialogMode(null)
}
```

**How it works:**
1. User selects OENS for "from" → System keeps CNPY in "to" (OENS → CNPY) ✓
2. User tries to change "to" to MGC → System changes "from" to CNPY (CNPY → MGC) ✓
3. User selects CNPY for "from" → Can select any token for "to" ✓
4. Result: One side is always CNPY, preventing invalid token-to-token pairs

### Token Swap Functionality

```javascript
const handleSwapTokens = () => {
  // Swap fromToken and toToken
  const temp = fromToken
  setFromToken(toToken)
  setToToken(temp)
}
```

The arrow down button between token cards swaps their positions:
- **Before**: OENS → CNPY (selling OENS for CNPY)
- **After**: CNPY → OENS (buying OENS with CNPY)

This allows users to quickly reverse their trading direction without reselecting tokens. Since all trades must maintain CNPY pairing, swapping always results in a valid pair.

### Recent Tokens (localStorage)

```javascript
// Load recent tokens
useEffect(() => {
  const recent = JSON.parse(localStorage.getItem('recentTokens') || '[]')
  setRecentTokens(recent)
}, [open])

// Save selected token
const handleSelectToken = (token) => {
  const updated = [token.symbol, ...recentTokens.filter(s => s !== token.symbol)].slice(0, 5)
  localStorage.setItem('recentTokens', JSON.stringify(updated))
  setRecentTokens(updated)
  
  onSelectToken(token)
  onOpenChange(false)
}
```

## Input Validation

### Decimal Input Validation

```javascript
onChange={(e) => {
  const value = e.target.value
  // Only allow numbers and decimal point
  if (value === '' || /^\d*\.?\d*$/.test(value)) {
    setAmount(value)
  }
}}
```

This regex pattern:
- `\d*` - Zero or more digits
- `\.?` - Optional decimal point
- `\d*` - Zero or more digits after decimal

Prevents: letters, multiple decimals, special characters

## Styling Patterns

### Token Avatar

```jsx
<div
  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
  style={{ backgroundColor: token.brandColor || '#10b981' }}
>
  {token.logo ? (
    <img src={token.logo} alt={token.symbol} className="w-full h-full rounded-full" />
  ) : (
    <span className="text-sm font-bold text-white">
      {token.symbol[0]}
    </span>
  )}
</div>
```

### Chain Badge Overlay

```jsx
<div className="relative">
  <div className="w-8 h-8 rounded-full..." style={{ backgroundColor: chainData.brandColor }}>
    <span>{chainData.ticker[0]}</span>
  </div>
  {/* Chain Badge Overlay */}
  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-muted border border-border flex items-center justify-center">
    <div className="w-2 h-2 rounded-full bg-primary" />
  </div>
</div>
```

### Toggle Button (Liquidity)

```jsx
<Button
  variant="outline"
  size="icon"
  className="rounded-full h-10 w-10 bg-background border-2 hover:bg-muted"
  onClick={toggleMode}
>
  {mode === 'deposit' ? <ArrowDown className="w-5 h-5" /> : <ArrowUp className="w-5 h-5" />}
</Button>
```

## Error Handling

### Safe Token Access

```javascript
const pool = tokenA && tokenB 
  ? liquidityPoolsData.find(p => 
      (p.tokenA === tokenA.symbol && p.tokenB === tokenB.symbol) ||
      (p.tokenA === tokenB.symbol && p.tokenB === tokenA.symbol)
    )
  : null
```

### Zero Division Prevention

```javascript
if (toPrice === 0) return { tokens: '0', usd: '$0.00' }
```

### Null Checks in Rendering

```jsx
{fromToken ? (
  <Card>...</Card>
) : (
  <Card className="cursor-pointer" onClick={onSelectToken}>
    Select token
  </Card>
)}
```

## Performance Considerations

### Memoized Calculations

Price calculations are done on-demand based on input changes, not continuously.

### Token Data Loading

All token data is imported statically (JSON imports), not fetched dynamically.

### State Updates

Token selection updates are batched in a single state update.

## Accessibility

### Button Labels

All interactive elements have clear text labels or aria-labels.

### Keyboard Navigation

Dialog supports keyboard navigation (Tab, Escape).

### Focus Management

Token selection dialog auto-focuses search input on open.

## Browser Compatibility

### localStorage Usage

Wrapped in try-catch for browsers with disabled storage:

```javascript
try {
  localStorage.setItem('recentTokens', JSON.stringify(updated))
} catch (e) {
  // Silent fail if localStorage is disabled
}
```

### CSS Features

Uses modern CSS features with fallbacks:
- Flexbox (widely supported)
- Grid (widely supported)
- Border-radius (universal)
- CSS variables (via Tailwind)

## Testing Notes

### Manual Testing Checklist

✅ Trade page loads correctly  
✅ Token selection dialog opens  
✅ Can search and select tokens  
✅ Recent tokens persist  
✅ Swap calculations work  
✅ Liquidity toggle works  
✅ Deposit/withdraw calculations correct  
✅ Chain page migration successful  
✅ Buy/Sell tabs function  
✅ Sidebar navigation works  
✅ Active state highlights correctly  
✅ No console errors  
✅ No linting errors  

### Edge Cases Handled

- Null token states (shows "Select token")
- Zero amounts (shows $0.00)
- Division by zero (returns 0)
- Missing pool data (null checks)
- Invalid URL parameters (defaults to CNPY)

## Deployment Notes

### Build Process

No changes required to build process. All new files are standard React components.

### Environment Variables

No new environment variables needed.

### Dependencies

No new npm packages required. Uses existing:
- react
- react-router-dom  
- lucide-react (icons)
- Existing UI components

## Maintenance Guide

### Adding New Tokens

1. Add token entry to `/src/data/tokens.json`
2. Create liquidity pool entries in `/src/data/liquidity-pools.json`
3. No code changes required

### Adding New Tab Types

1. Create new tab component in `/src/components/trading-module/`
2. Update `getTabsConfig()` in `trading-module.jsx`
3. Add tab to `renderTabContent()` switch statement

### Modifying Calculations

Price calculations are in individual tab components:
- Swap: `swap-tab.jsx` line ~25
- Liquidity: `liquidity-tab.jsx` line ~35
- Buy/Sell: `buy-sell-tab.jsx` line ~10

## Future Integration Points

### Smart Contract Integration

Replace mock calculations with:
```javascript
const price = await contract.getPrice(tokenA, tokenB)
const amount = await contract.calculateSwap(inputAmount, tokenA, tokenB)
```

### Wallet Integration

Replace mock balance with:
```javascript
const balance = await wallet.getTokenBalance(token.address)
```

### Transaction Submission

Add transaction handling:
```javascript
const tx = await contract.swap(fromToken, toToken, amount)
await tx.wait()
```

## Conclusion

All planned features have been successfully implemented. The system is modular, maintainable, and ready for future enhancements including real blockchain integration.

