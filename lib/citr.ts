/*!
 * BEGIN HEADER
 *
 * Contains:    Citr module
 * Maintainer:  Hendrik Erz
 * License:     GNU GPL v3
 *
 * Description:     Citr converts Pandoc Markdown citations into CSL JSON objects that can be fed into
 *      citeproc implementations. Citr expects citations to be fed into the parser to
 *      implement the structure outlined here: https://pandoc.org/demo/example19/Extension-citations.html
 *
 * END HEADER
 */
import {
  validateFullCitation,
  validateCitationPart,
  validateCitationID
} from './util/validator'

import {
  strictCitekeyValidatorRE,
  looseCitekeyValidatorRE
} from './util/regex'

import { extractLocator } from './util/retrieve-locator'
import { extractCitations } from './util/extract-citations'

/**
   * Expose validateCitationID and extractCitations to the outside.
   *
   */
export const util = {
  'validateCitationID': validateCitationID,
  'extractCitations': extractCitations
}

/**
 * Declares the full Citation interface as expected by citeproc. To quote:
 * > "Citations go inside square brackets and are separated by semicolons.
 * > Each citation must have a key, composed of `@' + the citation identifier
 * > from the database, and may optionally have a prefix, a locator, and a
 * > suffix. The citation key must begin with a letter, digit, or _, and may
 * > contain alphanumerics, _, and internal punctuation characters (:.#$%&-+?<>~/)."
 *
 * @interface Citation
 */
interface Citation {
  prefix: string,
  suffix: string,
  id: string,
  locator: string,
  label: string,
  'suppress-author': boolean
}
/**
 * Parses a single citation
 *
 * @param {string} citation The citation to parse
 * @param {Boolean} [strict=false] Whether or not to use strict mode (see source of validateCitationID for explanations)
 * @returns {Citation[]} An array containing all found citation keys.
 * @memberof Citr
 */
