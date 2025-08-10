"use client"

import { ExternalLink, TrendingUp, DollarSign } from "lucide-react"

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
  tags: OpportunityTag[]
  description: string
  link: string
  isHot?: boolean
}

interface OpportunityCardProps {
  opportunity: FlippitOpportunity
}

const FlippitOpportunityCard = ({ opportunity }: OpportunityCardProps) => {
  const getTagColor = (color: string) => {
    switch (color) {
      case 'yellow':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
      case 'blue':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
      case 'purple':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
      case 'green':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
      case 'red':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
      {/* Image */}
      <div className="relative h-48 bg-gray-100 dark:bg-slate-700 overflow-hidden">
        <img 
          src={opportunity.image} 
          alt={opportunity.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        {opportunity.isHot && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            HOT
          </div>
        )}
        <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          +{opportunity.profitMargin}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title and Brand */}
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg leading-tight line-clamp-1">
            {opportunity.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{opportunity.brand}</p>
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
          {opportunity.description}
        </p>

        {/* Pricing */}
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 text-xs">Current</p>
            <p className="font-semibold text-gray-900 dark:text-white">{opportunity.currentPrice}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 text-xs">Target</p>
            <p className="font-semibold text-green-600 dark:text-green-400">{opportunity.targetPrice}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 text-xs">Profit</p>
            <p className="font-semibold text-green-600 dark:text-green-400 flex items-center justify-center gap-1">
              <DollarSign className="w-3 h-3" />
              {opportunity.profit}
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {opportunity.tags.map((tag, index) => (
            <span 
              key={index}
              className={`px-2 py-1 text-xs font-medium rounded-md ${getTagColor(tag.color)}`}
            >
              {tag.name}
            </span>
          ))}
        </div>

        {/* Marketplace and Action */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-700">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Found on {opportunity.marketplace}
          </span>
          <a
            href={opportunity.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
          >
            View Deal
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  )
}

export default FlippitOpportunityCard
