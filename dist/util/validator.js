"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
function validateFullCitation(citation) {
    return /^\[([^[\]]*@[^[\]]+)\]$/.test(citation);
}
exports.validateFullCitation = validateFullCitation;
function validateCitationPart(citation) {
    return citation.split('@').length === 2;
}
exports.validateCitationPart = validateCitationPart;
function validateCitationID(id, strict = false) {
    if (strict) {
        return /^@?[a-zA-Z0-9_][a-zA-Z0-9_:.#$%&\-+?<>~/]*$/.test(id);
    }
    else {
        return /^@?[\p{L}\d_][\p{L}\d_:.#$%&\-+?<>~\/]*$/u.test(id);
    }
}
exports.validateCitationID = validateCitationID;