export function parseSingle(citation: string, strict: boolean = false): Citation[] {
  if (validateCitationID(citation, strict) && citation[0] === '@') {
    // It appears the citation was citekey-only. So let's just return that one.
    return [{
      prefix: '',
      suffix: '',
      id: citation.substr(1),
      locator: '',
      label: 'page',
      'suppress-author': false
    }]
  }

  if (!validateFullCitation(citation)) throw new Error(`Invalid Key - Invalid citation passed: ${citation}.`)

  let returnCitations: Citation[] = []

  // Now let's parse this thing. First of all, remove the first and last character, as
  // they are simply square brackets. Additionally, split the citation along delimiters.
  let _citation = citation.substr(1, citation.length - 2).split(';')

  let invalidPrefixes: string[] = []

  // Now iterate over all citations the user passed in to return them as an array.
  for (let c of _citation) {
    // It could be that the user just ended his/her citation with a ;
    if (c === '') continue

    // Make sure there is exactly one @ available.
    if (!validateCitationPart(c)) {
      // If the validator fails, this means that there's no @ or multiple @,
      // and hence no valid citation key in there. This means that the user has
      // written something along the lines of [as we can see here; further
      // @citekey1234; @citekey4321] or [see the corresponding mails
      // hello@example.com and webmaster@example.com; further @citekey1234].
      // --> treat it as a part of the prefix for the next citation part.
      invalidPrefixes.push(c)
      continue
    }

    // The Prefix is defined as everything before the citation key, so the
    // first index of the split array will contain the Prefix (If @ is the
    // first character, the string will be empty). Make sure to add possible
    // invalid prefixes from before
    let prefix = ''
    if (invalidPrefixes.length === 1) {
      prefix = invalidPrefixes + ';'
    }
    else if (invalidPrefixes.length > 1) {
      prefix = invalidPrefixes.join(';')
    }

    prefix += c.split('@')[0] // Add the actual prefix
    prefix = prefix.trim() // Trim whitespaces

    // Reset the additional prefixes here.
    invalidPrefixes = []

    // Next, the user can decide to omit the author from the citation by prepending the
    // @-character with a minus (-). We cannot look for the end of the prefix because
    // the user may have accidentally put a space in between the minus and the @.
    let suppressAuthor = c.indexOf('@') > 0 && c[c.indexOf('@') - 1] === '-'

    // In case the user wants to suppress the author, we know that the last character
    // of the prefix is a minus character, which is undesired in output. So remove it.
    // Make sure to re-trim the prefix again to remove potential whitespace.
    if (suppressAuthor) prefix = prefix.substr(0, prefix.length - 1).trim()

    // Now we need to extract the citation key. We'll be reusing the citation
    // validator regular expression. But as the secondHalf also contains the
    // suffix, locator, etc., we have to first cut it down. The citation key
    // can either be terminated with a comma or with a space.
    let commaIndex: number | undefined = c.split('@')[1].indexOf(',') + 1
    // If the commaIndex is 0, this means there was no comma - check for space
    if (commaIndex === 0) commaIndex = c.split('@')[1].indexOf(' ') + 1
    // Pass undefined to extract everything
    if (commaIndex <= 0) commaIndex = undefined

    // Now extract the key
    let citationKeyPart = c.substr(c.indexOf('@'), commaIndex)
    let extractedKey: RegExpExecArray | null = null
    if (strict) {
      extractedKey = strictCitekeyValidatorRE.exec(citationKeyPart)
    } else {
      extractedKey = looseCitekeyValidatorRE.exec(citationKeyPart)
    }

    // If the match has not been found, abort
    if (extractedKey === null) throw new Error(`Invalid Key - Invalid citation passed: ${c}`)

    // Now group 1 contains the valid ID.
    let citeKey = extractedKey[1]

    // The final two things that could possibly still be in the citation are a
    // locator and a suffix. Let us first extract everything after the key.
   let afterKey = c.split('@')[1].substr(extractedKey[1].length).trim()

    // The logic to get the locator is extremely difficult, as the locator
    // mainly is written in natural language. We'll offload the work to
    // retrieve the locator and the suffix to a utility function.
    let { suffix, locator, label } = extractLocator(afterKey)

    // Create a new Citation and push it to the array.
    returnCitations.push({
      prefix: prefix,
      suffix: suffix,
      id: citeKey,
      locator: locator,
      label: label,
      'suppress-author': suppressAuthor
    })
  }

  // Indicate that no citation has been found, which is a good indicator
  // that there is no valid citation (even excluding the invalid prefixes)
  if (returnCitations.length === 0 && _citation.length > 0) {
    throw new Error(`Invalid citation passed: ${citation}`)
  }

  // After everything has run, return all citations found.
  return returnCitations
}

/**
 * This function renders an array of citations to a Markdown citation string.
 *
 * @export
 * @param {Citation[]} citationArray The array to be transformed.
 * @returns {string} The complete string.
 */
export function makeCitation(citationArray: Citation[]): string {
  // Failsafe if the user passed only a single citation object
  if (!Array.isArray(citationArray)) citationArray = [citationArray]

  // Prepare the returning array
  let returnArray: string[] = []

  // Loop through all citations
  for (let csl of citationArray) {
    // Add the properties as they occur
    let res = ''
    if (!csl.hasOwnProperty('id')) throw new Error('Citation had no ID given!')

    if (csl.hasOwnProperty('prefix')) res += csl.prefix + ' '
    if (csl.hasOwnProperty('suppress-author') && csl['suppress-author']) res += '-'
    res += '@' + csl.id
    if (csl.hasOwnProperty('label') && csl.hasOwnProperty('locator')) res += ', ' + csl.label + ' ' + csl.locator
    if (csl.hasOwnProperty('suffix')) res += ' ' + csl.suffix

    // After everything is done, push it to the resulting array.
    returnArray.push(res.trim())
  }

  return `[${returnArray.join('; ')}]`
}
