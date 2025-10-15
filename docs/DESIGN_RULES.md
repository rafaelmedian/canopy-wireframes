# Design Rules for Canopy Launchpad

## Core Principles

### 1. Use shadcn/ui Components
- **Always use default shadcn/ui components** without modifying their base styles
- Leverage the built-in variant system (default, secondary, outline, ghost, etc.)
- Don't override component styles with custom Tailwind classes

### 2. Figma as Structure Guide
- Use Figma designs for:
  - Content structure and hierarchy
  - Information architecture
  - User flow and navigation
  - Content and copy
- **DO NOT** blindly copy Figma styles (fonts, colors, spacing)

### 3. Minimalistic Design
- Simple, clean interfaces
- Ample whitespace
- Clear visual hierarchy
- No unnecessary decorations or effects
- Focus on functionality over aesthetics

### 4. Typography Rules
- **Headings:**
  - H1: `text-4xl` or `text-3xl` (not 5xl or 6xl)
  - H2: `text-2xl` or `text-xl`
  - H3: `text-lg`
- **Body text:**
  - Default: `text-base` (16px)
  - Small: `text-sm` (14px)
  - Muted: Use `text-muted-foreground` color
- **Font weight:**
  - Headings: `font-semibold` or `font-bold`
  - Body: `font-normal`
  - Emphasis: `font-medium`

### 5. Dark Mode Only
- The application is always in dark mode
- Add `class="dark"` to the HTML element in index.html
- Use semantic color tokens:
  - `bg-background` / `text-foreground` for main content
  - `bg-card` / `text-card-foreground` for cards
  - `bg-muted` / `text-muted-foreground` for secondary content
  - `border` for borders
- Never use fixed colors like `bg-white` or `text-gray-900`
- For logos/icons that need inverting in dark mode, use `className="invert"`

### 6. Spacing Guidelines
- Use consistent spacing scale:
  - Small gaps: `gap-2` or `space-y-2`
  - Medium gaps: `gap-4` or `space-y-4`
  - Large gaps: `gap-6` or `space-y-6`
  - Section spacing: `gap-8` or `space-y-8`
- Padding: `p-4`, `p-6`, or `p-8` for containers

### 7. Layout Principles
- Use shadcn/ui Card component for contained sections
- Max width for content: `max-w-2xl` or `max-w-4xl`
- Center content with `mx-auto`
- Responsive by default (mobile-first)

### 8. Component Usage

#### Buttons
```jsx
// Good - using shadcn Button variants
<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// Bad - custom styled button
<Button className="bg-black text-white hover:bg-gray-800">Custom</Button>
```

#### Cards
```jsx
// Good - using Card components
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Bad - custom div styling
<div className="bg-white rounded-lg p-6 shadow">Content</div>
```

### 9. Icons
- Use Lucide React icons
- Icon size should match text size:
  - With `text-sm`: `w-4 h-4`
  - With `text-base`: `w-5 h-5`
  - With `text-lg`: `w-6 h-6`

### 10. Forms
- Use shadcn/ui form components (Input, Label, Select, etc.)
- Group related fields with proper spacing
- Clear labels and helpful descriptions
- Inline validation messages

## Example Implementation

```jsx
// Good - Following design rules
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

function Component() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Welcome to Launchpad</h1>
          <p className="text-muted-foreground">
            Launch your blockchain in minutes
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Follow these steps to launch your chain
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Step 1</h3>
              <p className="text-sm text-muted-foreground">
                Choose your template
              </p>
            </div>
            <Button>Continue</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

## Don'ts
- ❌ **DON'T create custom components if shadcn/ui already has one** (e.g., use Sidebar, not custom sidebar)
- ❌ Don't use fixed colors (`bg-gray-100`, `text-gray-900`)
- ❌ Don't use oversized text (`text-5xl`, `text-6xl`)
- ❌ Don't override shadcn component styles
- ❌ Don't ignore dark mode
- ❌ Don't use inline styles
- ❌ Don't forget responsive design
- ❌ Don't reinvent the wheel - check shadcn/ui docs first
- ❌ Don't create custom form inputs, modals, dialogs, tooltips, etc.
- ❌ Don't create custom navigation components if shadcn has them

## Do's
- ✅ **ALWAYS check shadcn/ui components first before creating custom ones**
- ✅ Use shadcn/ui Sidebar component for navigation sidebars
- ✅ Use shadcn/ui NavigationMenu for navigation
- ✅ Use shadcn/ui Form components for all forms
- ✅ Use shadcn/ui Dialog for modals
- ✅ Use shadcn/ui Sheet for slide-out panels
- ✅ Use semantic color tokens
- ✅ Follow shadcn component patterns
- ✅ Keep it simple and clean
- ✅ Test in both light and dark modes
- ✅ Use consistent spacing
- ✅ Maintain visual hierarchy
- ✅ Focus on usability