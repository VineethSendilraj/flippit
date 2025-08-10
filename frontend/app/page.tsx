"use client"

import { useState } from "react"
import Image from "next/image"
import FlippitSearchTable from "@/components/flippit-search-table"
import { InteractiveGridPattern } from "@/components/interactive-grid-pattern"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden flex">
      {/* Interactive Grid Background */}
      <div className="absolute inset-0 w-screen h-screen flex items-center justify-center">
        <InteractiveGridPattern
          className="opacity-30 w-screen [mask-image:radial-gradient(ellipse_at_center,_black_0%,_black_25%,_rgba(0,0,0,0.5)_40%,_transparent_75%)]"
          width={40}
          height={40}
          squares={[48, 32]}
          squaresClassName="hover:fill-blue-500/60 dark:hover:fill-blue-400/60 transition-all duration-200"
          allowInteractive={true}
        />
      </div>

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        <Sidebar />
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Header */}
        <header className="flex items-center justify-start p-6">
          <div 
            className="relative"
            onMouseEnter={() => setSidebarOpen(true)}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-full hover:bg-white/20 dark:hover:bg-slate-800/50 p-2 w-12 h-12 border-2 border-gray-200/50 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Image 
                src="/logos/flippit.png" 
                alt="Flippit Logo" 
                width={32} 
                height={32}
                className="rounded-lg"
              />
            </Button>
          </div>
        </header>

        {/* Main Content - Centered */}
        <div className="flex-1 flex flex-col justify-center items-center px-8 py-12">
          <div className="w-full max-w-3xl text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-7xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
                Flippit
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                AI-powered arbitrage opportunities for luxury goods and collectibles
              </p>
            </div>

            {/* Search Section */}
            <div className="pt-4">
              <FlippitSearchTable />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-8 py-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Made by Vineeth, Vardhan & Kevin
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
