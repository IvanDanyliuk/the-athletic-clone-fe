import { screen, fireEvent, cleanup, waitFor, act } from '@testing-library/react';
import { renderWithProviders } from '../../../../../utils/testing/customRenderMethod'; 
import { setupClubsSuccessHandlers } from '../../../../../utils/testing/serverMocks/clubs';
import { setupPlayersSuccessHandlers } from '../../../../../utils/testing/serverMocks/players';
import { playerToUpdate } from '../../../../../utils/testing/testDataMocks/players';
import { PlayerForm } from '../';


const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom') as any,
  useNavigate: () => mockedUseNavigate,
}));


describe('PlayerForm tests', () => {
  beforeEach(() => {
    setupClubsSuccessHandlers();
    setupPlayersSuccessHandlers();
  });

  afterEach(() => {
    cleanup();
  });

  test('should submit the creation form after passing player data', async () => {
    renderWithProviders(<PlayerForm />);

    const textFields = screen.getAllByTestId('textField');
    const numberField = screen.getByTestId('numberField');
    const selectFields = screen.getAllByTestId('selectField');
    const submitBtn = screen.getByRole('button', { name: 'Submit' });

    fireEvent.change(textFields[0] as HTMLInputElement, { target: { value: 'Test First Name' } });
    fireEvent.change(textFields[1] as HTMLInputElement, { target: { value: 'Test Last Name' } });
    fireEvent.change(numberField as HTMLInputElement, { target: { value: 5 } });
    
    //eslint-disable-next-line
    fireEvent.change(selectFields[0].querySelector('input')! as HTMLInputElement, { target: { value: 'United Kingdom' } });
    //eslint-disable-next-line
    fireEvent.change(selectFields[1].querySelector('input')! as HTMLInputElement, { target: { value: 'M' } });
    //eslint-disable-next-line
    fireEvent.change(selectFields[2].querySelector('input')! as HTMLInputElement, { target: { value: 'Test Club' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalled();
    });
  });

  test('should submit the updation form after passing player data', async () => {
    renderWithProviders(<PlayerForm playerToUpdate={playerToUpdate} />);

    const textFields = screen.getAllByRole('textbox');
    const submitBtn = screen.getByRole('button', { name: 'Submit' });

    fireEvent.change(textFields[0], { target: { value: 'Test First Name' } });
    fireEvent.change(textFields[1], { target: { value: 'Test Last Name' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalled();
    });
  });
});