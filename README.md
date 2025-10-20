# Canopy Launcher

A modern web application for launching blockchain networks on the Canopy ecosystem with minimal technical barriers.

## 🚀 Overview

Canopy Launcher provides a streamlined, user-friendly interface for deploying blockchain networks. It guides users through a simple 8-step process from selecting a programming language to launching their own chain - all in under 10 minutes.

## ✨ Features

### Implemented Features ✅

#### Launch Chain Workflow
- **Launch Overview Dialog**:
  - Modal dialog triggered from homepage or sidebar "Create L1 chain" button
  - Shows 5 key requirements for launching a blockchain
  - Clean design with icons, descriptions, and time estimate
  - No routing - appears as overlay on any page
- **Template-Based Chain Creation**: Pre-configured templates for Python, Go, Rust, and TypeScript
- **GitHub Integration**: Direct repository connection and forking workflow
- **Language Selection**: Visual language picker with devicon library icons
- **Chain Configuration**:
  - Token name, ticker (3-5 chars), and chain name
  - Token supply (1B fixed)
  - Halving schedule (customizable in days)
  - Block time selection (5s to 5min)
  - Real-time calculation of yearly token emission
- **Branding & Media**:
  - Logo upload (PNG/JPG, 1000×1000px recommended)
  - Brand color picker with hex input
  - Description textarea (20-500 chars, mandatory)
  - Gallery upload supporting images and videos
  - Carousel navigation with horizontal scrolling
  - Drag-and-drop thumbnail reordering
  - Editable file names
- **Links & Documentation**:
  - Dynamic social media links (Website, Twitter/X, Telegram, Discord, GitHub, Medium, Reddit, LinkedIn)
  - Platform-specific icons for each social link
  - Add/remove social platforms with validation (min. 1 required)
  - Optional whitepapers section with unified list
  - File upload (PDF, DOC, DOCX) and URL support
  - Metadata fetching for whitepaper URLs
- **Launch Settings**:
  - Fixed graduation threshold display ($50,000)
  - Virtual chain to real chain graduation explanation
  - Optional initial purchase in CNPY tokens
  - "Why should I buy?" expandable information section
  - Tooltip explaining CNPY usage for initial purchase
  - 1:1 token ratio display showing tokens received
- **Review & Payment**:
  - Comprehensive summary of all configuration data
  - Organized sections: Language & Repository, Chain Details, Branding & Media, Links & Documentation, Launch Settings
  - Repository name display (not full URL)
  - Social media icons matching platform selection
  - File/URL icons for whitepapers
  - Edit buttons for each section linking back to respective steps
  - Payment summary with lighter card background
  - Important launch notice with key information
  - "Connect Wallet & Pay" button navigates to owner chain page with success banner
  - Placeholder data for demonstration ($GAME, MyGameChain, etc.)

#### Chain Detail Page
- **Main Sidebar**:
  - Sticky navigation with search and connect wallet
  - "Create L1 chain" button opens launch overview dialog (no page navigation)
- **Chain Header**:
  - Compact display with logo, name, ticker
  - Favorite button (star icon, toggles filled yellow when favorited)
  - Share button with copy-to-clipboard functionality and toast notification (hidden for draft chains)
  - Creation/edit timestamp (shows "edited" for drafts, "created" for published chains)
- **Price Chart & Analytics**:
  - Market cap display with 24h change
  - Graduation progress tracker with help icon tooltip:
    - For virtual chains: Explains virtual (test mode) → real blockchain graduation process
    - For graduated chains: Confirms chain is deployed on real blockchain
    - Shows "$50k graduated" with 100% bar for graduated chains
  - Interactive price chart with time period selection (1H, 1D, 1W, 1M, 1Y, ALL)
  - Dynamic chart data based on selected period
  - Live statistics: Volume, MCap, Virtual Liquidity, Holders
