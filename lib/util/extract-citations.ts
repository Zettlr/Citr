/*!
 * BEGIN HEADER
 *
 * Contains:    This contains a utility function to extract all citations from a given text.
 * Maintainer:  Hendrik Erz
 * License:     GNU GPL v3
 *
 * Description:     Simply pass a full Markdown file in here to extract all citations as an array.
 *
 * END HEADER
 */

import { validateFullCitation } from "./validator"

/**
 * Extracts all citations from a text. Please note that the extracted citations must not necessarily
 * be completely correct.
 *
 * @export
 * @param {string} file The file to be parsed.
 * @returns {string[]} An Array containing all found citations.
 */
export function extractCitations(file: string): string[] {
  let allCitations: string[] = []

  // First we need a regular expression to filter out all citations
  let citationRE = /(\[([^[\]]*@[^[\]]+)\])/g
  let citation: RegExpExecArray | string[] | null

  // Now match everything in the text.
  while ((citation = citationRE.exec(file)) !== null) {
    // Only include valid citations
    if (!validateFullCitation(citation[0])) continue
    allCitations.push(citation[0])
  }

  return allCitations
}
