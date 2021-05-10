import {BASE_URL, getId} from '../support';

describe('Sign in service', () => {
  const user = {email: 'user' + getId() + '@reg.com', firstName: 'Jane', lastName: 'Dowson', password: 'Secret1234', passwordRepeat: 'Secret1234', acceptTerms: true};

  beforeEach(() => {
    cy.request('POST', BASE_URL + '/register', user);
  });

  it('redirects unauthenticated user to signin page', () => {
    cy.visit('/profile');
    cy.location('pathname').should('equal', '/signin');
  });

  it('allows to sign in with valid creadentials', () => {
    cy.visit('/signin');
    cy.contains('[role="heading"]', 'Sign in');

    cy.get('#email').type(user.email).should('have.value', user.email);
    cy.get('#password').type(user.password).should('have.value', user.password);
    cy.get('form').submit();

    cy.url().should('include', '/reservations');
  });
});
