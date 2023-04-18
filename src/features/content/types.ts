import { IMaterial } from "../materials/types";


export interface IContentSectionsInitialState {
  status: string,
  content: IContentSection[],
  materialsToContent: IMaterial[],
  error: null | string
}

export interface IContentSection {
  _id: string,
  name: string,
  maxLength: number,
  materials: IMaterial[],
  createdAt: string
}

export interface IContentTableHeadCell {
  title: string, 
  isSortable: boolean,
  sortKey?: string,
  order?: Order.asc
}

export enum Order {
  asc = 'asc',
  desc = 'desc'
}