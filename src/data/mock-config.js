// Configuration options and constants used across the application

export const BLOCK_TIME_OPTIONS = [
  { value: '5', label: '5 seconds' },
  { value: '10', label: '10 seconds' },
  { value: '30', label: '30 seconds' },
  { value: '60', label: '1 minute' },
  { value: '300', label: '5 minutes' },
  { value: '600', label: '10 minutes' },
]

export const AVATAR_COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-yellow-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-red-500',
  'bg-teal-500'
]

export const GRADUATION_THRESHOLD = 50000

export const DEFAULT_TOKENOMICS = {
  totalSupply: 1000000000, // 1 billion
  blockTime: '10',
  halvingDays: 365,
  yearOneEmission: 200000000 // 200 million
}
