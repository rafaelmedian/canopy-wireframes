import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Upload, Trash2 } from 'lucide-react'

export default function LogoUpload({ logo, setLogo, brandColor, setBrandColor, logoInputRef }) {
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

  return (
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
  )
}
