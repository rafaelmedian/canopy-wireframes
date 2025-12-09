# Staking Flow Improvements - Implementation Plan

Based on the conversation in CHANGES_STAKING.md, this document outlines the implementation plan for improving the staking flow in the Canopy Launcher.

---

## Overview of Changes

The staking system needs several improvements based on the business requirements discussed:

1. **Rewards Auto-Transfer**: Remove the Claim button since rewards are automatically transferred to user balances
2. **Restake Preference**: Add a differentiation in the staking table for whether rewards are restaked or added to balance
3. **Tab Restructure**: Change tab navigation from "Rewards / Active Stakes / Unstaking Queue" to pill-based "All Stakes / Active / Unstaking Queue"
4. **CNPY Multi-Chain Staking** (Task 4 - not implemented in this phase): CNPY should always appear at the top, and when staking CNPY, users can select multiple chains to earn baby tokens

---

## Task 1: Remove Claim Button and ClaimDialog

### Requirements
- Remove the "Claim" button from the Rewards tab in staking-tab.jsx
- Remove the ClaimDialog component import and usage
- Remove claim-related state and handlers
- The rewards display should remain (shows earned rewards) but without the ability to manually claim

### Files to Modify
- `src/pages/wallet/components/staking-tab.jsx`
  - Remove `ClaimDialog` import
  - Remove `claimDialogOpen` state
  - Remove `handleClaimClick` function
  - Remove Claim button from the table actions column
  - Remove ClaimDialog component usage

### Files to Keep (but unused)
- `src/pages/wallet/components/claim-dialog.jsx` - Keep for potential future use, just remove usage

---

## Task 2: Add Restake Preference Indicator

### Requirements
- Users can decide whether rewards should be:
  - **Restaked**: Automatically added back to their staking position
  - **Added to Balance**: Transferred to their wallet balance
- Show this preference in the staking table with a visual indicator
- This should be visible in the "All Stakes" and "Active" views

### Data Structure Changes
Add `restakeRewards` boolean field to stake objects in wallet.json:
```json
{
  "id": 1,
  "chainId": 1,
  "symbol": "OENS",
  "chain": "Onchain ENS",
  "amount": 500,
  "apy": 12.5,
  "rewards": 2.15,
  "rewardsUSD": 4.82,
  "color": "#10b981",
  "restakeRewards": true  // NEW FIELD
}
```

### UI Changes
- Add a new column or indicator showing the reward preference
- Display options:
  - Badge: "Restaking" (green) or "To Balance" (blue)
  - Or a toggle/switch in the table row
  - Or an icon indicator with tooltip

### Files to Modify
- `src/data/wallet.json` - Add restakeRewards field to stake objects
- `src/pages/wallet/components/staking-tab.jsx` - Add visual indicator for restake preference

---

## Task 3: Restructure Tabs with Pills Navigation

### Requirements
- Change from standard tabs to pill-style navigation (similar to Governance tab)
- New structure:
  - **All Stakes**: Shows all staking positions (active and available to stake)
  - **Active**: Shows only positions with amount > 0
  - **Unstaking Queue**: Shows pending unstakes

### UI Design (Based on Governance Tab Pills)
```jsx
// Pill container with horizontal scroll
<div className="relative flex-1 min-w-0">
  <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
    <button className={`h-9 px-4 rounded-full text-sm font-medium ${
      active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
    }`}>
      All Stakes
    </button>
    <button className="...">Active (2)</button>
    <button className="...">Unstaking Queue (1)</button>
  </div>
</div>
```

### Table Structure for All Stakes Tab
| Chain | Staked Amount | APY | Rewards Earned | Restake | Actions |
|-------|---------------|-----|----------------|---------|---------|
| OENS  | 500 OENS      | 12.5% | 2.15 OENS   | Badge   | Unstake / Add More |
| GAME  | 200 GAME      | 18.2% | 0.82 GAME   | Badge   | Unstake / Add More |
| SOCL  | Not staked    | 8.5%  | -            | -       | Stake |

