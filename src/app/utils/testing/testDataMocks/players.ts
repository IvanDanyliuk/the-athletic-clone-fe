import { IPlayer, IPlayerInitialState } from "../../../../features/players/types";
import { PlayerModel } from "../../../models/components";


export const playersStateMock: IPlayerInitialState = {
  status: 'succeeded',
  data: {
    players: [
      {
        _id: '641f36e462652c997e106e6a',
        firstName: 'Mykhailo',
        lastName: 'Mudryk',
        birthDate: '2001-03-14T22:00:00.000Z',
        country: 'Ukraine',
        photoUrl: '',
        number: '15',
        position: 'M',
        club: 'Chelsea',
        createdAt: '2023-03-25T18:01:08.305Z',
      },
    ],
    playersCount: 1
  },
  filters: null,
  error: null
};

export const newPlayer: PlayerModel = {
  firstName: 'Mykhailo',
  lastName: 'Mudryk',
  birthDate: '2001-03-14T22:00:00.000Z',
  country: 'Ukraine',
  photoUrl: '',
  number: '15',
  position: 'M',
  club: 'Chelsea',
};

export const playerToUpdate: IPlayer = {
  _id: '641f36e462652c997e106e6a',
  firstName: 'Mykhailo',
  lastName: 'Mudryk',
  birthDate: '2001-03-14T22:00:00.000Z',
  country: 'Ukraine',
  photoUrl: '',
  number: '15',
  position: 'M',
  club: 'Chelsea',
  createdAt: '2023-03-25T18:01:08.305Z',
};