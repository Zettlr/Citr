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
export declare function validateFullCitation(citation: string): boolean;
export declare function validateCitationPart(citation: string): boolean;
export declare function validateCitationID(id: string, strict?: boolean): boolean;
