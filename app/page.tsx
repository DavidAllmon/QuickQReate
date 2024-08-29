"use client";

import React, { useState, useEffect, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import ColorPicker from "./components/ColorPicker";
import ImageUpload from "./components/ImageUpload";
import VCardInput from "./components/VCardInput";
import WiFiInput from "./components/WiFiInput";
import NextImage from "next/image";
import quickLogo from "./assets/quick.png";
import { motion } from "framer-motion";
import URLInput from "./components/URLInput";

export default function Home() {
  const [input, setInput] = useState("");
  const [fgColor, setFgColor] = useState("#FFFFFF");
  const [bgColor, setBgColor] = useState("#1F2937");
  const [size, setSize] = useState(256);
  const [level, setLevel] = useState<"L" | "M" | "Q" | "H">("L");
  const [logo, setLogo] = useState<string | null>(null);
  const [qrType, setQrType] = useState<"url" | "vcard" | "wifi">("url");

  const calculateLogoSize = useCallback(() => {
    // Logo size is 20% of QR code size, with a minimum of 20px
    return Math.max(Math.floor(size * 0.2), 20);
  }, [size]);

  const downloadQRCode = () => {
    const svg = document.getElementById("qr-code");
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        canvas.width = size;
        canvas.height = size;
        ctx!.fillStyle = bgColor;
        ctx!.fillRect(0, 0, size, size);
        ctx!.drawImage(img, 0, 0, size, size);

        // Draw logo if it exists
        if (logo) {
          const logoImg = new Image();
          logoImg.onload = () => {
            const logoSize = calculateLogoSize();
            const logoX = (size - logoSize) / 2;
            const logoY = (size - logoSize) / 2;
            ctx!.drawImage(logoImg, logoX, logoY, logoSize, logoSize);

            // Save the final image
            const pngFile = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.download = "qrcode.png";
            downloadLink.href = pngFile;
            downloadLink.click();
          };
          logoImg.src = logo;
        } else {
          // Save the image without logo
          const pngFile = canvas.toDataURL("image/png");
          const downloadLink = document.createElement("a");
          downloadLink.download = "qrcode.png";
          downloadLink.href = pngFile;
          downloadLink.click();
        }
      };
      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    }
  };

  const handleLogoUpload = useCallback((file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogo(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setLogo(null);
    }
  }, []);

  useEffect(() => {
    document.body.className =
      "bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900";
  }, []);

  const qrCodeSize = size; // Use the size from state

  useEffect(() => {
    setInput('');
  }, [qrType]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 px-4 py-8 font-sans text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Compact Header with only the image logo */}
        <motion.div
          className="mb-8 flex items-center justify-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <NextImage
            src={quickLogo}
            alt="QuickQReate Logo"
            width={300}
            height={0}
            style={{ height: "auto" }}
            priority
            className="drop-shadow-2xl"
          />
        </motion.div>

        {/* Main Content */}
        <div className="grid gap-8 md:grid-cols-3">
          {/* Left Column: QR Type and Input */}
          <motion.div
            className="rounded-2xl bg-gray-800/50 p-6 shadow-2xl backdrop-blur-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="mb-4 text-xl font-semibold text-purple-300">QR Code Content</h2>
            <div className="space-y-4">
              <select
                id="qrType"
                value={qrType}
                onChange={(e) => setQrType(e.target.value as "url" | "vcard" | "wifi")}
                className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="url">URL or Text</option>
                <option value="vcard">vCard (Contact Information)</option>
                <option value="wifi">Wi-Fi Network</option>
              </select>

              {qrType === "url" && <URLInput value={input} onChange={setInput} />}
              {qrType === "vcard" && <VCardInput onVCardGenerated={setInput} />}
              {qrType === "wifi" && <WiFiInput onWiFiGenerated={setInput} />}
            </div>
          </motion.div>

          {/* Middle Column: QR Code Preview and Download */}
          <motion.div
            className="order-last md:order-none flex flex-col items-center justify-between rounded-2xl bg-gray-800/50 p-6 shadow-2xl backdrop-blur-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="mb-4 text-xl font-semibold text-purple-300">QR Code Preview</h2>
            <div
              className="relative mb-6"
              style={{ width: qrCodeSize, height: qrCodeSize }}
            >
              <div 
                className="absolute inset-0 blur-md rounded-lg bg-purple-500 opacity-30"
                style={{ 
                  width: qrCodeSize + 10, 
                  height: qrCodeSize + 10, 
                  left: -5, 
                  top: -5 
                }}
              ></div>
              <div className="relative">
                <QRCodeSVG
                  id="qr-code"
                  value={input || "https://example.com"}
                  size={qrCodeSize}
                  bgColor={bgColor}
                  fgColor={fgColor}
                  level={level}
                  includeMargin={true}
                  imageSettings={
                    logo
                      ? {
                          src: logo,
                          x: undefined,
                          y: undefined,
                          height: calculateLogoSize(),
                          width: calculateLogoSize(),
                          excavate: true,
                        }
                      : undefined
                  }
                />
              </div>
            </div>
            <button
              onClick={downloadQRCode}
              className="w-full rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Download QR Code
            </button>
          </motion.div>

          {/* Right Column: Customization Options */}
          <motion.div
            className="rounded-2xl bg-gray-800/50 p-6 shadow-2xl backdrop-blur-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 className="mb-4 text-xl font-semibold text-purple-300">Customize</h2>
            <div className="space-y-6">
              <ColorPicker label="Foreground Color" color={fgColor} onChange={setFgColor} />
              <ColorPicker label="Background Color" color={bgColor} onChange={setBgColor} />
              <div>
                <label htmlFor="size" className="mb-2 block text-sm font-medium text-purple-300">
                  Size
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    id="size"
                    min="128"
                    max="512"
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="mr-4 w-full accent-purple-500"
                  />
                  <span className="whitespace-nowrap text-sm text-purple-300">
                    {size}x{size}
                  </span>
                </div>
              </div>
              <div>
                <label htmlFor="level" className="mb-2 block text-sm font-medium text-purple-300">
                  Error Correction Level
                </label>
                <select
                  id="level"
                  value={level}
                  onChange={(e) => setLevel(e.target.value as "L" | "M" | "Q" | "H")}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="L">Low</option>
                  <option value="M">Medium</option>
                  <option value="Q">Quartile</option>
                  <option value="H">High</option>
                </select>
              </div>
              <ImageUpload onImageUpload={handleLogoUpload} />
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
