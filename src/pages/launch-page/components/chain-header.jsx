import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Upload, Star } from 'lucide-react'

export default function ChainHeader({ chainData }) {
  const [isFavorited, setIsFavorited] = useState(false)

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Logo Placeholder */}
          <div className="w-8 h-8 rounded-full bg-[#10b981] flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-black">
              {chainData.ticker[0]}
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-base font-medium">{chainData.name}</h2>
            <p className="text-xs text-gray-400">
              ${chainData.ticker} on {chainData.name} • {chainData.isDraft ? 'edited' : 'created'} 13m ago
            </p>
          </div>
        </div>

        {!chainData.isDraft && (
          <div className="flex items-center gap-3">
            {/* Favorite Button */}
            <Button
              variant="outline"
              size="icon"
              className="h-[30px] w-[30px] rounded-lg"
              onClick={() => setIsFavorited(!isFavorited)}
            >
              <Star className={`w-4 h-4 ${isFavorited ? 'fill-yellow-500 text-yellow-500' : ''}`} />
            </Button>

            {/* Share Button */}
            <Button variant="outline" size="icon" className="h-[30px] w-[30px] rounded-lg">
              <Upload className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
