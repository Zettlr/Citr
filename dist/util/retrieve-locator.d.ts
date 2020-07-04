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
interface FullSuffix {
    locator: string;
    label: string;
    suffix: string;
}
export declare function extractLocator(afterKey: string): FullSuffix;
export {};