- **Tabbed Interface**:
  - **Overview**:
    - Social links with platform-specific icons (GitHub with star count)
    - For draft chains: Dimmed social link placeholders with dotted borders and tooltips
    - Project title with chain-specific tagline
    - Project description
    - Image gallery with navigation arrows and thumbnails
    - Quick Stats Grid (summary cards for Holders, Code, Block Explorer with navigation, hidden for drafts)
    - Tokenomics section with icons (Total Supply, Block Time, Halving Schedule, Blocks per Day, Year 1 Emission)
    - Whitepapers & documentation with file/URL type indicators and metadata
  - **Holders**:
    - Title: "Top Holders" (shows total count, e.g., "5,021 holders")
    - Token holder rankings sorted by balance (top 21 displayed)
    - "Among X others" divider at bottom when total holders > displayed holders
    - Truncated crypto addresses (0x742d...bEb1 format)
    - Deterministic colorful avatars based on address hash
    - Balance amounts and percentage of total supply
    - Bottom border separators between holders
  - **Code**:
    - Repository name with GitHub icon
    - Deployment status badge with tooltip:
      - "Not Deployed" (orange) for virtual chains - explains code not yet deployed to real blockchain
      - "Deployed" (green) for graduated chains - confirms code is running on real blockchain
    - GitHub statistics (stars, forks) below repository name
    - Primary language with color indicator
    - License information (MIT)
    - Repository description
    - Topic tags (blockchain, language, smart-contracts, decentralized)
  - **Block Explorer**:
    - Network statistics dashboard (Block Height, Avg Block Time, Total Transactions, Network Status)
    - Search bar for addresses, transaction hashes, and block numbers
    - Recent Blocks section with:
      - Inline search functionality (icon inside input)
      - Block number, timestamp, transaction count, block reward, hash
      - Clickable blocks opening detail sheets
      - Empty state with search icon when no results
      - "Show More" button with loading state (hidden when < 8 blocks or during search)
    - Recent Transactions section with:
      - Inline search functionality for hash/addresses
      - Transaction hash, from/to addresses, amount, status badges (Success/Pending/Failed)
      - Clickable transactions opening detail sheets
      - Empty state when no search results
      - "Show More" button with loading state (hidden when < 8 transactions or during search)
    - Transaction Detail Sheet:
      - Transaction hash with copy-to-clipboard
      - Status badge and timestamp
      - Clickable block number linking to block details
      - From/To addresses with copy buttons
      - Amount and transaction fee
    - Block Detail Sheet with tabs:
      - Overview tab: Block number, timestamp, transaction count, block reward, block hash, previous block hash (all with copy buttons)
      - Transactions tab: List of all transactions in block (clickable), dynamic counter showing actual transaction count
- **Trading Panel**: CNPY token swap interface with connect wallet integration
- **Report a Problem**:
  - Centered button at bottom of detail page
  - Dialog with 3-step flow:
    1. Choose main reason (6 categories with icons: Scam/Fraud, Inappropriate Content, Security Concerns, Misleading Information, Market Manipulation, Legal/Copyright Issues)
    2. Specify the issue (dynamic radio options based on main reason)
    3. Additional comments (optional, 500 char limit with counter)
  - Toast notifications for success/error feedback
  - Consistent form styling with launcher workflow
- **Modular Architecture**: Component-based structure for maintainability
- **Page Variants**:
  - **Owner View** (`/chain/my-chain`):
    - Newly launched chain with minimal activity (1 holder, flat price chart, "Virtual" badge)
    - Launch success banner on first visit (green gradient with rocket icon)
    - Banner shows congratulations message with Share button (copies link to clipboard)
    - Auto-scrolls to top when landing from payment flow
    - Breadcrumb shows "Launchpad / ChainName / Virtual"
  - **Draft View** (`/chain/draft-chain`):
    - Chain still in configuration (step 4 of 7)
    - Orange "Draft" badge
    - Progress panel instead of trading panel showing launch completion status
    - Empty states for Holders and Block Explorer tabs
    - No Quick Stats Grid in overview
    - Social media links shown as dimmed placeholders with tooltips
    - Share and favorite buttons hidden
    - "edited X ago" timestamp instead of "created"
    - More menu (⋮) in top-right with "Delete draft chain" option and confirmation dialog
  - **Graduated View** (`/chain/graduated-chain`):
    - Green "Graduated" badge
    - Progress bar at 100% showing "$50k graduated"
    - Higher transaction counts and holder numbers (5,021 holders showing top 21)
    - "Among X others" separator in holders list
    - Market cap above $50k threshold

#### General Features
- **Form Validation**: Inline error messages and validation for all inputs
- **Dark Mode First**: Modern, clean interface optimized for dark mode
- **Step-by-Step Guidance**: Clear workflow with progress tracking in sidebar
- **Tooltips**: Helpful explanations with crypto context and examples
- **Recharts Integration**: Beautiful, responsive charts for price visualization

## 🛠 Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **shadcn/ui** - Component library (built on Radix UI)
- **Tailwind CSS v4** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Devicon** - Programming language icons
- **Recharts** - Composable charting library for price visualization

## 📁 Project Structure

