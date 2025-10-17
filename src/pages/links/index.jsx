import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ArrowLeft, ArrowRight, X, Upload, Trash2, Globe, Github, Linkedin, Link as LinkIcon, FileText } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import LaunchpadSidebar from '@/components/launchpad-sidebar'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'

// Social platform icons mapping
const PLATFORM_ICONS = {
  website: Globe,
  twitter: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  telegram: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
    </svg>
  ),
  discord: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  ),
  github: Github,
  medium: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
    </svg>
  ),
  reddit: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
    </svg>
  ),
  linkedin: Linkedin
}

const SOCIAL_PLATFORMS = [
  { value: 'website', label: 'Website', placeholder: 'https://yourchain.org' },
  { value: 'twitter', label: 'Twitter/X', placeholder: '@yourchainhandle' },
  { value: 'telegram', label: 'Telegram', placeholder: '@yourchainhandle' },
  { value: 'discord', label: 'Discord', placeholder: 'https://discord.gg/yourchain' },
  { value: 'github', label: 'GitHub', placeholder: 'https://github.com/yourchain' },
  { value: 'medium', label: 'Medium', placeholder: 'https://medium.com/@yourchain' },
  { value: 'reddit', label: 'Reddit', placeholder: 'https://reddit.com/r/yourchain' },
  { value: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/yourchain' }
]

export default function Links() {
  const navigate = useNavigate()
  const location = useLocation()
  const fileInputRef = useRef(null)

  const [socialLinks, setSocialLinks] = useState([
    { id: 1, platform: 'website', url: '' }
  ])
  const [selectedPlatform, setSelectedPlatform] = useState('')
  const [whitepaperTab, setWhitepaperTab] = useState('upload')
  const [whitepapers, setWhitepapers] = useState([]) // Unified list for files and URLs
  const [urlInput, setUrlInput] = useState('')
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false)
  const [errors, setErrors] = useState({})

  const addSocialLink = () => {
    if (!selectedPlatform) return

    const exists = socialLinks.some(link => link.platform === selectedPlatform)
    if (exists) {
      setErrors(prev => ({ ...prev, social: 'This platform is already added' }))
      return
    }

    setSocialLinks(prev => [...prev, {
      id: Date.now(),
      platform: selectedPlatform,
      url: ''
    }])
    setSelectedPlatform('')
    setErrors(prev => ({ ...prev, social: '' }))
  }

  const removeSocialLink = (id) => {
    if (socialLinks.length <= 1) {
      setErrors(prev => ({ ...prev, social: 'At least one social link is required' }))
      return
    }
    setSocialLinks(prev => prev.filter(link => link.id !== id))
    setErrors(prev => ({ ...prev, social: '' }))
  }

  const updateSocialLink = (id, url) => {
    setSocialLinks(prev => prev.map(link =>
      link.id === id ? { ...link, url } : link
    ))
  }

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    const validFiles = files.filter(file =>
      file.type === 'application/pdf' ||
      file.name.endsWith('.pdf') ||
      file.name.endsWith('.doc') ||
      file.name.endsWith('.docx')
    )

    const newFiles = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      type: 'file',
      file,
      name: file.name,
      size: file.size
    }))

    setWhitepapers(prev => [...prev, ...newFiles])

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const fetchUrlMetadata = async (url) => {
    setIsLoadingMetadata(true)
    try {
      // Simulate metadata fetching - in production, you'd call an API
      // For now, we'll extract basic info from the URL
      const urlObj = new URL(url)
      const filename = urlObj.pathname.split('/').pop() || 'Document'

      return {
        id: Date.now(),
        type: 'url',
        url,
        name: filename,
        title: filename,
        description: urlObj.hostname
      }
    } catch (error) {
      return {
        id: Date.now(),
        type: 'url',
        url,
        name: url,
        title: 'Invalid URL',
        description: ''
      }
    } finally {
      setIsLoadingMetadata(false)
    }
  }

  const addWhitepaperUrl = async () => {
    if (!urlInput.trim()) return

    const metadata = await fetchUrlMetadata(urlInput)
    setWhitepapers(prev => [...prev, metadata])
    setUrlInput('')
  }

  const removeWhitepaper = (id) => {
    setWhitepapers(prev => prev.filter(item => item.id !== id))
  }

  const handleBack = () => {
    navigate('/launchpad/branding')
  }

  const handleContinue = () => {
    if (isFormValid) {
      navigate('/launchpad/settings', {
        state: {
          ...location.state,
          links: {
            social: socialLinks,
            whitepapers
          }
        }
      })
    }
  }

  const handleClose = () => {
    navigate('/')
  }

  const isFormValid = socialLinks.length > 0 && socialLinks.every(link => link.url.trim().length > 0)

  const availablePlatforms = SOCIAL_PLATFORMS.filter(
    platform => !socialLinks.some(link => link.platform === platform.value)
  )

  return (
    <SidebarProvider defaultOpen={true}>
      <LaunchpadSidebar currentStep={5} completedSteps={[1, 2, 3, 4]} />

      <SidebarInset>
        {/* Header */}
        <div className="flex justify-end p-2 border-b mb-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">
                Build trust and help grow your community
              </h1>
              <p className="text-muted-foreground">
                Add social links and documentation to help users learn about your chain
              </p>
            </div>

            {/* Form */}
            <div className="space-y-8">
              {/* Social Links Section */}
              <div className="space-y-4">
                <Label className="block text-sm font-medium">
                  Social links
                </Label>

                {/* Social Links List */}
                <div className="space-y-3">
                  {socialLinks.map((link) => {
                    const platform = SOCIAL_PLATFORMS.find(p => p.value === link.platform)
                    const Icon = PLATFORM_ICONS[link.platform]
                    return (
                      <div key={link.id} className="flex items-center gap-3">
                        <div className="flex-1 flex items-center gap-3 p-4 border border-border rounded-lg">
                          <div className="flex items-center gap-2 w-32">
                            {Icon && (typeof Icon === 'function' ? <Icon /> : <Icon className="w-4 h-4" />)}
                            <Label className="font-medium">
                              {platform?.label}
                            </Label>
                          </div>
                          <Input
                            value={link.url}
                            onChange={(e) => updateSocialLink(link.id, e.target.value)}
                            placeholder={platform?.placeholder}
                            className="flex-1"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSocialLink(link.id)}
                          disabled={socialLinks.length <= 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )
                  })}
                </div>

                {/* Add Social Link */}
                {availablePlatforms.length > 0 && (
                  <div className="flex items-center gap-3">
                    <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select a platform to add" />
                      </SelectTrigger>
                      <SelectContent>
                        {availablePlatforms.map(platform => (
                          <SelectItem key={platform.value} value={platform.value}>
                            {platform.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={addSocialLink}
                      disabled={!selectedPlatform}
                    >
                      Add
                    </Button>
                  </div>
                )}

                {errors.social && (
                  <p className="text-sm text-destructive">{errors.social}</p>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Whitepapers Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label className="block text-sm font-medium">
                    Whitepapers
                  </Label>
                  <Badge variant="secondary" className="text-xs">Optional</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Share technical documentation, whitepapers, or other resources that help users understand your blockchain
                </p>

                <Tabs value={whitepaperTab} onValueChange={setWhitepaperTab}>
                  <TabsList>
                    <TabsTrigger value="upload">Upload</TabsTrigger>
                    <TabsTrigger value="url">URL</TabsTrigger>
                  </TabsList>

                  <TabsContent value="upload" className="space-y-4">
                    {/* Upload Area */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                    >
                      <Upload className="w-8 h-8 text-muted-foreground mb-3" />
                      <p className="font-medium">Upload from your device.</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        PDF, DOC, or DOCX files supported
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,application/pdf"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="url" className="space-y-4">
                    {/* URL Input */}
                    <div className="flex items-center gap-3">
                      <Input
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://yourchain.org/whitepaper.pdf"
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            addWhitepaperUrl()
                          }
                        }}
                      />
                      <Button
                        onClick={addWhitepaperUrl}
                        disabled={!urlInput.trim() || isLoadingMetadata}
                      >
                        {isLoadingMetadata ? 'Adding...' : 'Add'}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Unified Whitepapers List */}
                {whitepapers.length > 0 && (
                  <div className="space-y-2">
                    <Label className="block text-sm font-medium">
                      Added whitepapers
                    </Label>
                    {whitepapers.map(item => (
                      <Card key={item.id} className="p-3">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {item.type === 'file' ? (
                              <FileText className="w-5 h-5 text-muted-foreground" />
                            ) : (
                              <LinkIcon className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.type === 'file'
                                ? `${(item.size / 1024).toFixed(2)} KB`
                                : item.description || item.url
                              }
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeWhitepaper(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-8">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>

              <Button
                onClick={handleContinue}
                disabled={!isFormValid}
                className="gap-2"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
