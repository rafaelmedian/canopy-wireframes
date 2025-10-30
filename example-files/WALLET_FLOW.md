# Wallet Connection Flow

This document describes the wallet connection flow for the Canopy Launcher application. The flow is triggered when the user clicks "Connect wallet" in the main sidebar.

## Flow Overview

The wallet connection process consists of 7 steps that guide users through account creation or connection, email verification, wallet setup, external wallet connections, balance detection, token conversion, and final confirmation.

---

## Step 1: Create or Connect Canopy Wallet

**File:** `step-1.png`

**Purpose:** Initial account creation or login

**UI Elements:**
- **Header:**
  - Canopy logo icon (green circle with white icon)
  - Title: "Create or Connect Canopy wallet"
  - Subtitle: "Fund your wallet in a few simple steps"
  - Close button (X) in top right

- **Form Section:**
  - Label: "Email Address"
  - Input field: "Enter your email" (with green focus border)
  - Primary button: "Continue" (blue/gray, full width)

- **Divider:** Horizontal line with "or" text in center

- **Social Login:**
  - Button: "Continue with Google" (white background, Google logo)

- **Progress Indicators:**
  - 5 dots at bottom (first dot is green/active, rest are gray)

**User Actions:**
- Enter email address and click "Continue"
- OR click "Continue with Google" for OAuth login

**State:**
- Email input is focused (green border)
- Continue button is disabled until valid email is entered

---

## Step 2: Verification Code Sent

**File:** `step-2.png`

**Purpose:** Email verification via OTP code

**UI Elements:**
- **Header:**
  - Back button (left arrow) in top left
  - Close button (X) in top right
  - Send icon (blue paper plane) centered
  - Title: "Verification code sent"
  - Subtitle: "We have sent a 4-digit verification code to eliezer"

- **OTP Input:**
  - 4 digit input boxes (first box has green border with cursor)
  - Link: "Resend code" (blue text)

- **Action Button:**
  - Primary button: "Verify" (blue/gray, full width, disabled state)

- **Progress Indicators:**
  - 5 dots at bottom (first 2 are green, rest are gray)

**User Actions:**
- Enter 4-digit verification code
- Click "Verify" when all digits entered
- Click "Resend code" if needed
- Click back button to return to previous step

**State:**
- First OTP input is focused
- Verify button is disabled until all 4 digits are entered

---

## Step 3: Email Verified - Wallet Setup

**File:** `step-3.png`

**Purpose:** Choose between creating new wallet or importing existing one

**UI Elements:**
- **Header:**
  - Back button (left arrow) in top left
  - Close button (X) in top right
  - Canopy logo icon (green circle)
  - Title: "Create or Connect Canopy wallet"

- **Email Status Card:**
  - Mail icon (blue)
  - Email: "eliezer"
  - Status: "Email Verified" (gray text)
  - Checkmark icon (green) on right

- **Status Message:**
  - "No wallet created for this account yet. Create a new wallet or import an existing one."

- **Primary Action:**
  - Button: "Create Canopy Wallet" (blue, full width)

- **Divider:** Line with "or" text

- **Secondary Action:**
  - Section header: "Import Existing Wallet"
  - Dashed border container with:
    - Upload icon (gray circle)
    - Title: "Upload Keyfile (.JSON)"
    - Subtitle: "Click to browse or drag and drop"
  - Link: "Back" (gray text at bottom)

- **Progress Indicators:**
  - 5 dots at bottom (first 2 are green, rest are gray)

**User Actions:**
- Click "Create Canopy Wallet" to generate new wallet
- OR drag and drop keyfile or click to browse for existing wallet import
- Click "Back" to return to previous step

---

## Step 4: Connect Your Wallets

**File:** `step-4.png`

**Purpose:** Connect external wallets (Solana, EVM) and fund via transfer

**UI Elements:**
- **Header:**
  - Back button (left arrow) in top left
  - Close button (X) in top right
  - Wallet icon (blue)
  - Title: "Connect Your Wallets"
  - Subtitle: "Connect wallets fund your account"

- **Solana Wallet Section:**
  - Section label: "Solana Wallet"
  - Dashed border card:
    - Plus icon (gray circle)
    - Title: "Connect Solana Wallet"
    - Options: "MetaMask, WalletConnect"
    - Right chevron icon

- **EVM Wallet Section:**
  - Section label: "EVM Wallet"
  - Dashed border card:
    - Plus icon (gray circle)
    - Title: "Connect EVM Wallet"
    - Options: "MetaMask, WalletConnect"
    - Right chevron icon

