import FlippitSearchTable from "@/components/flippit-search-table"
import { ThemeToggle } from "@/components/theme-toggle"
import { InteractiveGridPattern } from "@/components/interactive-grid-pattern"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden flex flex-col">
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

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Main Content - Centered */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 relative z-10">
        <div className="w-full max-w-4xl text-center">


          <h1 className="text-3xl md:text-6xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight leading-tight">
            Flippit<br/>
          </h1>
          
          <p className="text-md text-gray-500 dark:text-gray-400 mb-8 max-w-xl mx-auto">
            AI-powered arbitrage opportunities for luxury goods and collectibles
          </p>

          {/* Search Section */}
          <FlippitSearchTable />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Made by{' '}

                Vineeth

              ,{' '}

                Vardhan

              , &{' '}

                Kevin

            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
