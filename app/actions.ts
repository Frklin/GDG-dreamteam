"use server"

export async function analyzeText(text: string, keyword: string): Promise<string> {
  // Convert to lowercase for case-insensitive matching
  const lowerText = text.toLowerCase()
  const lowerKeyword = keyword.toLowerCase()

  // Split the text into sentences
  const sentences = text.split(/(?<=[.!?])\s+/)

  // Colors for highlighting related terms
  const highlightColors = ["bg-yellow-200", "bg-green-200", "bg-blue-200", "bg-purple-200", "bg-pink-200"]

  // Find related terms (simple implementation - words that appear in the same sentences as the keyword)
  const relatedTerms = new Set<string>()

  // Process each sentence
  const processedSentences = sentences.map((sentence, index) => {
    const lowerSentence = sentence.toLowerCase()

    // Check if the sentence contains the keyword or is related
    const isRelevant = lowerSentence.includes(lowerKeyword)

    if (isRelevant) {
      // Extract potential related terms (words longer than 4 characters)
      const words = sentence.match(/\b\w{5,}\b/g) || []
      words.forEach((word) => {
        if (word.toLowerCase() !== lowerKeyword && !relatedTerms.has(word.toLowerCase())) {
          relatedTerms.add(word.toLowerCase())
        }
      })

      // Process markdown-style bold text (**text**)
      let processedSentence = sentence.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

      // Highlight the keyword with yellow
      processedSentence = processedSentence.replace(
        new RegExp(keyword, "gi"),
        (match) => `<span class="${highlightColors[0]} font-medium">${match}</span>`,
      )

      // Highlight related terms with different colors (up to 4 related terms)
      Array.from(relatedTerms)
        .slice(0, 4)
        .forEach((term, i) => {
          processedSentence = processedSentence.replace(
            new RegExp(`\\b${term}\\b`, "gi"),
            (match) => `<span class="${highlightColors[i + 1]} font-medium">${match}</span>`,
          )
        })

      // Underline the whole relevant sentence and add dyslexia-friendly class
      return `<span class="underline decoration-blue-500 decoration-2 dyslexia-friendly">${processedSentence}</span>`
    } else {
      // Make non-relevant text semi-transparent
      return `<span class="opacity-20">${sentence}</span>`
    }
  })

  // Join the processed sentences back together
  return processedSentences.join(" ")
}
