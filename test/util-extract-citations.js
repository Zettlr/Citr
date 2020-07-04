/* eslint-disable no-undef */
/**
 * @ignore
 * BEGIN HEADER
 *
 * Contains:        Citr.util.extractCitations tester
 * CVM-Role:        TESTING
 * Maintainer:      Hendrik Erz
 * License:         GNU GPL v3
 *
 * Description:     This file tests a component of Citr.
 *
 * END HEADER
 */

const extractCitations = require('../dist/citr.js').util.extractCitations
const assert = require('assert')

let testers = [
  {
    'input': `This is some Text, where both Doe [-@doe99] and others said
    something [see -@doe99, pp. 33-35; also @smith04, chap. 1]. Of course,
    this is debatable.`,
    'expected': [
      '[-@doe99]',
      '[see -@doe99, pp. 33-35; also @smith04, chap. 1]'
    ]
  },
  {
    'input': `Pandoc-citeproc is able to extract @citekey without any
    additional information such as [square brackets] from the text. So no
    matter whether there are [citekeys with info @AutorYear, p. 23-45] or
    a @citation without any info, everything should work out. Even on single
    lines:

    @anotherKey`,
    'expected': [
      '@citekey',
      '[citekeys with info @AutorYear, p. 23-45]',
      '@citation',
      '@anotherKey'
    ]
  }
]

describe('Util#extractCitations()', function () {
  for (let tester of testers) {
    it(`should successfully extract the ${tester.expected.length} citations`, function () {
      let extractedCitations = extractCitations(tester.input)
      assert.deepStrictEqual(tester.expected, extractedCitations)
    })
  }
})
