import { IClub } from "../../features/clubs/types"
import { ICompetition } from "../../features/competitions/types"

//ENTITIES
export interface ClubModel {
  fullName: string,
  commonName: string,
  shortName: string,
  country: string,
  clubLogoUrl: string,
  stadium: string,
}

export interface CompetitionModel {
  fullName: string,
  shortName: string,
  country: string,
  clubs: ClubModel[],
  logoUrl: string,
  type: string,
}

export interface MaterialModel {
  author: { 
    name: string,
    userId: string, 
    photoUrl?: string,
    organization: string,
    position: string,
  }, 
  type: MaterialType,
  title: string,
  content: string,
  preview?: string,
  image?: any,
  isMain?: boolean,
  status: string,
  views: number,
  likes: string[],
  publicationDate: string | any,
  comments: {
    user: string, 
    message: string
  }[],
  labels: string[],
}

export enum MaterialType {
  article = 'article',
  note = 'note',
  post = 'post'
}

export interface PlayerModel {
  firstName: string,
  lastName: string,
  birthDate: string | any,
  country: string,
  photoUrl: string,
  number: string,
  position: string,
  club: string,
}

export interface ScheduleModel {
  competition: string | ICompetition,
  season: string,
  fixture: {
    id: string,
    matchweekName: string,
    basicDate: string,
    games: {
      id: string,
      home: {
        club: IClub,
        points: number,
        goalsFor: number,
        goalsAgainst: number,
        final: string,
      },
      away: {
        club: IClub,
        points: number,
        goalsFor: number,
        goalsAgainst: number,
        final: string,
      },
      date: string,
      location: string,
      score: string,
    }[]
  }[]
}

export interface ContentSectionModel {
  name: string,
  maxLength: number,
  materials: string[]
}

export enum EssenseType {
  materials = 'materials',
  users = 'users',
  competitions = 'competitions',
  clubs = 'clubs',
  schedules = 'schedules',
  players = 'players'
}