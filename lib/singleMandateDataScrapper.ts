import puppeteer, { Browser } from 'puppeteer'
import ltx from 'ltx'
import { findAllUrls } from './urlFinder'
import { parseDistrictResults } from './districtResultsParser'

const VRK_ROOT_URL = 'https://rezultatai.vrk.lt/'
const SINGLE_MANDATE_URL = '?srcUrl=/rinkimai/1104/1/1746/rezultatai/lt/rezultataiVienm.html'

const DISTRICT_TABLE_SELECTOR = 'table.partydata:nth-child(11)'

const DISTRICT_NAME_SELECTOR = '#pub-content > div:nth-child(2) > h3:nth-child(1)'
const DISTRICT_RESULT_TABLE_SELECTOR = 'table.partydata:nth-child(11)'

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

async function getDistrictResults(browser: Browser, districtUrl: string): Promise<any> {
  const page = await browser.newPage()
  await page.goto(`${VRK_ROOT_URL}${districtUrl}`)
  await page.waitForSelector(DISTRICT_RESULT_TABLE_SELECTOR)
  const resultsTableHTML = await page.$eval(DISTRICT_RESULT_TABLE_SELECTOR, (el) => {
    return el.innerHTML
  })
  const districtName = await page.$eval(DISTRICT_NAME_SELECTOR, (el) => {
    return el.innerHTML
  })

  const districtResults = parseDistrictResults(resultsTableHTML)

  return {
    districtName,
    districtResults,
  }
}

export async function scrapeSingleMandateData(): Promise<void> {
  const browser = await puppeteer.launch()

  try {
    const districtUrls = await getDistrictUrls(browser)
    const districtResults = await getDistrictResults(browser, districtUrls[0])
  } finally {
    await browser.close()
  }
}
