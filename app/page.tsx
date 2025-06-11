"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, Shield, Smartphone, Lock } from "lucide-react"
import Footer from "@/components/Footer"
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

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

    if (storedFullName && storedLinkedinUrl) { // Phone number is now optional
      setFullName(storedFullName);
      setLinkedinUrl(storedLinkedinUrl);
      setPhoneNumber(storedPhoneNumber || ""); // Handle case where phone might be null/undefined
      setIsFormOpen(false); // Collapse form if values exist
    }
  }, [])

  const handleUseStored = () => {
    const params = new URLSearchParams({
      name: fullName,
      linkedin: linkedinUrl,
    })
    if (phoneNumber) { // Only add phone if it exists
      params.append("phone", phoneNumber)
    }
    router.push(`/my-qr?${params.toString()}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Cache values in local storage
    localStorage.setItem("networqr_fullname", fullName)
    localStorage.setItem("networqr_linkedin", linkedinUrl)
    localStorage.setItem("networqr_phone", phoneNumber) // Store even if empty

    // Encode values as query params and redirect
    const params = new URLSearchParams({
      name: fullName,
      linkedin: linkedinUrl,
    })
    if (phoneNumber) { // Only add phone if it exists
      params.append("phone", phoneNumber)
    }

    router.push(`/my-qr?${params.toString()}`)
  }

  const hasStoredValues = fullName && linkedinUrl; // Phone number is now optional for this check

  return (
    <div className="min-h-screen bg-slate-800 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
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
                  : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hasStoredValues && !isFormOpen ? (
                <div
                  className="bg-slate-600 border border-slate-500 rounded-md p-4 mb-4 cursor-pointer hover:bg-slate-500 transition-colors"
                  onClick={handleUseStored}
                >
                  <h3 className="text-white font-semibold mb-2">Saved QR Details:</h3>
                  <table className="w-full text-slate-300 text-sm">
                    <tbody>
                      <tr>
                        <td className="font-medium">Name:</td>
                        <td className="text-right">{fullName}</td>
                      </tr>
                      <tr>
                        <td className="font-medium">LinkedIn:</td>
                        <td className="text-right">{linkedinUrl}</td>
                      </tr>
                      {phoneNumber && (
                        <tr>
                          <td className="font-medium">Phone:</td>
                          <td className="text-right">{phoneNumber}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <p className="text-purple-400 text-sm mt-2">Open QR</p>
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
                        Phone Number (Optional)
                      </Label>
                      <PhoneInput
                        id="phone"
                        placeholder="Enter phone number"
                        value={phoneNumber}
                        onChange={(value) => setPhoneNumber(value || "")}
                        defaultCountry="IN"
                        international
                        countryCallingCodeEditable={false}
                      />
                    </div>

                    {/* Privacy Notice */}
                    <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-700/30 rounded-lg p-4 mt-4">
                      <div className="flex items-center justify-center mb-3">
                        <div className="flex items-center space-x-2">
                          <Shield className="w-5 h-5 text-green-400" />
                          <span className="text-green-400 font-semibold text-sm">100% Private</span>
                        </div>
                      </div>
                      <p className="text-xs text-green-200 text-center leading-relaxed">
                        Entered information NEVER leaves your device
                      </p>
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
        </div>
      </div>
      <div className="p-4">
        <Footer />
      </div>
    </div>
  )
}
