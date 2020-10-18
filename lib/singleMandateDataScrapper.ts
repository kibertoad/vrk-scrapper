import puppeteer, { Browser } from 'puppeteer'
import { findAllUrls } from './utils/urlFinder'
import { parseDistrictResults } from './districtResultsParser'
import { writeSingleMandateResults } from './utils/csvWriter'
import { DistrictResults } from './types/scrapperTypes'

const VRK_ROOT_URL = 'https://rezultatai.vrk.lt/'
const SINGLE_MANDATE_URL = '?srcUrl=/rinkimai/1104/1/1746/rezultatai/lt/rezultataiVienm.html'

const DISTRICT_TABLE_SELECTOR = 'table.partydata:nth-child(11)'

const DISTRICT_NAME_SELECTOR = '#pub-content > div:nth-child(2) > h3:nth-child(1)'
const DISTRICT_RESULT_TABLE_SELECTOR = 'table.partydata:nth-child(11)'
const DISTRICT_RESULT_TABLE_SELECTOR_ALTERNATIVE = 'table.partydata:nth-child(12)'

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function getDistrictUrls(browser: Browser): Promise<readonly string[]> {
  const page = await browser.newPage()
  await page.goto(`${VRK_ROOT_URL}${SINGLE_MANDATE_URL}`)
  await page.waitForSelector(DISTRICT_TABLE_SELECTOR)
  const districtTableHTML = await page.$eval(DISTRICT_TABLE_SELECTOR, (el) => {
    return el.innerHTML
  })
  const districtUrls = findAllUrls(districtTableHTML)
  return districtUrls
}

async function getDistrictResults(browser: Browser, districtUrl: string): Promise<DistrictResults> {
  const page = await browser.newPage()
  await page.goto(`${VRK_ROOT_URL}${districtUrl}`)
  await page.waitForSelector(DISTRICT_NAME_SELECTOR)

  const districtName = await page.$eval(DISTRICT_NAME_SELECTOR, (el) => {
    return el.innerHTML.replace('&nbsp;', ' ')
  })
  console.log(`Processing ${districtName}`)

  let resultsTableHTML
  try {
    resultsTableHTML = await page.$eval(DISTRICT_RESULT_TABLE_SELECTOR, (el) => {
      return el.innerHTML
    })
  } catch (err) {
    // Page structure is inconsistent across different districts, we need to handle that somehow
    resultsTableHTML = await page.$eval(DISTRICT_RESULT_TABLE_SELECTOR_ALTERNATIVE, (el) => {
      return el.innerHTML
    })
  }

  const districtResults = parseDistrictResults(resultsTableHTML)

  return {
    name: districtName,
    votes: districtResults,
  }
}

export async function scrapeSingleMandateData(): Promise<void> {
  const browser = await puppeteer.launch()

  try {
    const districtUrls = await getDistrictUrls(browser)

    for (const districtUrl of districtUrls) {
          const districtResults = await getDistrictResults(browser, districtUrl)
    // const districtResults = await getDistrictResults(browser, districtUrls[18])
    await writeSingleMandateResults(
      districtResults.name,
      districtResults.votes.attrHeaders,
      districtResults.votes.candidateValues
    )
    console.log(`Finished outputting district: ${districtResults.name}\n`)
    console.log('Sleeping...')
    await sleep(2000 + Math.random() * 1000)
    console.log('Woke up...')
    }
  } finally {
    await browser.close()
  }
}
