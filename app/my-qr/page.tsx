"use client"

import { useEffect, useState, Suspense, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Plus, Linkedin, Phone } from "lucide-react"
import QRCode from "qrcode"
import { setCookie, getCookie } from "cookies-next"
import Footer from "@/components/Footer"

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
  const fullName = searchParams.get("name") || ""
  const linkedinUrl = searchParams.get("linkedin") || ""
  const phoneNumber = searchParams.get("phone") || ""

  const qrData = [
    {
      title: "LinkedIn Profile",
      url: linkedinUrl,
      qr: qrCodes.linkedin,
      color: "#0A66C2",
      icon: <Linkedin className="w-4 h-4" />,
    },
    ...(phoneNumber
      ? [
          {
            title: "Phone Number",
            url: phoneNumber,
            qr: qrCodes.phone,
            color: "#059669",
            icon: <Phone className="w-4 h-4" />,
          },
        ]
      : []),
  ]

  useEffect(() => {
    const generateQRCodes = async () => {
      try {
        const linkedinQR = await QRCode.toDataURL(linkedinUrl, {
          width: 280,
          margin: 2,
          color: {
            dark: "#000000", // Black for the QR code
            light: "#FFFFFF", // White for the background
          },
        })

        let phoneQR = ""
        if (phoneNumber) {
          // Format phone number for tel: protocol
          const telPhone = `tel:+${phoneNumber.replace(/\D/g, "")}`
          phoneQR = await QRCode.toDataURL(telPhone, {
            width: 280,
            margin: 2,
            color: {
              dark: "#000000", // Black for the QR code
              light: "#FFFFFF", // White for the background
            },
          })
        }

        setQrCodes({
          linkedin: linkedinQR,
          phone: phoneQR,
        })
      } catch (error) {
        console.error("Error generating QR codes:", error)
      }
    }

    if (linkedinUrl) { // Only require linkedinUrl to generate QRs
      generateQRCodes()
    }

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [linkedinUrl, phoneNumber]) // Add phoneNumber to dependency array

  const currentQRData = qrData[currentQR] || qrData[0] // Ensure a default if phone is not present and currentQR is out of bounds

  return (
    <div className="min-h-screen bg-slate-800 flex flex-col">
      <div className="flex-1 p-4">
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

          {/* QR Code Tabs */}
          <Tabs value={currentQRData.title} onValueChange={(value) => setCurrentQR(qrData.findIndex(qr => qr.title === value))} className="flex flex-col items-center">
            <TabsList className={`grid w-full mb-4 bg-slate-700 border-slate-600 ${phoneNumber ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {qrData.map((qrItem) => (
                <TabsTrigger key={qrItem.title} value={qrItem.title} className="flex items-center space-x-2 text-slate-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                  {qrItem.icon}
                  <span>{qrItem.title.split(' ')[0]}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {qrData.map((qrItem, index) => (
              <TabsContent key={index} value={qrItem.title} className="w-full max-w-sm">
                <Card className="bg-slate-700 border-slate-600">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-center text-lg">{qrItem.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    {qrItem.qr ? (
                      <div className="bg-white p-4 rounded-xl mb-4 aspect-square flex items-center justify-center">
                        <img
                          src={qrItem.qr || "/placeholder.svg"}
                          alt={`${qrItem.title} QR Code`}
                          className="w-full h-full max-w-[280px] max-h-[280px] object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-square max-w-[280px] bg-slate-600 rounded-xl flex items-center justify-center mb-4">
                        <span className="text-slate-400 text-sm">Generating...</span>
                      </div>
                    )}
                    <p className="text-xs text-slate-400 text-center break-all px-2">{qrItem.url}</p>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
      <div className="p-4">
        <Footer />
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
