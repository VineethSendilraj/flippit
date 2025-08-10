"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, Loader2, AlertCircle } from "lucide-react"
import { fetchArbitrageData, fetchMsrpPrice } from "@/lib/perplexity"
import { saveArbitrageDataWithMsrp } from "@/lib/supabase"
import { Button } from "@/components/ui/button"

export default function LoadingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchId = searchParams.get("id") || ""
  const query = searchParams.get("query") || ""
  const location = searchParams.get("location") || ""

  const [steps, setSteps] = useState([
    { id: 1, text: "Searching for luxury retailers", completed: false, error: false },
    { id: 2, text: "Gathering contact information", completed: false, error: false },
    { id: 3, text: "Analyzing arbitrage opportunities", completed: false, error: false },
    { id: 4, text: "Preparing data for dashboard", completed: false, error: false },
  ])

  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const processSearch = async () => {
      try {
        console.log("Starting search process...")

        // Step 1: Search for retailers
        setSteps((prev) => prev.map((step) => (step.id === 1 ? { ...step, completed: true } : step)))
        await new Promise((r) => setTimeout(r, 1000))

        // Step 2: Gather contact info
        setSteps((prev) => prev.map((step) => (step.id === 2 ? { ...step, completed: true } : step)))

        console.log("Fetching data from Perplexity...")
        // Fetch data from Perplexity (with fallback)
        const companies = await fetchArbitrageData(query, location)
        console.log("Data fetched successfully:", companies.length, "retailers")
        await new Promise((r) => setTimeout(r, 1000))

        // Step 3: Fetch MSRP price
        setSteps((prev) => prev.map((step) => (step.id === 3 ? { ...step, completed: true } : step)))
        const msrpPrice = await fetchMsrpPrice(query)
        await new Promise((r) => setTimeout(r, 1000))

        // Step 4: Save to Supabase and prepare dashboard
        console.log("Saving data to Supabase...")
        const queryId = await saveArbitrageDataWithMsrp(query, location, msrpPrice, companies)
        console.log("Data saved successfully")
        setSteps((prev) => prev.map((step) => (step.id === 4 ? { ...step, completed: true } : step)))
        await new Promise((r) => setTimeout(r, 500))

        console.log("Redirecting to dashboard...")
        // Redirect to dashboard
        if (queryId) {
          router.push(`/dashboard?id=${queryId}`)
        } else {
          throw new Error("Failed to save query to Supabase.")
        }
      } catch (error) {
        console.error("Error processing search:", error)
        setHasError(true)
        setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred")

        // Mark current step as error
        setSteps((prev) => prev.map((step) => (!step.completed ? { ...step, error: true } : step)))
      }
    }

    if (searchId && query && location) {
      processSearch()
    }
  }, [query, location, searchId, router])

  const handleRetry = () => {
    setHasError(false)
    setErrorMessage("")
    setSteps([
      { id: 1, text: "Searching for luxury retailers", completed: false, error: false },
      { id: 2, text: "Gathering contact information", completed: false, error: false },
      { id: 3, text: "Analyzing arbitrage opportunities", completed: false, error: false },
      { id: 4, text: "Preparing data for dashboard", completed: false, error: false },
    ])

    // Restart the process
    window.location.reload()
  }

  const handleGoBack = () => {
    router.push("/")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {hasError ? "Processing Error" : "Processing Your Search"}
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            {hasError
              ? "We encountered an issue while processing your request"
              : `Finding arbitrage opportunities for ${query} in ${location.replace(/-/g, " ")}`}
          </p>
        </div>

        <div className="space-y-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex items-center space-x-3 rounded-lg border border-gray-700 bg-gray-800/50 p-4"
            >
              {step.error ? (
                <AlertCircle className="h-6 w-6 text-red-500" />
              ) : step.completed ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              )}
              <span className={step.error ? "text-red-400" : step.completed ? "text-white" : "text-gray-400"}>
                {step.text}
              </span>
            </div>
          ))}
        </div>

        {hasError && (
          <div className="space-y-4">
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
              <p className="text-sm text-red-400">{errorMessage}</p>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleRetry} className="flex-1">
                Try Again
              </Button>
              <Button onClick={handleGoBack} variant="outline" className="flex-1">
                Go Back
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
