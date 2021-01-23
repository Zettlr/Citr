/*!
 * BEGIN HEADER
 *
 * Contains:    Validation utilities
 * Maintainer:  Hendrik Erz
 * License:     GNU GPL v3
 *
 * Description:     In this file, a variety of validation functions are located. One is also exposed
 *      at the module level used to validate citation IDs.
 *
 * END HEADER
 */

import {
  fullCitationValidatorRE,
  strictCitekeyValidatorRE,
  looseCitekeyValidatorRE
} from './regex'

/**
 * Returns true or false based upon the result of the regular expression given.
 *
 * @export
 * @param {string} citation
 * @returns {boolean}
 */
export function validateFullCitation (citation: string): boolean {
  // Citations, as defined in the reference, only need to be encapsulated in square brackets and
  // have one key beginning with an @. The validation of the ID is not the business of this
  // function. See validateCitationID for this matter.
  return fullCitationValidatorRE.test(citation)
}

/**
 * Validates one single citation part to make sure it contains exactly
 * one @-identifier.
 *
 * @export
 * @param {string} citation The citation to check.
 * @returns {boolean} True or false, based on the check.
 */
export function validateCitationPart (citation: string): boolean {
  // There must be exactly one citation key inside the given citation, so
  // if we split it, it must yield exactly two results. If it only yields
  // one result, there was no @ present, and if it yields more than two
  // results, there were multiple @'s present.
  return citation.split('@').length === 2
}

/**
 * Validates a citation ID in the form @mykey1990 and returns true if it matches.
 * The preceeding @ may be omitted.
 *
 * @export
 * @param {string} id The ID to be tested
 * @param {boolean} [strict=false] Whether or not to use strict mode (see source for explanations)
 * @returns {boolean} True or false, depending of the outcome.
 */
export function validateCitationID (id: string, strict: boolean = false): boolean {
  // Why should you use strict mode? There should be few scenarios where this is
  // *really* necessary, but among them are: environments where you cannot be sure
  // that Unicode is actually present; you want to enforce simple citation keys;
  // you have to deal with adversarial environments where other parts further down
  // the pipeline might cough if they encounter non-ascii characters. For normal use
  // (read in Markdown and validate the contained citations against a library on a
  // local environment for a normal end-user), non-strict should be preferred.
  if (strict) {
    // The ID must have the following form:
    // 1. Begin with an @.
    // 2. Followed by a-zA-Z0-9_.
    // 3. Optionally followed by a-za-Z0-9_ and (:.#$%&-+?<>~/).
    return strictCitekeyValidatorRE.test(id)
  } else {
    // As Pandoc tries to be as forgiving as possible when it comes
    // to what is allowed, we'll also allow any conceivable character
    // from any script (also non-latin, such as Japanese, Chinese,
    // Ethiopian, or Russian) to be part of the citation ID. As we
    // make use of Unicode flags, this might cause errors in older
    // browsers, but the alternative would be a 14,000 characters
    // monster that we certainly don't want in our file. Keep it nice
    // and clean, and whoever wants to use Internet Explorer can go
    // someplace else. See the discussion here:
    // https://groups.google.com/forum/#!topic/pandoc-discuss/Dwgim0y8VEs
    return looseCitekeyValidatorRE.test(id)
  }
}
