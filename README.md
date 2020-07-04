<p align="center">
  <a href="https://github.com/Zettlr/Zettlr">
    <img src="https://raw.githubusercontent.com/Zettlr/Citr/master/citr_logo.png" alt="Citr"/>
  </a>
</p>

# Citr

> Converts Markdown Citations to CSL JSON

A small library for parsing Markdown citeproc citations to valid CSL JSON (and vice versa).

## Description

This module transforms citations as they are described in the Pandoc manual into valid CSL JSON that can then -- for instance -- be passed to citeproc-js.

## Install

With NPM:

```bash
$ npm install @zettlr/citr
```

With Yarn:

```bash
$ yarn add @zettlr/citr
```

## Usage

```javascript
Citr.parseSingle(markdown, strict?) // Parses a single citation from Markdown to CSL JSON
Citr.makeCitation(csl) // Converts a CSL JSON citation to Markdown
Citr.util.extractCitations(text, strict?) // Extracts all citations from a text
Citr.util.validateCitationID(key, strict?) // Validates a given citation key
```

Citr exposes a small API that you can conveniently use:

```javascript
const Citr = require('Citr')

let myCitation = '[see -@doe99, pp. 33-35; also @smith04, chap. 1]'

let csl = Citr.parseSingle(myCitation)

/*
[
  {
    prefix: 'see',
    suffix: '',
    id: 'doe99',
    locator: '33-35',
    label: 'page',
    'suppress-author': true
  },
  {
    prefix: 'also',
    suffix: '',
    id: 'smith04',
    locator: '1',
    label: 'chapter',
    'suppress-author': false
  }
]
*/
```

If the citation contains any malformed partial citations, Citr will throw an error, so to test for errors, use try/catch constructs:

```javascript
const Citr = require('Citr')
let myCitation = '[Malformed ID inside @.this key]'
let csl = ''

try {
  csl = Citr.parseSingle(myCitation)
} catch (err) {
  console.error(`The citation was malformed.`)
}
```

To extract all citations that are inside a given Markdown file/text, Citr exposes a convenient function:

```javascript
const Citr = require('Citr')

let myText = 'This is some Text, where both Doe [-@doe99] and others said something [see -@doe99, pp. 33-35; also @smith04, chap. 1]. Of course, this is debatable.'

let citations = Citr.util.extractCitations(myText)
/*
[
  '[-doe99]',
  '[see -@doe99, pp. 33-35; also @smith04, chap. 1]'
]
*/
```

You can then afterwards pass all citations in a `for`-loop through the `parseSingle`-function.

If you simply want to conveniently check an ID, use the utility function `validateCitationID`:

```javascript
const Citr = require('Citr')

let goodKey = '@Doe1990'
let badKey = '@.wrongKey'

Citr.util.validateCitationID(goodKey) // true
Citr.util.validateCitationID(badKey) // false
```

Last but not least you may want to generate a Markdown citation string from a given CSL JSON object. To do so, simply pass a CSL JSON object to the `makeCitation` function. The only required attribute is `id`. Please note that this conversion is **not** language-sensitive, but will output everything as English text. Thereby it can be passed again to the `parseSingle`-function to retrieve the correct citation.

```javascript
const Citr = require('Citr')

const csl = [
  {
    prefix: 'see',
    suffix: '',
    id: 'doe99',
    locator: '33-35',
    label: 'page',
    'suppress-author': true
  },
  {
    prefix: 'also',
    suffix: '',
    id: 'smith04',
    locator: '1',
    label: 'chapter',
    'suppress-author': false
  }
]

let markdownCitation = Citr.makeCitation(csl)
/*
'[see -@doe99, pp. 33-35; also @smith04, chap. 1]'
*/
```

You can, of course, also pass one single object to the engine.

## Legacy ("strict") mode

The `strict` parameter is optional and restores the behavior of versions pre `1.1.0` in that functions validating citekeys can either apply a strict mode or a "loose" mode. In strict mode, only a very small subset of ASCII characters are allowed for citekeys (no umlauts as ö, ü, é, è, non-latin script, etc.), while the loose mode will allow as many letter characters as possible. **By default, strict mode is off (`strict = false`)**. To enable strict mode, pass `true` to any of the functions that allow the strict mode.

Example:

```javascript
const Citr = require('Citr')

let asciiKey = '@Doe1990'
let unicodeKey = '@村上2018'

Citr.util.validateCitationID(asciiKey) // true
Citr.util.validateCitationID(asciiKey, true) // true (strict mode enabled)
Citr.util.validateCitationID(unicodeKey) // true (Japanese characters are allowed)
Citr.util.validateCitationID(unicodeKey, true) // false (only ASCII characters allowed)

try {
  let citation = Citr.parseSingle(unicodeKey, true) // Enable strict mode
} catch (err) {
  console.error('An error will be thrown, as parseSingle will call validateCitationID using strict mode')
}
```

## Contributions

Contributions and PRs are welcome. By contributing, you agree that your code will also be made available under the GNU GPL v3 license.

## License

This software is licenced via the GNU GPL v3-License.

The brand (including name, icons and everything Citr can be identified with) is exluded and all rights reserved. If you want to fork Citr to develop another library, feel free but please change name and icons.
