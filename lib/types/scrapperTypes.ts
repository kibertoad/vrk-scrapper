export type CandidateVotes = {
  name: string
  party: string
  districtVotes: string
  mailVotes: string
  totalVotes: string
  percentFromValid: string
  percentFromAll: string
}

export type DistrictVotes = {
  attrHeaders: readonly string[]
  candidateValues: CandidateVotes[]
}

export type DistrictResults = {
  name: string
  votes: DistrictVotes
}
