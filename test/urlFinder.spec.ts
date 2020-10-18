import { findAllUrls } from '../lib/utils/urlFinder'
import fs from 'fs'
import path from 'path'

const tableHTML = fs
  .readFileSync(path.resolve(__dirname, 'resources/single_mandate_table.html'))
  .toString()

describe('urlFinder', () => {
  it('correctly finds urls', () => {
    const result = findAllUrls(tableHTML)
    expect(result).toMatchSnapshot()
  })
})
