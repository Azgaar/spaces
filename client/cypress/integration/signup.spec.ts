import {getId} from '../support';

const user = {email: 'user_' + getId() + '@reg.com', firstName: 'Jane', lastName: 'Dowson', password: 'Secret1234'};

describe('Sign up service', () => {
  it('allows to register new user', () => {
    cy.visit('/signup');
    cy.contains('[role="heading"]', 'Sign up');
    cy.get('#firstName').type(user.firstName).should('have.value', user.firstName);
    cy.get('#lastName').type(user.lastName).should('have.value', user.lastName);
    cy.get('#email').type(user.email).should('have.value', user.email);
    cy.get('#password').type(user.password).should('have.value', user.password);
    cy.get('#passwordRepeat').type(user.password).should('have.value', user.password);
    cy.get('[name="acceptTerms"]').check().should('be.checked');
    cy.get('form').submit();

    cy.url().should('include', '/reservations');
  });
});
