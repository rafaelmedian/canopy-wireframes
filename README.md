# Canopy Launcher

A modern web application for launching blockchain networks on the Canopy ecosystem with minimal technical barriers.

## 🚀 Overview

Canopy Launcher provides a streamlined, user-friendly interface for deploying blockchain networks. It guides users through a simple 7-step process from selecting a programming language to launching their own chain.

## ✨ Features

- **Launchpad** - Browse and discover blockchain chains with filtering and sorting
- **Global Search** - Search for chains, transactions, and blocks with ⌘K
- **Chain Launch Flow** - 7-step wizard for creating new blockchain chains
- **Chain Detail Pages** - Comprehensive view with multiple states (Draft, Virtual, Graduated)
- **Block Explorer** - Browse blocks and transactions
- **Report System** - Report chains that violate platform policies

## 🛠 Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **shadcn/ui** - Component library (built on Radix UI)
- **Tailwind CSS v4** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Devicon** - Programming language icons
- **Recharts** - Composable charting library

## 📁 Project Structure

```
src/
├── components/              # Shared/reusable components
│   ├── ui/                 # shadcn/ui components
│   │   ├── alert-dialog.jsx
│   │   ├── avatar.jsx
│   │   ├── badge.jsx
│   │   ├── button.jsx
│   │   ├── card.jsx
│   │   ├── command.jsx
│   │   ├── dialog.jsx
│   │   ├── dropdown-menu.jsx
│   │   ├── input.jsx
│   │   ├── label.jsx
│   │   ├── progress.jsx
│   │   ├── radio-group.jsx
│   │   ├── select.jsx
│   │   ├── separator.jsx
│   │   ├── sheet.jsx
│   │   ├── sidebar.jsx
│   │   ├── skeleton.jsx
│   │   ├── sonner.jsx      # Toast notifications
│   │   ├── tabs.jsx
│   │   ├── textarea.jsx
│   │   └── tooltip.jsx
│   ├── command-search-dialog.jsx  # Global search (Cmd+K)
│   ├── launch-overview-dialog.jsx # Launch flow overview
│   ├── launchpad-sidebar.jsx      # Launchpad filtering sidebar
│   ├── main-sidebar.jsx           # Main navigation sidebar
│   └── search-panel.jsx           # Search functionality
│
├── data/                   # Mock data and database
│   ├── db.js              # Database query functions
│   ├── chains.json        # Chain definitions (16 chains)
│   ├── holders.json       # Token holders by chainId
│   ├── transactions.json  # Transaction records by chainId
│   ├── blocks.json        # Block data by chainId
│   ├── price-history.json # Price history by chainId
│   ├── milestones.json    # Milestone type definitions (9 types)
│   ├── milestone-logs.json # Milestone progress tracking by chainId
│   └── mock-config.js     # Configuration constants
│
├── hooks/                  # Custom React hooks
│   ├── use-auto-save.js   # Auto-save form data
│   └── use-mobile.js      # Mobile detection hook
│
├── pages/
│   ├── launchpad/         # Main marketplace/discovery page
│   │   ├── index.jsx
│   │   └── components/
│   │       ├── chain-card.jsx        # Grid view card
│   │       ├── chain-list-item.jsx   # List view item
│   │       ├── filter-bar.jsx        # Sorting/filtering controls
│   │       ├── top-chain-card.jsx    # Featured chain card
│   │       └── top-chain-carousel.jsx # Featured chains carousel
│   │
│   ├── launch-chain/      # 7-step chain creation flow
│   │   ├── language-selection/       # Step 1: Choose language
│   │   │   └── index.jsx
│   │   ├── connect-repo/             # Step 2: Connect GitHub
│   │   │   ├── index.jsx
│   │   │   └── components/
│   │   │       ├── github-auth-dialog.jsx
│   │   │       └── github-connect-dialog.jsx
│   │   ├── configure-chain/          # Step 3: Chain settings
│   │   │   └── index.jsx
│   │   ├── branding/                 # Step 4: Visual identity
│   │   │   ├── index.jsx
│   │   │   └── components/
│   │   │       ├── gallery-carousel.jsx
│   │   │       └── logo-upload.jsx
│   │   ├── links/                    # Step 5: Social links
│   │   │   └── index.jsx
│   │   ├── launch-settings/          # Step 6: Launch config
│   │   │   └── index.jsx
│   │   └── review/                   # Step 7: Review & launch
│   │       └── index.jsx
│   │
│   ├── chain-detail/      # Public chain view (virtual/graduated)
│   │   ├── index.jsx
│   │   └── components/
│   │       ├── chain-header.jsx           # Chain info header
│   │       ├── overview-tab.jsx           # Stats overview
│   │       ├── milestones-tab.jsx         # Achievement tracking
│   │       ├── holders-tab.jsx            # Token holders list
│   │       ├── code-tab.jsx               # Source code viewer
│   │       ├── block-explorer-tab.jsx     # Blocks & transactions
│   │       ├── price-chart.jsx            # Price history chart
│   │       ├── trading-panel.jsx          # Buy/sell interface
│   │       ├── report-problem-button.jsx  # Report chain button
│   │       ├── report-problem-dialog.jsx  # Report form
│   │       ├── transaction-detail-sheet.jsx # Transaction details
│   │       └── block-detail-sheet.jsx     # Block details
│   │
│   ├── chain-detail-draft/ # Draft chain view (pre-launch)
│   │   ├── index.jsx
│   │   └── components/
│   │       ├── draft-block-explorer-tab.jsx # Empty state
│   │       ├── draft-holders-tab.jsx        # Empty holders
│   │       └── draft-progress-panel.jsx     # Launch progress
│   │
│   ├── chain-detail-owner/ # Owner view (your chains)
│   │   ├── index.jsx
│   │   └── components/
│   │       ├── launch-success-banner.jsx    # Post-launch banner
│   │       └── review-countdown-panel.jsx   # Review timer
│   │
│   ├── chain-detail-graduated/ # Graduated chain view
│   │   └── index.jsx       # Uses chain-detail components
│   │
│   ├── transaction-page/   # Transaction detail page
│   │   └── index.jsx
│   │
│   └── block-page/         # Block detail page
│       └── index.jsx
│
├── utils/
│   └── milestones.js      # Milestone icon mapping
│
├── lib/
│   └── utils.js           # General utilities (cn, etc)
│
├── App.jsx                # Main app component & routing
├── main.jsx               # App entry point
└── index.css              # Global styles & Tailwind
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/TapTrap-LLC/canopy-wireframes.git

# Navigate to project directory
cd canopy-wireframes

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 🧪 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🎨 Styling

The project uses Tailwind CSS v4 with the following approach:

- Dark mode is always enabled
- Uses semantic color tokens from shadcn/ui
- Components use shadcn's built-in variants
- Custom styles are minimal and follow Tailwind conventions
