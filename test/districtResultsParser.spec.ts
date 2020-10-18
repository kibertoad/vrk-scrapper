import fs from 'fs'
import path from 'path'
import { parseDistrictResults } from '../lib/districtResultsParser'

const tableHTML = fs
  .readFileSync(path.resolve(__dirname, 'resources/single_mandate_district_results_table.html'))
  .toString()

const tableHTML2 = fs
  .readFileSync(path.resolve(__dirname, 'resources/single_mandate_district_results_table_2.html'))
  .toString()

const tableHTML3 = fs
  .readFileSync(path.resolve(__dirname, 'resources/single_mandate_district_results_table_3.html'))
  .toString()

const tableHTML4 = fs
  .readFileSync(path.resolve(__dirname, 'resources/single_mandate_district_results_table_4.html'))
  .toString()

describe('districtResultsParser', () => {
  it('parses results correctly district 1', () => {
    const result = parseDistrictResults(tableHTML)
    expect(result).toMatchSnapshot()
  })

  // Aleksoto–Vilijampoles (Nr.19) apygarda
  it('parses results correctly district 19', () => {
    const result = parseDistrictResults(tableHTML2)
    expect(result).toMatchSnapshot()
  })

  // Panevezio vakarine (Nr.27) apygarda
  it('parses results correctly district 27', () => {
    const result = parseDistrictResults(tableHTML3)
    expect(result).toMatchSnapshot()
  })

  // Ausros (Nr.25) apygarda
  it('parses results correctly district 25', () => {
    const result = parseDistrictResults(tableHTML4)
    expect(result).toMatchSnapshot()
  })
})
