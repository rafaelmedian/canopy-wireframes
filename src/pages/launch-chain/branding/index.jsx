import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, ArrowRight, X, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import MainSidebar from '@/components/main-sidebar'
import LaunchpadSidebar from '@/components/launchpad-sidebar'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import LogoUpload from './components/logo-upload'
import GalleryCarousel from './components/gallery-carousel'
import {Badge} from "@/components/ui/badge.jsx";
import { useAutoSave } from '@/hooks/use-auto-save.js'
import { useLaunchFlow } from '@/contexts/launch-flow-context'
import PreviewSideSheet from '../components/preview-side-sheet'

export default function Branding() {
  const navigate = useNavigate()
  const { getFlowData, updateFlowData } = useLaunchFlow()

  // Initialize from context if available
  const savedBranding = getFlowData('branding')
  const [logo, setLogo] = useState(savedBranding?.logo || null)
  const [brandColor, setBrandColor] = useState(savedBranding?.brandColor || '#6366f1')
  const [title, setTitle] = useState(savedBranding?.title || '')
  const [description, setDescription] = useState(savedBranding?.description || '')
  const [galleryItems, setGalleryItems] = useState(savedBranding?.gallery || [])
  const [errors, setErrors] = useState({
    title: '',
    description: ''
  })
  const [showPreview, setShowPreview] = useState(false)

  const logoInputRef = useRef(null)
  const galleryInputRef = useRef(null)

  // Check if repo is connected (from context)
  const repoConnected = getFlowData('chainConfig') ? true : false

  // Auto-save hook
  const { isSaving, lastSaved } = useAutoSave(
    [logo, brandColor, title, description, galleryItems],
    repoConnected
  )

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Validate title
  const validateTitle = (value) => {
    if (!value || value.trim().length === 0) return 'Title is required'
    if (value.trim().length < 10) return 'Title must be at least 10 characters'
    if (value.trim().length > 100) return 'Title must be less than 100 characters'
    return ''
  }

  const handleTitleChange = (e) => {
    const value = e.target.value
    setTitle(value)
    setErrors(prev => ({ ...prev, title: validateTitle(value) }))
  }

  // Validate description
  const validateDescription = (value) => {
    if (!value || value.trim().length === 0) return 'Description is required'
    if (value.trim().length < 20) return 'Description must be at least 20 characters'
    if (value.trim().length > 500) return 'Description must be less than 500 characters'
    return ''
  }

  const handleDescriptionChange = (e) => {
    const value = e.target.value
    setDescription(value)
    setErrors(prev => ({ ...prev, description: validateDescription(value) }))
  }

  // Handle gallery upload
  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files)
    const validFiles = files.filter(file =>
      file.type.startsWith('image/') || file.type.startsWith('video/')
    )

    const newItems = validFiles.map(file => {
      const reader = new FileReader()
      return new Promise((resolve) => {
        reader.onload = (event) => {
          resolve({
            file,
            preview: event.target.result,
            type: file.type.startsWith('image/') ? 'image' : 'video'
          })
        }
        reader.readAsDataURL(file)
      })
    })

    Promise.all(newItems).then(items => {
      setGalleryItems(prev => [...prev, ...items])
    })

    if (galleryInputRef.current) {
      galleryInputRef.current.value = ''
    }
  }

  const handleBack = () => {
    navigate('/launchpad/configure')
  }

  const handleContinue = () => {
    if (isFormValid) {
      updateFlowData('branding', {
        logo,
        brandColor,
        title,
        description,
        gallery: galleryItems
      })
      navigate('/launchpad/links')
    }
  }

  const handleClose = () => {
    navigate('/')
  }

  const isFormValid = logo && title && description && !errors.title && !errors.description

  return (
    <div className="flex min-h-screen bg-background">
      <MainSidebar variant="compact" />
      <LaunchpadSidebar
        currentStep={4}
        completedSteps={[1, 2, 3]}
        repoConnected={repoConnected}
        isSaving={isSaving}
        lastSaved={lastSaved}
      />

      <div className="flex-1 overflow-auto">
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
                Add your branding
              </h1>
              <p className="text-muted-foreground">
                Make your chain stand out with custom branding
              </p>
            </div>

            {/* Form */}
            <div className="space-y-8">
              {/* Logo Upload Component */}
              <LogoUpload
                logo={logo}
                setLogo={setLogo}
                brandColor={brandColor}
                setBrandColor={setBrandColor}
                logoInputRef={logoInputRef}
              />

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Title */}
              <div className="space-y-2">
                <Label className="block text-sm font-medium" htmlFor="title">
                  Chain title
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Onchain ENS: Decentralized Naming for the Future"
                  value={title}
                  onChange={handleTitleChange}
                  className={errors.title ? 'border-destructive' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  A catchy title that appears on the launchpad. Example: "MyGameChain: The Future of Gaming on Blockchain"
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="block text-sm font-medium" htmlFor="description">
                  Describe your chain
                </Label>
                <Textarea
                  id="description"
                  placeholder="e.g., Integrated with Canopy's robust infrastructure, our platform is designed to enhance the way digital assets are managed and exchanged..."
                  value={description}
                  onChange={handleDescriptionChange}
                  className={`min-h-32 ${errors.description ? 'border-destructive' : ''}`}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  A detailed description of your blockchain's purpose and features. Example: "A revolutionary blockchain designed specifically for gaming applications, enabling seamless in-game asset transactions..."
                </p>
                <p className="text-sm text-muted-foreground">
                  {description.length}/500 characters
                </p>
              </div>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Gallery Component */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="block text-sm font-medium">
                    Gallery
                    {' '}
                  </Label>
                  <Badge variant="secondary" className="text-xs">Optional</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  This will help your chain stand out and build trust among others. We recommend adding at least three images or videos.
                </p>

                <GalleryCarousel
                  galleryItems={galleryItems}
                  setGalleryItems={setGalleryItems}
                  galleryInputRef={galleryInputRef}
                  onUpload={handleGalleryUpload}
                />
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

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(true)}
                  className="gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Preview
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
        </div>
      </div>

      {/* Preview Side Sheet */}
      <PreviewSideSheet
        open={showPreview}
        onOpenChange={setShowPreview}
        formData={{
          // From current step
          logo: logo,
          brandColor: brandColor,
          description: description,
          bannerImage: galleryItems?.[0]?.preview || null,
          // From context
          ...getFlowData('chainConfig'),
          ...getFlowData('links'),
          ...getFlowData('launchSettings'),
          repository: getFlowData('repository')
        }}
      />
    </div>
  )
}
