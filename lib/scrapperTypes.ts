export type CandidateVotes = {
  name: string
  party: string
  districtVotes: number
  mailVotes: number
  totalVotes: number
  percentFromValid: number
  percentFromAll: number
}

export type DistrictResults = {
  attrHeaders: readonly string[]
  candidateValues: CandidateVotes[]
}
