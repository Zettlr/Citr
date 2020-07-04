/* eslint-disable no-undef */
/**
 * @ignore
 * BEGIN HEADER
 *
 * Contains:        Citr.makeCitation tester
 * CVM-Role:        TESTING
 * Maintainer:      Hendrik Erz
 * License:         GNU GPL v3
 *
 * Description:     This file tests a component of Citr.
 *
 * END HEADER
 */

const makeCitation = require('../dist/citr.js').makeCitation
const assert = require('assert')

let cslTesters = [
  {
    'input': [
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
    ],
    'output': '[see -@doe99, page 33-35; also @smith04, chapter 1]'
  }
]

describe('Citr#makeCitation()', function () {
  for (let tester of cslTesters) {
    it(`should compile the input to: ${tester.output}`, function () {
      let markdownCitation = makeCitation(tester.input)
      assert.deepStrictEqual(tester.output, markdownCitation)
    })
  }
})
