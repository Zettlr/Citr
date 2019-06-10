"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = require("./validator");
function extractCitations(file) {
    let allCitations = [];
    let citationRE = /(\[([^[\]]*@[^[\]]+)\])/g;
    let citation;
    while ((citation = citationRE.exec(file)) !== null) {
        if (!validator_1.validateFullCitation(citation[0]))
            continue;
        allCitations.push(citation[0]);
    }
    return allCitations;
}
exports.extractCitations = extractCitations;
