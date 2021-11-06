import { aliasQuery } from '../utils/graphql-utils';

const testPersonId = "cGVvcGxlOjE="

context('Person', () => {
    beforeEach(() => {
        cy.intercept('POST', Cypress.env('backend_url'), (req) => {
            aliasQuery(req, 'GetPerson')
        })
    })

    it('shows characters name and films he was in', () => {
        cy.visit(`${Cypress.env('frontend_url')}/people/${testPersonId}`);
        cy.wait('@gqlGetPersonQuery')
            .then(interceptedRequest => {
                const person = interceptedRequest.response.body.data.person
                cy.get('[data-cy="name"]').contains(person.name);
                person.filmConnection.films.forEach(film => {
                    cy.get('[data-cy="film-list"]').contains(film.title);
                })
            })
    });

    it('starts animation on film list click', () => {
        cy.visit(`${Cypress.env('frontend_url')}/people/${testPersonId}`);
        cy.wait('@gqlGetPersonQuery');
        cy.get('[data-cy="film-list"]').click();
        cy.get('[data-cy="grid-item"]').should('have.class', 'crawl');
    });

    it('navigates to people page on go back button click', () => {
        cy.visit(`${Cypress.env('frontend_url')}/people/${testPersonId}`);
        cy.wait('@gqlGetPersonQuery');
        cy.get('[data-cy="go-back-btn"]').click();
        cy.url().should("eq", `${Cypress.env('frontend_url')}/people`);
    });
})