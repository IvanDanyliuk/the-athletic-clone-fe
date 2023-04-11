import { screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../../../utils/testing/customRenderMethod'; 
import { setupMaterialsSuccessHandlers } from '../../../../../utils/testing/serverMocks/materials';
import { setupClubsSuccessHandlers } from '../../../../../utils/testing/serverMocks/clubs';
import { setupCompetitionsSuccessHandlers } from '../../../../../utils/testing/serverMocks/competitions';
import { postToUpdate } from '../../../../../utils/testing/testDataMocks/materials';
import RealtimePostForm from '../RealtimePostForm';


const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom') as any,
  useNavigate: () => mockedUseNavigate,
}));


describe('NoteForm tests', () => {
  beforeEach(() => {
    setupCompetitionsSuccessHandlers();
    setupClubsSuccessHandlers();
    setupMaterialsSuccessHandlers();
  });

  afterEach(() => {
    cleanup();
  });

  test('should call useNavigate after submiting a creation form', async () => {
    renderWithProviders(<RealtimePostForm />);

    const select = screen.getAllByTestId('multiSelect');
    //eslint-disable-next-line
    fireEvent.change(select[0].querySelector('input')!, { target: { value: 'Premier League' } });
    
    const submitBtn = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalled();
    });
  });

  test('should call useNavigate after submiting an updation form', async () => {
    renderWithProviders(<RealtimePostForm postToUpdate={postToUpdate} />);

    const select = screen.getAllByTestId('multiSelect');
    //eslint-disable-next-line
    fireEvent.change(select[0].querySelector('input')!, { target: { value: 'Premier League' } });

    const submitBtn = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalled();
    });
  });
});