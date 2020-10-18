import puppeteer, { Browser, Page } from 'puppeteer'
import { findAllUrls } from './urlFinder'

const SINGLE_MANDATE_URL =
  'https://rezultatai.vrk.lt/?srcUrl=/rinkimai/1104/1/1746/rezultatai/lt/rezultataiVienm.html'
const RESULTS_TABLE_SELECTOR = 'table.partydata:nth-child(11)'

async function getDistrictUrls(browser: Browser): Promise<readonly string[]> {
  const page = await browser.newPage()
  await page.goto(SINGLE_MANDATE_URL)
  await page.waitForSelector(RESULTS_TABLE_SELECTOR)
  const resultsTableHTML = await page.$eval(RESULTS_TABLE_SELECTOR, (el) => {
    return el.innerHTML
  })
  const districtUrls = findAllUrls(resultsTableHTML)
  return districtUrls
}

export async function scrapeSingleMandateData(): Promise<void> {
  const browser = await puppeteer.launch()

  try {
    const districtUrls = await getDistrictUrls(browser)
  } finally {
    await browser.close()
  }
}
