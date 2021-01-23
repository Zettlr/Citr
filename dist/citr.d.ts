import { validateCitationID } from './util/validator';
import { extractCitations } from './util/extract-citations';
export declare const util: {
    validateCitationID: typeof validateCitationID;
    extractCitations: typeof extractCitations;
};
interface Citation {
    prefix: string;
    suffix: string;
    id: string;
    locator: string;
    label: string;
    'suppress-author': boolean;
}
export declare function parseSingle(citation: string, strict?: boolean): Citation[];
export declare function makeCitation(citationArray: Citation[]): string;
export {};
