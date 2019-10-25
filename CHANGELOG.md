# 1.1.0

- **Changed signature of `validateCitationID` utility function**. As of now, it will validate against a broader set of characters that requires the encoding to be set to UTF-8, as it will now also see as valid Unicode characters from non-latin scripts, such as Ethiopian, Japanese, or Chinese. This will make the citation IDs more vulnerable to encoding errors, but is to be preferred (see the reasoning of John McFarlane here). Additionally, Citr is meant as a pivot between any Markdown citation representations and a citeproc processor, such as `citeproc-js` or `pandoc-citeproc`. That means Citr shouldn't focus too much on validating the IDs themselves, as much as making sure that it can process the citations and convert them to CSL JSON. **To restore the old behaviour, you need to call the functions using the legacy flag** ("strict" as it will accept less characters as valid). See README for implementation details.

# 1.0.4

- Add declaration output.

# 1.0.3

- `parseSingle` now accepts single citekey-only citations (such as `@Autor2015`) without the need to enclose them in square-brackets.
