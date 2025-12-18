import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { HelpCircle, User, Settings, Home, Search, Bell, Mail, Star, Heart, Share2, Download, Upload, Trash2, Edit, Plus, Minus, X, Check, ChevronRight, ChevronDown } from 'lucide-react'

export default function DesignSystem() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [alertDialogOpen, setAlertDialogOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Design System</h1>
          <p className="text-muted-foreground">Visual reference for all UI components and design tokens</p>
        </div>

        {/* Color Palette */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Color Palette</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            {/* Background Colors */}
            <Card>
              <CardHeader>
                <CardTitle>Background Colors</CardTitle>
                <CardDescription>Base background and surface colors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg bg-background border"></div>
                  <div>
                    <p className="font-medium">background</p>
                    <p className="text-sm text-muted-foreground">Main page background</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg bg-card border"></div>
                  <div>
                    <p className="font-medium">card</p>
                    <p className="text-sm text-muted-foreground">Card and panel backgrounds</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg bg-muted border"></div>
                  <div>
                    <p className="font-medium">muted</p>
                    <p className="text-sm text-muted-foreground">Muted backgrounds</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg bg-popover border"></div>
                  <div>
                    <p className="font-medium">popover</p>
                    <p className="text-sm text-muted-foreground">Popover and dropdown backgrounds</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Text Colors */}
            <Card>
              <CardHeader>
                <CardTitle>Text Colors</CardTitle>
                <CardDescription>Foreground and text colors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg bg-foreground"></div>
                  <div>
                    <p className="font-medium">foreground</p>
                    <p className="text-sm text-muted-foreground">Primary text color</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg bg-muted-foreground"></div>
                  <div>
                    <p className="font-medium">muted-foreground</p>
                    <p className="text-sm text-muted-foreground">Secondary text color</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg bg-card-foreground"></div>
                  <div>
                    <p className="font-medium">card-foreground</p>
                    <p className="text-sm text-muted-foreground">Text on cards</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Semantic Colors */}
            <Card>
              <CardHeader>
                <CardTitle>Semantic Colors</CardTitle>
                <CardDescription>Primary, secondary, and accent colors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg bg-primary"></div>
                  <div>
                    <p className="font-medium">primary</p>
                    <p className="text-sm text-muted-foreground">Primary actions and highlights</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg bg-secondary"></div>
                  <div>
                    <p className="font-medium">secondary</p>
                    <p className="text-sm text-muted-foreground">Secondary actions</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg bg-accent"></div>
                  <div>
                    <p className="font-medium">accent</p>
                    <p className="text-sm text-muted-foreground">Accent highlights</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg bg-destructive"></div>
                  <div>
                    <p className="font-medium">destructive</p>
                    <p className="text-sm text-muted-foreground">Error and destructive actions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Border & Ring Colors */}
            <Card>
              <CardHeader>
                <CardTitle>Border & Ring Colors</CardTitle>
                <CardDescription>Border and focus ring colors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg border-2 border-border"></div>
                  <div>
                    <p className="font-medium">border</p>
                    <p className="text-sm text-muted-foreground">Default border color</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg border-2 border-input"></div>
                  <div>
                    <p className="font-medium">input</p>
                    <p className="text-sm text-muted-foreground">Input border color</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg border-2 border-ring"></div>
                  <div>
                    <p className="font-medium">ring</p>
                    <p className="text-sm text-muted-foreground">Focus ring color</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Aave Pro Background Layers */}
          <Card>
            <CardHeader>
              <CardTitle>Aave Pro Background Layers</CardTitle>
              <CardDescription>Layered background system for depth</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="h-20 w-full rounded-lg" style={{ backgroundColor: 'var(--bg-max)' }}></div>
                  <p className="text-sm font-medium">bg-max</p>
                  <p className="text-xs text-muted-foreground">Deepest background</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 w-full rounded-lg border" style={{ backgroundColor: 'var(--bg-1)' }}></div>
                  <p className="text-sm font-medium">bg-1</p>
                  <p className="text-xs text-muted-foreground">Page background</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 w-full rounded-lg border" style={{ backgroundColor: 'var(--bg-2)' }}></div>
                  <p className="text-sm font-medium">bg-2</p>
                  <p className="text-xs text-muted-foreground">Cards</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 w-full rounded-lg border" style={{ backgroundColor: 'var(--bg-3)' }}></div>
                  <p className="text-sm font-medium">bg-3</p>
                  <p className="text-xs text-muted-foreground">Elevated cards</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 w-full rounded-lg border" style={{ backgroundColor: 'var(--bg-4)' }}></div>
                  <p className="text-sm font-medium">bg-4</p>
                  <p className="text-xs text-muted-foreground">Popovers</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 w-full rounded-lg border" style={{ backgroundColor: 'var(--bg-5)' }}></div>
                  <p className="text-sm font-medium">bg-5</p>
                  <p className="text-xs text-muted-foreground">Inputs</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 w-full rounded-lg border" style={{ backgroundColor: 'var(--bg-6)' }}></div>
                  <p className="text-sm font-medium">bg-6</p>
                  <p className="text-xs text-muted-foreground">Hover states</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Aave Pro Foreground Hierarchy */}
          <Card>
            <CardHeader>
              <CardTitle>Aave Pro Foreground Hierarchy</CardTitle>
              <CardDescription>Text color hierarchy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg" style={{ backgroundColor: 'var(--fg-1)' }}></div>
                  <div>
                    <p className="font-medium">fg-1</p>
                    <p className="text-sm text-muted-foreground">Primary text</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg" style={{ backgroundColor: 'var(--fg-2)' }}></div>
                  <div>
                    <p className="font-medium">fg-2</p>
                    <p className="text-sm text-muted-foreground">Secondary text</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg" style={{ backgroundColor: 'var(--fg-3)' }}></div>
                  <div>
                    <p className="font-medium">fg-3</p>
                    <p className="text-sm text-muted-foreground">Muted text</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg" style={{ backgroundColor: 'var(--fg-4)' }}></div>
                  <div>
                    <p className="font-medium">fg-4</p>
                    <p className="text-sm text-muted-foreground">Disabled text</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Aave Pro Border System */}
          <Card>
            <CardHeader>
              <CardTitle>Aave Pro Border System</CardTitle>
              <CardDescription>Border opacity levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="h-20 w-full rounded-lg border" style={{ borderColor: 'var(--border-0)' }}></div>
                  <p className="text-sm font-medium">border-0</p>
                  <p className="text-xs text-muted-foreground">Subtle (6%)</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 w-full rounded-lg border" style={{ borderColor: 'var(--border-1)' }}></div>
                  <p className="text-sm font-medium">border-1</p>
                  <p className="text-xs text-muted-foreground">Default (8%)</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 w-full rounded-lg border" style={{ borderColor: 'var(--border-2)' }}></div>
                  <p className="text-sm font-medium">border-2</p>
                  <p className="text-xs text-muted-foreground">Emphasis (12%)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Aave Pro Semantic Colors */}
          <Card>
            <CardHeader>
              <CardTitle>Aave Pro Semantic Colors</CardTitle>
              <CardDescription>Color scales for semantic meaning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Blue */}
                <div>
                  <p className="text-sm font-medium mb-3">Blue</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <div className="h-12 w-full rounded" style={{ backgroundColor: 'var(--blue-1)' }}></div>
                      <p className="text-xs">blue-1</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-12 w-full rounded" style={{ backgroundColor: 'var(--blue-2)' }}></div>
                      <p className="text-xs">blue-2</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-12 w-full rounded" style={{ backgroundColor: 'var(--blue-3)' }}></div>
                      <p className="text-xs">blue-3</p>
                    </div>
                  </div>
                </div>
                {/* Green */}
                <div>
                  <p className="text-sm font-medium mb-3">Green</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <div className="h-12 w-full rounded" style={{ backgroundColor: 'var(--green-1)' }}></div>
                      <p className="text-xs">green-1</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-12 w-full rounded" style={{ backgroundColor: 'var(--green-2)' }}></div>
                      <p className="text-xs">green-2</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-12 w-full rounded" style={{ backgroundColor: 'var(--green-3)' }}></div>
                      <p className="text-xs">green-3</p>
                    </div>
                  </div>
                </div>
                {/* Yellow */}
                <div>
                  <p className="text-sm font-medium mb-3">Yellow</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <div className="h-12 w-full rounded" style={{ backgroundColor: 'var(--yellow-1)' }}></div>
                      <p className="text-xs">yellow-1</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-12 w-full rounded" style={{ backgroundColor: 'var(--yellow-2)' }}></div>
                      <p className="text-xs">yellow-2</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-12 w-full rounded" style={{ backgroundColor: 'var(--yellow-3)' }}></div>
                      <p className="text-xs">yellow-3</p>
                    </div>
                  </div>
                </div>
                {/* Red */}
                <div>
                  <p className="text-sm font-medium mb-3">Red</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <div className="h-12 w-full rounded" style={{ backgroundColor: 'var(--red-1)' }}></div>
                      <p className="text-xs">red-1</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-12 w-full rounded" style={{ backgroundColor: 'var(--red-2)' }}></div>
                      <p className="text-xs">red-2</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-12 w-full rounded" style={{ backgroundColor: 'var(--red-3)' }}></div>
                      <p className="text-xs">red-3</p>
                    </div>
                  </div>
                </div>
                {/* Purple */}
                <div>
                  <p className="text-sm font-medium mb-3">Purple</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <div className="h-12 w-full rounded" style={{ backgroundColor: 'var(--purple-1)' }}></div>
                      <p className="text-xs">purple-1</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-12 w-full rounded" style={{ backgroundColor: 'var(--purple-2)' }}></div>
                      <p className="text-xs">purple-2</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-12 w-full rounded" style={{ backgroundColor: 'var(--purple-3)' }}></div>
                      <p className="text-xs">purple-3</p>
                    </div>
                  </div>
                </div>
                {/* Cyan */}
                <div>
                  <p className="text-sm font-medium mb-3">Cyan</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <div className="h-12 w-full rounded" style={{ backgroundColor: 'var(--cyan-1)' }}></div>
                      <p className="text-xs">cyan-1</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-12 w-full rounded" style={{ backgroundColor: 'var(--cyan-2)' }}></div>
                      <p className="text-xs">cyan-2</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-12 w-full rounded" style={{ backgroundColor: 'var(--cyan-3)' }}></div>
                      <p className="text-xs">cyan-3</p>
                    </div>
                  </div>
                </div>
                {/* Navy */}
                <div>
                  <p className="text-sm font-medium mb-3">Navy</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <div className="h-12 w-full rounded" style={{ backgroundColor: 'var(--navy-1)' }}></div>
                      <p className="text-xs">navy-1</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-12 w-full rounded" style={{ backgroundColor: 'var(--navy-2)' }}></div>
                      <p className="text-xs">navy-2</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-12 w-full rounded" style={{ backgroundColor: 'var(--navy-3)' }}></div>
                      <p className="text-xs">navy-3</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Visualization Colors */}
          <Card>
            <CardHeader>
              <CardTitle>Data Visualization Colors</CardTitle>
              <CardDescription>Colors for charts and data visualization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <div className="h-16 w-full rounded" style={{ backgroundColor: 'var(--data-red)' }}></div>
                  <p className="text-sm font-medium">data-red</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 w-full rounded" style={{ backgroundColor: 'var(--data-orange)' }}></div>
                  <p className="text-sm font-medium">data-orange</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 w-full rounded" style={{ backgroundColor: 'var(--data-yellow)' }}></div>
                  <p className="text-sm font-medium">data-yellow</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 w-full rounded" style={{ backgroundColor: 'var(--data-lime)' }}></div>
                  <p className="text-sm font-medium">data-lime</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 w-full rounded" style={{ backgroundColor: 'var(--data-green)' }}></div>
                  <p className="text-sm font-medium">data-green</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 w-full rounded" style={{ backgroundColor: 'var(--data-teal)' }}></div>
                  <p className="text-sm font-medium">data-teal</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 w-full rounded" style={{ backgroundColor: 'var(--data-blue)' }}></div>
                  <p className="text-sm font-medium">data-blue</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 w-full rounded" style={{ backgroundColor: 'var(--data-purple)' }}></div>
                  <p className="text-sm font-medium">data-purple</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 w-full rounded" style={{ backgroundColor: 'var(--data-pink)' }}></div>
                  <p className="text-sm font-medium">data-pink</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shadow System */}
          <Card>
            <CardHeader>
              <CardTitle>Shadow System</CardTitle>
              <CardDescription>Shadow and stroke variables</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <div className="h-16 w-full rounded-lg bg-card border" style={{ boxShadow: '0 2px 4px 0 var(--shadow-low)' }}></div>
                    <p className="text-sm font-medium">shadow-low</p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-16 w-full rounded-lg bg-card border" style={{ boxShadow: '0 2px 8px 0 var(--shadow-medium)' }}></div>
                    <p className="text-sm font-medium">shadow-medium</p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-16 w-full rounded-lg bg-card border" style={{ boxShadow: '0 4px 12px 0 var(--shadow-high)' }}></div>
                    <p className="text-sm font-medium">shadow-high</p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-16 w-full rounded-lg bg-card border" style={{ boxShadow: '0 0 0 1px var(--shadow-stroke-1)' }}></div>
                    <p className="text-sm font-medium">shadow-stroke-1</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Utility Colors */}
          <Card>
            <CardHeader>
              <CardTitle>Utility Colors</CardTitle>
              <CardDescription>Special purpose colors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="h-16 w-full rounded-lg" style={{ backgroundColor: 'var(--ethereum)' }}></div>
                  <p className="text-sm font-medium">ethereum</p>
                  <p className="text-xs text-muted-foreground">Ethereum brand color</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 w-full rounded-lg border-2" style={{ borderColor: 'var(--focus)' }}></div>
                  <p className="text-sm font-medium">focus</p>
                  <p className="text-xs text-muted-foreground">Focus ring color</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 w-full rounded-lg" style={{ backgroundColor: 'var(--scrim)' }}></div>
                  <p className="text-sm font-medium">scrim</p>
                  <p className="text-xs text-muted-foreground">Overlay backdrop</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Typography Scale */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Typography</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Heading Hierarchy</CardTitle>
              <CardDescription>Heading sizes and weights</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h1 className="text-4xl font-bold">Heading 1 (text-4xl, font-bold)</h1>
                <p className="text-sm text-muted-foreground mt-1">Used for page titles</p>
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Heading 2 (text-2xl, font-semibold)</h2>
                <p className="text-sm text-muted-foreground mt-1">Used for section titles</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Heading 3 (text-xl, font-semibold)</h3>
                <p className="text-sm text-muted-foreground mt-1">Used for subsection titles</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold">Heading 4 (text-lg, font-semibold)</h4>
                <p className="text-sm text-muted-foreground mt-1">Used for card titles</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Body Text</CardTitle>
              <CardDescription>Body text sizes and weights</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-base font-normal">Body text (text-base, font-normal)</p>
                <p className="text-sm text-muted-foreground mt-1">Default body text size</p>
              </div>
              <div>
                <p className="text-sm font-normal">Small text (text-sm, font-normal)</p>
                <p className="text-sm text-muted-foreground mt-1">Used for descriptions and secondary text</p>
              </div>
              <div>
                <p className="text-xs font-normal">Extra small text (text-xs, font-normal)</p>
                <p className="text-sm text-muted-foreground mt-1">Used for labels and captions</p>
              </div>
              <div>
                <p className="text-base font-medium">Medium weight (font-medium)</p>
                <p className="text-sm text-muted-foreground mt-1">Used for emphasis</p>
              </div>
              <div>
                <p className="text-base font-semibold">Semibold weight (font-semibold)</p>
                <p className="text-sm text-muted-foreground mt-1">Used for strong emphasis</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Spacing Scale */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Spacing Scale</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Spacing Tokens</CardTitle>
              <CardDescription>Common spacing patterns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">gap-2 / space-y-2 (0.5rem / 8px)</p>
                <div className="flex gap-2">
                  <div className="h-8 w-8 bg-primary rounded"></div>
                  <div className="h-8 w-8 bg-primary rounded"></div>
                  <div className="h-8 w-8 bg-primary rounded"></div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">gap-4 / space-y-4 (1rem / 16px)</p>
                <div className="flex gap-4">
                  <div className="h-8 w-8 bg-primary rounded"></div>
                  <div className="h-8 w-8 bg-primary rounded"></div>
                  <div className="h-8 w-8 bg-primary rounded"></div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">gap-6 / space-y-6 (1.5rem / 24px)</p>
                <div className="flex gap-6">
                  <div className="h-8 w-8 bg-primary rounded"></div>
                  <div className="h-8 w-8 bg-primary rounded"></div>
                  <div className="h-8 w-8 bg-primary rounded"></div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">gap-8 / space-y-8 (2rem / 32px)</p>
                <div className="flex gap-8">
                  <div className="h-8 w-8 bg-primary rounded"></div>
                  <div className="h-8 w-8 bg-primary rounded"></div>
                  <div className="h-8 w-8 bg-primary rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Buttons */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Buttons</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Button Variants</CardTitle>
              <CardDescription>All button variants and sizes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <p className="text-sm font-medium">Variants</p>
                <div className="flex flex-wrap gap-3">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="link">Link</Button>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium">Sizes</p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon"><Plus className="h-4 w-4" /></Button>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium">States</p>
                <div className="flex flex-wrap gap-3">
                  <Button disabled>Disabled</Button>
                  <Button>Normal</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Cards */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Cards</h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Card with Header</CardTitle>
                <CardDescription>Card description goes here</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card content area</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Card with Footer</CardTitle>
                <CardDescription>Another card example</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card content</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Form Elements */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Form Elements</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Input Fields</CardTitle>
              <CardDescription>Text input variations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Default Input</Label>
                <Input placeholder="Enter text here" />
              </div>
              <div className="space-y-2">
                <Label>Disabled Input</Label>
                <Input placeholder="Disabled input" disabled />
              </div>
              <div className="space-y-2">
                <Label>Input with Error</Label>
                <Input placeholder="Error state" aria-invalid="true" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Textarea</CardTitle>
              <CardDescription>Multi-line text input</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Textarea</Label>
                <Textarea placeholder="Enter multiple lines of text" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Checkbox</CardTitle>
              <CardDescription>Checkbox states</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="unchecked" />
                <Label htmlFor="unchecked">Unchecked</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="checked" defaultChecked />
                <Label htmlFor="checked">Checked</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="disabled" disabled />
                <Label htmlFor="disabled">Disabled</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Radio Group</CardTitle>
              <CardDescription>Radio button selection</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup defaultValue="option1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option1" id="option1" />
                  <Label htmlFor="option1">Option 1</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option2" id="option2" />
                  <Label htmlFor="option2">Option 2</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option3" id="option3" />
                  <Label htmlFor="option3">Option 3</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Select</CardTitle>
              <CardDescription>Dropdown selection</CardDescription>
            </CardHeader>
            <CardContent>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                  <SelectItem value="option3">Option 3</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Switch</CardTitle>
              <CardDescription>Toggle switch states</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="switch-off" />
                <Label htmlFor="switch-off">Off</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="switch-on" defaultChecked />
                <Label htmlFor="switch-on">On</Label>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Badges */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Badges</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Badge Variants</CardTitle>
              <CardDescription>All badge styles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Tabs */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Tabs</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Tab Navigation</CardTitle>
              <CardDescription>Tab component example</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="tab1">
                <TabsList>
                  <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                  <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                  <TabsTrigger value="tab3">Tab 3</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1" className="mt-4">
                  <p>Content for Tab 1</p>
                </TabsContent>
                <TabsContent value="tab2" className="mt-4">
                  <p>Content for Tab 2</p>
                </TabsContent>
                <TabsContent value="tab3" className="mt-4">
                  <p>Content for Tab 3</p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>

        {/* Dialogs */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Dialogs</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Dialog</CardTitle>
              <CardDescription>Modal dialog component</CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Open Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Dialog Title</DialogTitle>
                    <DialogDescription>
                      This is a dialog description. It provides context for the dialog content.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p>Dialog content goes here.</p>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alert Dialog</CardTitle>
              <CardDescription>Confirmation dialog</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete Item</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the item.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </section>

        {/* Tooltips */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Tooltips</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Tooltip</CardTitle>
              <CardDescription>Hover to see tooltip</CardDescription>
            </CardHeader>
            <CardContent>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">Hover me</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This is a tooltip</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardContent>
          </Card>
        </section>

        {/* Progress & Loading */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Progress & Loading</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Progress Bar</CardTitle>
              <CardDescription>Progress indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm">25%</p>
                <Progress value={25} />
              </div>
              <div className="space-y-2">
                <p className="text-sm">50%</p>
                <Progress value={50} />
              </div>
              <div className="space-y-2">
                <p className="text-sm">75%</p>
                <Progress value={75} />
              </div>
              <div className="space-y-2">
                <p className="text-sm">100%</p>
                <Progress value={100} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skeleton</CardTitle>
              <CardDescription>Loading state placeholders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Avatar */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Avatar</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Avatar</CardTitle>
              <CardDescription>User avatar component</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>AB</AvatarFallback>
                </Avatar>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Separator */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Separator</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Separator</CardTitle>
              <CardDescription>Horizontal and vertical separators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm mb-2">Horizontal</p>
                <Separator />
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm">Vertical</p>
                <Separator orientation="vertical" className="h-8" />
                <p className="text-sm">Separator</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Icons */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Icons</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Icon Sizes</CardTitle>
              <CardDescription>Common Lucide icons with size guidelines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium mb-3">Size: w-4 h-4 (with text-sm)</p>
                  <div className="flex flex-wrap gap-4 items-center">
                    <Home className="w-4 h-4" />
                    <Search className="w-4 h-4" />
                    <Settings className="w-4 h-4" />
                    <User className="w-4 h-4" />
                    <Bell className="w-4 h-4" />
                    <Mail className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-3">Size: w-5 h-5 (with text-base)</p>
                  <div className="flex flex-wrap gap-4 items-center">
                    <Star className="w-5 h-5" />
                    <Heart className="w-5 h-5" />
                    <Share2 className="w-5 h-5" />
                    <Download className="w-5 h-5" />
                    <Upload className="w-5 h-5" />
                    <Edit className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-3">Size: w-6 h-6 (with text-lg)</p>
                  <div className="flex flex-wrap gap-4 items-center">
                    <Trash2 className="w-6 h-6" />
                    <Plus className="w-6 h-6" />
                    <Minus className="w-6 h-6" />
                    <X className="w-6 h-6" />
                    <Check className="w-6 h-6" />
                    <ChevronRight className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}

