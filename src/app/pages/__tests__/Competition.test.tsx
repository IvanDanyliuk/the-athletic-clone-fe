import { cleanup, screen } from '@testing-library/react';
import { Competition } from '../';
import { renderWithProviders } from '../../utils/testing/customRenderMethod';
import { competitionToUpdate, competitionsStateSuccessMock } from '../../utils/testing/testDataMocks/competitions';
import { setupCompetitionsSuccessHandlers } from '../../utils/testing/serverMocks/competitions';


describe('Competition page tests', () => {
  beforeEach(() => {
    setupCompetitionsSuccessHandlers();
  });

  afterEach(() => {
    cleanup();
  });

  test('should render the Competition page', async () => {
    renderWithProviders(
      <Competition />,
      {
        preloadedState: {
          competitions: {
            ...competitionsStateSuccessMock,
            data: {
              ...competitionsStateSuccessMock.data,
              competition: competitionToUpdate
            }
          }
        }
      }
    );
    expect(screen.getByText(competitionToUpdate.fullName)).toBeInTheDocument();
  });

  test('should render the loader component', async () => {
    renderWithProviders(
      <Competition />,
      {
        preloadedState: {
          competitions: {
            ...competitionsStateSuccessMock,
            data: {
              ...competitionsStateSuccessMock.data,
              competition: null
            }
          }
        }
      }
    );
    expect(screen.getByTestId('backgroundLoader')).toBeInTheDocument();
  });
});