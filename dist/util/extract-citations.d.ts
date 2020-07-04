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
export declare function extractCitations(file: string, strict?: boolean): string[];
