interface OpportunityTag {
  name: string
  color: 'yellow' | 'blue' | 'purple' | 'green' | 'red'
}

interface FlippitOpportunity {
  id: string
  name: string
  brand: string
  image: string
  currentPrice: string
  targetPrice: string
  profit: string
  profitMargin: string
  marketplace: string
  region: string
  tags: OpportunityTag[]
  description: string
  link: string
  isHot?: boolean
}

export const opportunities: FlippitOpportunity[] = [
  {
    id: 'rolex-submariner',
    name: 'Submariner Date 41mm',
    brand: 'Rolex',
    image: 'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=400&h=300&fit=crop&auto=format',
    currentPrice: '$8,200',
    targetPrice: '$12,500',
    profit: '$4,300',
    profitMargin: '52%',
    marketplace: 'Chrono24',
    region: 'ny',
    tags: [
      { name: 'HOT', color: 'red' },
      { name: 'Watches', color: 'blue' },
      { name: 'Luxury', color: 'purple' },
      { name: 'Investment Grade', color: 'green' }
    ],
    description: 'Mint condition Rolex Submariner with box and papers. High demand model with strong resale value.',
    link: 'https://chrono24.com',
    isHot: true
  },
  {
    id: 'hermes-birkin',
    name: 'Birkin 30 Togo Leather',
    brand: 'Hermès',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop&auto=format',
    currentPrice: '$15,000',
    targetPrice: '$22,000',
    profit: '$7,000',
    profitMargin: '47%',
    marketplace: 'Fashionphile',
    region: 'ca',
    tags: [
      { name: 'Handbags', color: 'purple' },
      { name: 'Luxury', color: 'blue' },
      { name: 'Rare', color: 'red' },
      { name: 'Designer', color: 'yellow' }
    ],
    description: 'Authentic Hermès Birkin in excellent condition. Classic color combination with high market demand.',
    link: 'https://fashionphile.com'
  },
  {
    id: 'jordan-retro',
    name: 'Air Jordan 1 Retro High OG "Chicago"',
    brand: 'Nike',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop&auto=format',
    currentPrice: '$450',
    targetPrice: '$800',
    profit: '$350',
    profitMargin: '78%',
    marketplace: 'StockX',
    region: 'il',
    tags: [
      { name: 'Sneakers', color: 'blue' },
      { name: 'Limited Edition', color: 'red' },
      { name: 'Streetwear', color: 'green' },
      { name: 'Retro', color: 'yellow' }
    ],
    description: 'Classic colorway in pristine condition. Size 10.5 - high demand size with strong resale potential.',
    link: 'https://stockx.com'
  },
  {
    id: 'cartier-tank',
    name: 'Tank Must Watch',
    brand: 'Cartier',
    image: 'https://images.unsplash.com/photo-1523170335258-f5c216654a17?w=400&h=300&fit=crop&auto=format',
    currentPrice: '$2,800',
    targetPrice: '$4,200',
    profit: '$1,400',
    profitMargin: '50%',
    marketplace: 'Crown & Caliber',
    region: 'fl',
    tags: [
      { name: 'Watches', color: 'blue' },
      { name: 'Vintage', color: 'yellow' },
      { name: 'Designer', color: 'purple' },
      { name: 'Gold', color: 'yellow' }
    ],
    description: 'Iconic Cartier Tank in 18k gold. Timeless design with consistent appreciation in value.',
    link: 'https://crownandcaliber.com'
  },
  {
    id: 'chanel-flap',
    name: 'Classic Flap Bag Medium',
    brand: 'Chanel',
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&h=300&fit=crop&auto=format',
    currentPrice: '$6,500',
    targetPrice: '$9,800',
    profit: '$3,300',
    profitMargin: '51%',
    marketplace: 'Rebag',
    region: 'tx',
    tags: [
      { name: 'Handbags', color: 'purple' },
      { name: 'Luxury', color: 'blue' },
      { name: 'Classic', color: 'green' },
      { name: 'Investment', color: 'yellow' }
    ],
    description: 'Authentic Chanel Classic Flap in black quilted leather. Gold hardware, excellent condition.',
    link: 'https://rebag.com',
    isHot: true
  },
  {
    id: 'patek-philippe',
    name: 'Nautilus 5711/1A-010',
    brand: 'Patek Philippe',
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400&h=300&fit=crop&auto=format',
    currentPrice: '$85,000',
    targetPrice: '$120,000',
    profit: '$35,000',
    profitMargin: '41%',
    marketplace: 'Hodinkee Shop',
    region: 'ny',
    tags: [
      { name: 'HOT', color: 'red' },
      { name: 'Watches', color: 'blue' },
      { name: 'Ultra Luxury', color: 'purple' },
      { name: 'Blue Chip', color: 'green' }
    ],
    description: 'The holy grail of sports watches. Discontinued model with unprecedented demand and limited supply.',
    link: 'https://shop.hodinkee.com',
    isHot: true
  }
]

export type { FlippitOpportunity, OpportunityTag }