### Action Buttons Logic
- **Active stakes** (amount > 0):
  - "Unstake" button - Opens UnstakeDialog
  - "Add More" button - Opens StakeDialog to increase stake
- **Inactive stakes** (amount = 0):
  - "Stake" button - Opens StakeDialog

### Files to Modify
- `src/pages/wallet/components/staking-tab.jsx` - Complete restructure of the tabs

---

## Task 4: CNPY Multi-Chain Staking (Implemented)

### Requirements (from CHANGES_STAKING.md conversation)
- CNPY should always be at the top of the staking list ✅
- When staking CNPY, users can select multiple chains ✅
- Staking CNPY for a chain earns you the native token (baby token) of that chain ✅
- Example: Stake 1000 CNPY for Chain ID 1 (CNPY), Chain ID 200 (Game), Chain ID 300 (DeFi Masters)
  - You earn CNPY rewards
  - You earn GAME rewards
  - You earn DFIM rewards
- This is an `editStake` transaction that modifies the committees field ✅

### Key Concepts from Conversation
1. **Single CNPY Stake Applied to Multiple Chains**: Users have one CNPY balance staked, but it applies to up to 15 chains
2. **Baby Tokens**: By staking CNPY for chains, you earn those chain's native tokens
3. **Secondary Staking**: You can then stake those baby tokens on their respective chains for more yield
4. **editStake Transaction**: Adding chains is done via editStake, modifying the committees array

### Implementation Details
- CNPY is now the first item in the stakes array with `isCnpy: true` flag
- CNPY row shows committee chains with stacked avatars and tooltip showing chain details
- "Manage" button (instead of "Add More") opens the multi-chain staking dialog
- New `CnpyStakeDialog` component handles:
  - Amount input for staking CNPY
  - Multi-chain selection with checkboxes
  - Display of current committees and available chains
  - Confirmation flow showing all tokens user will earn

### Files Created/Modified
- Created: `src/pages/wallet/components/cnpy-stake-dialog.jsx`
- Modified: `src/pages/wallet/components/staking-tab.jsx`
  - Added CNPY-first sorting
  - Added committee avatars display in Chain column
  - Added special "Manage" button for CNPY
  - Integrated CnpyStakeDialog
- Modified: `src/data/wallet.json`
  - Added CNPY stake with `isCnpy`, `committees`, and `availableChains` fields

---

## Implementation Order

1. **Task 1**: Remove Claim functionality (simplest change) ✅
2. **Task 2**: Add restake preference indicator ✅
3. **Task 3**: Restructure tabs with pills ✅
4. **Task 4**: CNPY multi-chain staking ✅

---

## Testing Checklist

### Task 1
- [x] Claim button no longer appears in Rewards tab
- [x] ClaimDialog does not open
- [x] Rewards are still displayed correctly
- [x] No console errors related to claim functionality

### Task 2
- [x] Restake preference badge appears for each stake
- [x] Badge shows correct status (Auto-compound / Auto-withdraw)
- [x] Tooltip explains the preference

### Task 3
- [x] Pills render correctly with proper styling
- [x] "All Stakes" shows all staking positions
- [x] "Active" filters to only positions with amount > 0
- [x] "Unstaking Queue" shows pending unstakes
- [x] "Add More" button works for active stakes
- [x] "Stake" button works for inactive positions
- [x] "Unstake" button works for active stakes
- [x] Badge counts are accurate

### Task 4
- [ ] CNPY always appears at the top of the staking list
- [ ] CNPY row shows committee chains with stacked avatars
- [ ] Clicking "Manage" on CNPY opens the multi-chain dialog
- [ ] Multi-chain dialog shows amount input
- [ ] Chain selection allows checking/unchecking chains
- [ ] Currently active chains show "Active" badge
- [ ] Confirmation step shows all tokens user will earn
- [ ] Success message confirms stake for selected chains

---

## Notes

- The current `Rewards` tab shows all available chains to stake, which will become "All Stakes"
- The `Active Stakes` tab becomes just "Active" as a pill filter
- The pill navigation should match the Governance tab styling for consistency
- Consider mobile responsiveness with horizontal scroll for pills