```
src/
├── components/                    # Shared/reusable components
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.jsx
│   │   ├── card.jsx
│   │   ├── dialog.jsx
│   │   ├── input.jsx
│   │   ├── label.jsx
│   │   ├── select.jsx
│   │   ├── sidebar.jsx
│   │   ├── textarea.jsx
│   │   ├── tooltip.jsx
│   │   └── ...
│   ├── launch-overview-dialog.jsx # Launch overview modal (triggered globally)
│   ├── launchpad-sidebar.jsx      # Launch workflow navigation
│   └── main-sidebar.jsx           # Main app navigation with dialog trigger
│
├── pages/                        # Page components (views)
│   ├── launch-chain/             # Launch workflow pages
│   │   ├── language-selection/
│   │   │   └── index.jsx        # Step 1: Choose language
│   │   ├── connect-repo/
│   │   │   ├── index.jsx        # Step 2: Connect GitHub
│   │   │   └── components/
│   │   │       └── github-connect-dialog.jsx
│   │   ├── configure-chain/
│   │   │   └── index.jsx        # Step 3: Configure chain & token
│   │   ├── branding/
│   │   │   ├── index.jsx        # Step 4: Add branding
│   │   │   └── components/
│   │   │       ├── logo-upload.jsx
│   │   │       └── gallery-carousel.jsx
│   │   ├── links/
│   │   │   └── index.jsx        # Step 5: Links & documentation
│   │   ├── launch-settings/
│   │   │   └── index.jsx        # Step 6: Launch settings
│   │   └── review/
│   │       └── index.jsx        # Step 7: Review & payment
│   │
│   ├── launch-page/              # Chain detail page (regular view)
│   │   ├── index.jsx             # Main page component
│   │   └── components/           # Shared components
│   │       ├── chain-header.jsx            # Chain logo, name, favorite, share
│   │       ├── price-chart.jsx             # Chart with graduation tracker
│   │       ├── overview-tab.jsx            # Overview (supports draft mode)
│   │       ├── holders-tab.jsx             # Token holder rankings (top N)
│   │       ├── code-tab.jsx                # Repository & language details
│   │       ├── block-explorer-tab.jsx      # Blockchain explorer with search
│   │       ├── transaction-detail-sheet.jsx # Transaction detail side sheet
│   │       ├── block-detail-sheet.jsx      # Block detail side sheet with tabs
│   │       ├── trading-panel.jsx           # Token swap interface
│   │       ├── report-problem-button.jsx   # Report button
│   │       └── report-problem-dialog.jsx   # Report dialog with 3-step flow
│   │
│   ├── launch-page-owner/        # Owner view variant
│   │   ├── index.jsx             # Newly launched chain (minimal activity)
│   │   └── components/
│   │       └── launch-success-banner.jsx    # Success banner with share button
│   │
│   ├── launch-page-draft/        # Draft view variant
│   │   ├── index.jsx             # Draft chain page with progress panel
│   │   └── components/
│   │       ├── draft-holders-tab.jsx       # Empty state for holders
│   │       ├── draft-block-explorer-tab.jsx # Empty state for explorer
│   │       └── draft-progress-panel.jsx    # Launch progress tracker
│   │
│   └── launch-page-graduated/    # Graduated view variant
│       └── index.jsx             # Graduated chain (100% progress, high activity)
│
├── lib/
│   └── utils.js                 # Utility functions
│
├── App.jsx                      # Main app with routing
├── main.jsx                    # Entry point
└── index.css                   # Global styles
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/canopy/launcher.git

# Navigate to project directory
cd launcher

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 📖 Development Guidelines

### Design Principles

1. **Always Dark Mode**: The application is permanently set to dark mode
2. **Use shadcn/ui Components**: Don't create custom components if shadcn/ui has one
3. **Minimalistic Design**: Clean, simple interfaces with proper spacing
4. **Semantic Colors**: Use theme tokens (e.g., `bg-background`, `text-foreground`)
5. **Consistent Typography**: Follow established font sizes and weights

### File Naming Conventions

- **Pages**: Use kebab-case folders with `index.jsx` (e.g., `/pages/language-selection/index.jsx`)
- **Components**: Use kebab-case for files (e.g., `github-connect-dialog.jsx`)
- **Page-specific components**: Place in `components/` subfolder within the page directory

### Component Guidelines

- Check shadcn/ui documentation before creating custom components
- Use shadcn component variants instead of custom styling
- Keep components focused and single-purpose
- Use proper TypeScript/PropTypes for component props (when applicable)

## 🎯 Workflow Steps

The launcher guides users through these steps:

**Pre-Launch:**
1. **Overview Dialog** ✅ - Modal showing 5 key requirements (Choose language, Connect repo, Configure chain, Customize brand, Review & launch)

**Launch Flow:**
1. **Language Selection** ✅ - Choose programming language template (Python, Go, Rust, TypeScript)
2. **Repository Connection** ✅ - Fork template and connect GitHub repository
3. **Chain Configuration** ✅ - Set chain name, token details, halving schedule, and block time
4. **Branding & Media** ✅ - Add logo, brand color, description, and gallery (images/videos)
5. **Links & Documentation** ✅ - Add social links and whitepapers (files or URLs)
6. **Launch Settings** ✅ - Configure graduation threshold and optional initial purchase
7. **Review & Payment** ✅ - Final review, summary, and payment (using placeholder data)

## 🧪 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🎨 Styling

The project uses Tailwind CSS v4 with the following approach:

- Dark mode is always enabled via `class="dark"` on the HTML element
- Uses semantic color tokens from shadcn/ui
- Components use shadcn's built-in variants
- Custom styles are minimal and follow Tailwind conventions

## 📄 License

[License information here]

## 🤝 Contributing

[Contributing guidelines here]

## 📞 Support

For issues and questions, please open a GitHub issue or contact the Canopy team.