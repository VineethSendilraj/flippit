import FlippitSearchTable from "@/components/flippit-search-table"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Hero Section */}
      <div className="pt-12 pb-8 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-full mb-6 border border-blue-200 dark:border-blue-800">
            <div className="flex -space-x-1 mr-3">
              {/* OpenAI Logo */}
              <div className="w-6 h-6 bg-black dark:bg-white rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800">
                <svg className="w-3 h-3 text-white dark:text-black" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>
                </svg>
              </div>
              {/* Anthropic Logo */}
              <img 
                src="/logos/claude.webp" 
                alt="Anthropic Claude" 
                className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 object-cover"
              />
              {/* Perplexity Logo */}
              <img 
                src="/logos/perplexity.webp" 
                alt="Perplexity" 
                className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 object-cover"
              />
            </div>
            Powered by OpenAI, Anthropic & Perplexity
          </div>

          <h1 className="text-3xl md:text-6xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight leading-tight">
            Find anything you need<br/>
            <span className="text-gray-600 dark:text-gray-400">to flip for profit</span>
          </h1>
          
          <p className="text-md text-gray-500 dark:text-gray-400 mb-6 max-w-xl mx-auto">
            AI-powered arbitrage opportunities for luxury goods and collectibles
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-6 pb-20 max-w-6xl">
        <FlippitSearchTable />
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Made by{' '}
              <a 
                href="https://linkedin.com/in/vineeth-sendilraj" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
              >
                Vineeth
              </a>
              ,{' '}
              <a 
                href="https://linkedin.com/in/vardhan-krishna" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
              >
                Vardhan
              </a>
              , &{' '}
              <a 
                href="https://linkedin.com/in/kevin-huang" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
              >
                Kevin
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
