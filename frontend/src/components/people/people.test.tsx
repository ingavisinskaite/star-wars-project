import { render, screen, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import People, { GET_PEOPLE } from './people';

const mocks: any = [
  {
    request: {
      query: GET_PEOPLE,
      variables: {
        after: '',
        first: 10
      },
    },
    result: {
      data: {
        allPeople: {
          totalCount: 82,
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: true,
            endCursor: "YXJyYXljb25uZWN0aW9uOjk=",
            startCursor: "YXJyYXljb25uZWN0aW9uOjA="
          },
          people: [
            {
              id: "cGVvcGxlOjE=",
              name: "Luke Skywalker",
              gender: "male",
            }
          ]
        }
      }
    },
  },
];

describe('People', () => {
  beforeEach(() => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <People />
      </MockedProvider>,
    );
  });
  it('should show loader if data is loading', () => {
    const loader = screen.getByTestId('app-loading');
    expect(loader).toBeVisible();
  });

  it('should render male image if character is male', async () => {
    await act(async () => await new Promise(resolve => setTimeout(resolve, 0)));
    const firstPersonGender = mocks[0].result.data.allPeople.people[0].gender;
    expect(screen.getAllByTestId('avatar')[0]).toHaveAttribute('src', `${firstPersonGender}.png`);
  });

  it('shows load more button', async () => {
    await act(async () => await new Promise(resolve => setTimeout(resolve, 0)));
    expect(screen.getByTestId("load-more-btn")).toBeVisible();
  });
});

