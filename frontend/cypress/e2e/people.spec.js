import { aliasQuery } from '../utils/graphql-utils'

context('People', () => {
    beforeEach(() => {
        cy.intercept('POST', Cypress.env('backend_url'), (req) => {
            aliasQuery(req, 'GetPeople')
        })
    })

    it('matches names from request with names on screen', () => {
        cy.visit(`${Cypress.env('frontend_url')}/people`);
        cy.wait('@gqlGetPeopleQuery')
            .then(interceptedRequest => {
                const people = interceptedRequest.response.body.data.allPeople.people;
                people.forEach(person => {
                    cy.get('[data-cy="people-container"]').contains(person.name);
                })
            })
    });

    it('Loads 10 people on initial visit. Loads 10 more people on button click', () => {
        cy.visit(`${Cypress.env('frontend_url')}/people`);
        cy.wait('@gqlGetPeopleQuery');
        cy.get('[data-cy="card"]').should('have.length', 10);

        cy.get('[data-cy="load-more-btn"]').click();
        cy.wait('@gqlGetPeopleQuery');
        cy.get('[data-cy="card"]').should('have.length', 20);
    });

    it('navigates to person detail page on card click', () => {
        cy.visit(`${Cypress.env('frontend_url')}/people`);
        cy.wait('@gqlGetPeopleQuery')
            .then(interceptedRequest => {
                const firstPerson = interceptedRequest.response.body.data.allPeople.people[0];
                cy.get('[data-cy="name"]').contains(firstPerson.name).click();
                cy.url().should("eq", `${Cypress.env('frontend_url')}/people/${firstPerson.id}`);
            })
    });
})