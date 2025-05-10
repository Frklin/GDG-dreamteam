"use client"

import { extractKeywordContext, extractKeyPoints } from "@/lib/text-utils"
import { capitalizeFirstLetter } from "@/lib/utils"

interface SlideCardProps {
  keyword: string
  text: string
  onKeywordClick: () => void
}

export default function SlideCard({ keyword, text, onKeywordClick }: SlideCardProps) {
  const context = extractKeywordContext(text, keyword)
  const keyPoints = extractKeyPoints(text, keyword)
  const capitalizedKeyword = capitalizeFirstLetter(keyword)

  return (
    <div className="flex justify-center my-8">
      <div
        className="w-64 h-96 rounded-xl overflow-hidden border-4 border-gray-800 shadow-xl cursor-pointer transform transition-transform hover:scale-105"
        onClick={onKeywordClick}
        style={{
          backgroundImage: "linear-gradient(to bottom, #f0f4ff, #e6eeff)",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Card Header */}
        <div className="h-16 bg-gradient-to-r from-purple-700 to-indigo-800 flex items-center justify-center p-2">
          <h2 className="text-white text-center text-lg font-bold leading-tight">
            What is <span className="bg-yellow-300 text-purple-900 px-1 rounded">{capitalizedKeyword}</span>?
          </h2>
        </div>

        {/* Card Content */}
        <div className="p-4 flex flex-col h-[calc(100%-4rem)]">
          {/* Card Image/Icon Area */}
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-indigo-600"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m12 16 4-4-4-4" />
                <path d="M8 12h8" />
              </svg>
            </div>
          </div>

          {/* Key Points */}
          <div className="flex-grow overflow-auto">
            <ul className="space-y-3">
              {keyPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="min-w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-800">{point}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Card Footer */}
          <div className="mt-3 pt-2 border-t border-gray-300 text-xs text-center text-gray-500">
            Click card to see full analysis
          </div>
        </div>
      </div>
    </div>
  )
}
