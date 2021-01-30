describe('Bloglist app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user1 = {
      username: 'user1',
      name: 'User One',
      password: 'pass',
    }
    const user2 = {
      username: 'user2',
      name: 'User Two',
      password: 'pass',
    }
    cy.request('POST', 'http://localhost:3001/api/users', user1)
    cy.request('POST', 'http://localhost:3001/api/users', user2)
    cy.visit('http://localhost:3000')
  })

  it('login form is shown', function () {
    cy.contains('Log in to application')
  })

  describe('login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('user1')
      cy.get('#password').type('pass')
      cy.get('#login-button').click()

      cy.contains('User One logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('wrongUserName')
      cy.get('#password').type('pass')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'Wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('when logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'user1', password: 'pass' })
    })

    it('a blog can be created', function () {
      cy.contains('create blog').click()
      cy.get('#title').type('Cypress blog')
      cy.get('#author').type('cypress')
      cy.get('#url').type('cypress.io')
      cy.get('#create-button').click()
      cy.contains('Cypress blog')
    })

    describe('and a blog exist', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'Cypress blog',
          author: 'cypress',
          url: 'cypress.io',
        })
        cy.createBlog({
          title: 'Cypress blog with 5 likes',
          author: 'cypress',
          url: 'cypress.io',
          likes: 5,
        })
        cy.createBlog({
          title: 'Cypress blog with 10 likes',
          author: 'cypress',
          url: 'cypress.io',
          likes: 10,
        })
      })

      it('user can like blog', function () {
        cy.contains('view').click()
        cy.get('.blogDetails').contains('like').as('likeButton')
        cy.get('@likeButton').parent().as('likesDiv')
        cy.get('@likeButton').click()
        cy.get('@likesDiv').should('contain', '1')
      })

      it('user can delete blog', function () {
        cy.contains('view').click()
        cy.get('.blogDetails').contains('Remove').click()
        cy.get('Cypress blog').should('not.exist')
      })

      it('only author can delete blog', function () {
        cy.logout()
        cy.login({ username: 'user2', password: 'pass' })
        cy.contains('view').click()
        cy.get('.blogDetails').contains('Remove').should('not.exist')
      })
    })
  })
})
