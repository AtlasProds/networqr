"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Gift } from "lucide-react"
import QRCode from "qrcode"

export default function Footer() {
  const [giftQR, setGiftQR] = useState<string>("")
  const giftUrl = "https://networqr.atlasprods.com"

  useEffect(() => {
    const generateGiftQR = async () => {
      try {
        const qr = await QRCode.toDataURL(giftUrl, {
          width: 200,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        })
        setGiftQR(qr)
      } catch (error) {
        console.error("Error generating gift QR code:", error)
      }
    }

    generateGiftQR()
  }, [giftUrl])

  return (
    <footer className="mt-8 text-xs text-slate-500 py-8 flex justify-between">
      <div className="flex flex-col text-left">
        <div className="font-semibold text-slate-300 mb-1">NetworQR</div>
        <div className="mb-2">
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
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-purple-400 hover:text-purple-300 hover:bg-slate-700 p-2 h-auto"
          >
            <Gift className="w-3 h-3 mr-1" />
            Gift NetworQR
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-slate-700 border-slate-600 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white text-center">Gift NetworQR</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            {giftQR ? (
              <div className="bg-white p-4 rounded-xl">
                <img
                  src={giftQR}
                  alt="NetworQR Gift QR Code"
                  className="w-[200px] h-[200px]"
                />
              </div>
            ) : (
              <div className="w-[200px] h-[200px] bg-slate-600 rounded-xl flex items-center justify-center">
                <span className="text-slate-400 text-sm">Generating...</span>
              </div>
            )}
            <div className="text-center">
              <p className="text-slate-300 text-sm mb-2">Share NetworQR with others!</p>
              <a
                href={giftUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 underline text-xs break-all"
              >
                {giftUrl}
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  )
}
