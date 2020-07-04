/*!
 * BEGIN HEADER
 *
 * Contains:    Utility functions to retrieve the locator of citations.
 * Maintainer:  Hendrik Erz
 * License:     GNU GPL v3
 *
 * Description:     These are utility functions that help in retrieving the
 *      locator from a given citation string. ATTENTION these
 *      functions are not to be used outside of the Citr module
 *      as they require a very specific input string format!
 *
 * END HEADER
 */

import { locatorRE } from '../util/regex'

// First import all the locales available
import { en } from '../data/en'
import { de } from '../data/de'
import { fr } from '../data/fr'

// Then save them into the localeMappings array
const localeMappings = [ en, de, fr ]

/**
 * The locator result that is returned by the retrieveLocator function.
 *
 * @interface LocatorResult
 */
interface LocatorResult {
  label: string;
  natural: string;
}

/**
 * The suffix object that is returned by the extractLocator function.
 *
 * @interface FullSuffix
 */
interface FullSuffix {
  locator: string,
  label: string,
  suffix: string
}

/**
 * Parses a locator string and returns both the found locator and the corresponding label. Assumes
 * string to be prepared insofar as the locator is at the beginning of the string position.
 *
 * @export
 * @param {string} locatorString
 * @returns {LocatorResult} An object containing a "label" property and a "natural" property (which is the natural label)
 */
function retrieveLocator (locatorString: string): LocatorResult {
  // What we do here is simply check whether or not the locator is contained in any list.
  for (let locale of localeMappings) {
    for (let loc of Object.keys(locale)) {
      if (locatorString.indexOf(loc) === 0) {
        return { label: locale[loc], natural: loc }
      }
    }
  }

  return { label: '', natural: '' }
}

/**
 * Extracts the locator, and returns the locator, label and suffix properties containing
 * everything found after the citation key.
 *
 * @param {string} afterKey Everything from a single citation that follows the citation key.
 * @returns {FullSuffix} The full extracted suffix.
 */
export function extractLocator(afterKey: string): FullSuffix {
  // First things first: Prepare the return object.
  let retObject: FullSuffix = {
    locator: '',
    label: 'page', // Default is page
    suffix: ''
  }

  // First, clean up potential whitespace
  afterKey = afterKey.trim()

  // As the afterKey is defined as literally that: Everything after the key,
  // it will most probably begin with a comma, so if it does, remove it.
  if (afterKey[0] === ',') afterKey = afterKey.substr(1).trim()

  // Now before entering into the gruesome logic of extracting a correct
  // locator, let's try the simplest case: No locator label provided. In this
  // simplest of all cases, the first character of the afterKey string will be
  // a digit.
  if ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].includes(parseInt(afterKey[0]))) {
    // Hooray! Now simply extract the locator and suffix, and return!
    let locator = /^\d+(-\d+)?/.exec(afterKey)
    if (locator) {
      retObject.locator = locator[0]
      // Remove locator from the rest of the suffix
      retObject.suffix = afterKey.replace(locator[0], '')
    }

    // Return directly
    return retObject
  }

  // If we've landed here, we have a locator label explicitly given. And
  // therefore, the problems start. How do we extract a locator label that
  // might be given in all possible languages? Easy: We'll simply do this by
  // only supporting English. After all, each citation will be parsed
  // internally into citeproc, and for that matter the label and locator will
  // be translated in final output. We don't need to care so much about it now.
  let result = retrieveLocator(afterKey)
  if (result.label === '') {
    // There's been no match, so assume everything to be the suffix.
    retObject.suffix = afterKey
    return retObject
  }

  // There has been a match in label, so extract the locator now.
  retObject.label = result.label
  afterKey = afterKey.substr(result.natural.length).trim()

  // There is only one single problem: The locator may be divided into multiple
  // parts, e.g. 33-35, 149, 151. So we have to do multiple execs on the
  // remaining suffix and split the afterKey variable on the last found index.
  let match: RegExpExecArray | null
  let splitIndex = 0
  while ((match = locatorRE.exec(afterKey)) !== null) {
    splitIndex = match.index + match[0].length
   }

  // Now simply retrieve the two substrings.
  retObject.locator = afterKey.substr(0, splitIndex).trim()
  retObject.suffix = afterKey.substr(splitIndex + 1).trim()

  // Finally return both locator and suffix in an object.
  return retObject
}
