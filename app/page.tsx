'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import ColorPicker from './components/ColorPicker'
import ImageUpload from './components/ImageUpload'
import NextImage from 'next/image'
import quickLogo from './assets/quick.png'

export default function Home() {
  const [input, setInput] = useState('')
  const [fgColor, setFgColor] = useState('#FFFFFF')
  const [bgColor, setBgColor] = useState('#1F2937')
  const [size, setSize] = useState(256)
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('L')
  const [logo, setLogo] = useState<string | null>(null)

  const downloadQRCode = () => {
    const svg = document.getElementById('qr-code')
    const svgData = new XMLSerializer().serializeToString(svg!)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.onload = () => {
      canvas.width = size
      canvas.height = size
      ctx!.fillStyle = bgColor
      ctx!.fillRect(0, 0, size, size)
      ctx!.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.download = 'qrcode.png'
      downloadLink.href = pngFile
      downloadLink.click()
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  const handleLogoUpload = useCallback((file: File | null) => {
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogo(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setLogo(null)
    }
  }, [])

  useEffect(() => {
    document.body.className = 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900'
  }, [])

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-white font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16 text-center">
          <div className="flex justify-center">
            <NextImage
              src={quickLogo}
              alt="QuickQReate Logo"
              width={400}
              height={0}
              style={{ height: 'auto' }}
              priority
              onError={(e) => {
                console.error("Error loading image:", e);
                // You can set a fallback here if needed
              }}
            />
          </div>
          <div className="mt-8 inline-block">
            <p className="relative text-xl font-medium py-3 px-6 rounded-full bg-opacity-10 bg-white backdrop-filter backdrop-blur-sm border border-transparent" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.05), rgba(255,255,255,0.05))',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.2) inset'
            }}>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300">
                Generate QR codes in a snap
              </span>
            </p>
          </div>
        </div>
        
        <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-2xl rounded-2xl p-8 transition-all duration-300 hover:shadow-purple-500/30">
          <div className="mb-8">
            <label htmlFor="input" className="block text-lg font-medium mb-2 text-purple-300">
              Enter URL or text
            </label>
            <input
              type="text"
              id="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white transition-all duration-300"
              placeholder="https://example.com"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <ColorPicker label="Foreground Color" color={fgColor} onChange={setFgColor} />
            <ColorPicker label="Background Color" color={bgColor} onChange={setBgColor} />
            <div>
              <label htmlFor="size" className="block text-lg font-medium mb-2 text-purple-300">
                Size
              </label>
              <input
                type="range"
                id="size"
                min="128"
                max="512"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full accent-purple-500"
              />
              <span className="text-sm text-purple-300 mt-1 block">{size}x{size}</span>
            </div>
            <div>
              <label htmlFor="level" className="block text-lg font-medium mb-2 text-purple-300">
                Error Correction Level
              </label>
              <select
                id="level"
                value={level}
                onChange={(e) => setLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white transition-all duration-300"
              >
                <option value="L">Low</option>
                <option value="M">Medium</option>
                <option value="Q">Quartile</option>
                <option value="H">High</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <ImageUpload onImageUpload={handleLogoUpload} />
            </div>
          </div>
          <div className="flex justify-center mb-8">
            <div className="p-2 rounded-2xl transition-all duration-300 group">
              <QRCodeSVG
                id="qr-code"
                value={input || 'https://example.com'}
                size={size}
                bgColor={bgColor}
                fgColor={fgColor}
                level={level}
                includeMargin={true}
                imageSettings={logo ? {
                  src: logo,
                  x: undefined,
                  y: undefined,
                  height: 24,
                  width: 24,
                  excavate: true,
                } : undefined}
              />
              <div className="mt-4 text-center">
                <p className="text-purple-300 text-sm">Scan me!</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              onClick={downloadQRCode}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300 transform hover:scale-105"
            >
              Download QR Code
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}