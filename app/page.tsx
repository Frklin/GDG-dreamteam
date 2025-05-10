import TextAnalyzer from "@/components/text-analyzer"

export default function Home() {
  return (
    <main className="min-h-screen p-6 md:p-12 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Text Analyzer</h1>
        <p className="text-gray-600 mb-8 text-center">
          Enter your text and a keyword to highlight relevant content and fade out non-relevant parts.
        </p>
        <TextAnalyzer />
      </div>
    </main>
  )
}
