"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.locatorRE = exports.looseCitekeyValidatorRE = exports.strictCitekeyValidatorRE = exports.citationExtractionRE = exports.fullCitationValidatorRE = void 0;
exports.fullCitationValidatorRE = /^\[([^[\]]*@[^[\]]+)\]$/;
exports.citationExtractionRE = /(\[([^[\]]*@[^[\]]+)\])|(@[\p{L}\d_][\p{L}\d_:.#$%&\-+?<>~\/]*)/gu;
exports.strictCitekeyValidatorRE = /^@?([a-zA-Z0-9_][a-zA-Z0-9_:.#$%&\-+?<>~/]*)$/;
exports.looseCitekeyValidatorRE = /^@?([\p{L}\d_][\p{L}\d_:.#$%&\-+?<>~\/]*)$/u;
exports.locatorRE = /\d+(?:-\d+)?/g;
