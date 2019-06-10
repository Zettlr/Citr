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

/**
 * Returns true or false based upon the result of the regular expression given.
 *
 * @export
 * @param {string} citation
 * @returns Boolean
 */
export function validateFullCitation (citation: string): Boolean {
  // Citations, as defined in the reference, only need to be encapsulated in square brackets and
  // have one key beginning with an @. The validation of the ID is not the business of this
  // function. See validateCitationID for this matter.
  return /^\[([^[\]]*@[^[\]]+)\]$/.test(citation)
}

/**
 * Validates one single citation part to make sure it contains exactly
 * one @-identifier.
 *
 * @export
 * @param {string} citation The citation to check.
 * @returns {Boolean} True or false, based on the check.
 */
export function validateCitationPart (citation: string): Boolean {
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
 * @param {string} id the ID to be tested
 * @returns {Boolean} True or false, depending of the outcome.
 */
export function validateCitationID (id: string): Boolean {
  // The ID must have the following form:
  // 1. Begin with an @.
  // 2. Followed by a-zA-Z0-9_.
  // 3. Optionally followed by a-za-Z0-9_ and (:.#$%&-+?<>~/).
  return /^@?[a-zA-Z0-9_][a-zA-Z0-9_:.#$%&\-+?<>~/]*$/.test(id)
}
