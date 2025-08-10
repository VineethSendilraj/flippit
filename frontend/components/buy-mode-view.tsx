"use client"

import { useState, useEffect, useRef } from "react"
import { Phone, Play } from "lucide-react"
import { updateRetailer } from "@/lib/supabase"
import { summarizeCallTranscript } from "@/lib/openai"
import { apiCall } from "@/lib/api-config"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface BuyModeViewProps {
  retailers: any[]
  setRetailers: (retailers: any[]) => void
  msrpPrice?: number | null
}

export function BuyModeView({ retailers, setRetailers, msrpPrice }: BuyModeViewProps) {
  const [selectedRetailer, setSelectedRetailer] = useState<any | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [price, setPrice] = useState("")
  const [isCalling, setIsCalling] = useState(false)
  const [callTranscript, setCallTranscript] = useState("")
  const [showTranscriptModal, setShowTranscriptModal] = useState(false)
  const [transcriptToShow, setTranscriptToShow] = useState("")
  const [lowestPrice, setLowestPrice] = useState<number | null>(null)
  const callStarted = useRef(false)
  const [callingCompany, setCallingCompany] = useState<string | null>(null)

  // On mount, auto-call Agnihotri Jewelers only
  useEffect(() => {
    if (retailers.length > 0 && !callStarted.current) {
      callStarted.current = true
      const agnihotri = retailers.find(r => r.name === "Agnihotri Jewelers")
      if (agnihotri && !agnihotri.has_been_called) {
        handleCall(agnihotri)
      }
    }
    // Set initial lowest price
    const lowest = retailers
      .map(r => r.lowest_price_offered)
      .filter(p => typeof p === "number")
      .reduce((min, p) => (min === null || (p !== null && p < min) ? p : min), null as number | null)
    setLowestPrice(lowest)
  }, [retailers])

  // Generalized call handler for any company
  const handleCall = async (company: any) => {
    setIsCalling(true)
    setCallingCompany(company.name)
    try {
      const res = await apiCall("/api/call", {
        method: "POST",
        body: JSON.stringify({ company }),
      })
      const data = await res.json()
      if (data.success && data.status === "ended") {
        // Update company in Supabase and local state
        const summaryPrice = Number(data.summary)
        const updates = {
          has_been_called: true,
          call_transcript: data.transcript,
          call_summary: data.summary,
          lowest_price_offered: summaryPrice,
        }
        await updateRetailer(company.id, updates)
        setRetailers(retailers.map(r => r.id === company.id ? { ...r, ...updates } : r))
        setCallTranscript(data.transcript)
        // Update lowest price if needed
        setLowestPrice(prev => (prev === null || summaryPrice < prev ? summaryPrice : prev))
      }
    } catch (err) {
      console.error("Error calling company:", err)
    } finally {
      setIsCalling(false)
      setCallingCompany(null)
    }
  }

  const handleShowTranscript = (transcript: string) => {
    setTranscriptToShow(transcript)
    setShowTranscriptModal(true)
  }

  const handleCallClick = (retailer: any) => {
    setSelectedRetailer(retailer)
    setIsDialogOpen(true)
    setTranscript("")
    setPrice("")
  }

  const handleSaveCall = async () => {
    if (!selectedRetailer || !transcript) return

    try {
      setIsProcessing(true)

      // Generate call summary using OpenAI
      const summary = await summarizeCallTranscript(transcript)

      // Update the retailer in Supabase
      const updates = {
        has_been_called: true,
        call_transcript: transcript,
        call_summary: summary,
        lowest_price_offered: price ? Number.parseFloat(price) : null,
      }

      await updateRetailer(selectedRetailer.id, updates)

      // Update the local state
      setRetailers(retailers.map((r) => (r.id === selectedRetailer.id ? { ...r, ...updates } : r)))

      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saving call data:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-4">
      {isCalling && callingCompany && (
        <div className="mb-2">
          <span className="animate-pulse text-blue-400 font-semibold">Calling {callingCompany}...</span>
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price Offered</TableHead>
              <TableHead className="w-[140px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {retailers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No retailers found
                </TableCell>
              </TableRow>
            ) : (
              retailers.map((retailer) => (
                <TableRow key={retailer.id}>
                  <TableCell className="font-medium">{retailer.name}</TableCell>
                  <TableCell>{retailer.phone_number}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{retailer.location}</TableCell>
                  <TableCell>
                    {retailer.has_been_called ? (
                      <span className="rounded-full bg-green-500/20 px-2 py-1 text-xs font-medium text-green-500">
                        Called
                      </span>
                    ) : (
                      <span className="rounded-full bg-yellow-500/20 px-2 py-1 text-xs font-medium text-yellow-500">
                        Not Called
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {retailer.lowest_price_offered ? `$${retailer.lowest_price_offered.toLocaleString()}` : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {/* Call action button for all companies except Agnihotri after first load */}
                      {(!retailer.has_been_called && retailer.name !== "Agnihotri Jewelers") && (
                        <Button variant="outline" size="sm" onClick={() => handleCall(retailer)} disabled={isCalling}>
                          <span role="img" aria-label="Call">📞</span>
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => handleShowTranscript(retailer.call_transcript)} disabled={!retailer.call_transcript}>
                        Transcript
                      </Button>
                      {retailer.call_audio_url && (
                        <Button variant="outline" size="sm">
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Transcript Modal */}
      <Dialog open={showTranscriptModal} onOpenChange={setShowTranscriptModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Call Transcript</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <pre className="whitespace-pre-wrap text-sm bg-gray-900/10 rounded p-2 max-h-96 overflow-auto">{transcriptToShow}</pre>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setShowTranscriptModal(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Existing call dialog for manual entry */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Call Details</DialogTitle>
            <DialogDescription>
              {selectedRetailer?.name} - {selectedRetailer?.phone_number}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="transcript">Call Transcript</Label>
              <Textarea
                id="transcript"
                placeholder="Enter the call transcript..."
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                rows={8}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price Offered ($)</Label>
              <Input
                id="price"
                type="number"
                placeholder="Enter price if provided"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleSaveCall} disabled={!transcript || isProcessing}>
              {isProcessing ? "Processing..." : "Save Call Data"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
