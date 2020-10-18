import fs from 'fs'
import path from 'path'
import { parseDistrictResults } from '../lib/districtResultsParser'
import { writeSingleMandateResults } from '../lib/csvWriter'
import { FileTestHelper } from 'cli-testlab'

const tableHTML = fs
  .readFileSync(path.resolve(__dirname, 'resources/single_mandate_district_results_table.html'))
  .toString()

describe('csvWriter', () => {
  it('writes single mandate results correctly', async () => {
    const fileHelper = new FileTestHelper(__dirname)

    const result = parseDistrictResults(tableHTML)
    await writeSingleMandateResults('district1', result.attrHeaders, result.candidateValues)
    const fileContent = fileHelper.getFileTextContent('../singleMandateByDistrict/district1.csv')
    expect(fileContent).toMatchSnapshot()

    await fileHelper.deleteDir('../singleMandateByDistrict')
  })
})
