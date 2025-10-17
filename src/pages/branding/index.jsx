import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { ArrowLeft, ArrowRight, X, Upload, Trash2, GripVertical } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import LaunchpadSidebar from '@/components/launchpad-sidebar'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'

export default function Branding() {
  const navigate = useNavigate()
  const location = useLocation()

  const [logo, setLogo] = useState(null)
  const [brandColor, setBrandColor] = useState('#6366f1')
  const [description, setDescription] = useState('')
  const [galleryItems, setGalleryItems] = useState([])
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0)
  const [editingNameIndex, setEditingNameIndex] = useState(null)
  const [draggedIndex, setDraggedIndex] = useState(null)
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

  // Handle logo upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setLogo({
          file,
          preview: event.target.result
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogoRemove = () => {
    setLogo(null)
    if (logoInputRef.current) {
      logoInputRef.current.value = ''
    }
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

  const handleGalleryRemove = (index) => {
    setGalleryItems(prev => prev.filter((_, i) => i !== index))
    if (currentGalleryIndex >= galleryItems.length - 1) {
      setCurrentGalleryIndex(Math.max(0, galleryItems.length - 2))
    }
  }

  // Handle name edit
  const handleNameEdit = (index, newName) => {
    setGalleryItems(prev => prev.map((item, i) =>
      i === index ? { ...item, customName: newName } : item
    ))
  }

  const handleNameClick = (index) => {
    setEditingNameIndex(index)
  }

  const handleNameBlur = () => {
    setEditingNameIndex(null)
  }

  const handleNameKeyDown = (e) => {
    if (e.key === 'Enter') {
      setEditingNameIndex(null)
    }
  }

  // Handle drag and drop
  const handleDragStart = (index) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newItems = [...galleryItems]
    const draggedItem = newItems[draggedIndex]
    newItems.splice(draggedIndex, 1)
    newItems.splice(index, 0, draggedItem)

    setGalleryItems(newItems)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
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
              {/* Logo Upload */}
              <div className="space-y-2">
                <Label className="block text-sm font-medium">
                  Logo
                </Label>
                <p className="text-sm text-muted-foreground">
                  This appears in wallets, explorers, and trading interfaces.
                </p>

                {!logo ? (
                  <div
                    onClick={() => logoInputRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-muted-foreground mb-3" />
                    <p className="font-medium">Upload from device</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      1000×1000 pixels recommended. PNG or JPG file.
                    </p>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/png,image/jpeg"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Card className="p-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={logo.preview}
                          alt="Logo preview"
                          className="w-20 h-20 object-contain rounded-lg bg-muted"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{logo.file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(logo.file.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleLogoRemove}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>

                    {/* Brand Color Picker */}
                    <div className="space-y-2">
                      <Label className="block text-sm font-medium">
                        Brand Color
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Choose a primary color that represents your brand
                      </p>
                      <div className="flex items-center gap-3">
                        <Input
                          type="color"
                          value={brandColor}
                          onChange={(e) => setBrandColor(e.target.value)}
                          className="w-20 h-10 cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={brandColor}
                          onChange={(e) => setBrandColor(e.target.value)}
                          placeholder="#000000"
                          className="flex-1 max-w-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

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

              {/* Gallery */}
              <div className="space-y-2">
                <Label className="block text-sm font-medium">
                  Gallery
                </Label>
                <p className="text-sm text-muted-foreground">
                  This will help your chain stand out and build trust among others. We recommend adding at least three images or videos.
                </p>

                {galleryItems.length === 0 ? (
                  <div
                    onClick={() => galleryInputRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-muted-foreground mb-3" />
                    <p className="font-medium">Upload from your device.</p>
                    <input
                      ref={galleryInputRef}
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={handleGalleryUpload}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Main Preview */}
                    <Card className="p-4">
                      <div className="relative">
                        {galleryItems[currentGalleryIndex].type === 'image' ? (
                          <img
                            src={galleryItems[currentGalleryIndex].preview}
                            alt={`Gallery item ${currentGalleryIndex + 1}`}
                            className="w-full h-80 object-contain rounded-lg bg-muted"
                          />
                        ) : (
                          <video
                            src={galleryItems[currentGalleryIndex].preview}
                            controls
                            className="w-full h-80 rounded-lg bg-muted"
                          />
                        )}
                      </div>

                      {/* Current item info with editable name */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex-1 min-w-0 mr-4">
                          {editingNameIndex === currentGalleryIndex ? (
                            <Input
                              value={galleryItems[currentGalleryIndex].customName || galleryItems[currentGalleryIndex].file.name}
                              onChange={(e) => handleNameEdit(currentGalleryIndex, e.target.value)}
                              onBlur={handleNameBlur}
                              onKeyDown={handleNameKeyDown}
                              autoFocus
                              className="font-medium"
                            />
                          ) : (
                            <p
                              className="font-medium cursor-text hover:bg-muted px-2 py-1 -mx-2 -my-1 rounded transition-colors truncate"
                              onClick={() => handleNameClick(currentGalleryIndex)}
                              title="Click to edit name"
                            >
                              {galleryItems[currentGalleryIndex].customName || galleryItems[currentGalleryIndex].file.name}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground mt-1">
                            {currentGalleryIndex + 1} of {galleryItems.length}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleGalleryRemove(currentGalleryIndex)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>

                    {/* Thumbnail Grid with Drag & Drop */}
                    <div className="grid grid-cols-4 gap-3">
                      {galleryItems.map((item, index) => (
                        <Card
                          key={index}
                          draggable
                          onDragStart={() => handleDragStart(index)}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDragEnd={handleDragEnd}
                          onClick={() => setCurrentGalleryIndex(index)}
                          className={`relative cursor-pointer overflow-hidden group ${
                            currentGalleryIndex === index
                              ? 'ring-2 ring-primary'
                              : 'hover:ring-2 hover:ring-primary/50'
                          } ${draggedIndex === index ? 'opacity-50' : ''}`}
                        >
                          {/* Drag handle */}
                          <div className="absolute top-1 left-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-background/80 rounded p-1">
                              <GripVertical className="w-3 h-3 text-muted-foreground" />
                            </div>
                          </div>

                          {/* Thumbnail */}
                          {item.type === 'image' ? (
                            <img
                              src={item.preview}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-24 object-cover"
                            />
                          ) : (
                            <div className="relative w-full h-24 bg-muted flex items-center justify-center">
                              <video
                                src={item.preview}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xs font-medium">
                                VIDEO
                              </div>
                            </div>
                          )}

                          {/* Order number */}
                          <div className="absolute bottom-1 right-1">
                            <div className="bg-background/80 rounded px-1.5 py-0.5 text-xs font-medium">
                              {index + 1}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>

                    {/* Add more button */}
                    <Button
                      variant="outline"
                      onClick={() => galleryInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Add more images or videos
                    </Button>
                    <input
                      ref={galleryInputRef}
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={handleGalleryUpload}
                      className="hidden"
                    />
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
