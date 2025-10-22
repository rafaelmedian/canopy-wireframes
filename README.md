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
│   ├── command-search-dialog.jsx
│   ├── launchpad-sidebar.jsx
│   └── main-sidebar.jsx
│
├── data/                   # Mock data and database
│   ├── db.js
│   ├── chains.json
│   ├── transactions.json
│   └── blocks.json
│
├── hooks/                  # Custom React hooks
│   └── use-auto-save.js
│
├── pages/                  # Page components
│   ├── home/              # Launchpad home page
│   ├── launch-chain/      # 7-step launch flow
│   │   ├── language-selection/
│   │   ├── repository/
│   │   ├── configure-chain/
│   │   ├── branding/
│   │   ├── links/
│   │   ├── settings/
│   │   └── review/
│   ├── chain-page/        # Chain detail pages
│   ├── transaction-page/
│   └── block-page/
│
├── lib/
│   └── utils.js
│
├── App.jsx
├── main.jsx
└── index.css
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
