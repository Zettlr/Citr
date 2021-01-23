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
exports.validateCitationID = exports.validateCitationPart = exports.validateFullCitation = void 0;
const regex_1 = require("./regex");
function validateFullCitation(citation) {
    return regex_1.fullCitationValidatorRE.test(citation);
}
exports.validateFullCitation = validateFullCitation;
function validateCitationPart(citation) {
    return citation.split('@').length === 2;
}
exports.validateCitationPart = validateCitationPart;
function validateCitationID(id, strict = false) {
    if (strict) {
        return regex_1.strictCitekeyValidatorRE.test(id);
    }
    else {
        return regex_1.looseCitekeyValidatorRE.test(id);
    }
}
exports.validateCitationID = validateCitationID;
