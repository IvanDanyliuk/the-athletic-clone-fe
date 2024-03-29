import { cleanup, screen } from '@testing-library/react';
import { setupMaterialsSuccessHandlers } from '../../../utils/testing/serverMocks/materials';
import { renderWithProviders } from '../../../utils/testing/customRenderMethod';
import { materialsStateSuccessMock } from '../../../utils/testing/testDataMocks/materials';
import { postToUpdate } from '../../../utils/testing/testDataMocks/materials';
import { usersStateSuccessMock } from '../../../utils/testing/testDataMocks/users';
import Post from '../Post';


describe('Post tests', () => {
  beforeEach(() => {
    setupMaterialsSuccessHandlers();
  });

  afterEach(() => {
    cleanup();
  });

  test('should render the post content if the post exists', async () => {
    renderWithProviders(
      <Post />, 
      { preloadedState: {
        materials: {
          ...materialsStateSuccessMock,
          data: {
            ...materialsStateSuccessMock.data,
            material: postToUpdate
          }
        },
        users: usersStateSuccessMock
      } }
    );
    expect(await screen.findAllByText(`${postToUpdate.author.firstName} ${postToUpdate.author.lastName}`)).toHaveLength(postToUpdate.comments.length + 1);
  });

  test('should render the loader if the post does not exist', async () => {
    renderWithProviders(<Post />);
    expect(await screen.findByTestId('backgroundLoader')).toBeInTheDocument();
  });
});