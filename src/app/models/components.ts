//ENTITIES
export interface ClubModel {
  _id?: string,
  fullName: string,
  commonName: string,
  shortName: string,
  country: string,
  clubLogoUrl: string,
  stadium: string,
  createdAt?: string,
  updatedAt?: string
}

export interface CompetitionModel {
  fullName: string,
  shortName: string,
  country: string,
  clubs: ClubModel[],
  logoUrl: string,
  type: string,
}