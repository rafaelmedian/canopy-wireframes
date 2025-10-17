import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Trash2, GripVertical, Upload } from 'lucide-react'

export default function GalleryCarousel({ galleryItems, setGalleryItems, galleryInputRef, onUpload }) {
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0)
  const [editingNameIndex, setEditingNameIndex] = useState(null)
  const [draggedIndex, setDraggedIndex] = useState(null)

  const handleGalleryRemove = (index) => {
    setGalleryItems(prev => prev.filter((_, i) => i !== index))
    if (currentGalleryIndex >= galleryItems.length - 1) {
      setCurrentGalleryIndex(Math.max(0, galleryItems.length - 2))
    }
  }

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

  if (galleryItems.length === 0) {
    return (
      <div
        onClick={() => galleryInputRef.current?.click()}
        className="border-2 border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
      >
        <Upload className="w-8 h-8 text-muted-foreground mb-3" />
        <p className="font-medium">Upload from your device.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Add up to 10 images or videos. PNG, JPG, and MP4 formats are supported.
        </p>
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={onUpload}
          className="hidden"
        />
      </div>
    )
  }

  return (
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

            {/* Delete button */}
            <div className="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="destructive"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation()
                  handleGalleryRemove(index)
                }}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
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
        onChange={onUpload}
        className="hidden"
      />
    </div>
  )
}
