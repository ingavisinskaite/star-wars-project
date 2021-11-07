import { act, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import Person, { GET_PERSON } from './person';
import {
    Route,
    MemoryRouter
} from "react-router-dom";

const personId = "abcd";

const mocks: any = [
    {
        request: {
            query: GET_PERSON,
            variables: {
                id: personId,
            },
        },
        result: {
            data: {
                person: {
                    name: "Luke Skywalker",
                    filmConnection: {
                        films: [
                            {
                                title: "A New Hope"
                            }
                        ]
                    }
                }
            }
        },
    },
];

let isCrawlActive = false;
const setIsCrawlActive = () => {
    isCrawlActive = !isCrawlActive;
}

describe('Person', () => {
    beforeEach(() => {
        render(
            <MemoryRouter initialEntries={[`people/${personId}`]}>
                <Route path='people/:id'>
                    <MockedProvider mocks={mocks}>
                        <Person isCrawlActive={isCrawlActive} setIsCrawlActive={setIsCrawlActive} />
                    </MockedProvider>
                </Route>
            </MemoryRouter>
        );
    });
    it('should show loader if data is loading', () => {
        const loader = screen.getByTestId('app-loading');
        expect(loader).toBeDefined();
    });

    it('should show characters name', async () => {
        await act(async () => await new Promise(resolve => setTimeout(resolve, 0)));
        const mockedPersonName = mocks[0].result.data.person.name;
        expect(screen.getByText(mockedPersonName)).toHaveAttribute("data-testid", "name");
    });

    it('should show go back button', () => {
        expect(screen.getByTestId("go-back-btn")).toBeVisible();
    });
});

