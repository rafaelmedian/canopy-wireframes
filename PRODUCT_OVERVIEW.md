# Canopy Launcher - Product Overview

## Introduction

This document provides a comprehensive overview of the Canopy Launcher platform from a product and design perspective. All screens and flows have been implemented as high-fidelity wireframes to facilitate product discussions and identify edge cases before final design polish.

**This document describes the ACTUAL implemented features** - not aspirational designs. Every interaction, validation rule, calculation, tooltip, loading state, and UX behavior documented here exists in the current codebase.

**Note:** Wallet connection functionality is not included in this build as it's being developed separately by Rafa and will be integrated once finalized.

---

## Table of Contents

1. [Launchpad (Home)](#1-launchpad-home)
2. [Global Search](#2-global-search)
3. [Chain Launch Flow](#3-chain-launch-flow)
4. [Chain Detail Pages](#4-chain-detail-pages)
5. [Transaction & Block Explorer](#5-transaction--block-explorer)
6. [Report an Issue](#6-report-an-issue)

---

## 1. Launchpad (Home)

The launchpad serves as the main landing page where users discover and explore L1 blockchain chains.

### Key Features

**Filter System**
- Filter by status: All, Virtual, Graduated
- **Virtual**: Chains in bonding curve phase (pre-graduation)
- **Graduated**: Chains that reached the market cap threshold and migrated to mainnet
- Status indicators show real-time chain state

**Sort System**
- Sort by: Market Cap, Holders, Volume, Price
- All sort options default to "High to Low"
- Visual hierarchy: Main label with muted direction text (e.g., "Market Cap: High to Low")

**Chain Display Modes**
- Grid view (default)
- List view
- Toggle between views using view mode buttons

**Chain Cards (Grid Mode)**
- **Avatar:** Colored circle with logo image or ticker's first letter
  - Background color from chain's brandColor
  - 40x40px size
- **Chain Name & Ticker:**
  - Name displayed as heading (truncated if too long)
  - Ticker displayed below name as `${TICKER}` in muted text
- **Milestone Badges:**
  - Small hexagonal badges showing completed milestones
  - Shows up to 4 milestone badges
  - "+X" badge if more than 4 milestones completed
  - Hover tooltip shows milestone title (e.g., "First 10 holders", "$1k market cap")
  - 10 total milestones tracked:
    1. First 10 holders
    2. $1k market cap
    3. 50 holders milestone
    4. 1,000 transactions
    5. $5k market cap
    6. 100 holders club
    7. $10k market cap
    8. 500 holders strong
    9. $25k market cap
    10. Graduation ready ($50k)
- **Description:** 2-line clamped text preview
- **Progress Bar:**
  - Visual progress toward graduation goal
  - Shows current market cap vs goal (e.g., "$23.0k / $50k")
  - 24h change percentage (green for positive, red for negative)
- **Click:** Navigate to chain detail page

**Chain List Items (List Mode)**
- **7-Column Grid Layout:**
  1. **Chain Name & Logo:**
     - Avatar + name + ticker (same as grid)
  2. **Market Cap & Progress:**
     - Label + current/goal display
     - Progress bar
  3. **Change (24h):**
     - Label + percentage with color coding
  4. **VOL (24h):**
     - Label + volume in thousands
  5. **Holders:**
     - Label + holder count
  6. **Liquidity:**
     - Shows "Liquidity" if graduated, "Virtual Liq" if not
  7. **Age:**
     - Chain age (e.g., "2d")
- **Click:** Navigate to chain detail page

**Top Chains Section**
- Featured "Top chain this week" card
- Highlighted visual treatment
- Shows chain performance metrics

**Create New Chain CTA**
- Prominent "Create L1 chain" button in sidebar
- Also accessible via "+" icon in compact sidebar mode
- Opens launch overview dialog

[Image: Launchpad grid view with milestone badges]

[Image: Chain card showing milestones]

[Image: Launchpad list view with all columns]

[Image: Filter and sort controls]

---

## 2. Global Search

Command-style search accessible throughout the application via `⌘K` (Mac) or `Ctrl+K` (Windows).

### Search Functionality

**Keyboard Shortcut**
- Global shortcut indicator visible on search button in sidebar
- Press `⌘K` / `Ctrl+K` anywhere to open search dialog

**Search Scope**
- Chains: Searches by name and ticker symbol
- Transactions: Searches by transaction hash
- Blocks: Searches by block number or block hash
- Real-time filtering as user types
- Maximum 5 results per category

**Recent Searches**
- Persists last 5 searches in localStorage
- **Future Enhancement:** Should be tied to user object in database so recent searches persist across devices when user signs in
- Shows when search input is empty
- Includes chains, transactions, and blocks
- Visual indicators: Clock icon + type-specific icon
- Displays chain name context for transactions/blocks
- Click any recent search to navigate

**Search Results Display**
- **Chains**: Avatar, name, ticker, market cap, 24h change
- **Transactions**: Hash (truncated), amount, block number, chain context
- **Blocks**: Block number, transaction count, hash preview, chain context

**Navigation Behavior**
- Chains: Navigate to chain detail page
- Transactions: Navigate to transaction detail page
- Blocks: Navigate to block detail page
- Recent searches navigate to appropriate detail pages

**No Results State**
- Shows helpful message: "No results found. Try searching for chain names, transaction hashes, or block numbers."
- Only displays when actively searching (not on empty state)

[Image: Search dialog with recent searches]

[Image: Search results showing chains]

[Image: Search results showing transactions and blocks]

---

## 3. Chain Launch Flow

Multi-step wizard for creating a new L1 blockchain. The flow guides users through all necessary configuration.

### Flow Overview

**7-Step Process:**
1. Language Selection
2. Repository Connection
3. Chain Configuration
4. Branding
5. Links & Social Media
6. Settings & Tokenomics
7. Review & Launch

**Launch Overview Dialog**
- Triggered by "Create L1 chain" button
- Explains the launch process
- Shows what to expect
- "Start" button begins flow
- Can be dismissed with "Cancel"

[Image: Launch overview dialog]

---

### Step 1: Language Selection

Select the programming language/framework for the blockchain.

**Available Languages:**
- TypeScript
- Rust
- Go
- Solidity
- Python
- C++

**Interaction:**
- Click language card to select
- Visual feedback on selection (border highlight)
- "Continue" proceeds to repository connection (requires selection)
- X button in top-right closes flow and returns to launchpad

**Validation:**
- Must select one language to proceed

[Image: Language selection screen]

---

### Step 2: Repository Connection

Connect to the GitHub repository containing the blockchain code.

**Authentication Flow:**

**Initial State:**
- GitHub icon with "Connect with GitHub" CTA
- Explanation text: "Authenticate with GitHub to select your repository"
- OAuth connection required

**GitHub Authentication:**
- User clicks "Connect with GitHub"
- Redirects to GitHub OAuth flow
- **Technical Requirement:** Canopy needs to build a GitHub App
- Requests repository access permissions
- User authorizes Canopy to access their repositories

**After Authentication:**
- Shows list of user's repositories
- Searchable/filterable repository list
- Repository cards show:
  - Repository name
  - Owner/organization
  - Primary language
  - Last updated timestamp
  - Public/private indicator
- Select repository from list
- Visual connection status indicator

**Why This Connection is Important:**
1. **Automated Deployment:** Canopy can deploy the blockchain code
2. **Repository Information:** Access to repo metadata, commits, and activity
3. **Continuous Integration:** Monitor code changes and updates
4. **Code Analysis:** Validate blockchain implementation
5. **Documentation:** Pull README and docs for chain page

**Connection Features:**
- Shows connected repository with disconnect option
- Link to view repository on GitHub

**Interaction:**
- "Back" returns to language selection
- "Next" proceeds to configuration (requires connected repo)
- Can change selected repository before proceeding
- "Disconnect" button to reselect different repository

**Validation:**
- Must authenticate with GitHub to proceed
- Must select a repository to continue
- Repository must match selected language (validation/warning)
- Shows connection status feedback
- Error handling for failed OAuth or revoked access

**Technical Requirements:**
- Canopy GitHub App needs to be created
- OAuth authentication flow required

[Image: Repository connection screen - Initial state]

[Image: GitHub authentication flow]

[Image: Repository selection list]

[Image: Connected repository state]

---

### Step 3: Chain Configuration

Core blockchain parameters and technical configuration.

**Configuration Fields:**

**Basic Information:**

**Chain Name (Required):**
- Text input field
- Validation:
  - Minimum: 2 characters
  - Maximum: 50 characters
  - Pattern: Only letters, numbers, and spaces allowed (`/^[a-zA-Z0-9\s]+$/`)
  - Error messages: "Chain name is required", "Chain name must be at least 2 characters", "Chain name must be less than 50 characters", "Only letters, numbers, and spaces allowed"
- Helper tooltip: "The name of your blockchain network. Example: 'Ethereum', 'Solana', 'MyChain'"

**Token Name (Required):**
- Text input field
- Validation:
  - Minimum: 2 characters
  - Maximum: 30 characters
  - Pattern: Only letters, numbers, and spaces allowed (`/^[a-zA-Z0-9\s]+$/`)
  - Error messages: "Token name is required", "Token name must be at least 2 characters", "Token name must be less than 30 characters", "Only letters, numbers, and spaces allowed"
- Helper tooltip: "The full name of your native token. Example: 'Ether', 'Bitcoin', 'MyToken'"
- **Special Behavior:** Triggers ticker auto-suggestion (see below)

**Ticker (Required):**
- Text input field
- Auto-converts to uppercase as user types
- Maximum length: 5 characters (enforced by maxLength attribute)
- Validation:
  - Minimum: 3 characters
  - Maximum: 5 characters
  - Pattern: Uppercase letters and numbers only (`/^[A-Z0-9]+$/`)
  - Error messages: "Ticker is required", "Ticker must be at least 3 characters", "Ticker must be 3-5 characters", "Only uppercase letters and numbers allowed"
- Helper tooltip: "The trading symbol for your token. Example: 'ETH', 'BTC', 'USDC' (3-5 characters)"

**Ticker Auto-Suggestion System:**
- Automatically generates ticker from token name
- Triggered when:
  - User types in token name field
  - User has NOT manually edited ticker field
  - Token name is at least 2 characters
- Debounced: Waits 800ms after user stops typing
- **Loading State:** Shows "Suggesting..." with spinner icon while generating
- **Success State:** Shows "Suggested Ticker" with green check icon after generation
- **Generation Algorithm:**
  - Single word: Takes first 3-4 characters (e.g., "Bitcoin" → "BITC")
  - Multiple words: Takes first letter of each word (e.g., "My Game Chain" → "MGC")
  - Ensures minimum 3 characters
- **Manual Edit Behavior:**
  - If user manually types in ticker field, auto-suggestion permanently disables
  - Clears suggestion indicator
  - Won't re-generate even if token name changes

---

**Token Economics:**

**Token Supply (Fixed):**
- Display only, not editable
- Fixed value: 1,000,000,000 (1 billion tokens)
- Visual styling: Muted background, reduced opacity, disabled cursor
- Helper text: "The total number of tokens that will ever exist."

**Halving Schedule (Required):**
- Number input field
- Placeholder: "365"
- Default: 365 days
- Validation:
  - Must be valid number
  - Minimum: 1 day
  - Maximum: 10,000 days
  - Error messages: "Halving schedule is required", "Must be a valid number", "Must be at least 1 day", "Must be less than 10,000 days"
- Helper tooltip: "Halving reduces mining rewards by 50% at set intervals. Like Bitcoin's 4-year halving cycle. Enter days between halvings."

**Block Time (Required):**
- Dropdown select field (not free-form input)
- Options: Predefined common block times (10 seconds, 12 seconds, etc.)
- Default: 10 seconds
- Helper tooltip: "Time between new blocks being added to the chain. Bitcoin: ~10 min, Ethereum: ~12 sec. Faster = more transactions."

**Network Summary Card:**
- Real-time calculations displayed in card with Info icon
- Updates automatically as user changes values
- **Displayed Metrics:**
  - **Block Time:** Shows selected option (e.g., "10 seconds")
  - **Blocks per Day:** Calculated as `(24 * 60 * 60) / blockTime`, formatted with thousands separator
  - **Halving Schedule:** Shows "Every X days"
  - **Est. Tokens Minted (Year 1):** Complex calculation using Bitcoin's geometric series:
    - Formula: `initial_subsidy = total_supply / (blocks_per_halving * 2)`
    - If Year 1 spans multiple halvings, calculates pro-rata across periods
    - Displays with thousands separator and ticker symbol (e.g., "~137,442,250 GAME")

**Interaction:**
- "Back" returns to repository connection
- "Continue" proceeds to branding (disabled until all fields valid)
- X button in top-right closes flow and returns to launchpad

**Validation:**
- All fields required
- Form only valid when all fields filled AND no validation errors
- "Continue" button disabled if form invalid
- Real-time validation on blur (when user leaves field)
- Error messages shown below each invalid field with red text and red border

**Auto-save:**
- Uses custom `useAutoSave` hook
- Watches all form values: chainName, tokenName, ticker, halvingDays, blockTime
- Only saves if repository connected
- Shows saving indicator in sidebar
- Shows "Last saved" timestamp in sidebar

**Scroll Behavior:**
- Automatically scrolls to top when page loads

[Image: Configuration form - basic info section]

[Image: Ticker auto-suggestion - Loading state]

[Image: Ticker auto-suggestion - Suggested state]

[Image: Network Summary Card with calculations]

---

### Step 4: Branding

Visual identity for the chain.

**Branding Elements:**

**Logo Upload (Required):**
- Drag & drop or click to upload
- Accepts: PNG, JPG, SVG
- Square aspect ratio recommended
- Preview shows uploaded logo
- Can replace or remove logo
- Integrated with brand color picker in same component

**Brand Color (Required):**
- Color picker for primary brand color
- Hex input field for manual entry
- Preview shows color in context
- Part of LogoUpload component
- Required to proceed

**Title (Required):**
- Text input field
- Validation:
  - Minimum: 10 characters (trimmed)
  - Maximum: 100 characters (trimmed)
  - Error messages: "Title is required", "Title must be at least 10 characters", "Title must be less than 100 characters"
- Helper text: "A catchy title that appears on the launchpad. Example: 'MyGameChain: The Future of Gaming on Blockchain'"

**Description (Required):**
- Textarea field (multi-line)
- **Character Counter:** Shows "{count}/500 characters" below field
- Updates in real-time as user types
- Validation:
  - Minimum: 20 characters (trimmed)
  - Maximum: 500 characters (trimmed)
  - Error messages: "Description is required", "Description must be at least 20 characters", "Description must be less than 500 characters"
- Helper text: "A detailed description of your blockchain's purpose and features. Example: 'A revolutionary blockchain designed specifically for gaming applications, enabling seamless in-game asset transactions...'"

**Gallery (Optional):**
- Marked with "Optional" badge (secondary variant)
- Separate `GalleryCarousel` component
- Upload up to 3 items (images OR videos)
- Accepts: Image files (`image/*`) and video files (`video/*`)
- Drag & drop or click to upload
- Can reorder, replace, or remove items
- Helper text: "Recommended: Add at least three images or videos. This will help your chain stand out and build trust among others."
- Uses FileReader API for preview generation
- Clears file input after upload to allow re-selecting same file

**Interaction:**
- "Back" returns to configuration
- "Continue" proceeds to links (requires logo, title, and description)
- X button in top-right closes flow and returns to launchpad

**Validation:**
- Logo is required (not optional as originally documented)
- Title required with character limits
- Description required with character limits
- Gallery optional
- Form valid only when: `logo && title && description && !errors.title && !errors.description`
- "Continue" button disabled if form invalid

**Auto-save:**
- Uses custom `useAutoSave` hook
- Watches: logo, brandColor, title, description, gallery
- Only saves if repository or chainConfig connected
- Shows saving indicator in sidebar
- Shows "Last saved" timestamp in sidebar

**Scroll Behavior:**
- Automatically scrolls to top when page loads

[Image: Branding screen with logo upload]

[Image: Title and description fields with character counter]

[Image: Gallery upload with optional badge]

---

### Step 5: Links & Social Media

Social presence and external links.

**Social Links Section (Required):**

**Platform Management:**
- **Available Platforms:** Website, Twitter/X, Telegram, Discord, GitHub, Medium, Reddit, LinkedIn
- Each platform has specific label and placeholder:
  - Website: "https://yourchain.org"
  - Twitter: "@yourchainhandle"
  - Discord: "https://discord.gg/yourchain"
  - Telegram: "https://t.me/yourchain"
  - GitHub: "https://github.com/yourorg/yourchain"
  - Medium: "https://medium.com/@yourchain"
  - Reddit: "https://reddit.com/r/yourchain"
  - LinkedIn: "https://linkedin.com/company/yourchain"

**Dynamic Add/Remove System:**
- Starts with 1 default link (typically website)
- **Add Platform:** Dropdown shows only platforms not yet added
- **Each Link Card Shows:**
  - Platform icon (custom SVG for Twitter, Telegram, Discord, Medium, Reddit; Lucide icons for Website/Globe, GitHub, LinkedIn)
  - Platform label in fixed-width area (128px)
  - URL input field (flex-1, full width)
  - Delete button (ghost icon button with X)
- **Add Button:** Opens platform selector dropdown
- **Remove Button:** Deletes link from list

**Validation Rules:**
- **Duplicate Prevention:** Dropdown only shows platforms that haven't been added yet
  - Selected platforms are automatically removed from the dropdown list
  - Prevents duplicate platform selection
- **Minimum Requirement:** At least 1 social link required
  - Cannot remove last remaining link
- **URL Validation:** All added links must have non-empty URLs to proceed
- Form valid only when: `socialLinks.length > 0 && socialLinks.every(link => link.url.trim().length > 0)`

**Resources Section (Optional):**
- Marked with "Optional" badge (secondary variant)
- Helper text: "Share additional resources, pitch decks, whitepapers, or documentation that help users understand your blockchain"

**Two Upload Methods (Tabbed Interface):**

**Tab 1: Upload from Device**
- Click-to-upload or drag-and-drop area
- Accepts: PDF, DOC, DOCX files
- File types: `.pdf`, `.doc`, `.docx`, `application/pdf`
- Multiple file upload supported
- Visual upload zone with Upload icon
- Text: "Upload from your device. PDF, DOC, or DOCX files supported"
- Uses hidden file input with ref

**Tab 2: Add URL**
- Text input for resource URLs
- "Add" button (disabled when input empty)
- Enter key also triggers add action
- **Loading State:** Button shows "Adding..." while fetching metadata
- **URL Metadata Fetching:**
  - Extracts filename from URL path
  - Gets hostname for description
  - Creates resource object: `{ id, type: 'url', url, name, title, description }`

**Unified Resources List:**
- Displays both uploaded files and URL resources
- **Card Display for Each Resource:**
  - **Files:** FileText icon, filename, file size in KB, delete button
  - **URLs:** LinkIcon, URL-derived name, description/hostname, delete button
- **Data Structure:**
  - File: `{ id, type: 'file', file, name, size }`
  - URL: `{ id, type: 'url', url, name, title, description }`

**Interaction:**
- "Back" returns to branding
- "Continue" proceeds to settings (requires at least 1 social link with URL)
- X button in top-right closes flow and returns to launchpad

**Validation:**
- Social links: Required, minimum 1, all must have URLs
- Resources: Optional, don't affect form validity
- "Continue" button disabled if social links invalid

**Auto-save:**
- Uses custom `useAutoSave` hook
- Watches: socialLinks, resources
- Only saves if branding or chainConfig connected
- Shows saving indicator in sidebar
- Shows "Last saved" timestamp in sidebar

**Scroll Behavior:**
- Automatically scrolls to top when page loads

[Image: Social links with platform selector]

[Image: Added social links list]

[Image: Resources upload tab]

[Image: Resources URL tab]

[Image: Resources list with files and URLs]

---

### Step 6: Settings & Tokenomics

Economic model and launch settings.

**Graduation Threshold (Fixed, Not Configurable):**
- Fixed value: **$50,000 market cap**
- Displayed in Card component with Target icon
- Large, bold font styling
- Format: "$50,000" with thousands separator
- **Not editable by user**

**Virtual Chain Explanation:**
- Two-paragraph explanation with bolded key terms:
  - Paragraph 1: "Your chain starts as a **virtual chain** — a lightweight environment where users can buy and trade your tokens without the full blockchain infrastructure running yet."
  - Paragraph 2: "Once total purchases reach **$50,000**, your chain **graduates**. At this point, we deploy your repository and launch the full blockchain network, making it a real, operational chain on the Canopy ecosystem."

**Initial Purchase Section (Optional):**
- Marked with "Optional" badge
- User can enter amount in CNPY
- Accepts decimal values (e.g., 100.50)
- **Tooltip:** "CNPY is Canopy's native token. Your initial purchase uses CNPY to buy your chain's tokens, establishing liquidity and demonstrating commitment. This creates the initial trading pair for your token on the Canopy ecosystem."

**Real-Time Token Preview:**
- Shows when amount entered
- Displays: "You will receive {amount} {TICKER} tokens (1:1 ratio)"
- Uses ticker from Step 3 configuration
- Formatted with thousands separator

**"Why Should I Buy?" Section:**
- Clickable button: "Buy tokens to show confidence."
- Toggles expandable card

**Expandable Card Content:**
- **Title:** "Why should I buy tokens?"
- **Introduction:** "Making an initial purchase of your chain's tokens demonstrates confidence and commitment to potential users and investors. Here's why it matters:"
- **4 Key Points:**
  1. **Show Confidence:** Buying your own tokens signals that you believe in your project's success and are willing to invest your own capital.
  2. **Build Trust:** Community members are more likely to participate when they see the creators have 'skin in the game.'
  3. **Kickstart Liquidity:** Your initial purchase helps establish the starting liquidity pool, making it easier for others to buy and trade.
  4. **Accelerate Graduation:** Every purchase counts toward the $50,000 graduation threshold, bringing your chain closer to full deployment.
- **Note:** This is entirely optional. You can launch your chain without an initial purchase, but many successful projects choose to make one as a demonstration of commitment.

**Interaction:**
- "Back" returns to links
- "Continue" proceeds to review
- X button in top-right closes flow and returns to launchpad
- Info button toggles "Why should I buy?" card visibility

**Validation:**
- No required fields in this step
- Initial purchase is completely optional
- Can proceed with 0 or any positive amount
- Form always valid (no blocking validation)

**Auto-save:**
- Uses custom `useAutoSave` hook
- Watches: initialPurchase (amount)
- Only saves if links or branding connected
- Shows saving indicator in sidebar
- Shows "Last saved" timestamp in sidebar

**Scroll Behavior:**
- Automatically scrolls to top when page loads

[Image: Graduation threshold card]

[Image: Virtual chain explanation]

[Image: Initial purchase input with tooltip]

[Image: Token preview display]

[Image: "Why should I buy?" collapsed state]

[Image: "Why should I buy?" expanded card]

---

### Step 7: Review & Launch

Final review of all configuration before publishing or saving changes.

**Edit Mode:**
- When editing a published chain, this step shows "Save Changes" button instead of "Connect Wallet & Pay"
- After saving changes, returns to the chain detail page with success confirmation

**Review Cards:**

**1. Language & Repository Card:**
- **Language:** Displayed as Badge (secondary variant)
- **Repository:** GitHub icon + full repository name (e.g., "username/repo-name")
- Edit button navigates to `/launchpad/language`

**2. Chain Details Card:**
- **2-Column Grid Layout:**
  - Chain Name
  - Token Name
  - Ticker (displayed as `$TICKER`)
  - Supply (formatted: "1,000,000,000 GAME" with thousands separator)
  - Halving Schedule (e.g., "Every 365 days")
  - Block Time (e.g., "10 seconds")
- Edit button navigates to `/launchpad/configure`

**3. Branding & Media Card:**
- **Logo Preview:**
  - 64x64px rounded box with muted background
  - Shows uploaded logo image
  - If no logo: Shows first letter of ticker in large bold font (2xl)
- **Brand Color Display:**
  - 24x24px color swatch with border
  - Hex code in monospace font beside swatch
- **Title:** Full text display
- **Description:** Full text display
- **Gallery:** Shows count (e.g., "3 items" or "No gallery items")
- Edit button navigates to `/launchpad/branding`

**4. Links & Documentation Card:**
- **Social Links Subsection:**
  - Each link displays: Platform icon + label + full URL
  - Uses PLATFORM_ICONS mapping for proper icons
  - Vertically stacked list
- **Resources Subsection (conditional):**
  - Only shows if resources.length > 0
  - Each resource shows: FileText icon (files) or LinkIcon (URLs) + resource name
- Edit button navigates to `/launchpad/links`

**5. Launch Settings Card:**
- **Graduation Threshold:**
  - Displayed as "$50,000 market cap"
  - Not editable (shown for reference)
- **Initial Purchase (conditional):**
  - Only shows if initialPurchase > 0
  - Displays: "{amount} CNPY" (e.g., "100 CNPY")
  - Shows token receipt in muted text: "You will receive {amount} ${TICKER}"
- Edit button navigates to `/launchpad/settings`

**Payment Summary Card:**
- **Creation Fee:** Fixed at 100 CNPY
- **Initial Purchase:** Shows amount if > 0, otherwise shows 0 CNPY
- **Separator Line** between line items and total
- **Total:** Sum of creation fee + initial purchase
  - Large text (text-lg)
  - Bold font (font-bold)
  - Format: "{total} CNPY" (e.g., "200 CNPY")

**Important Notice Card:**
- Styled with AlertCircle icon (primary color)
- **Title:** "Important"
- **3 Bullet Points:**
  - "• Starts as virtual chain (test mode)"
  - "• Becomes real at $50,000 market cap"
  - "• Settings cannot be changed after launch"
- **Visual Styling:**
  - Background with primary border accent
  - Warning/info styling to draw attention

**Action Buttons:**

**Layout:**
- Full-width flex column with gap
- Buttons are full-width and large size

**Primary Button:**
- **New Launch:** "Connect Wallet & Pay"
- **Edit Mode:** "Save Changes"
- Full width, primary styling

**Secondary Button:**
- "Back" with ArrowLeft icon
- Returns to `/launchpad/settings`
- Full width, outline variant

**Interaction:**
- All "Edit" buttons navigate to respective steps with current state preserved
- "Back" returns to settings step
- Primary button action depends on mode:
  - New launch: Opens wallet connection and payment flow
  - Edit mode: Saves changes and returns to chain detail page
- X button in top-right closes flow and returns to launchpad

**Validation:**
- Final validation of all required fields before allowing publish
- Shows inline errors if any required data missing
- Prevents publish if validation fails
- Edit mode skips payment validation

**Auto-save:**
- Uses custom `useAutoSave` hook
- Watches all accumulated state
- Shows saving indicator in sidebar
- Shows "Last saved" timestamp in sidebar

**Scroll Behavior:**
- Automatically scrolls to top when page loads

[Image: Review screen - Language & Repository card]

[Image: Review screen - Chain Details card]

[Image: Review screen - Branding card with logo preview]

[Image: Review screen - Links & Documentation card]

[Image: Review screen - Launch Settings card]

[Image: Payment Summary card]

[Image: Important Notice card]

[Image: Action buttons - New launch mode]

[Image: Action buttons - Edit mode]

---

## 4. Chain Detail Pages

Comprehensive view of a blockchain with multiple states and tabs.

### Chain States

Chains can be in one of four states:

1. **Draft** (Creator only)
2. **Virtual** (Bonding curve phase)
3. **Countdown** (24h before graduation)
4. **Graduated** (Mainnet launched)

---

### State 1: Draft Chain (Owner View Only)

When chain is saved as draft and only visible to the creator.

**Header:**
- Breadcrumb: "Launchpad / {Chain Name}" with Draft badge
- More menu (three dots) in top-right with "Delete draft chain" option

**Chain Header Card:**
- Shows chain name with ticker
- Displays "edited X time ago" (not "created" or "launched")
- No favorite or share buttons (only visible for published chains)
- Milestone badges not shown for drafts

**Right Sidebar - Draft Progress Panel:**
- Shows current step number and total steps (e.g., "You're on step 3 of 7")
- Progress bar showing completion percentage
- List of all 7 steps with checkmarks for completed steps
- Current step highlighted
- "Continue Setup" button that navigates to next incomplete step
- Info note: "Complete all steps and make your initial purchase to launch your chain. Your configuration is automatically saved as you progress."

**Tabs Available:**
- Overview
- Holders (shows draft placeholder state)
- Milestones
- Code
- Block Explorer (shows draft placeholder state)

**Overview Tab for Drafts:**
- Social link placeholders (dimmed, dashed borders, with tooltips explaining "This is where your social media links will appear")
- Shows title and description if configured
- No milestone achievements section (only shown for published chains)
- Gallery section if images added
- Quick stats cards hidden for drafts
- Tokenomics section shows if configured
- Resources section shows if added

**Delete Draft Action:**
- Opens confirmation dialog
- Warning: "This action cannot be undone. This will permanently delete your draft chain and remove all associated configuration data."
- Cancel or Delete buttons
- On delete: Shows success toast and returns to launchpad

[Image: Draft chain header with breadcrumb and more menu]

[Image: Draft Progress Panel showing steps]

[Image: Draft overview tab with placeholder social links]

---

### State 2: Virtual Chain (Public View)

Active chain in bonding curve phase, visible to all users.

**Header:**
- Breadcrumb: "Launchpad / {Chain Name}" with Virtual badge
- No more menu for public viewers

**Chain Header Card:**
- Chain logo/avatar with brand color
- Chain name
- Milestone badges (hexagonal badges with icons, shows up to 6 completed milestones, "+X" if more)
- Ticker and creation time (e.g., "$GAME on MyGameChain • created 13m ago")
- Favorite button (star icon)
- Share button (copies link to clipboard)

**Price Chart Card:**
- Visual chart showing price over time
- Current price with 24h change percentage
- Market cap with progress toward $50k graduation
- Volume and holder count metrics

**Tabs Available:**
- Overview
- Holders (with holder count)
- Milestones
- Code
- Block Explorer

**Overview Tab:**
- Social links (first 4 shown as rounded pills, clickable)
- GitHub link shows "23 stars" if applicable
- Title and description
- Milestone achievements section (clickable badges showing all completed milestones, links to Milestones tab)
- Gallery carousel with navigation arrows and thumbnails
- Quick stats cards:
  - Holders card (shows count, avatars of top 5 holders, "View All Holders" button)
  - Code card (shows language, stars, forks, "View Repository" button)
  - Block Explorer card (shows block height, total transactions, avg block time, "View Explorer" button)
- Tokenomics section (total supply, block time, halving schedule, blocks per day, year 1 emission)
- Resources & Documentation section (if resources added)

**Holders Tab:**
- List of all holders with addresses, balances, and percentage of supply
- Holder distribution visualization

**Milestones Tab:**
- All 10 milestones with progress tracking

**Code Tab:**
- Repository information and code details

**Block Explorer Tab:**
- Recent blocks table showing:
  - Block number (clickable)
  - Timestamp
  - Transaction count
  - Block reward
- Recent transactions table showing:
  - Transaction hash (clickable, truncated)
  - From/To addresses (truncated)
  - Amount
  - Status badge
  - Timestamp

**Right Sidebar - Trading Panel:**
- Buy/Sell/Convert tabs
- Token swap interface with amount inputs
- "Connect Wallet" button (placeholder for Rafa's module)
- Price display and balance information
- Swap arrow to flip token positions

**Report a Problem Button:**
- Shown at bottom of main content area
- Hidden for draft chains

[Image: Virtual chain with price chart and metrics]

[Image: Chain header with milestone badges]

[Image: Overview tab with quick stats cards]

[Image: Trading panel]

---

### State 3: Review Countdown (After Payment, Before Launch)

After user completes payment, a 30-second review period begins before chain is published.

**Header:**
- Breadcrumb shows Draft badge during countdown
- Same layout as draft state

**Right Sidebar - Review Countdown Panel:**
- "Review Period" title with clock icon
- Message: "You have Xs to review and edit your chain before it launches"
- Large circular countdown timer showing seconds remaining
- Progress circle animates as time counts down
- Center shows "publish on" label with countdown number
- Warning card: "Last chance to edit - Once the countdown ends, your chain will be launched and settings cannot be changed."
- "Edit Chain Configuration" button that takes user back to review step

**Main Content:**
- Same tabs and content as draft state
- All configuration visible for final review

**After Countdown Completes:**
- Countdown panel disappears
- Success banner appears at top
- Chain becomes publicly visible
- State changes to Virtual

[Image: Review countdown panel with circular timer]

[Image: Warning card about last chance to edit]

---

### State 4: Graduated Chain (Mainnet)

Chain that successfully reached $50k market cap and graduated to mainnet.

**Header:**
- Breadcrumb shows Graduated badge

**Chain Header Card:**
- Same as Virtual chain (milestone badges, favorite, share buttons)

**Price Chart - Major Differences:**
- **Metric Selector:** Segmented control to switch between Price, Market Cap, and Volume views
- **Selected Metric Display:** Shows large value for selected metric:
  - Price: Shows current price with 24h change percentage
  - Market Cap: Shows market cap in thousands
  - Volume: Shows 24h volume in thousands
- **No Graduation Progress Bar:** Progress bar and "until graduation" text removed
- **Time Period Buttons:** Same as Virtual (1H, 1D, 1W, 1M, 1Y, ALL)
- **Live Updates Bar:** Shows "Liquidity" label instead of "Virtual Liq"

**Tabs:**
- Same tabs as Virtual: Overview, Holders, Milestones, Code, Block Explorer
- Overview tab has all same sections
- Trading panel on right sidebar

**Summary of Differences from Virtual:**
- Graduated badge instead of Virtual
- Metric selector (Price/Market Cap/Volume) in chart
- No graduation progress bar
- "Liquidity" instead of "Virtual Liq" in stats bar

[Image: Graduated chain with metric selector]

[Image: Price chart showing market cap view]

---

### Block Detail Sheet

Side sheet that opens when clicking a block in Explorer tab.

**Header:**
- "Block #[number]"
- Close button (X)

**Tabs:**

**Overview Tab:**
- Block Number (large display)
- Timestamp (relative + absolute)
- Transactions count
- Block Reward (calculated based on halving schedule)
- Block Hash (full, with copy button)
- Previous Block Hash (if not genesis)

**Transactions Tab:**
- List of all transactions in this block
- Each transaction shows:
  - Transaction hash (truncated, clickable)
  - From/To addresses (truncated)
  - Amount with ticker
  - Status badge
  - Timestamp
- Click transaction → Opens transaction detail sheet
- This sheet closes when transaction sheet opens

**Interactions:**
- Copy block hash → Copies to clipboard, shows checkmark
- Copy previous hash → Same behavior
- Click transaction → Navigate to transaction detail
- Close sheet → Returns to Explorer tab

**Important Detail:**
- Sheet properly queries all transactions for the block
- Previously had bug showing only recent 10 transactions
- Now uses `getTransactionsByBlockNumber(chainId, blockNumber)`
- Shows actual transaction count matching block.transactions field

[Image: Block detail sheet - Overview]

[Image: Block detail sheet - Transactions list]

---

### Transaction Detail Sheet

Side sheet that opens when clicking a transaction in Explorer tab or block detail.

**Header:**
- "Transaction Details"
- Close button (X)

**Content:**
- Transaction Hash (full, with copy button)
- Status badge (Success/Pending/Failed with appropriate colors)
- Timestamp (relative + absolute)
- Block Number (clickable, opens block detail)
- From Address (full, with copy button)
- To Address (full, with copy button)
- Amount (with ticker)
- Transaction Fee (with ticker, or "< 0.001" if minimal)

**Status Badges:**
- Success: Green with checkmark icon
- Pending: Yellow with clock icon
- Failed: Red with X icon

**Interactions:**
- Copy hash → Clipboard + checkmark feedback
- Copy addresses → Same behavior
- Click block number → Opens block detail sheet (transaction sheet closes)
- Close sheet → Returns to previous view

**Navigation:**
- Opens from: Explorer tab transaction list, Block detail transaction list
- Can navigate between transaction → block → transaction
- Breadcrumb context maintained

[Image: Transaction detail sheet]

---

## 5. Transaction & Block Explorer

Standalone pages for transactions and blocks, separate from the side sheets shown within chain detail pages.

**Why These Pages Exist:**
- Users can access transactions and blocks directly via the global search (⌘K)
- Shareable URLs for specific transactions and blocks
- Bookmarkable links for important transactions
- Deep linking from external sources
- Better for sharing transaction/block details with others

**Two Ways to View Transactions/Blocks:**
1. **Side Sheets:** When viewing from a chain's Explorer tab, opens as an overlay sheet
2. **Full Pages:** When accessing via search, direct URL, or shared link, shows as full page with sidebar

### Transaction Detail Page

Full-page view accessible via direct URL: `/transaction/[hash]`

**Layout:**
- Sidebar navigation (full app sidebar)
- Main content area (max-width container)
- Back button: "Back to [Chain Name]"
- Page title: "Transaction Details"
- Subtitle: "View detailed information about this transaction on [Chain Name]"

**Content:**
- Same information as transaction detail sheet
- Card-based layout
- More spacious presentation
- Optimized for direct linking and sharing

**Navigation:**
- Back button → Returns to chain detail page
- Click block number → Navigates to block detail page (same tab)
- Breadcrumb context showing chain → transaction

**Use Cases:**
- Shared transaction links
- Accessed from global search
- Bookmarked transactions
- Deep linking from external sources

**Not Found State:**
- Shows if transaction hash doesn't exist
- "Transaction not found" message
- Back to launchpad button

[Image: Transaction detail page]

---

### Block Detail Page

Full-page view accessible via direct URL: `/block/[hash]`

**Layout:**
- Sidebar navigation
- Main content area
- Back button: "Go to [Chain Name]"
- Page title: "Block #[number]"
- Subtitle: "View detailed information about this block on [Chain Name]"

**Content:**
- Tabs: Overview and Transactions (same as sheet)
- Card-based layout
- Overview tab shows all block metadata
- Transactions tab shows full list
- Click transaction → Navigates to transaction detail page

**Navigation:**
- Back button → Returns to chain detail page
- Click transaction → Navigates to transaction page (same tab)
- Breadcrumb context showing chain → block

**Use Cases:**
- Shared block links
- Accessed from global search
- Bookmarked blocks
- Deep linking from external sources
- Transaction detail pages link here

**Not Found State:**
- Shows if block hash doesn't exist
- "Block not found" message
- Back to launchpad button

[Image: Block detail page - Overview]

[Image: Block detail page - Transactions]

---

### Navigation Flow Between Pages

**From Global Search:**
- Search transaction → Transaction detail page
- Search block → Block detail page
- Both show back button to respective chain

**From Chain Detail (Explorer Tab):**
- Click transaction → Transaction detail sheet (side sheet)
- Click block → Block detail sheet (side sheet)
- Sheets remain contextual to chain page

**From Transaction/Block Pages:**
- Transaction page → Click block number → Block page
- Block page → Click transaction → Transaction page
- Both maintain chain context in back button

**Difference Between Sheet and Page:**
- **Sheet**: Quick view, stays on chain detail page, closes easily
- **Page**: Full view, shareable URL, better for deep linking
- Same content, different contexts

---

## 6. Report a Problem

Feature for users to report chains that violate platform policies.

**Access Point:**
- "Report a Problem" button shown at bottom of chain detail pages
- Hidden for draft chains
- Opens dialog when clicked

**Report Dialog:**

**Header:**
- Title: "Report {Chain Name}"
- Description: "Help us keep the Canopy ecosystem safe by reporting chains that violate our policies."

**Step 1: Choose Main Reason**
- 6 category cards in 2-column grid:
  1. Scam/Fraud
  2. Inappropriate Content
  3. Security Concerns
  4. Misleading Information
  5. Market Manipulation
  6. Legal/Copyright Issues
- Radio selection, only one can be selected

**Step 2: Specify the Issue**
- Shows after main reason selected
- Each category has specific options:
  - **Scam/Fraud:** Rug pull attempt, Fake/misleading project, Impersonation, Pump and dump scheme
  - **Inappropriate Content:** Offensive or hateful content, Adult/NSFW content, Violence or illegal activities, Harassment
  - **Security Concerns:** Malicious code in repository, Contract vulnerabilities, Backdoors or admin keys abuse, Suspicious smart contract behavior
  - **Misleading Information:** False claims or promises, Fake team/advisors, Plagiarized documentation, Fake partnerships
  - **Market Manipulation:** Wash trading, Price manipulation, Coordinated pump schemes, Fake volume, Other manipulation tactics
  - **Legal/Copyright Issues:** Copyright infringement, Trademark violation, Using others' IP without permission, Regulatory violations
- Radio selection list

**Step 3: Additional Comments (Optional)**
- Textarea for additional details
- Character counter showing 0/500 characters
- Placeholder: "Provide any additional details that might help us investigate this report..."

**Footer:**
- Cancel button
- "Send Report" button (disabled until main reason and specific reason selected)
- Shows "Submitting..." state while sending

**After Submission:**
- Success toast: "Report submitted successfully - Our team will review your report shortly."
- Dialog closes
- Form resets

[Image: Report problem button]

[Image: Report dialog with category selection]

[Image: Specific reason selection]

[Image: Additional comments textarea]

---

## Auto-Save & Data Persistence

### Launch Flow Auto-Save

**What Gets Saved:**
- All form inputs in launch flow steps
- Upload progress and uploaded files
- Current step position
- Draft state

**How It Works:**
- Saves to localStorage on every input change (debounced 500ms)
- Persists even if user closes browser
- "Last saved" timestamp shown
- Auto-save indicator in UI

**Recovery:**
- Returning to launch flow restores progress
- "Continue where you left off" prompt
- Can choose to start fresh or resume
- Draft chains saved to database

**Clearing:**
- Successful publish clears localStorage
- Delete draft clears data
- Manual "Start fresh" clears data

---

## Form Validation

### Real-Time Validation

**Input Fields:**
- Validates on blur (when user leaves field)
- Shows error message below field
- Red border on invalid input
- Green checkmark on valid input

**Common Validations:**
- Required fields marked with asterisk (*)
- Character limits with counters
- Format validation (URLs, hex, addresses)
- Numeric range validation
- Unique constraints (ticker symbols)

**Error Messages:**
- Clear, actionable error text
- Explains what's wrong and how to fix
- Examples: "Ticker must be 3-5 uppercase letters"

### Submit Validation

**Step Navigation:**
- "Next" button disabled if required fields empty
- Hover shows tooltip: "Complete required fields to continue"
- Validates all fields when clicking Next
- Scrolls to first error if validation fails

**Final Publish:**
- Validates all steps before allowing publish
- Shows summary of errors by section
- Must fix errors before publishing
- Success state shows confirmation

---

## Edge Cases & Special Scenarios

### Empty States

**Launchpad with No Chains:**
- Empty state illustration
- "No chains yet" message
- "Create first chain" CTA
- Help text explaining platform

**No Search Results:**
- "No results found" message
- Suggestions for better search
- Recent searches still shown

**Chain with No Transactions:**
- "No transactions yet" in Explorer tab
- Explanation that chain just launched
- Encourages first transaction

**Chain with No Holders:**
- Shows "No holders" state
- Creator is first holder by default

### Error States

**Failed Upload:**
- Shows error message
- Retry button
- Option to upload different file
- Clear error explanation

**Network Error:**
- "Connection lost" indicator
- Auto-retry mechanism
- Manual retry button
- Saved progress preserved

**Invalid Transaction:**
- Transaction failed state shown
- Reason for failure (if available)
- Failed badge in red
- Explanation in detail view

### Loading States

**Chain Loading:**
- Skeleton screens for cards
- Shimmer animation
- Maintains layout to prevent shift

**Search Loading:**
- Loading spinner in search dialog
- "Searching..." indicator
- Results appear as they load

**Transaction/Block Loading:**
- Loading state in sheet/page
- Skeleton for content areas
- Smooth transition when loaded

---

## Responsive Behavior

### Desktop (Primary Target)

**Sidebar:**
- Full sidebar (240px width)
- Collapsed sidebar option (73px width)
- All icons and labels visible
- Search shows shortcut key

**Layout:**
- Multi-column grids (3-4 columns)
- Side-by-side panels (chain detail + trading)
- Full-width tables
- Spacious forms

### Tablet (Responsive)

**Sidebar:**
- Can collapse to icon-only
- Overlay mode option
- Gesture-friendly hit targets

**Layout:**
- 2-column grids
- Stacked panels
- Scrollable tables
- Adapted forms

### Mobile (Future Enhancement)

**Note:** Not primary focus in current wireframes, but considerations made for:
- Full-screen sheets instead of side sheets
- Single column layouts
- Bottom navigation option
- Touch-optimized controls

---

## Design Patterns & Conventions

### Color System

**Status Colors:**
- Success/Graduated: Green (`#10b981`)
- Warning/Draft: Yellow (`#f59e0b`)
- Error/Failed: Red (`#ef4444`)
- Pending: Yellow (`#f59e0b`)
- Info: Blue (`#3b82f6`)

**Interactive Elements:**
- Primary actions: Brand color
- Secondary actions: Muted/outline
- Destructive: Red
- Disabled: Reduced opacity (50%)

### Typography

**Hierarchy:**
- Page titles: 3xl font (30px)
- Section titles: xl font (20px)
- Card titles: base font (16px)
- Body text: sm font (14px)
- Helper text: xs font (12px)

**Font Weights:**
- Headings: Bold (700)
- Emphasis: Semibold (600)
- Body: Regular (400)
- Muted: Regular (400) with reduced opacity

### Spacing

**Consistent Scale:**
- Page padding: 2rem (32px)
- Card padding: 1.5rem (24px)
- Section gaps: 1.5rem (24px)
- Element gaps: 0.75rem (12px)
- Tight spacing: 0.5rem (8px)

### Icons

**Icon Library:**
- Lucide icons throughout
- 16px (w-4 h-4) for inline
- 20px (w-5 h-5) for buttons
- 24px (w-6 h-6) for emphasis

**Icon Usage:**
- Leading icons for navigation
- Trailing icons for external links
- Status icons for badges
- Action icons for buttons

---

## Known Limitations & Future Enhancements

### Not Included in Current Build

1. **Wallet Connection**
   - Module being built by Rafa
   - Integration pending
   - Placeholder CTAs in place

2. **Actual Trading**
   - Trading UI built
   - Backend integration needed
   - Price calculations placeholder

3. **Real-Time Updates**
   - Currently static data
   - WebSocket integration planned
   - Polling mechanism alternative

4. **Notifications**
   - No notification system yet
   - Toast messages for actions
   - Email notifications planned

5. **User Profiles**
   - Creator profiles minimal
   - Full profile pages planned
   - Portfolio view needed

### Planned Enhancements

1. **Advanced Search**
   - Filters within search
   - Search history
   - Saved searches

2. **Analytics Dashboard**
   - Chain performance metrics
   - Holder analytics
   - Transaction patterns

3. **Mobile App**
   - Native mobile version
   - Mobile-optimized flows
   - Push notifications

4. **Multi-language Support**
   - i18n framework
   - Language selector
   - Localized content

---

## Testing Checklist

### User Flows to Validate

- [ ] Complete launch flow with all steps
- [ ] Save draft and resume later
- [ ] Publish chain and verify it appears in launchpad
- [ ] Edit published chain as owner
- [ ] Search for chains, transactions, blocks
- [ ] Navigate transaction → block → transaction
- [ ] Filter and sort on launchpad
- [ ] Switch between grid and list views
- [ ] View all chain states (draft, virtual, countdown, graduated)
- [ ] Open and close detail sheets
- [ ] Copy hashes and addresses to clipboard
- [ ] Access via direct URLs (transaction/block pages)

### Validation Testing

- [ ] All required field validations
- [ ] Format validations (URLs, hex, etc.)
- [ ] Character limits enforced
- [ ] Numeric range validations
- [ ] Unique constraint validations
- [ ] Error messages clear and helpful

### Auto-Save Testing

- [ ] Data persists across page refresh
- [ ] LocalStorage cleared on publish
- [ ] Draft recovery works correctly
- [ ] Last saved timestamp updates
- [ ] No data loss on network interruption

### Edge Cases

- [ ] Empty states render correctly
- [ ] Error states show appropriate messages
- [ ] Loading states smooth transitions
- [ ] No chains, no results, no data states
- [ ] Invalid URLs handled gracefully
- [ ] Missing data shows placeholders

---

## Product Questions for Discussion

### User Experience

1. Should we allow editing ticker symbol after publish? (Currently restricted)
2. What happens if user wants to delete a published chain?
3. Should countdown phase allow trading or pause it?
4. How do we handle chains that never reach graduation?
5. Should we show creator controls in a separate menu vs inline?

### Data & Validation

1. What are the minimum/maximum values for tokenomics?
2. Should we validate repository exists on GitHub?
3. How do we prevent duplicate chain names/tickers?
4. What if genesis hash format varies by language?
5. Should we auto-calculate some tokenomics fields?

### Trading & Economics

1. What happens to liquidity pool at graduation?
2. How do we handle slippage for bonding curve trades?
3. Should we show price charts in virtual phase?
4. What trading restrictions during countdown?
5. How do we migrate holders to mainnet?

### Search & Discovery

1. Should search include creator names?
2. Do we need category/tag filtering?
3. Should we show trending chains section?
4. How do we promote newly launched chains?
5. Should we have "Following" feature for chains?

### Technical Considerations

1. How do we index transactions/blocks for search?
2. What's the pagination strategy for Explorer?
3. Do we need real-time price updates?
4. How do we handle high transaction volume chains?
5. What's the plan for scaling block/transaction data?

---

## Appendix: Feature Completion Status

### ✅ Fully Implemented

- Launchpad with filter/sort
- Grid and list views
- Launch flow (all 7 steps)
- Draft save/resume
- Chain detail (all states)
- Trading panel UI
- Explorer tab with blocks/transactions
- Block detail sheet
- Transaction detail sheet
- Transaction detail page
- Block detail page
- Global search (⌘K)
- Recent searches
- Auto-save functionality
- Form validation
- Edit mode for owners

### 🚧 Partially Implemented

- Trading execution (UI only)
- Wallet connection (placeholder)
- Real-time updates (static data)
- Analytics (basic metrics only)

### 📋 Planned

- Notifications system
- User profiles
- Advanced analytics
- Mobile optimization
- Multi-language support
- Report issue system

---

## Document Version

**Version:** 1.0
**Last Updated:** January 2025
**Status:** Ready for Product Review

**Next Steps:**
1. Product team review and feedback
2. Design team visual polish
3. User testing sessions
4. Wallet integration (Rafa)
5. Backend API integration
6. Production deployment planning

---

*This document represents the current state of implementation. All features described are functional in the codebase as wireframes. Screenshots to be added at marked positions.*
