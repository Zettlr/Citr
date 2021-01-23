# 1.2.2

- Fixed the return types on the validators from `Boolean` to `boolean`.
- The TypeScript target is now `ES2019`, because `es6` does not support the `Array.prototype.includes()`-method we were using.
- Improve error message (@tobiasdiez).

# 1.2.1

- Fixed a logical error where activating strict mode would actually use the loose mode while parsing a single citation.
- Fixed a problem where citation parts with no commas after the citekey would be reported as false and hence not parsed correctly.

# 1.2.0

- Refactored the code base to be more maintainable and streamlined.
- Added better tests to achieve 100 % code coverage.
- **Changed signature of `extractCitations` utility function**. It now also accepts a `strict` flag (default: false) to retain strict behaviour.
- `Citr.parseSingle()` now respects the strict-flag internally when validating the provided citation ID of a full square-bracket-citation (see the changelog for 1.1.0 on what this means).

# 1.1.0

- **Changed signature of `validateCitationID` utility function**. As of now, it will validate against a broader set of characters that requires the encoding to be set to UTF-8, as it will now also see as valid Unicode characters from non-latin scripts, such as Ethiopian, Japanese, or Chinese. This will make the citation IDs more vulnerable to encoding errors, but is to be preferred (see the reasoning of John McFarlane here). Additionally, Citr is meant as a pivot between any Markdown citation representations and a citeproc processor, such as `citeproc-js` or `pandoc-citeproc`. That means Citr shouldn't focus too much on validating the IDs themselves, as much as making sure that it can process the citations and convert them to CSL JSON. **To restore the old behaviour, you need to call the functions using the legacy flag** ("strict" as it will accept less characters as valid). See README for implementation details.

# 1.0.4

- Add declaration output.

# 1.0.3

- `parseSingle` now accepts single citekey-only citations (such as `@Autor2015`) without the need to enclose them in square-brackets.
