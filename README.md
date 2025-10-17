# Canopy Launcher

A modern web application for launching blockchain networks on the Canopy ecosystem with minimal technical barriers.

## 🚀 Overview

Canopy Launcher provides a streamlined, user-friendly interface for deploying blockchain networks. It guides users through a simple 8-step process from selecting a programming language to launching their own chain - all in under 10 minutes.

## ✨ Features

### Implemented Features ✅

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
- **Form Validation**: Inline error messages and validation for all inputs
- **Dark Mode First**: Modern, clean interface optimized for dark mode
- **Step-by-Step Guidance**: Clear workflow with progress tracking in sidebar
- **Tooltips**: Helpful explanations with crypto context and examples

## 🛠 Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **shadcn/ui** - Component library (built on Radix UI)
- **Tailwind CSS v4** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Devicon** - Programming language icons

## 📁 Project Structure

```
src/
├── components/               # Shared/reusable components
│   ├── ui/                  # shadcn/ui components
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
│   └── launchpad-sidebar.jsx # Main navigation sidebar
│
├── pages/                   # Page components (views)
│   ├── launchpad-overview/
│   │   └── index.jsx       # Welcome/overview screen
│   ├── language-selection/
│   │   └── index.jsx       # Step 1: Choose language
│   ├── connect-repo/
│   │   ├── index.jsx       # Step 2: Connect GitHub
│   │   └── components/
│   │       └── github-connect-dialog.jsx
│   ├── configure-chain/
│   │   └── index.jsx       # Step 3: Configure chain & token
│   ├── branding/
│   │   ├── index.jsx       # Step 4: Add branding
│   │   └── components/
│   │       ├── logo-upload.jsx
│   │       └── gallery-carousel.jsx
│   └── links/
│       └── index.jsx       # Step 5: Links & documentation
│
├── lib/
│   └── utils.js            # Utility functions
│
├── App.jsx                 # Main app with routing
├── main.jsx               # Entry point
└── index.css              # Global styles
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

1. **Overview** ✅ - Introduction and requirements
2. **Language Selection** ✅ - Choose programming language template (Python, Go, Rust, TypeScript)
3. **Repository Connection** ✅ - Fork template and connect GitHub repository
4. **Chain Configuration** ✅ - Set chain name, token details, halving schedule, and block time
5. **Branding & Media** ✅ - Add logo, brand color, description, and gallery (images/videos)
6. **Links & Documentation** ✅ - Add social links and whitepapers (files or URLs)
7. **Launch Settings** 🚧 - Configure launch parameters (Coming Soon)
8. **Review & Payment** 🚧 - Final review and payment (Coming Soon)

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