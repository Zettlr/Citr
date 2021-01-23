"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractLocator = void 0;
const regex_1 = require("../util/regex");
const en_1 = require("../data/en");
const de_1 = require("../data/de");
const fr_1 = require("../data/fr");
const localeMappings = [en_1.en, de_1.de, fr_1.fr];
function retrieveLocator(locatorString) {
    for (let locale of localeMappings) {
        for (let loc of Object.keys(locale)) {
            if (locatorString.indexOf(loc) === 0) {
                return { label: locale[loc], natural: loc };
            }
        }
    }
    return { label: '', natural: '' };
}
function extractLocator(afterKey) {
    let retObject = {
        locator: '',
        label: 'page',
        suffix: ''
    };
    afterKey = afterKey.trim();
    if (afterKey[0] === ',')
        afterKey = afterKey.substr(1).trim();
    if ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].includes(parseInt(afterKey[0]))) {
        let locator = /^\d+(-\d+)?/.exec(afterKey);
        if (locator) {
            retObject.locator = locator[0];
            retObject.suffix = afterKey.replace(locator[0], '');
        }
        return retObject;
    }
    let result = retrieveLocator(afterKey);
    if (result.label === '') {
        retObject.suffix = afterKey;
        return retObject;
    }
    retObject.label = result.label;
    afterKey = afterKey.substr(result.natural.length).trim();
    let match;
    let splitIndex = 0;
    while ((match = regex_1.locatorRE.exec(afterKey)) !== null) {
        splitIndex = match.index + match[0].length;
    }
    retObject.locator = afterKey.substr(0, splitIndex).trim();
    retObject.suffix = afterKey.substr(splitIndex + 1).trim();
    return retObject;
}
exports.extractLocator = extractLocator;
