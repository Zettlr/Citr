/* eslint-disable no-undef */
/**
 * @ignore
 * BEGIN HEADER
 *
 * Contains:        Citr.parseSingle tester
 * CVM-Role:        TESTING
 * Maintainer:      Hendrik Erz
 * License:         GNU GPL v3
 *
 * Description:     This file tests a component of Citr.
 *
 * END HEADER
 */

const parseSingle = require('../dist/citr.js').parseSingle
const assert = require('assert')

let singleCitations = [
  {
    'input': '[Some prefix @identifier]',
    'expected': [
      {
        prefix: 'Some prefix',
        suffix: '',
        id: 'identifier',
        locator: '',
        label: 'page',
        'suppress-author': false
      }
    ]
  },
  {
    'input': '[see @doe99, pp. 33-35; also @smith04, chap. 1]',
    'expected': [
      {
        prefix: 'see',
        suffix: '',
        id: 'doe99',
        locator: '33-35',
        label: 'page',
        'suppress-author': false
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
  },
  {
    'input': '[@doe99, pp. 33-35, 38-39 and *passim*]',
    'expected': [
      {
        prefix: '',
        suffix: 'and *passim*',
        id: 'doe99',
        locator: '33-35, 38-39',
        label: 'page',
        'suppress-author': false
      }
    ]
  },
  {
    'input': '[@smith04; @doe99]',
    'expected': [
      {
        prefix: '',
        suffix: '',
        id: 'smith04',
        locator: '',
        label: 'page',
        'suppress-author': false
      },
      {
        prefix: '',
        suffix: '',
        id: 'doe99',
        locator: '',
        label: 'page',
        'suppress-author': false
      }
    ]
  },
  {
    'input': '[-@smith04]',
    'expected': [
      {
        prefix: '',
        suffix: '',
        id: 'smith04',
        locator: '',
        label: 'page',
        'suppress-author': true
      }
    ]
  },
  {
    'input': '[@Clover2016, pp. 49-52, 67, 123-156, 158]',
    'expected': [
      {
        prefix: '',
        suffix: '',
        id: 'Clover2016',
        locator: '49-52, 67, 123-156, 158',
        label: 'page',
        'suppress-author': false
      }
    ]
  },
  {
    'input': '[@Ranciere1999, 22 and 32]',
    'expected': [
      {
        prefix: '',
        suffix: ' and 32',
        id: 'Ranciere1999',
        locator: '22',
        label: 'page',
        'suppress-author': false
      }
    ]
  },
  {
    'input': '[see for a recap of previous studies @Wilkinson2009; further -@Norris2005, 198; @Green2002, 62 ff]',
    'expected': [
      {
        prefix: 'see for a recap of previous studies',
        suffix: '',
        id: 'Wilkinson2009',
        locator: '',
        label: 'page',
        'suppress-author': false
      },
      {
        prefix: 'further',
        suffix: '',
        id: 'Norris2005',
        locator: '198',
        label: 'page',
        'suppress-author': true
      },
      {
        prefix: '',
        suffix: ' ff',
        id: 'Green2002',
        locator: '62',
        label: 'page',
        'suppress-author': false
      }
    ]
  },
  {
    'input': '[@Drury2017a, 6-7]',
    'expected': [
      {
        prefix: '',
        suffix: '',
        id: 'Drury2017a',
        locator: '6-7',
        label: 'page',
        'suppress-author': false
      }
    ]
  },
  {
    'input': '[see for an instructive example @Braha2012]',
    'expected': [
      {
        prefix: 'see for an instructive example',
        suffix: '',
        id: 'Braha2012',
        locator: '',
        label: 'page',
        'suppress-author': false
      }
    ]
  },
  {
    'input': '[@Aristotle1981, §1302a22; @Skultety2009, 352]',
    'expected': [
      {
        prefix: '',
        suffix: '',
        id: 'Aristotle1981',
        locator: '1302a22',
        label: 'section',
        'suppress-author': false
      },
      {
        prefix: '',
        suffix: '',
        id: 'Skultety2009',
        locator: '352',
        label: 'page',
        'suppress-author': false
      }
    ]
  },
  // Some German expressions to test the German recogniser
  {
    'input': '[vgl. @Koselleck2006, Kap. 3-4, 6]',
    'expected': [
      {
        prefix: 'vgl.',
        suffix: '',
        id: 'Koselleck2006',
        locator: '3-4, 6',
        label: 'chapter',
        'suppress-author': false
      }
    ]
  },
  {
    'input': '[@Richter1992, S. 43-56]',
    'expected': [
      {
        prefix: '',
        suffix: '',
        id: 'Richter1992',
        locator: '43-56',
        label: 'page',
        'suppress-author': false
      }
    ]
  },
  {
    'input': '[außerdem @Volk2017, Abschn. 2-3]',
    'expected': [
      {
        prefix: 'außerdem',
        suffix: '',
        id: 'Volk2017',
        locator: '2-3',
        label: 'section',
        'suppress-author': false
      }
    ]
  },
  // Some French expressions for the French recogniser
  {
    'input': '[@Lavalier1876, liv. 3]',
    'expected': [
      {
        prefix: '',
        suffix: '',
        id: 'Lavalier1876',
        locator: '3',
        label: 'book',
        'suppress-author': false
      }
    ]
  },
  {
    'input': '[@Bourdieu1976, chapitre 2]',
    'expected': [
      {
        prefix: '',
        suffix: '',
        id: 'Bourdieu1976',
        locator: '2',
        label: 'chapter',
        'suppress-author': false
      }
    ]
  },
  // Now some in-text @-citekeys without bracket
  {
    'input': '@Autor2015',
    'expected': [
      {
        prefix: '',
        suffix: '',
        id: 'Autor2015',
        locator: '',
        label: 'page',
        'suppress-author': false
      }
    ]
  },
  {
    'input': '@Hello_World1970',
    'expected': [
      {
        prefix: '',
        suffix: '',
        id: 'Hello_World1970',
        locator: '',
        label: 'page',
        'suppress-author': false
      }
    ]
  },
  // These tests test whether Citr works even if there is no comma immediately
  // after the citation key
  {
    'input': '[vgl. @Koselleck2006 für einen Überblick]',
    'expected': [
      {
        prefix: 'vgl.',
        suffix: 'für einen Überblick',
        id: 'Koselleck2006',
        locator: '',
        label: 'page',
        'suppress-author': false
      }
    ]
  },
  // Tests to check if invalid citation parts end up being prefixes of the following ones
  {
    'input': '[ein invalider prefix; außerdem @Volk2017, Abschn. 2-3]',
    'expected': [
      {
        prefix: 'ein invalider prefix; außerdem',
        suffix: '',
        id: 'Volk2017',
        locator: '2-3',
        label: 'section',
        'suppress-author': false
      }
    ]
  },
  // expected = undefined indicates that the function should throw
  {
    'input': 'Should not @work out',
    'expected': undefined
  },
  {
    'input': '[Should also not work]',
    'expected': undefined
  },
  {
    'input': '[Double ID @structure2901 @second1990]',
    'expected': undefined
  },
  {
    'input': '[Malformed ID inside @.this key]',
    'expected': undefined
  }
]

describe('Citr#parseSingle()', function () {
  for (let citation of singleCitations) {
    if (citation.expected === undefined) {
      // Should throw
      it(`should throw an error for the citation: ${citation.input}`, function () {
        assert.throws(() => {
          parseSingle(citation.input)
        })
      })
    } else {
      // Should evaluate correctly
      it(`should parse the citation correctly: ${citation.input}`, function () {
        let csl = parseSingle(citation.input)
        assert.deepStrictEqual(citation.expected, csl)
      })
    }
  }
})
