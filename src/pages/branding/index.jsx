import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import LaunchpadSidebar from '@/components/launchpad-sidebar'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import LogoUpload from './components/logo-upload'
import GalleryCarousel from './components/gallery-carousel'
import {Badge} from "@/components/ui/badge.jsx";

export default function Branding() {
  const navigate = useNavigate()
  const location = useLocation()

  const [logo, setLogo] = useState(null)
  const [brandColor, setBrandColor] = useState('#6366f1')
  const [description, setDescription] = useState('')
  const [galleryItems, setGalleryItems] = useState([])
  const [errors, setErrors] = useState({
    description: ''
  })

  const logoInputRef = useRef(null)
  const galleryInputRef = useRef(null)

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
      navigate('/launchpad/links', {
        state: {
          ...location.state,
          branding: {
            logo,
            brandColor,
            description,
            gallery: galleryItems
          }
        }
      })
    }
  }

  const handleClose = () => {
    navigate('/')
  }

  const isFormValid = logo && description && !errors.description

  return (
    <SidebarProvider defaultOpen={true}>
      <LaunchpadSidebar currentStep={4} completedSteps={[1, 2, 3]} />

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

              {/* Description */}
              <div className="space-y-2">
                <Label className="block text-sm font-medium" htmlFor="description">
                  Describe your chain
                </Label>
                <Textarea
                  id="description"
                  placeholder="A short explanation of what your blockchain does"
                  value={description}
                  onChange={handleDescriptionChange}
                  className={`min-h-32 ${errors.description ? 'border-destructive' : ''}`}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description}</p>
                )}
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
