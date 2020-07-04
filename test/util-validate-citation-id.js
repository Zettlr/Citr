/* eslint-disable no-undef */
/**
 * @ignore
 * BEGIN HEADER
 *
 * Contains:        Citr.util.validateCitationID tester
 * CVM-Role:        TESTING
 * Maintainer:      Hendrik Erz
 * License:         GNU GPL v3
 *
 * Description:     This file tests a component of Citr.
 *
 * END HEADER
 */

const validateCitationID = require('../dist/citr.js').util.validateCitationID
const assert = require('assert')

let testIDs = [
  {
    'input': '@key1990',
    'expected': true
  },
  {
    'input': '@_anotherKey2901',
    'expected': true
  },
  {
    'input': '@0815key',
    'expected': true
  },
  {
    'input': 'hellokitty',
    'expected': true
  },
  {
    'input': 'hey_there',
    'expected': true
  },
  {
    'input': 'invalid@key',
    'expected': false
  },
  {
    'input': 'another!invalid-key',
    'expected': false
  },
  {
    'input': 'no spaces allowed',
    'expected': false
  },
  {
    'input': '@Römer2005',
    'expected': true
  }
]

describe('Util#validateCitationID()', function () {
  for (let id of testIDs) {
    it(`should return ${id.expected} for key ${id.input}`, function () {
      let result = validateCitationID(id.input)
      assert.strictEqual(id.expected, result)
    })
  }
})
