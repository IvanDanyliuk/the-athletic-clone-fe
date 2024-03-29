import { cleanup, screen } from '@testing-library/react';
import { setupClubsSuccessHandlers } from '../../../utils/testing/serverMocks/clubs';
import { setupPlayersSuccessHandlers } from '../../../utils/testing/serverMocks/players';
import { renderWithProviders } from '../../../utils/testing/customRenderMethod';
import { clubToUpdate, clubsStateSuccessMock } from '../../../utils/testing/testDataMocks/clubs';
import { playersStateSuccessMock } from '../../../utils/testing/testDataMocks/players';
import { ClubRoster } from '../';


describe('ClubRoster tests', () => {
  beforeEach(() => {
    setupClubsSuccessHandlers();
    setupPlayersSuccessHandlers();
  });

  afterEach(() => {
    cleanup();
  });

  test('should render the club squad data', async () => {
    renderWithProviders(
      <ClubRoster />,
      {
        preloadedState: {
          clubs: {
            ...clubsStateSuccessMock,
            data: {
              ...clubsStateSuccessMock.data,
              club: clubToUpdate
            }
          },
          players: playersStateSuccessMock
        }
      }
    );

    expect(screen.getAllByText(`${playersStateSuccessMock.data.main.players[0].firstName} ${playersStateSuccessMock.data.main.players[0].lastName}`)).toHaveLength(playersStateSuccessMock.data.main.players.length);
  });
});