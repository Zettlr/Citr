/*!
 * BEGIN HEADER
 *
 * Contains:    A utility function to extract citations from a piece of text.
 * Maintainer:  Hendrik Erz
 * License:     GNU GPL v3
 *
 * Description: Simply pass a full Markdown file to this function to extract
 *              all citations as an array.
 *
 * END HEADER
 */

import { validateFullCitation, validateCitationID } from './validator'
import { citationExtractionRE } from './regex'

/**
 * Extracts all citations from a text. Please note that the extracted citations
 * must not necessarily be completely correct.
 *
 * @export
 * @param {string} file The file to be parsed.
 * @param {boolean} strict Whether to apply strict mode to citekey validation
 * @returns {string[]} An Array containing all found citations.
 */
export function extractCitations(file: string, strict: boolean = false): string[] {
  let allCitations: string[] = []

  // First we need a regular expression to filter out all citations
  let citation: RegExpExecArray | string[] | null

  // Now match everything in the text.
  while ((citation = citationExtractionRE.exec(file)) !== null) {
    // Only include valid citations and citekeys
    if (citation[3]) {
      // Validate a standalone citation key
      if (!validateCitationID(citation[3], strict)) continue
      allCitations.push(citation[3])
    } else if (citation[1]) {
      // Validate a full citation
      if (!validateFullCitation(citation[1])) continue
      allCitations.push(citation[1])
    }
  }

  return allCitations
}
