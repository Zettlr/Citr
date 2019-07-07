/**
 * This file contains some general tests for the Citr library.
 */

const Citr = require('../dist/citr.js')
const chalk = require('chalk')

/**
 * Some logging functions for convenience
 */
const log = {
  error: function(message) { console.error(chalk.red(message)) },
  warn: function(message) { console.warn(chalk.yellow(message)) },
  info: function(message) { console.log(chalk.keyword('cornflowerblue')(message)) },
  success: function(message) { console.log(chalk.green(message)) }
}

/**
 * The following citekeys should evaluate to either true or false.
 */
let testIDs = [
  '@key1990',
  '@_anotherKey2901',
  '@0815key',
  'hellokitty',
  'hey_there',
  'invalid-key',
  'another!invalid-key',
  'no spaces allowed'
]

/**
 * The following citations should all evaluate to true.
 */
let testingCitationsTrue = [
  '[Some prefix @identifier]',
  '[see @doe99, pp. 33-35; also @smith04, chap. 1]',
  '[see @doe99, pp. 33-35; also @smith04, chap. 1]',
  '[@doe99, pp. 33-35, 38-39 and *passim*]',
  '[@smith04; @doe99]',
  '[-@smith04]',
  '[@Clover2016, pp. 49-52, 67, 123-156, 158]',
  '[@Ranciere1999, 22 and 32]',
  '[see for a recap of previous studies @Wilkinson2009; further -@Norris2005, 198; @Green2002, 62 ff]',
  '[@Drury2017a, 6-7]',
  '[see for an instructive example @Braha2012]',
  '[@Aristotle1981, §1302a22; @Skultety2009, 352]',
  // Some German expressions to test the German recogniser
  '[vgl. @Koselleck2006, Kap. 3-4, 6]',
  '[@Richter1992, S. 43-56]',
  '[außerdem @Volk2017, Abschn. 2-3]',
  // Some French expressions for the French recogniser
  '[@Lavalier1876, liv. 3]',
  '[@Bourdieu1976, chapitre 2]',
  // Now some in-text @-citekeys without brackets
  '@Autor2015',
  '@Hello_World1970'
]

/**
 * The following citations should all evaluate to false.
 */
let testingCitationsFalse = [
  'Should not @work out',
  '[Should also not work]',
  '[Double ID @structure2901 @second1990]',
  '[Malformed ID inside @.this key]'
]

log.info(`Citr Test Suite starting ...`)
log.info(`We have ${testingCitationsTrue.length} valid citations and ${testingCitationsFalse.length} invalid. Additionally we will test ${testIDs.length} IDs specifically.`)
console.log("")

log.info(`Testing true citations ...`)
for (let cite of testingCitationsTrue) {
  try {
    let result = Citr.parseSingle(cite)
    log.success(`Successfully parsed: ${cite}`)
    console.log(result)
  } catch (e) {
    log.error(`An error was thrown: ${e.message}`)
  }
  console.log("")
}

console.log("")
log.info(`Testing false citations ...`)
for (let cite of testingCitationsFalse) {
  try {
    Citr.parseSingle(cite)
    log.error(`No error was thrown for citation ${cite}!`)
  } catch (e) {
    log.success(`Successful error: ${e.message}`)
  }
}

console.log("")
log.info(`Testing citekeys ...`)
for (let id of testIDs) {
  if (Citr.util.validateCitationID(id)) {
    log.success(`Citekey ${id} was correct.`)
  } else {
    log.info(`Citekey ${id} was malformed.`)
  }
}

// Last but not least, test the extract citation stuff, and the conversion
console.log("")
let myText = 'This is some Text, where both Doe [-@doe99] and others said something [see -@doe99, pp. 33-35; also @smith04, chap. 1]. Of course, this is debatable.'
log.info(`Testing ID extraction from string. Test string is: ${myText}`)
let citations = Citr.util.extractCitations(myText)
if (citations[0] === '[-@doe99]' && citations[1] === '[see -@doe99, pp. 33-35; also @smith04, chap. 1]') {
    log.success(`The given citation ID was successfully retrieved from the string.`)
} else {
    log.error(`The citation ID has not been correctly extracted. Result was:`)
    console.log(citations)
}

// Convert
console.log("")
let csl = [
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

// Please note in the following evaluation that we used "page" and "chapter", which
// is correct, given that the engine does not discriminate between language specifics.
// Such a citation will be transformed once again correctly.
if (markdownCitation === '[see -@doe99, page 33-35; also @smith04, chapter 1]') {
    log.success(`The CSL objects have been successfully transformed to a citation!`)
} else {
    log.error(`The CSL object was not correctly transformed. Result was:`)
    console.log(markdownCitation)
}

console.log("")
log.info(`Done!`)
