import fs from 'fs'
import path from 'path'
import { parseDistrictResults } from '../lib/districtResultsParser'

const tableHTML = fs
  .readFileSync(path.resolve(__dirname, 'resources/single_mandate_district_results_table.html'))
  .toString()

const tableHTML2 = fs
  .readFileSync(path.resolve(__dirname, 'resources/single_mandate_district_results_table_2.html'))
  .toString()

describe('districtResultsParser', () => {
  it('parses results correctly', () => {
    const result = parseDistrictResults(tableHTML)
    expect(result).toMatchSnapshot()
  })

  // Aleksoto–Vilijampoles (Nr.19) apygarda
  it('parses results correctly for a different structure', () => {
    const result = parseDistrictResults(tableHTML2)
    expect(result).toMatchSnapshot()
  })
})
