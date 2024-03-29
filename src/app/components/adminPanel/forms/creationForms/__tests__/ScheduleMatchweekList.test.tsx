import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { store } from '../../../../../../features/store';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ScheduleContext from '../../../../../context/scheduleContext';
import { newSchedule } from '../../../../../utils/testing/testDataMocks/schedules';
import { ScheduleContextType } from '../../../../../context/scheduleContext';
import { setupCompetitionsSuccessHandlers } from '../../../../../utils/testing/serverMocks/competitions';
import { setupSchedulesSuccessHandlers } from '../../../../../utils/testing/serverMocks/schedules';
import { setupClubsSuccessHandlers } from '../../../../../utils/testing/serverMocks/clubs';
import { ScheduleMatchweekList } from '../';


const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom') as any,
  useNavigate: () => mockedUseNavigate,
}));

const addScheduleTitleMock = jest.fn();
const addMatchweekMock = jest.fn();
const addMatchMock = jest.fn();
const deleteMatchweekMock = jest.fn();
const deleteMatchMock = jest.fn();

const value: ScheduleContextType = {
  schedule: newSchedule,
  isUpdatingMode: false,
  addScheduleTitle: addScheduleTitleMock,
  addMatchweek: addMatchweekMock, 
  addMatch: addMatchMock,
  deleteMatchweek: deleteMatchweekMock,
  deleteMatch: deleteMatchMock,
};


describe('ScheduleMatchweekList tests', () => {
  beforeEach(() => {
    setupCompetitionsSuccessHandlers();
    setupClubsSuccessHandlers();
    setupSchedulesSuccessHandlers();
  });

  afterEach(() => {
    cleanup();
  });

  test('should call the deleteMatchWeek function after clicking on the Delete Matchweek button', async () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ScheduleContext.Provider value={value}>
              <ScheduleMatchweekList />
            </ScheduleContext.Provider>
          </LocalizationProvider>
        </Provider>
      </MemoryRouter>
    );

    const deleteBtns = screen.getAllByTestId('deleteMatchBtn');
    fireEvent.click(deleteBtns[1]);

    expect(deleteMatchweekMock).toHaveBeenCalled();
  });
});