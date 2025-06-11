"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function HomePage() {
  const [fullName, setFullName] = useState("")
  const [linkedinUrl, setLinkedinUrl] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(true) // Default to open
  const router = useRouter()

  useEffect(() => {
    const storedFullName = localStorage.getItem("networqr_fullname");
    const storedLinkedinUrl = localStorage.getItem("networqr_linkedin");
    const storedPhoneNumber = localStorage.getItem("networqr_phone");

    if (storedFullName && storedLinkedinUrl && storedPhoneNumber) {
      setFullName(storedFullName);
      setLinkedinUrl(storedLinkedinUrl);
      setPhoneNumber(storedPhoneNumber);
      setIsFormOpen(false); // Collapse form if values exist
    }
  }, [])

  const handleUseStored = () => {
    const params = new URLSearchParams({
      name: fullName,
      linkedin: linkedinUrl,
      phone: phoneNumber,
    })
    router.push(`/my-qr?${params.toString()}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Cache values in local storage
    localStorage.setItem("networqr_fullname", fullName)
    localStorage.setItem("networqr_linkedin", linkedinUrl)
    localStorage.setItem("networqr_phone", phoneNumber)

    // Encode values as query params and redirect
    const params = new URLSearchParams({
      name: fullName,
      linkedin: linkedinUrl,
      phone: phoneNumber,
    })

    router.push(`/my-qr?${params.toString()}`)
  }

  const hasStoredValues = fullName && linkedinUrl && phoneNumber;

  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Networ<span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">QR</span>
          </h1>
          <p className="text-slate-300 text-sm">Generate QR codes for your professional network</p>
        </div>

        <Card className="bg-slate-700 border-slate-600">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-lg">Contact Information</CardTitle>
            <CardDescription className="text-slate-300 text-sm">
              {hasStoredValues && !isFormOpen
                ? "Using previously saved details."
                : "Enter your details to generate personalized QR codes"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasStoredValues && !isFormOpen ? (
              <div
                className="bg-slate-600 border border-slate-500 rounded-md p-4 mb-4 cursor-pointer hover:bg-slate-500 transition-colors"
                onClick={handleUseStored}
              >
                <h3 className="text-white font-semibold mb-2">Saved QR Details:</h3>
                <p className="text-slate-300 text-sm">
                  <span className="font-medium">Name:</span> {fullName}
                </p>
                <p className="text-slate-300 text-sm">
                  <span className="font-medium">LinkedIn:</span> {linkedinUrl}
                </p>
                <p className="text-slate-300 text-sm">
                  <span className="font-medium">Phone:</span> {phoneNumber}
                </p>
                <p className="text-purple-400 text-sm mt-2">Click to generate QR with these details</p>
              </div>
            ) : null}

            <Collapsible open={isFormOpen} onOpenChange={setIsFormOpen} className="space-y-4">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between text-white hover:bg-slate-600 hover:text-white">
                  {hasStoredValues ? "Create New QR" : "Enter Details"}
                  {isFormOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-slate-200 text-sm">
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="bg-slate-600 border-slate-500 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedin" className="text-slate-200 text-sm">
                      LinkedIn Profile URL
                    </Label>
                    <Input
                      id="linkedin"
                      type="url"
                      placeholder="https://linkedin.com/in/johndoe"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      required
                      className="bg-slate-600 border-slate-500 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-slate-200 text-sm">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 555 123 4567"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      className="bg-slate-600 border-slate-500 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3 mt-6"
                  >
                    Generate QR Codes
                  </Button>
                </form>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>

        <footer className="text-center mt-8 text-xs text-slate-400">
          <div className="font-semibold text-white mb-1">NetworQR</div>
          <div>
            Powered by{" "}
            <a
              href="https://atlasprods.com?utm_src=networqr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 underline"
            >
              AtlasProds
            </a>
          </div>
        </footer>
      </div>
    </div>
  )
}
