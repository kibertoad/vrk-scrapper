import parse5, { DefaultTreeParentNode, Document } from 'parse5'
import { CandidateVotes, DistrictResults } from './scrapperTypes'

const linebreakRegex = /\r\n|\n|\r/gm

function chunk<T = any[]>(arr: T[], chunkSize: number): T[][] {
  const R = []
  for (let i = 0, len = arr.length; i < len; i += chunkSize) R.push(arr.slice(i, i + chunkSize))
  return R
}

function transformCandidateValues(candidateRowsChunk: any[]): CandidateVotes {
  const name = candidateRowsChunk[0].childNodes[0].value
  const party = candidateRowsChunk[2].childNodes[0].value
  const voteValues = candidateRowsChunk[3].value
    .trim()
    .replace(/    /g, ' ')
    .replace(/  /g, ' ')
    .replace(/  /g, ' ')
    .replace(linebreakRegex, '')
    .split(' ')

  const [districtVotes, mailVotes, totalVotes, percentFromValid, percentFromAll] = voteValues

  return {
    name,
    party,
    districtVotes,
    mailVotes,
    totalVotes,
    percentFromValid,
    percentFromAll,
  }
}

export function parseDistrictResults(text: string): DistrictResults {
  const sanitizedText = text
    .trim()
    .replace(/\&nbsp/g, ' ')
    .replace(linebreakRegex, '')
  const districtHtml: DefaultTreeParentNode = parse5.parse(sanitizedText) as DefaultTreeParentNode
  // @ts-ignore
  const candidateRows = districtHtml.childNodes[0].childNodes[1].childNodes
  const headerRow = candidateRows.shift()
  const attrHeaders = headerRow.value.trim().replace(/   /g, '  ').replace(/   /g, '  ').split('  ')

  const candidateRowsChunksWithSummary = chunk(candidateRows, 4)
  const candidateRowsChunks = candidateRowsChunksWithSummary.slice(0, 15)
  const summaryRows = candidateRowsChunksWithSummary.slice(15, 18)
  const candidateValues = candidateRowsChunks.map(transformCandidateValues)

  return {
    attrHeaders,
    candidateValues,
  }
}
