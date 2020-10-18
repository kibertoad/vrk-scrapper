import { createObjectCsvWriter } from 'csv-writer'
import { CandidateVotes } from './scrapperTypes'
import { stat, mkdir } from 'fs/promises'

function ensureDirectoryExists(dir: string) {
  return stat(dir).catch(() => mkdir(dir, { recursive: true }))
}

export async function writeSingleMandateResults(
  districtName: string,
  attrHeaders: readonly string[],
  candidateData: CandidateVotes[]
) {
  const dir = 'singleMandateByDistrict'
  await ensureDirectoryExists(dir)

  const headers = [
    {
      id: 'name',
      title: attrHeaders[0].toUpperCase(),
    },
    {
      id: 'party',
      title: attrHeaders[1].toUpperCase(),
    },
    {
      id: 'districtVotes',
      title: attrHeaders[2].toUpperCase(),
    },
    {
      id: 'mailVotes',
      title: attrHeaders[3].toUpperCase(),
    },
    {
      id: 'totalVotes',
      title: attrHeaders[4].toUpperCase(),
    },
    {
      id: 'percentFromValid',
      title: attrHeaders[5].toUpperCase(),
    },
    {
      id: 'percentFromAll',
      title: attrHeaders[6].toUpperCase(),
    },
  ]

  const csvWriter = createObjectCsvWriter({
    path: `${dir}/${districtName}.csv`,
    header: headers,
  })

  await csvWriter.writeRecords(candidateData)
}
