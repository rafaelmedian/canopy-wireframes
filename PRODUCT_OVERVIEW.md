# Canopy Launcher - Product Overview

## Introduction

This document describes the design and user flows for key pages of the Canopy Launcher platform. These screens have been implemented as high-fidelity wireframes to facilitate product discussions and identify edge cases before final design and development.

**What's Documented:**
- Launchpad (home page with chain listings)
- Global search functionality
- Chain launch flow (7-step wizard)
- Chain detail pages (multiple states)
- Transaction & block explorer pages
- Report functionality
- Wallet functionality (connection, creation, funding, staking, and portfolio management)

---

## Table of Contents

1. [Launchpad (Home)](#1-launchpad-home)
2. [Global Search](#2-global-search)
3. [Chain Launch Flow](#3-chain-launch-flow)
4. [Chain Detail Pages](#4-chain-detail-pages)
5. [Transaction & Block Explorer](#5-transaction--block-explorer)
6. [Report an Issue](#6-report-an-issue)
7. [Wallet](#7-wallet)

---

## 1. Launchpad (Home)

**Live Example:** https://canopy-wireframes.vercel.app/

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

**Example Public Chain:**
- https://canopy-wireframes.vercel.app/chain/onchain-ens

![Launchpad grid view with milestone badges](public/imgs/launchpad-grid-view.png)

![Launchpad list view with all columns](public/imgs/launchpad-list-view.png)

![Filter and sort controls](public/imgs/filter-and-sort-controls.png)

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

![Search dialog with recent searches](public/imgs/search-dialog-recent-searches.png)

![Search results showing chains](public/imgs/search-results-chains.png)

![Search results showing transactions and blocks](public/imgs/search-results-transactions-blocks.png)

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

![Launch overview dialog](public/imgs/launch-overview-dialog.png)

---

### Step 1: Language Selection

**Live Example:** https://canopy-wireframes.vercel.app/launchpad/language

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

![Language selection screen](public/imgs/language-selection-screen.png)

---

### Step 2: Repository Connection

**Live Example:** https://canopy-wireframes.vercel.app/launchpad/repository

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

![Repository connection screen - Initial state](public/imgs/repository-connection-initial.png)

![GitHub authentication flow](public/imgs/github-authentication-flow.png)

![Repository selection list](public/imgs/repository-selection-list.png)

![Connected repository state](public/imgs/connected-repository-state.png)

---

### Step 3: Chain Configuration

**Live Example:** https://canopy-wireframes.vercel.app/launchpad/configure

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

![Configuration form - basic info section](public/imgs/configuration-form-basic-info.png)

---

### Step 4: Branding

**Live Example:** https://canopy-wireframes.vercel.app/launchpad/branding

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

![Branding screen with logo upload](public/imgs/branding-screen-logo-upload.png)

![Gallery upload with optional badge](public/imgs/gallery-upload-optional-badge.png)

---

### Step 5: Links & Social Media

**Live Example:** https://canopy-wireframes.vercel.app/launchpad/links

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

![Social links with platform selector](public/imgs/social-links-platform-selector.png)

---

### Step 6: Settings & Tokenomics

**Live Example:** https://canopy-wireframes.vercel.app/launchpad/settings

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

![Graduation threshold card](public/imgs/graduation-threshold-card.png)

---

### Step 7: Review & Launch

**Live Example:** https://canopy-wireframes.vercel.app/launchpad/review

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

![Review screen - Language & Repository card](public/imgs/review-screen-language-repository.png)

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

**Live Example:** https://canopy-wireframes.vercel.app/chain/draft-chain

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

![Draft chain header with breadcrumb and more menu](public/imgs/draft-chain-header-breadcrumb.png)

---

### State 2: Virtual Chain (Public View)

**Live Example:** https://canopy-wireframes.vercel.app/chain/my-chain

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

![Virtual chain with price chart and metrics](public/imgs/virtual-chain-price-chart-metrics.png)

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

![Review countdown panel with circular timer](public/imgs/review-countdown-panel-timer.png)

---

### State 4: Graduated Chain (Mainnet)

**Live Example:** https://canopy-wireframes.vercel.app/chain/graduated-chain

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

![Graduated chain with metric selector](public/imgs/graduated-chain-metric-selector.png)

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

**Live Example:** https://canopy-wireframes.vercel.app/transaction/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1a9d2f4e6c8a0b2d4e6c8a0b2

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

![Transaction detail page](public/imgs/transaction-detail-page.png)

---

### Block Detail Page

**Live Example:** https://canopy-wireframes.vercel.app/block/0x8f5c7d9a2b1e4f3c6a8d9e2f1b4c7a5d9e2f1b4c7a5d9e2f1b4c

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

![Block detail page - Overview](public/imgs/block-detail-page-overview.png)

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

![Report dialog with category selection](public/imgs/report-dialog-category-selection.png)

---

## Auto-Save & Data Persistence

**Note:** The auto-save functionality shown in the UI is currently a visual representation only. The actual saving mechanism is not yet implemented.

### How Auto-Save Should Work (Future Implementation)

**What Should Be Saved:**
- All form inputs in launch flow steps
- Upload progress and uploaded files
- Current step position
- Draft state

**How It Should Work:**
- Save to database on every input change (debounced to avoid excessive calls)
- Persist even if user closes browser
- Show "Last saved" timestamp in UI
- Show saving indicator when saving

**Recovery Flow:**
- When user returns to launch flow, restore their progress
- Show "Continue where you left off" prompt
- Allow user to start fresh or resume from saved state
- Draft chains stored in database

**Clearing Saved Data:**
- Successful publish should clear draft data
- Delete draft should clear all associated data
- "Start fresh" option should clear saved progress

---

## 7. Wallet

Cross-chain wallet system for managing assets, staking, and transactions across the Canopy ecosystem.

### Overview

The wallet implementation provides a complete solution for wallet creation, connection, funding, asset management, and staking functionality. It integrates with the launchpad and chain pages to enable seamless token transactions.

**Access Points:**
- Wallet icon in sidebar (globally accessible)
- Opens wallet sheet (sidebar overlay)
- Dedicated `/wallet` page for full view
- Buy buttons in wallet sheet and full wallet page open funding dialog

---

### Authentication & Connection

**Live Example:** Click "Connect Wallet" button in sidebar

Email-based authentication system with OTP verification.

**Demo User Accounts:**

Two test accounts are available for demo purposes:

1. **User with Funds:**
   - Email: `withfunds@email.com`
   - Has existing wallet: Yes
   - Wallet address: `0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199`
   - Total balance: $12,458.32
   - Assets: 5 different tokens (OENS, GAME, SOCL, STRM, DFIM)
   - Active stakes: 2 positions
   - Transaction history: 6 transactions

2. **User without Wallet:**
   - Email: `nofunds@email.com`
   - Has existing wallet: No
   - Goes through full wallet creation flow
   - Shows empty states after creation

**OTP Verification:**
- Demo verification code: `1111`
- Any other code will show error

**Email Validation:**
- Only accepts `withfunds@email.com` or `nofunds@email.com`
- Other emails show error: "Please use a valid email for the demo: withfunds@email.com or nofunds@email.com"

**Connection Dialog Steps:**

The WalletConnectionDialog component handles a 7-step flow:

**Step 1: Email Entry**
- Input field for email address
- "Continue" button (disabled if email invalid)
- "Login with Seed Phrase" alternative option
- Close button (X) returns to previous page

**Step 1.5: Login with Seed Phrase** (Optional alternative path)
- 12-word seed phrase input grid
- Each word in separate input field
- Accepts any 12 filled words (demo mode)
- "Login" button connects wallet immediately
- Back button returns to Step 1

**Step 2: OTP Verification**
- Four-digit code input (one digit per box)
- Auto-focus next input on entry
- Backspace moves to previous input
- "Resend code" button shows toast
- "Continue" button with loading states:
  - Normal state: "Continue"
  - Verifying: "Verifying..." with spinner
  - Success: "Verified!" with checkmark (1.5s)
- After verification:
  - If user has wallet (withfunds@email.com): Connects immediately and closes dialog
  - If user has no wallet (nofunds@email.com): Proceeds to Step 3

**Step 3: Wallet Setup** (Only for users without wallet)
- Title: "No Canopy Wallet Found for {email}"
- Two action buttons:
  - "Import Keyfile" (disabled, not implemented)
  - "Create Wallet" button with states:
    - Normal: "Create Wallet"
    - Creating: "Creating wallet..." with spinner (3s)
    - Success: "Wallet Created" with checkmark
- After 1.5s success state, proceeds to Step 3.1

**Step 3.1: Secure Your Wallet - Seed Phrase Display**
- Shows 12-word recovery phrase in 2-column grid
- Each word numbered (1-12)
- Warning card with yellow background:
  - Title: "Never Share Your Recovery Phrase"
  - Warning text about security
- "I've Written It Down" button proceeds to Step 3.2

**Step 3.2: Verify Seed Phrase**
- Two verification questions
- Each asks "What is word #X?"
- Four options per question (radio buttons)
- Must answer both correctly to proceed
- Incorrect answers show error toast
- "Continue" button (disabled until both answered)
- After correct verification, connects wallet and proceeds to Step 3.3

**Step 3.3: Wallet Created - Fund or Skip**
- Success message: "Wallet Created!"
- Shows wallet address with copy button
- Two action buttons:
  - "Fund Wallet" → Proceeds to Step 4
  - "Do It Later" → Connects wallet with $0 balance and closes dialog

**Step 4: Connect Wallets to Fund**
- Title: "Connect Your Wallets"
- Subtitle: "Connect wallets fund your account"
- Three wallet connection options:

  **Solana Wallet:**
  - Label: "Solana Wallet"
  - Shows "Connect Solana Wallet" card when disconnected
  - Available providers: MetaMask, WalletConnect
  - When connected:
    - Shows provider name
    - Displays balances (USDT, USDC)
    - Green checkmark icon
    - Disconnect button (X)

  **EVM Wallet:**
  - Label: "EVM Wallet"
  - Shows "Connect EVM Wallet" card when disconnected
  - Available providers: MetaMask, WalletConnect
  - When connected:
    - Shows provider name
    - Multi-chain indicator
    - Green checkmark icon
    - Disconnect button (X)

  **Fund via Transfer:**
  - Shows Canopy wallet address
  - Copy button for address
  - Text: "Transfer CNPY from another Canopy Wallet"

- "Continue" button (disabled until at least one wallet connected)
- Mock connection: Automatically creates balances (USDT: 100.50, USDC: 50.25)

**Step 5: Choose Fund Source**
- Title: "Choose Fund Source"
- Subtitle: "Select which token you want to convert to CNPY"
- Balance summary card:
  - Shows "Balance Available"
  - Large display: Total balance from selected wallet
  - Wallet selector dropdown:
    - Shows currently selected wallet (provider name + address)
    - Dropdown to switch between connected wallets
    - Each option shows total balance
  - Token list with radio buttons:
    - Each token shows: Icon, name, balance, USD value
    - Radio button for selection
    - Default: First token auto-selected
- "Continue" button proceeds to Step 6

**Step 6: Convert to CNPY**
- Title: "Convert to CNPY"
- Large amount input:
  - Placeholder: "$0"
  - Center-aligned, large font (5xl)
  - Accepts decimal values
- Shows available balance and wallet address
- "Use max" button fills maximum amount
- Swap direction arrow (decorative)
- Conversion result card:
  - Shows CNPY logo
  - Displays converted amount (1:1 ratio)
  - Shows USD value
- "Convert to CNPY" button with states:
  - Normal: "Convert to CNPY"
  - Converting: "Converting..." with spinner (2s)
  - Success: "Converted!" with checkmark
- Exchange rate display: "1 USD = 1 CNPY"
- After conversion, proceeds to Step 7

**Step 7: Success - Wallet Funded**
- Title: "Wallet Funded!"
- Subtitle: "Your Canopy wallet is ready. You can now buy into projects."
- Balance card:
  - Shows converted amount
  - Displays "CNPY" label
  - Funded source information (token used, amount)
- Two action buttons:
  - "Start Buying Projects" → Connects wallet with funded data and closes dialog
  - "Add More Funds" → Returns to Step 4

**Wallet Data Creation on Completion:**

When user completes funding (Step 7), the following data is created and saved to localStorage:

```javascript
{
  totalValue: convertedAmount,  // The amount user entered
  assets: [
    {
      id: 1,
      chainId: 1,
      symbol: 'CNPY',
      name: 'Canopy',
      balance: convertedAmount,
      price: 1,
      value: convertedAmount,
      change24h: 0,
      color: '#1dd13a'
    }
  ],
  transactions: [
    {
      id: 1,
      type: 'received',
      symbol: 'CNPY',
      amount: convertedAmount,
      timestamp: currentDate,  // e.g., "Jan 15, 2025"
      status: 'completed',
      hash: '0x...' // Random 40-character hex
    }
  ],
  stakes: [
    {
      id: 1,
      chainId: 1,
      symbol: 'CNPY',
      chain: 'Canopy',
      amount: 0,  // Not staked yet, available to stake
      apy: 15.0,
      rewards: 0,
      color: '#1dd13a'
    }
  ],
  unstaking: [],
  earningsHistory: []
}
```

**initialStep Prop:**

The WalletConnectionDialog accepts an `initialStep` prop to open at a specific step:
- Default: `initialStep={1}` (email entry)
- Buy button usage: `initialStep={4}` (opens at Connect Wallets step)
- Resets to initialStep when dialog closes

**State Persistence:**

- Wallet connection state stored in localStorage:
  - `walletAddress`: The wallet address
  - `isWalletConnected`: Boolean connection status
  - `userEmail`: User's email address
  - `walletData`: Funded wallet data (when user completes funding)
- Loaded on page refresh/app mount
- Cleared on logout

**Wallet Context:**

Global context providing wallet state and functions:
- `isConnected`: Boolean connection status
- `walletAddress`: Current wallet address (or null)
- `currentUser`: User object (email, hasWallet, walletAddress)
- `connectWallet(email, address)`: Connect wallet
- `disconnectWallet()`: Disconnect and clear all localStorage
- `getTotalBalance()`: Returns total balance (checks funded data first, then user JSON, then default)
- `getWalletData()`: Returns wallet data (checks funded data first, then user JSON, then default)
- `updateWalletData(fundedData)`: Save funded data to state and localStorage
- `formatAddress(address)`: Format address as "0x1234...5678"
- `getUserByEmail(email)`: Fetch user object by email

---

### Wallet Sheet (Sidebar)

**Access:** Click wallet icon in sidebar

Side sheet overlay that shows wallet summary and quick actions.

**Layout:**
- Opens from left side
- Full height
- Width: `sm:max-w-[420px]`
- Three sections: Header (fixed), Tabs (scrollable), Footer (fixed)

**Header Section** (Fixed, non-scrollable):

**Wallet Identity:**
- Canopy logo avatar (green circle with "C")
- Wallet address (formatted: "0x8626...1199")
- Copy button (copies full address to clipboard)
- Connection status: "Connected" in green text

**Total Balance Display:**
- Label: "Estimated Balance" with chevron icon
- Clickable → Navigates to `/wallet` page
- Large balance display: "$12,458.32" (formatted with 2 decimals)

**Quick Action Buttons:**
- 4-column grid layout
- Each button shows icon + label:
  1. **Swap:** Repeat icon, "Swap" label (no functionality)
  2. **Buy:** Download icon, "Buy" label → Opens WalletConnectionDialog at step 4
  3. **Send:** Send icon, "Send" label (no functionality)
  4. **Stake:** Coins icon, "Stake" label → Opens StakeDialog

**Tabs Section** (Scrollable):

**Two tabs:** Balances, Activity

**Balances Tab:**
- Empty state (when no assets):
  - Wallet icon in muted circle
  - Heading: "No assets yet"
  - Description: "Start your blockchain journey by creating or investing in chains on the launchpad."
  - "Go to Launchpad" button → Navigates to `/`

- With assets:
  - Section header: "TOP ASSETS" with "VIEW ALL" link → Navigates to `/wallet`
  - Shows top 5 assets only
  - Each asset card (clickable):
    - Token avatar (colored circle with symbol initial)
    - Token name and symbol
    - Balance: "{amount} {symbol}"
    - Price: "${price}" (per token)
    - Value: "${total value}" (balance × price)
    - Click → Navigates to chain detail page

**Activity Tab:**
- Empty state (when no transactions):
  - Activity icon in muted circle
  - Heading: "No activity yet"
  - Description: "Start your blockchain journey by creating or investing in chains on the launchpad."
  - "Go to Launchpad" button → Navigates to `/`

- With transactions:
  - Shows ActivityTab component in compact mode
  - No search or filters (compact=true)
  - Click transaction → Opens TransactionDetailSheet

**Footer Section** (Fixed, non-scrollable):

Two buttons:
1. **Wallet settings:** Ghost button with Settings icon (no functionality)
2. **Disconnect wallet:** Ghost button with LogOut icon in red
   - On click:
     - Navigates to `/` (home)
     - After 100ms delay, calls `disconnectWallet()`
     - Clears all localStorage (walletAddress, isWalletConnected, userEmail, walletData)

**Dialogs:**
- StakeDialog: Opens when clicking Stake button or asset
- WalletConnectionDialog: Opens when clicking Buy button (initialStep={4})

---

### Full Wallet Page

**Live Example:** Click "Estimated Balance" in wallet sheet, or navigate to `/wallet`

Full-page wallet view with complete portfolio management.

**Layout:**
- Sidebar navigation (MainSidebar)
- Main content area (max-width: 1024px)
- Two-column layout:
  - Left: Main content (tabs)
  - Right: Quick Actions sidebar (fixed position)

**Wallet Header:**

**Wallet Identity:**
- Canopy logo avatar (green circle with "C")
- Wallet address (formatted)
- Copy button
- Connection status: "Connected" in green

**Header Actions:**
- Settings button (icon only, no functionality)
- Disconnect button (icon only):
  - Red color on hover
  - On click:
    - Navigates to `/` (home)
    - After 100ms delay, calls `disconnectWallet()`

**Tabs:**

Four tabs with URL query parameter tracking (`?tab=assets`):
1. Assets
2. Staking
3. Activity
4. Governance (not implemented, empty tab)

**Tab behavior:**
- Active tab synced with URL (`?tab=assets`, `?tab=staking`, etc.)
- Clicking tab updates URL
- URL change updates active tab
- Page scrolls to top on load

---

### Assets Tab

Complete portfolio view with chart and asset table.

**Portfolio Chart Card:**

**Estimated Balance Header:**
- Label: "Estimated Balance"
- Large balance display: "$12,458.32"
- Secondary display: "≈ $12458.32" in muted text
- Today's PnL:
  - Label: "Today's PnL"
  - Value: "-$12.46(0.10%)" in red/green
  - Calculated as: `totalValue * 0.001`

**Chart Section:**
- Time period selector (top-right):
  - Buttons: 1H, 1D, 1W, 1M, 1Y
  - Active period highlighted
  - Default: 1D
- Line chart (Recharts):
  - Orange gradient line (#f59e0b)
  - Shows portfolio value over time
  - Data points vary by period:
    - 1H: 12 points (5-minute intervals)
    - 1D: 12 points (2-hour intervals)
    - 1W: 7 points (daily)
    - 1M: 10 points (3-day intervals)
    - 1Y: 12 points (monthly)
  - Mock data: Random variation around total value (±10%)
  - Grid lines (horizontal only)
  - No Y-axis labels
  - Tooltip shows time and value

**Search:**
- Search input with magnifying glass icon
- Placeholder: "Search assets..."
- Filters by asset name or symbol (case-insensitive)
- Real-time filtering as user types

**Assets Table:**

**Sortable columns** (click header to sort):
1. **Chain:**
   - Token avatar (colored circle)
   - Symbol (bold)
   - Name (muted)
   - Sortable by name

2. **Amount:**
   - Total value: "$5,606.24" (bold)
   - Balance: "2,500 OENS" (muted)
   - Sortable by value (default sort)

3. **24H Change:**
   - Mini sparkline chart (12px × 6px)
   - Percentage: "+3.2%" or "-2.3%"
   - Green for positive, red for negative
   - Chart color matches percentage color
   - Sortable by change percentage

4. **Price:**
   - Price per token: "$2.2426"
   - 4 decimal places
   - Sortable by price

**Sort Behavior:**
- Default: Sort by value (desc)
- Click header to sort by that column
- Click again to toggle asc/desc
- Arrow icon indicates sortable columns

**Row Interaction:**
- Entire row is clickable
- Hover: Background changes to muted
- Click: Navigates to chain detail page
- Uses `getChainById(asset.chainId)` to find route

**Empty State:**
- Shows when search returns no results
- Search icon in muted circle
- Text: "No assets found"
- Subtext: "Try searching with a different asset name or symbol"

**Data Structure:**

Each asset contains:
```javascript
{
  id: 1,
  chainId: 1,           // Links to chain in db.js
  symbol: "OENS",
  name: "Onchain ENS",
  balance: 2500,        // Token amount
  price: 2.24256,       // Price per token
  value: 5606.24,       // balance × price
  change24h: 3.2,       // Percentage change
  color: "#10b981",     // Token brand color
  priceHistory: [       // For mini chart
    { price: 0.80 },
    { price: 0.95 },
    // ... 8 data points total
  ]
}
```

---

### Staking Tab

Complete staking interface with rewards, active stakes, and unstaking queue.

**Total Interest Earned Card:**

**Header:**
- Label: "Total interest earned to date"
- Large balance: "$10.50" (sum of all rewardsUSD from earningsHistory)
- Unit: "USD" in muted text
- Info text: "Earn up to 8.05% APY on your crypto. Redeem any time."
- Info icon with tooltip:
  - "Annual Percentage Yield (APY) varies by asset and network conditions."
  - "You can unstake and withdraw your funds at any time."

**Action:**
- "View Earned Balances" button → Opens EarningsHistorySheet

**Three Tabs:**

Tabs show badge count:
1. **Rewards:** Available chains to stake
2. **Active Stakes (2):** Currently staked positions
3. **Unstaking Queue (1):** Pending unstakes

---

**Rewards Tab** (Available chains to stake):

Table with sortable columns:

**Columns:**
1. **Chain:**
   - Token avatar
   - Chain name (bold)
   - Symbol (muted)

2. **Annual yield** (sortable):
   - APY percentage: "12.5%"
   - Default sort column (desc)

3. **Current Earned Balance** (sortable):
   - If earning:
     - Rewards: "2.15 OENS"
     - USD value: "4.82 USD" (muted)
   - If not earning:
     - "Not yet earning" (muted)

4. **Actions:**
   - "Claim" button (if rewards > 0) → Opens ClaimDialog
   - "Stake" button → Opens StakeDialog

**Behavior:**
- Shows all stakes (amount: 0 means available but not staked)
- Sortable by APY (default) or earnings
- Click "Stake" → Opens StakeDialog with selected chain
- Click "Claim" → Opens ClaimDialog with selected stake

---

**Active Stakes Tab:**

Shows only stakes with `amount > 0` (excluding fully unstaked).

**Columns:**
1. **Chain:** Avatar + name + symbol
2. **Staked Amount:**
   - Token amount: "500 OENS"
   - USD value: "$1,121.28" (calculated: amount × asset.price)
3. **APY:** Percentage
4. **Rewards Earned:**
   - Token amount: "2.15 OENS"
   - USD value: "$4.82 USD" (if > 0)
5. **Actions:**
   - "Unstake" button → Opens UnstakeDialog

**State Management:**
- Tracks unstaked chains in `unstakedChainIds` state
- Tracks partial unstakes in `stakeAdjustments` state
- When fully unstaked: Hidden from active stakes
- When partially unstaked:
  - Amount reduced by unstaked amount
  - Rewards reset to 0
  - Still shows in table with new amount

**Empty State:**
- Checkmark icon in muted circle
- Text: "No active stakes"
- Subtext: "Start staking to earn rewards"

---

**Unstaking Queue Tab:**

Shows pending unstakes (7-day unstaking period).

**Columns:**
1. **Chain:**
   - Avatar + symbol
   - "Pending" badge
2. **Amount:** Token amount
3. **Available In:** "5 days, 3 hours"
4. **Actions:**
   - "View Details" → Opens UnstakingDetailSheet
   - "Cancel" → Opens CancelUnstakeDialog

**Unstaking Items:**
- Combines original `unstaking` data + new items from `newUnstakingItems` state
- Filters out canceled items (tracked in `canceledUnstakeIds`)
- Each unstake has 7-day countdown
- Cancel restores to active stake (adds to `canceledUnstakeIds`)

**Empty State:**
- Checkmark icon in muted circle
- Text: "No pending unstakes"
- Subtext: "Unstaked funds will appear here during the unstaking period"

---

**Staking Dialogs:**

**StakeDialog:**
- Select chain (dropdown if not pre-selected)
- Shows available balance from assets
- Enter amount to stake
- Shows APY
- "Stake" button (demo only, no actual transaction)

**ClaimDialog:**
- Shows rewards amount
- Shows USD value
- "Claim Rewards" button (demo only)
- Success state after claiming

**UnstakeDialog:**
- Shows staked amount
- Select amount or percentage to unstake (25%, 50%, 75%, 100%)
- Enter custom amount
- Warning: 7-day unstaking period
- "Unstake" button
- On success:
  - Calls `onUnstakeSuccess(stake, amount)`
  - Updates state (full or partial unstake)
  - Adds to unstaking queue

**UnstakingDetailSheet:**
- Side sheet showing unstake details
- Chain information
- Amount unstaking
- Time remaining
- "Cancel Unstake" button

**CancelUnstakeDialog:**
- Confirmation dialog
- Warning: "This will return your funds to active staking"
- "Cancel Unstake" and "Keep Unstaking" buttons
- On confirm: Adds to `canceledUnstakeIds`

**EarningsHistorySheet:**
- Side sheet showing daily earnings
- Grouped by date (Today, Yesterday, dates)
- Each day shows:
  - Date header
  - List of earnings by chain
  - Chain avatar + symbol
  - Token amount + USD value
- Scrollable list

---

### Activity Tab

Transaction history with filtering and detail sheets.

**Filters** (Three dropdown menus):

**Type Filter:**
- Options: Sent, Received, Swap, Staked, Unstaked, Claimed
- Multi-select (checkboxes)
- Button label:
  - No selection: "Type"
  - One selected: Shows type name (e.g., "Sent")
  - Multiple: "Type (2)"

**Status Filter:**
- Options: Completed, Pending
- Multi-select
- Button label same pattern as Type

**Asset Filter:**
- Options: All token symbols from transactions
- Multi-select
- Shows token avatar in dropdown
- Button label same pattern

**Reset Filters:**
- Shows when any filter active
- Link button: "Reset filters"
- Clears all selections

**Transaction List:**

**Table Headers** (not shown in compact mode):
- Details
- Amount
- Date

**Each Transaction Row:**

**Details Column:**
- Token avatar (colored circle with first letter)
- Transaction type badge (bottom-right corner):
  - Sent: ArrowUpRight icon
  - Received: ArrowDownLeft icon
  - Swap: Repeat icon
  - Staked: TrendingUp icon
  - Unstaked: TrendingDown icon
  - Claimed: CheckCircle icon
- Type text:
  - "Sent OENS"
  - "Received GAME"
  - "Swapped OENS to SOCL"
  - "Staked OENS"
  - "Unstaked OENS"
  - "Claimed OENS"

**Amount Column:**
- Primary: USD value with +/- sign
  - Send: "-$111.28"
  - Receive: "+$865.16"
  - Swap: "$224.26" (no sign)
- Secondary: Token amount
  - Send: "-50 OENS"
  - Receive: "+125 GAME"
  - Swap: "100 OENS → 45 SOCL"

**Date Column:**
- Relative time: "2 hours ago", "Yesterday", "3 days ago"

**Row Interaction:**
- Entire row clickable
- Hover: Background changes to muted
- Click: Opens TransactionDetailSheet

**Empty States:**

**No transactions at all:**
- Activity icon in muted circle
- Heading: "No activity yet"
- Description: "Start your blockchain journey by creating or investing in chains on the launchpad."
- "Go to Launchpad" button

**No results after filtering:**
- Text: "No transactions found"
- Subtext: "Try adjusting your filters"

**TransactionDetailSheet:**

Side sheet showing full transaction details:

**Header:**
- Title: "Transaction Details"
- Close button

**Content:**
- Transaction Hash: Full hash with copy button
- Status badge: Success (green), Pending (yellow), Failed (red)
- Timestamp: Relative + absolute
- Block Number: Clickable → Opens block detail page
- From Address: Full address with copy button
- To Address: Full address with copy button
- Amount: With token symbol
- Transaction Fee: With token symbol (or "< 0.001" if minimal)

**Compact Mode** (used in wallet sheet):
- No table headers
- No filter UI
- Just transaction list
- Same row layout and click behavior

**Transaction Data Structure:**

```javascript
{
  id: 1,
  type: "sent",           // sent, received, swap, staked, unstaked, claimed
  symbol: "OENS",         // For single token txs
  amount: -50,            // Negative for send/stake
  timestamp: "2 hours ago",
  status: "completed",    // completed, pending
  hash: "0x1a2b...",
  from: "0xYour...",
  to: "0xRecip...",
  fee: 0.0012,
  // For swap transactions:
  symbolFrom: "OENS",
  symbolTo: "SOCL",
  amountFrom: 100,
  amountTo: 45,
  // For staking transactions:
  apy: 12.5,              // (staked only)
  rewards: 2.15           // (unstaked only)
}
```

---

### Quick Actions Sidebar

**Location:** Right sidebar on `/wallet` page

**Position:**
- Fixed position (sticky top-4)
- Width: 64 (256px)
- Padding top: 158px (aligns below wallet header)

**Card Content:**

**Header:**
- Title: "Quick Actions"

**4-Button Grid** (2×2):

1. **Send:**
   - Send icon
   - Label: "Send"
   - No functionality

2. **Buy:**
   - Download icon
   - Label: "Buy"
   - Opens WalletConnectionDialog at step 4

3. **Swap:**
   - Repeat icon
   - Label: "Swap"
   - No functionality

4. **Stake:**
   - Coins icon
   - Label: "Stake"
   - Opens StakeDialog

**Button Style:**
- Outline variant
- Flex column layout (icon above text)
- Padding: py-4
- Gap between icon and text

---

### Data Structure & Persistence

**User Data** (`/src/data/users.json`):

```javascript
{
  "users": [
    {
      "email": "withfunds@email.com",
      "hasWallet": true,
      "walletAddress": "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"
    },
    {
      "email": "nofunds@email.com",
      "hasWallet": false,
      "walletAddress": null
    }
  ]
}
```

**Wallet Data** (`/src/data/wallet.json`):

Keyed by user email:

```javascript
{
  "withfunds@email.com": {
    "totalValue": 12458.32,
    "change24h": 5.2,
    "assets": [ /* array of assets */ ],
    "stakes": [ /* array of stake positions */ ],
    "unstaking": [ /* array of pending unstakes */ ],
    "transactions": [ /* array of transactions */ ],
    "earningsHistory": [ /* array of daily earnings */ ]
  },
  "nofunds@email.com": {
    "totalValue": 0,
    "assets": [],
    "stakes": [],
    "unstaking": [],
    "transactions": [],
    "earningsHistory": []
  }
}
```

**LocalStorage Keys:**

When wallet is connected:
- `walletAddress`: Wallet address string
- `isWalletConnected`: "true" or not present
- `userEmail`: User's email
- `walletData`: JSON string of funded wallet data (if user completed funding)

**Wallet Context Priority:**

When loading wallet data:
1. First checks `fundedWalletData` (from localStorage or state)
2. If not found, checks `walletDataByUser[currentUser.email]`
3. If not found, defaults to `walletDataByUser['withfunds@email.com']`

When user completes funding flow:
1. Creates wallet data object with funded amount
2. Saves to state via `setFundedWalletData(data)`
3. Saves to localStorage via `localStorage.setItem('walletData', JSON.stringify(data))`
4. Persists across page refreshes
5. Cleared on logout

---

### Features Not Implemented

The following features from the wallet PRD are **not implemented**:

**Transaction Actions:**
- Send: Button present but no functionality
- Receive: Not implemented
- Swap: Button present but no functionality (Swap tab in trading panel not implemented)
- Actual Buy functionality: Dialog flow implemented but no real transaction/API calls

**Wallet Settings:**
- Settings button present but no functionality
- No password change
- No keyfile export
- No connected wallets management
- No notification preferences

**Governance:**
- Tab exists but completely empty
- No proposal voting
- No governance token staking
- No proposal creation

**Additional Missing Features:**
- Real-time balance updates (static demo data)
- Token price charts (only portfolio chart)
- Multi-chain support (chains from launchpad, but no real blockchain integration)
- Hardware wallet support
- Transaction detail modal partially implemented (sheet only)
- Actual blockchain transactions (all demo/mock)
- Real wallet providers integration (MetaMask/WalletConnect UI only)
- Seed phrase import functionality (UI present, accepts any 12 words)
- Keyfile import (button disabled)

---

### Components Structure

**Main Components:**
- `/src/components/wallet-connection-dialog.jsx` - 7-step wallet connection/creation flow
- `/src/pages/wallet/index.jsx` - Full wallet page with tabs
- `/src/pages/wallet/components/wallet-sheet.jsx` - Sidebar wallet overlay
- `/src/contexts/wallet-context.jsx` - Global wallet state management

**Wallet Page Components:**
- `assets-tab.jsx` - Portfolio chart and assets table
- `staking-tab.jsx` - Staking management with 3 tabs
- `activity-tab.jsx` - Transaction history with filters

**Staking Components:**
- `stake-dialog.jsx` - Stake tokens dialog
- `unstake-dialog.jsx` - Unstake tokens dialog
- `claim-dialog.jsx` - Claim rewards dialog
- `unstaking-detail-sheet.jsx` - Unstaking details side sheet
- `cancel-unstake-dialog.jsx` - Cancel unstake confirmation
- `earnings-history-sheet.jsx` - Daily earnings history

**Activity Components:**
- `transaction-detail-sheet.jsx` - Transaction details side sheet

**Data Files:**
- `/src/data/users.json` - User accounts (2 demo users)
- `/src/data/wallet.json` - Wallet data keyed by email

---

### Integration Points

**Sidebar Integration:**
- Wallet icon in MainSidebar
- Shows balance when connected
- Opens wallet sheet on click

**Launchpad Integration:**
- Empty states link to launchpad
- Asset rows link to chain detail pages
- Buy buttons open funding dialog

**Chain Detail Pages:**
- Trading panel has "Connect Wallet" placeholder
- Will integrate with wallet context when implemented

**Navigation:**
- `/wallet` - Full wallet page
- `/wallet?tab=assets` - Assets tab
- `/wallet?tab=staking` - Staking tab
- `/wallet?tab=activity` - Activity tab
- `/wallet?tab=governance` - Governance tab (empty)

---

