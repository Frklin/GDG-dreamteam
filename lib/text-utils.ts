/**
 * Extracts a relevant context around the keyword from the text
 */
export function extractKeywordContext(text: string, keyword: string): string {
  const lowerText = text.toLowerCase()
  const lowerKeyword = keyword.toLowerCase()

  // Find the position of the keyword
  const keywordIndex = lowerText.indexOf(lowerKeyword)

  if (keywordIndex === -1) {
    return "No context found for this keyword."
  }

  // Find the sentence containing the keyword
  const sentenceStart = lowerText.lastIndexOf(".", keywordIndex) + 1
  const sentenceEnd = lowerText.indexOf(".", keywordIndex + lowerKeyword.length)

  // Extract the sentence and some context around it
  let contextStart = Math.max(0, sentenceStart - 30)
  let contextEnd = Math.min(text.length, sentenceEnd + 1)

  // Adjust to not cut words
  while (contextStart > 0 && text[contextStart] !== " " && text[contextStart] !== ".") {
    contextStart--
  }

  while (contextEnd < text.length && text[contextEnd] !== " " && text[contextEnd] !== ".") {
    contextEnd++
  }

  // Extract the context
  let context = text.substring(contextStart, contextEnd).trim()

  // Add ellipsis if we're not at the beginning or end
  if (contextStart > 0) {
    context = "..." + context
  }

  if (contextEnd < text.length) {
    context = context + "..."
  }

  return context
}

/**
 * Extracts key points related to the keyword from the text
 */
export function extractKeyPoints(text: string, keyword: string): string[] {
  const lowerText = text.toLowerCase()
  const lowerKeyword = keyword.toLowerCase()

  // Split the text into sentences
  const sentences = text.split(/(?<=[.!?])\s+/)

  // Find sentences containing the keyword
  const relevantSentences = sentences.filter((sentence) => sentence.toLowerCase().includes(lowerKeyword))

  // If we don't have enough relevant sentences, include nearby sentences
  let keyPoints: string[] = []

  if (relevantSentences.length > 0) {
    // Process the most relevant sentences to create concise key points
    keyPoints = relevantSentences.map((sentence) => {
      // Shorten the sentence if it's too long
      if (sentence.length > 100) {
        const keywordIndex = sentence.toLowerCase().indexOf(lowerKeyword)
        const startIndex = Math.max(0, keywordIndex - 30)
        const endIndex = Math.min(sentence.length, keywordIndex + lowerKeyword.length + 50)

        let shortenedSentence = sentence.substring(startIndex, endIndex).trim()

        // Add ellipsis if we cut the sentence
        if (startIndex > 0) {
          shortenedSentence = "..." + shortenedSentence
        }

        if (endIndex < sentence.length) {
          shortenedSentence = shortenedSentence + "..."
        }

        return shortenedSentence
      }

      return sentence.trim()
    })

    // Limit to 3-4 key points
    keyPoints = keyPoints.slice(0, Math.min(4, keyPoints.length))
  }

  // If we still don't have enough key points, create some generic ones
  if (keyPoints.length === 0) {
    keyPoints = [`No specific information about "${keyword}" found in the text.`]
  }

  return keyPoints
}
