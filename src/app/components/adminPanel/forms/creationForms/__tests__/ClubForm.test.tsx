import { screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../../../utils/testing/customRenderMethod'; 
import { setupClubsSuccessHandlers } from '../../../../../utils/testing/serverMocks/clubs';
import { clubToUpdate } from '../../../../../utils/testing/testDataMocks/clubs';
import ClubForm from '../ClubForm';


const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom') as any,
  useNavigate: () => mockedUseNavigate,
}));


describe('ClubForm tests', () => {
  beforeEach(() => {
    setupClubsSuccessHandlers();
  });

  afterEach(() => {
    cleanup();
  });

  test('should submit the creation form after passing form data', async () => {
    renderWithProviders(<ClubForm />);

    const textFields = screen.getAllByRole('textbox');
    const slectField = screen.getByTestId('selectField');
    const submitBtn = screen.getByRole('button', { name: 'Submit' });

    fireEvent.change(textFields[0], { target: { value: 'Test Full Name' } });
    fireEvent.change(textFields[1], { target: { value: 'Test Common Name' } });
    fireEvent.change(textFields[2], { target: { value: 'TSN' } });
    fireEvent.change(textFields[3], { target: { value: 'Test Stadium' } });
    //eslint-disable-next-line
    fireEvent.change(slectField.querySelector('input')!, { target: { value: 'Test Country' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalled();
    });
  });

  test('should submit the updation form after passing form data', async () => {
    renderWithProviders(<ClubForm clubToUpdate={clubToUpdate} />);

    const textFields = screen.getAllByRole('textbox');
    const selectField = screen.getByTestId('selectField');
    

    

    const fullNameInput = screen.getByLabelText('Full Name')
    fireEvent.change(fullNameInput, { target: { value: 'Test Full Name' } });
    fireEvent.change(textFields[1], { target: { value: 'Test Common Name' } });
    fireEvent.change(textFields[2], { target: { value: 'TSN' } });
    fireEvent.change(textFields[3], { target: { value: 'Test Stadium' } });
    // eslint-disable-next-line
    fireEvent.change(selectField.querySelector('input')!, { target: { value: 'Test Country' } });
    const submitBtn = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalled();
    });
  });
});