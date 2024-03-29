import { IClub } from '../clubs/types';
import { ICompetition } from '../competitions/types';
import { Order, StateStatus } from '../types';

export interface ISchedule {
  _id?: string;
  competition: ICompetition | any;
  season: string;
  fixture: IMatchweek[];
  createdAt?: string;
}

export interface IMatch {
  id: string;
  home: {
    club: IClub;
    points: number;
    goalsFor: number;
    goalsAgainst: number;
    final: string;
  };
  away: {
    club: IClub;
    points: number;
    goalsFor: number;
    goalsAgainst: number;
    final: string;
  };
  date: string;
  location: string;
  score: string;
}

export interface IMatchweek {
  _id?: string;
  id: string;
  matchweekName: string;
  basicDate: string;
  games: IMatch[];
}
export interface ISchedulesInitialState {
  status: StateStatus;
  data: {
    main: {
      schedules: ISchedule[];
      schedulesCount: number;
    };
    schedule: ISchedule | null;
    latestMatches: {
      league: string;
      matches: IMatch[];
    }[];
  };
  filters: {} | null;
  error: string | null;
}

export interface ISchedulesTableHeadCell {
  title: string;
  isSortable: boolean;
  sortKey?: string;
  order?: Order;
}

export interface ISchedulesFilters {
  competition?: string;
  country?: string;
  season?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ISchedulesRequestData {
  page?: number;
  itemsPerPage?: number;
  filterData?: ISchedulesFilters | null; 
  sortData?: {
    indicator: string;
    order: string;
  } | null;
}

export interface IGetScheduleQuery {
  season: string;
  leagueId: string;
}

export interface IGetSchedulesByClubQuery {
  season: string;
  clubId: string;
}