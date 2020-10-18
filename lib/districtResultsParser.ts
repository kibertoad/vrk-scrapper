import parse5, { DefaultTreeParentNode, Document } from 'parse5'
import { CandidateVotes, DistrictVotes } from './types/scrapperTypes'

const linebreakRegex = /\r\n|\n|\r/gm
const IS_INDEPENDENT_TEXT = 'Išsikėlė pat'
const IS_INDEPENDENT_TEXT_OUTPUT = 'Išsikėlė pats(-i)'

type CandidateColumns = {
  nameColumn: any
  partyValue: string
  votesValue: string
}

// Structure of this data is not very consistent become amount of cells is different for independent candidates
function extractCandidateCells<T = any[]>(cells: any[]): CandidateColumns[] {
  const result: CandidateColumns[] = []
  let nextCandidate: Partial<CandidateColumns> = {}

  let foundName = false
  let foundParty = false
  let isIndependent = false
  for (let cell of cells) {
    if (!foundName) {
      nextCandidate.nameColumn = cell
      foundName = true
      continue
    }
    if (!foundParty && cell.childNodes) {
      nextCandidate.partyValue = cell.childNodes[0].value
      foundParty = true
      continue
    }

    // For independent candidates that fact is included in votes element. yay for consistency
    if (!foundParty && cell.value?.includes?.(IS_INDEPENDENT_TEXT)) {
      nextCandidate.partyValue = IS_INDEPENDENT_TEXT_OUTPUT
      foundParty = true
      isIndependent = true
    }

    if (foundParty) {
      nextCandidate.votesValue = isIndependent
        ? cell.value.replace(IS_INDEPENDENT_TEXT, '')
        : cell.value

      foundName = false
      foundParty = false
      isIndependent = false
      result.push(nextCandidate as CandidateColumns)
      nextCandidate = {}
    }
  }
  return result
}

function chunkAny(arr: any[], chunkSize: number): any[] {
  const R = []
  for (let i = 0, len = arr.length; i < len; i += chunkSize) R.push(arr.slice(i, i + chunkSize))
  return R
}

function transformCandidateValues(candidateRowsChunk: CandidateColumns): CandidateVotes {
  const name = candidateRowsChunk.nameColumn.childNodes[0].value
  const party = candidateRowsChunk.partyValue
  const voteValues: string[] = candidateRowsChunk.votesValue
    .trim()
    .replace(/\t/g, ' ')
    .replace(/    /g, ' ')
    .replace(/  /g, ' ')
    .replace(/  /g, ' ')
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

export function parseDistrictResults(text: string): DistrictVotes {
  const sanitizedText = text
    .trim()
    .replace(/\&nbsp;/g, ' ')
    .replace(linebreakRegex, '')
  const districtHtml: DefaultTreeParentNode = parse5.parse(sanitizedText) as DefaultTreeParentNode
  // @ts-ignore
  const candidateRows = districtHtml.childNodes[0].childNodes[1].childNodes
  const headerRow = candidateRows.shift()
  const attrHeaders = headerRow.value
    .trim()
    .replace(linebreakRegex, '')
    // we don't need this parent value
    .replace('Paduotų balsų skaičius', '')
    .replace(/\t/g, ' ')
    .replace(/\s{3,8}/g, '  ')
    .split('  ')

  const candidateRowsChunksWithSummary = extractCandidateCells(candidateRows)
  const candidateRowsChunks = candidateRowsChunksWithSummary.slice(
    0,
    candidateRowsChunksWithSummary.length - 3
  )
  const summaryRows = candidateRowsChunksWithSummary.slice(
    candidateRowsChunksWithSummary.length - 3,
    candidateRowsChunksWithSummary.length
  )
  const candidateValues = candidateRowsChunks.map(transformCandidateValues)

  return {
    attrHeaders,
    candidateValues,
  }
}
