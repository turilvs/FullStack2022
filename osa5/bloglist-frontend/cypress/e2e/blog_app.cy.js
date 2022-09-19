describe("Blog app", function() {
  beforeEach(function() {
    cy.request("POST", "http://localhost:3003/api/testing/reset")
    const user = {
      name: "Artturi Rantala",
      username: "turilas",
      password: "salainen",
    }
    cy.request("POST", "http://localhost:3003/api/users/", user)
    cy.visit("http://localhost:3000")
  })

  it("Login form is shown", function() {
    cy.contains("Log in to application")
  })

  describe("Login",function() {
    it("succeeds with correct credentials", function() {
      cy.get("#username").type("turilas")
      cy.get("#password").type("salainen")
      cy.get("#login-button").click()
      cy.contains("Artturi Rantala logged in")
    })

    it("fails with wrong credentials", function() {
      cy.get("#username").type("turilas")
      cy.get("#password").type("vaaraSalasana")
      cy.get("#login-button").click()
      cy.get(".error")
        .should("contain", "wrong username or password")
        .and("have.css", "color", "rgb(255, 0, 0)")

      cy.get("html").should("not.contain", "Artturi Rantala logged in")
    })
  })

  describe("When logged in", function() {
    beforeEach(function() {
      cy.login({ username: "turilas", password: "salainen" })
    })

    it("A blog can be created", function() {
      cy.createBlog({
        title: "A blog created by cypress",
        author: "Cypress",
        url: "https://www.artsinBlogi.com/",
      })
      cy.contains("A blog created by cypress")
    })
    describe("and several blogs exist", function () {
      beforeEach(function () {
        cy.createBlog({
          title: "first blog",
          author: "Cypress",
          url: "https://www.artsinBlogi.com/",
        })
        cy.createBlog({
          title: "second blog",
          author: "Cypress",
          url: "https://www.artsinBlogi.com/",
        })
        cy.createBlog({
          title: "third blog",
          author: "Cypress",
          url: "https://www.artsinBlogi.com/",
        })
      })

      it("one of those can be liked", function () {
        cy.contains("second blog").parent().find("#info-btn").as("infoButton")
        cy.get("@infoButton").click()
        cy.contains("Likes").parent().find("#like-btn").as("likeButton")
        cy.get("@likeButton").click()
      })

      it("one of those can be deleted", function () {
        cy.contains("first blog").parent().find("#info-btn").as("infoButton")
        cy.get("@infoButton").click()
        cy.contains("added by Artturi Rantala").parent().find("#delete-btn").as("deleteButton")
        cy.get("@deleteButton").click()
        cy.get("html").should("not.contain", "first blog")
      })

      it("blogs are in the order where the most liked blog is first", function () {
        cy.contains("third blog").parent().find("#info-btn").as("infoButton")
        cy.get("@infoButton").click()
        cy.contains("Likes").parent().find("#like-btn").as("likeButton")
        cy.get("@likeButton").click()
        cy.get("@likeButton").click()
        cy.get("@likeButton").click()


        cy.get(".blog").eq(0).should("contain", "third blog")
        cy.get(".blog").eq(1).should("contain", "first blog")
        cy.get(".blog").eq(2).should("contain", "second blog")
      })

    })
  })
})