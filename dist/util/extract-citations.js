"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractCitations = void 0;
const validator_1 = require("./validator");
const regex_1 = require("./regex");
function extractCitations(file, strict = false) {
    let allCitations = [];
    let citation;
    while ((citation = regex_1.citationExtractionRE.exec(file)) !== null) {
        if (citation[3]) {
            if (!validator_1.validateCitationID(citation[3], strict))
                continue;
            allCitations.push(citation[3]);
        }
        else if (citation[1]) {
            if (!validator_1.validateFullCitation(citation[1]))
                continue;
            allCitations.push(citation[1]);
        }
    }
    return allCitations;
}
exports.extractCitations = extractCitations;
