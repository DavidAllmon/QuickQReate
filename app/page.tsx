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
import { Dialog } from "@headlessui/react";

export default function Home() {
  const [input, setInput] = useState("");
  const [fgColor, setFgColor] = useState("#FFFFFF");
  const [bgColor, setBgColor] = useState("#1F2937");
  const [size, setSize] = useState(256);
  const [level, setLevel] = useState<"L" | "M" | "Q" | "H">("L");
  const [logo, setLogo] = useState<string | null>(null);
  const [qrType, setQrType] = useState<"url" | "vcard" | "wifi">("url");
  const [isErrorCorrectionModalOpen, setIsErrorCorrectionModalOpen] = useState(false);

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
                <div className="flex items-center mb-2">
                  <label htmlFor="level" className="block text-sm font-medium text-purple-300">
                    Error Correction Level
                  </label>
                  <button
                    onClick={() => setIsErrorCorrectionModalOpen(true)}
                    className="ml-2 text-purple-300 hover:text-purple-100 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
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

        {/* Error Correction Level Modal */}
        <Dialog
          open={isErrorCorrectionModalOpen}
          onClose={() => setIsErrorCorrectionModalOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md max-h-[90vh] overflow-hidden rounded-2xl bg-gray-800 shadow-xl transition-all">
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-4rem)]">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-purple-300 mb-4"
                >
                  Error Correction Level
                </Dialog.Title>
                <div className="mt-2 space-y-4 text-sm text-gray-300">
                  <p>
                    Error correction level is a crucial feature of QR codes that allows them to remain readable even if they are partially damaged or obscured. It determines the amount of redundant data included in the QR code, which can be used to reconstruct the original information if parts of the code are unreadable.
                  </p>
                  <p>
                    There are four levels of error correction:
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li><strong>L (Low)</strong>: 7% of data can be restored. Use this for large QR codes or when you&apos;re confident the code won&apos;t be damaged.</li>
                    <li><strong>M (Medium)</strong>: 15% of data can be restored. This is the most common level, suitable for most applications.</li>
                    <li><strong>Q (Quartile)</strong>: 25% of data can be restored. Use this if you expect the QR code might get somewhat damaged or dirty.</li>
                    <li><strong>H (High)</strong>: 30% of data can be restored. Use this for small QR codes or when you expect significant damage or obstruction.</li>
                  </ul>
                  <p>
                    Higher error correction levels increase the QR code&apos;s reliability but also increase its complexity and density. This means that for the same amount of data, a QR code with high error correction will be larger or have smaller individual squares compared to one with low error correction.
                  </p>
                  <p>
                    When choosing an error correction level, consider:
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>The environment where the QR code will be used (e.g., outdoors, on a product label)</li>
                    <li>The expected lifespan of the QR code</li>
                    <li>The importance of the data (e.g., critical information vs. a simple URL)</li>
                    <li>The available space for the QR code</li>
                  </ul>
                </div>
              </div>
              <div className="bg-gray-700 px-6 py-4 flex justify-end">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
                  onClick={() => setIsErrorCorrectionModalOpen(false)}
                >
                  Got it, thanks!
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </main>
  );
}
