"use client"

import { useState } from "react"
import { analyzeText } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SlideCard from "@/components/slide-card"
import PdfUploader from "@/components/pdf-uploader"

export default function TextAnalyzer() {
  const [text, setText] = useState("")
  const [keyword, setKeyword] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [slideCreated, setSlideCreated] = useState(false)
  const [analyzedText, setAnalyzedText] = useState<string | null>(null)
  const [pdfName, setPdfName] = useState<string | null>(null)

  const handleCreateSlide = async () => {
    if (!text || !keyword) return

    setIsLoading(true)

    try {
      const analyzed = await analyzeText(text, keyword)
      setAnalyzedText(analyzed)
      setSlideCreated(true)
      setResult(null) // Clear previous results
    } catch (error) {
      console.error("Error analyzing text:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeywordClick = () => {
    if (analyzedText) {
      setResult(analyzedText)
    }
  }

  const handlePdfTextExtracted = (extractedText: string, fileName: string) => {
    setText(extractedText)
    setPdfName(fileName)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">Enter Text</TabsTrigger>
            <TabsTrigger value="pdf">Upload PDF</TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="mt-4">
            <div>
              <label htmlFor="text" className="block text-sm font-medium mb-2">
                Enter your text
              </label>
              <Textarea
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your paragraph here... Use **text** for bold formatting."
                className="min-h-[150px]"
                required
              />
            </div>
          </TabsContent>

          <TabsContent value="pdf" className="mt-4">
            <PdfUploader onTextExtracted={handlePdfTextExtracted} />

            {pdfName && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-800 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                  <span>
                    Successfully extracted text from <strong>{pdfName}</strong>
                  </span>
                </p>
              </div>
            )}

            {text && pdfName && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="extracted-text" className="block text-sm font-medium">
                    Extracted Text Preview
                  </label>
                  <Button variant="outline" size="sm" onClick={() => setText("")} className="text-xs">
                    Clear
                  </Button>
                </div>
                <div className="max-h-[150px] overflow-y-auto border rounded-md p-3 text-sm bg-gray-50">
                  {text.length > 300 ? text.substring(0, 300) + "..." : text}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div>
          <label htmlFor="keyword" className="block text-sm font-medium mb-2">
            Enter keyword
          </label>
          <Input
            id="keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter a keyword to focus on..."
            required
          />
        </div>

        <Button type="button" onClick={handleCreateSlide} className="w-full" disabled={isLoading || !text || !keyword}>
          {isLoading ? "Creating..." : "Create Card"}
        </Button>
      </div>

      {slideCreated && <SlideCard keyword={keyword} text={text} onKeywordClick={handleKeywordClick} />}

      {result && (
        <Card className="p-6 mt-6">
          <h2 className="text-lg font-semibold mb-4">Analysis Result</h2>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: result }} />
        </Card>
      )}
    </div>
  )
}
