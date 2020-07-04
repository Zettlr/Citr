/*!
 * BEGIN HEADER
 *
 * Contains:    Regular expressions for various tasks.
 * Maintainer:  Hendrik Erz
 * License:     GNU GPL v3
 *
 * Description: Citr needs to extract a lot of different functionality, so we
 *              need many different regular expressions. In this file, we
 *              collect them all to make it easy to maintain them.
 *
 * END HEADER
 */

/**
 * This regular expression also matches full citations as above, but
 * only expects the citation itself within the string. It contains one
 * capturing group that includes the full citation without the square
 * brackets.
 *
 * Full match: A full citation with square brackets
 * Group 1: The full citation without the square brackets
 */
export const fullCitationValidatorRE = /^\[([^[\]]*@[^[\]]+)\]$/

/**
 * This regular expression is a combination of the RegExp above and the
 * loose citekeyValidatorRE below, enabling us to capture both full citations
 * and loose citations in text.
 *
 * Full match: Either a full citation with square brackets, or a single citekey
 * Group 1: Full citation with square brackets
 * Group 2: Full citation without square brackets
 * Group 3: Single citekey (2nd alternative)
 */
export const citationExtractionRE = /(\[([^[\]]*@[^[\]]+)\])|(@[\p{L}\d_][\p{L}\d_:.#$%&\-+?<>~\/]*)/gu

/**
 * This regular expression matches citekeys with strict restrictions on what
 * is allowed, and what not (such as: may contain only ASCII characters).
 *
 * Full match: A single citekey (strict mode)
 * Group 1: A single citekey, but guaranteed without the optional @ in front.
 */
export const strictCitekeyValidatorRE = /^@?([a-zA-Z0-9_][a-zA-Z0-9_:.#$%&\-+?<>~/]*)$/

/**
 * This regular expression matches citekeys as loosely as possible to match
 * what pandoc-citeproc would try to pass as a valid citation key.
 *
 * Full match: A single citekey (loose mode)
 * Group 1: A single citekey, but guaranteed without the optional @ in front.
 */
export const looseCitekeyValidatorRE = /^@?([\p{L}\d_][\p{L}\d_:.#$%&\-+?<>~\/]*)$/u

/**
 * The locator regular expression matches locator mappings
 *
 * Full match: A full locator range (digits only, optionally divided by a '-')
 */
export const locatorRE = /\d+(?:-\d+)?/g
