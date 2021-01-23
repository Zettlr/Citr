"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCitation = exports.parseSingle = exports.util = void 0;
const validator_1 = require("./util/validator");
const regex_1 = require("./util/regex");
const retrieve_locator_1 = require("./util/retrieve-locator");
const extract_citations_1 = require("./util/extract-citations");
exports.util = {
    'validateCitationID': validator_1.validateCitationID,
    'extractCitations': extract_citations_1.extractCitations
};
function parseSingle(citation, strict = false) {
    if (validator_1.validateCitationID(citation, strict) && citation[0] === '@') {
        return [{
                prefix: '',
                suffix: '',
                id: citation.substr(1),
                locator: '',
                label: 'page',
                'suppress-author': false
            }];
    }
    if (!validator_1.validateFullCitation(citation))
        throw new Error(`Invalid Key - Invalid citation passed: ${citation}.`);
    let returnCitations = [];
    let _citation = citation.substr(1, citation.length - 2).split(';');
    let invalidPrefixes = [];
    for (let c of _citation) {
        if (c === '')
            continue;
        if (!validator_1.validateCitationPart(c)) {
            invalidPrefixes.push(c);
            continue;
        }
        let prefix = '';
        if (invalidPrefixes.length === 1) {
            prefix = invalidPrefixes + ';';
        }
        else if (invalidPrefixes.length > 1) {
            prefix = invalidPrefixes.join(';');
        }
        prefix += c.split('@')[0];
        prefix = prefix.trim();
        invalidPrefixes = [];
        let suppressAuthor = c.indexOf('@') > 0 && c[c.indexOf('@') - 1] === '-';
        if (suppressAuthor)
            prefix = prefix.substr(0, prefix.length - 1).trim();
        let commaIndex = c.split('@')[1].indexOf(',') + 1;
        if (commaIndex === 0)
            commaIndex = c.split('@')[1].indexOf(' ') + 1;
        if (commaIndex <= 0)
            commaIndex = undefined;
        let citationKeyPart = c.substr(c.indexOf('@'), commaIndex);
        let extractedKey = null;
        if (strict) {
            extractedKey = regex_1.strictCitekeyValidatorRE.exec(citationKeyPart);
        }
        else {
            extractedKey = regex_1.looseCitekeyValidatorRE.exec(citationKeyPart);
        }
        if (extractedKey === null)
            throw new Error(`Invalid Key - Invalid citation passed: ${c}`);
        let citeKey = extractedKey[1];
        let afterKey = c.split('@')[1].substr(extractedKey[1].length).trim();
        let { suffix, locator, label } = retrieve_locator_1.extractLocator(afterKey);
        returnCitations.push({
            prefix: prefix,
            suffix: suffix,
            id: citeKey,
            locator: locator,
            label: label,
            'suppress-author': suppressAuthor
        });
    }
    if (returnCitations.length === 0 && _citation.length > 0) {
        throw new Error(`Invalid citation passed: ${citation}`);
    }
    return returnCitations;
}
exports.parseSingle = parseSingle;
function makeCitation(citationArray) {
    if (!Array.isArray(citationArray))
        citationArray = [citationArray];
    let returnArray = [];
    for (let csl of citationArray) {
        let res = '';
        if (!csl.hasOwnProperty('id'))
            throw new Error('Citation had no ID given!');
        if (csl.hasOwnProperty('prefix'))
            res += csl.prefix + ' ';
        if (csl.hasOwnProperty('suppress-author') && csl['suppress-author'])
            res += '-';
        res += '@' + csl.id;
        if (csl.hasOwnProperty('label') && csl.hasOwnProperty('locator'))
            res += ', ' + csl.label + ' ' + csl.locator;
        if (csl.hasOwnProperty('suffix'))
            res += ' ' + csl.suffix;
        returnArray.push(res.trim());
    }
    return `[${returnArray.join('; ')}]`;
}
exports.makeCitation = makeCitation;