- **Canopy Wallet Section:**
  - Section label: "Canopy Wallet (Optional)"
  - Dashed border card:
    - Wallet icon (green circle)
    - Title: "Connect Canopy Wallet"
    - Subtitle: "Use your Canopy account"
    - Right chevron icon

- **Fund via Transfer Section:**
  - Section label: "Fund via Transfer"
  - Dark card:
    - Title: "Transfer CNPY from another Canopy Wallet"
    - Subtitle: "Send CNPY tokens to this address"
    - Address display: "0x742d35Cc6634C0532925a3b844Bc9e7595f0..." (truncated)
    - Copy icon button

- **Action Button:**
  - Primary button: "Continue" (blue, full width)

- **Progress Indicators:**
  - 5 dots at bottom (first 4 are green, rest is gray)

**User Actions:**
- Click "Connect Solana Wallet" to open wallet selection modal (see step 4.1)
- Click "Connect EVM Wallet" to open wallet selection modal
- Click "Connect Canopy Wallet" to use Canopy account
- Copy funding address for transfers
- Click "Continue" when wallets are connected

---

## Step 4.1: Select Wallet (Modal)

**File:** `step-4.1.select a wallet.png`

**Purpose:** Choose which wallet provider to connect

**UI Elements:**
- **Modal Header:**
  - Title: "Select Wallet"
  - Close button (X) in top right

- **Wallet Options:**
  - MetaMask option:
    - MetaMask icon (orange)
    - Name: "MetaMask"
    - Type: "Multi-chain"
    - Right chevron icon
    - Dark background with hover state

  - WalletConnect option:
    - WalletConnect icon (blue)
    - Name: "WalletConnect"
    - Type: "Multi-chain"
    - Right chevron icon
    - Dark background with hover state

**User Actions:**
- Click on MetaMask or WalletConnect to initiate connection
- Click X to close modal without selecting

**State:**
- Modal overlay with semi-transparent background
- Both options are clickable

---

## Step 4.2: Wallet Connected (State)

**File:** `step-4.2- wallet selected.png`

**Purpose:** Show connected wallet with balance information

**UI Elements:**
- Same layout as Step 4, but Solana Wallet section now shows:
  - **Connected Wallet Card** (green border, solid background):
    - MetaMask icon (orange)
    - Name: "MetaMask"
    - Type: "Multi-chain"
    - Balances: "USDT: 100.50 , USDC: 50.25"
    - Checkmark icon (green) in top right
    - X button to disconnect

- **EVM Wallet Section:**
  - Still shows dashed border (not connected)

- **Canopy Wallet & Fund via Transfer:**
  - Same as Step 4

- **Progress Indicators:**
  - 5 dots at bottom (first 4 are green, rest is gray)

**User Actions:**
- Click X on connected wallet to disconnect
- Connect additional wallets
- Click "Continue" to proceed

**State:**
- Solana wallet is connected and shows token balances
- Continue button is now enabled

---

## Step 5: Balances Found

**File:** `step-5.png`

**Purpose:** Confirm detected balances and prepare for conversion

**UI Elements:**
- **Header:**
  - Back button (left arrow) in top left
  - Close button (X) in top right
  - Success icon (green checkmark in circle)
  - Title: "Balances Found!"
  - Subtitle: "We found USDT and USDC in your connected wallets"

- **Balance Summary Card** (dark background):
  - Label: "Total Balance"
  - Amount: "$150.75" (large, white text)

  - **Wallet Information:**
    - MetaMask icon with label "MetaMask (Multi-chain)"
    - Address: "7xKX ... gAsU"

  - **Token List:**
    - USDT row:
      - Tether icon (green circle with T)
      - Name: "USDT"
      - Type: "Tether USD"
      - Amount: "100.50"
      - Value: "$100.50"

    - USDC row:
      - USD Coin icon (blue circle with $)
      - Name: "USDC"
      - Type: "USD Coin"
      - Amount: "50.25"
      - Value: "$50.25"

- **Next Step Information:**
  - Radio button (selected)
  - Label: "Next: Convert to CNPY"
  - Description: "Convert your USDT/USDC to CNPY to start buying into projects"

- **Action Button:**
  - Primary button: "Continue to Conversion" (blue, full width)

- **Progress Indicators:**
  - 5 dots at bottom (first 4 are green, last is gray)

