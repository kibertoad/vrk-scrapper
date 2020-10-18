import { scrapeSingleMandateData } from '../index'

scrapeSingleMandateData()
  .then(() => {
    console.log('Done!')
    process.exit(0)
  })
  .catch((err: Error) => {
    console.error(`Error: ${err.message}`)
    process.exit(1)
  })
