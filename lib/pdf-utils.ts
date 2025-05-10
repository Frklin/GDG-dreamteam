/**
 * Extracts text from a PDF file
 */
export async function extractTextFromPdf(file: File): Promise<string> {
  // We'll use the pdf.js library which is loaded from a CDN
  // First, ensure the PDF.js library is loaded
  if (typeof window !== "undefined" && !window.pdfjsLib) {
    await loadPdfJsLibrary()
  }

  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()

    fileReader.onload = async (event) => {
      try {
        const typedArray = new Uint8Array(event.target?.result as ArrayBuffer)

        // Load the PDF file
        const pdf = await window.pdfjsLib.getDocument({ data: typedArray }).promise
        let extractedText = ""

        // Extract text from each page
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const textContent = await page.getTextContent()
          const pageText = textContent.items.map((item: any) => item.str).join(" ")
          extractedText += pageText + "\n\n"
        }

        resolve(extractedText.trim())
      } catch (error) {
        reject(error)
      }
    }

    fileReader.onerror = (error) => {
      reject(error)
    }

    fileReader.readAsArrayBuffer(file)
  })
}

/**
 * Loads the PDF.js library from CDN
 */
async function loadPdfJsLibrary() {
  return new Promise<void>((resolve, reject) => {
    // Add PDF.js script
    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js"
    script.onload = () => {
      // Set worker source
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js"
      resolve()
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
}

// Add type definition for the PDF.js library
declare global {
  interface Window {
    pdfjsLib: any
  }
}