**User Actions:**
- Review balances
- Click "Continue to Conversion" to proceed with token swap
- Click back button to modify wallet connections

---

## Step 6: Convert to CNPY

**File:** `step-6.png`

**Purpose:** Convert USDT/USDC to CNPY tokens

**UI Elements:**
- **Header:**
  - Back button (left arrow) in top left
  - Close button (X) in top right
  - Canopy logo icon (green circle)
  - Title: "Convert to CNPY"
  - Subtitle: "Convert your USDT/USDC to CNPY to start buying into projects"

- **Conversion Card** (dark background):
  - **Available Balance:**
    - Label: "Available Balance"
    - Amount: "$150.75" (large white text)
    - Wallet info: "7xKX ... gAsU · $150.75"

  - **Amount Input:**
    - Label: "Amount to Convert"
    - Input field with "$" prefix
    - Value: "150"
    - "Max" button on right (dark gray)

  - **Direction Indicator:**
    - Down arrow icon (centered)

  - **Conversion Result:**
    - Label: "You will receive"
    - Amount: "150 CNPY" (large green text)
    - Exchange rate: "1 USD = 1 CNPY"

- **Action Button:**
  - Primary button: "Convert to CNPY" (bright green, full width)

- **Progress Indicators:**
  - 5 dots at bottom (all 5 are green)

**User Actions:**
- Enter amount to convert (or click "Max")
- Review conversion rate and resulting CNPY amount
- Click "Convert to CNPY" to execute conversion
- Click back button to return to balance review

**State:**
- Amount input shows "150" (full balance)
- Conversion calculates in real-time as user types

---

## Step 7: Wallet Funded (Success)

**File:** `step-7.png`

**Purpose:** Confirm successful funding and allow user to start using the platform

**UI Elements:**
- **Header:**
  - Close button (X) in top right (no back button)
  - Success icon (large green checkmark in circle)
  - Title: "Wallet Funded!"
  - Subtitle: "Your Canopy wallet is ready. You can now buy into projects."

- **Balance Summary Card** (dark background):
  - **CNPY Balance:**
    - Label: "Your CNPY Balance"
    - Amount: "701.25" (large green text)
    - Token: "CNPY" (gray text)

  - **Divider line**

  - **Wallet Statistics:**
    - "Connected Wallets" label with count: "0"
    - "Remaining Balance" label with amount: "$0.75"

- **Action Button:**
  - Primary button: "Start Buying Projects" (blue, full width)

- **Progress Indicators:**
  - 5 dots at bottom (all 5 are green)

**User Actions:**
- Click "Start Buying Projects" to navigate to launchpad/explore
- Click X to close dialog and show connected wallet card in sidebar

**State:**
- This is the final step - wallet is fully funded and ready
- After closing, the main sidebar should display the connected wallet card with balance

---

## Technical Implementation Notes

### Dialog Component
- Use shadcn Dialog component
- Modal should be centered on screen
- Backdrop should be semi-transparent (black/50 or similar)
- Dialog should be responsive (max-w-md on desktop, full width on mobile)
- Include smooth transitions between steps

### State Management
- Track current step (1-7)
- Store email, verification code, wallet addresses, balances
- Handle connection status for each wallet type
- Calculate conversion rates and amounts

### Navigation
- Back button should return to previous step (except on final step)
- Close button (X) should exit flow at any point (with confirmation?)
- Progress dots should indicate current step (green = completed/current, gray = pending)

### Integration Points
- Email service for verification codes
- Wallet connection libraries (MetaMask, WalletConnect)
- Balance checking APIs
- Token conversion/swap functionality
- Update sidebar wallet card after completion

### Error Handling
- Invalid email format
- Verification code timeout/incorrect
- Wallet connection failures
- Insufficient balance
- Conversion/swap failures

### Skip Conditions
- If user already has connected wallets, skip steps 4-5
- If user already has CNPY balance, skip step 6
- Allow "Later" or "Skip" options for optional steps

---

## Flow Summary

1. **Email Entry** → Enter email or use Google OAuth
2. **Verification** → Enter 4-digit code sent to email
3. **Wallet Setup** → Create new or import existing Canopy wallet
4. **Connect External Wallets** → Link Solana/EVM wallets for funding
5. **Balance Detection** → Confirm detected USDT/USDC balances
6. **Token Conversion** → Convert stablecoins to CNPY
7. **Success** → Wallet funded and ready to use

After completion, the main sidebar should show the connected wallet card with the user's balance instead of the "Connect wallet" button.
