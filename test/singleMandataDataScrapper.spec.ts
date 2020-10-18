import { scrapeSingleMandateData } from '../lib/singleMandateDataScrapper'

describe('singleMandateDataScrapper', () => {
  it('happy path', async () => {
    await scrapeSingleMandateData()
  })
})
