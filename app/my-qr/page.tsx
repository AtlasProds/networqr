"use client"

import { useEffect, useState, Suspense, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import QRCode from "qrcode"
import { setCookie, getCookie } from "cookies-next"

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed"
    platform: string
  }>
  prompt(): Promise<void>
}

function MyQRContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [currentQR, setCurrentQR] = useState(0)
  const [qrCodes, setQrCodes] = useState<{
    linkedin: string
    phone: string
  }>({ linkedin: "", phone: "" })
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState<boolean>(() => {
    const installDismissed = getCookie("installDismissed")
    return !installDismissed
  })

  const fullName = searchParams.get("name") || ""
  const linkedinUrl = searchParams.get("linkedin") || ""
  const phoneNumber = searchParams.get("phone") || ""

  const qrData = [
    {
      title: "LinkedIn Profile",
      url: linkedinUrl,
      qr: qrCodes.linkedin,
      color: "#0A66C2",
    },
    {
      title: "Phone Number",
      url: phoneNumber,
      qr: qrCodes.phone,
      color: "#059669",
    },
  ]

  useEffect(() => {
    const generateQRCodes = async () => {
      try {
        // Format phone number for tel: protocol
        const telPhone = `tel:+${phoneNumber.replace(/\D/g, "")}`

        const linkedinQR = await QRCode.toDataURL(linkedinUrl, {
          width: 280,
          margin: 2,
          color: {
            dark: "#000000", // Black for the QR code
            light: "#FFFFFF", // White for the background
          },
        })

        const phoneQR = await QRCode.toDataURL(telPhone, {
          width: 280,
          margin: 2,
          color: {
            dark: "#000000", // Black for the QR code
            light: "#FFFFFF", // White for the background
          },
        })

        setQrCodes({
          linkedin: linkedinQR,
          phone: phoneQR,
        })
      } catch (error) {
        console.error("Error generating QR codes:", error)
      }
    }

    if (linkedinUrl && phoneNumber) {
      generateQRCodes()
    }

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      deferredPrompt.current = e
      const installDismissed = getCookie("installDismissed")
      if (!installDismissed) {
        setShowInstallPrompt(true)
      }
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [linkedinUrl, phoneNumber])

  const handleAddToHomeScreen = async () => {
    if (deferredPrompt.current) {
      deferredPrompt.current.prompt()
      const { outcome } = await deferredPrompt.current.userChoice
      if (outcome === "accepted") {
        console.log("User accepted the A2HS prompt")
      } else {
        console.log("User dismissed the A2HS prompt")
      }
      deferredPrompt.current = null
      setShowInstallPrompt(false)
    } else {
      // Fallback for browsers that don't support beforeinstallprompt or if it's already been shown
      if (navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome")) {
        alert('To add to home screen:\n1. Tap the Share button\n2. Scroll down and tap "Add to Home Screen"')
      } else {
        alert('To add to home screen:\n1. Tap the menu (⋮)\n2. Tap "Add to Home screen" or "Install app"')
      }
    }
  }

  const handleDismissInstallPrompt = () => {
    setCookie("installDismissed", "true", { maxAge: 60 * 60 * 24 * 365 }) // 1 year
    setShowInstallPrompt(false)
  }

  if (!fullName || !linkedinUrl || !phoneNumber) {
    return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm bg-slate-700 border-slate-600">
          <CardContent className="pt-6">
            <p className="text-center text-slate-300 mb-4 text-sm">
              No contact information found. Please go back and fill out the form.
            </p>
            <Button
              onClick={() => router.push("/")}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Form
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQRData = qrData[currentQR]

  return (
    <div className="min-h-screen bg-slate-800 p-4">
      <div className="max-w-sm mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="text-slate-300 hover:text-white hover:bg-slate-700 p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-xl font-bold text-white">
              Networ
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">QR</span>
            </h1>
          </div>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-white mb-1">{fullName}</h2>
          <p className="text-slate-400 text-sm">Your personalized QR codes</p>
        </div>

        {/* Add to Home Screen Button */}
        <div className="flex justify-center mb-4">
          <Button
            onClick={handleAddToHomeScreen}
            className={`flex-1 ${deferredPrompt.current && showInstallPrompt ? "mr-2" : ""} bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3`}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add to Home Screen
          </Button>
          {deferredPrompt.current && showInstallPrompt && (
            <Button
              variant="outline"
              onClick={handleDismissInstallPrompt}
              className="flex-1 bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white font-medium py-3"
            >
              No Thanks
            </Button>
          )}
        </div>

        {/* QR Code Carousel */}
        <div className="relative flex items-center justify-center mb-4">
          <Button
            variant="ghost"
            onClick={() => setCurrentQR(currentQR === 0 ? qrData.length - 1 : currentQR - 1)}
            className="absolute left-0 z-10 text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-30 px-4 py-2"
            disabled={currentQR === 0}
          >
            <ChevronLeft className="w-10 h-10" />
          </Button>

          <Card className="bg-slate-700 border-slate-600 w-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-center text-lg">{currentQRData.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {currentQRData.qr ? (
                <div className="bg-white p-4 rounded-xl mb-4">
                  <img
                    src={currentQRData.qr || "/placeholder.svg"}
                    alt={`${currentQRData.title} QR Code`}
                    className="w-70 h-70"
                  />
                </div>
              ) : (
                <div className="w-70 h-70 bg-slate-600 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-slate-400 text-sm">Generating...</span>
                </div>
              )}
              <p className="text-xs text-slate-400 text-center break-all px-2">{currentQRData.url}</p>
            </CardContent>
          </Card>

          <Button
            variant="ghost"
            onClick={() => setCurrentQR(currentQR === qrData.length - 1 ? 0 : currentQR + 1)}
            className="absolute right-0 z-10 text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-30 px-4 py-2"
            disabled={currentQR === qrData.length - 1}
          >
            <ChevronRight className="w-10 h-10" />
          </Button>
        </div>

        {/* Navigation Dots */}
        <div className="flex items-center justify-center space-x-2 mb-4">
          {qrData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQR(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentQR ? "bg-purple-400" : "bg-slate-600"
              }`}
            />
          ))}
        </div>

        <footer className="text-center mt-8 text-xs text-slate-500">
          <div className="font-semibold text-slate-300 mb-1">NetworQR</div>
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

export default function MyQRPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-800 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-slate-300 text-sm">Loading...</p>
          </div>
        </div>
      }
    >
      <MyQRContent />
    </Suspense>
  )
}
