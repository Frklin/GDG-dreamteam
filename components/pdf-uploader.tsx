"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { extractTextFromPdf } from "@/lib/pdf-utils"

interface PdfUploaderProps {
  onTextExtracted: (text: string, fileName: string) => void
}

export default function PdfUploader({ onTextExtracted }: PdfUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      processFile(files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      processFile(files[0])
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const processFile = async (file: File) => {
    // Check if file is a PDF
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const text = await extractTextFromPdf(file)
      onTextExtracted(text, file.name)
    } catch (err) {
      console.error("Error extracting text from PDF:", err)
      setError("Failed to extract text from PDF. Please try another file.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-500"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <path d="M9 15v-2" />
            <path d="M12 15v-6" />
            <path d="M15 15v-4" />
          </svg>

          <div className="text-sm text-gray-600">
            <p className="font-medium">Drag and drop your PDF here</p>
            <p className="mt-1">or</p>
          </div>

          <Button type="button" variant="outline" size="sm" onClick={handleButtonClick} disabled={isLoading}>
            {isLoading ? "Processing..." : "Select PDF"}
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileChange}
            disabled={isLoading}
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center items-center space-x-2">
          <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
          <p className="text-sm text-gray-600">Extracting text from PDF...</p>
        </div>
      )}
    </div>
  )
}
