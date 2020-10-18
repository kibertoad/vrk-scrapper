import fs from 'fs'
import path from 'path'
import { parseDistrictResults } from '../lib/districtResultsParser'

const tableHTML = fs
  .readFileSync(path.resolve(__dirname, 'resources/single_mandate_district_results_table.html'))
  .toString()

describe('districtResultsParser', () => {
  it('parses results correctly', () => {
    const result = parseDistrictResults(tableHTML)
    expect(result).toMatchSnapshot()
  })
})
