require("cypress-plugin-tab");
const { v4: uuidv4 } = require("uuid");

const CREATOR = "nick@email.com";
const INVITEE = "ryan@email.com";

describe("first call functionality", () => {
  it("lets users create gigs", () => {
    const uuid = uuidv4();

    cy.visit("http://localhost:3000");
    // login
    cy.findByRole("button", { name: /login/i }).click();
    cy.findByRole("textbox", { label: /email address/i }).type(CREATOR);
    cy.findByLabelText(/password/i).type("password");
    cy.findByRole("button", { name: /sign in/i }).click();

    // add a gig
    cy.findByTitle(/create a gig/i).click();
    cy.findByPlaceholderText(/Add a short, clear title/i).type(uuid);
    cy.tab()
      .type("200")
      .tab()
      .tab()
      .tab()
      .tab()
      .type("Event Center")
      .tab()
      .tab()
      .type("attire")
      .tab()
      .type("business casual")
      .type("{enter}")
      .tab()
      .tab()
      .type("Bass")
      .tab()
      .type(INVITEE)
      .type("{enter}")
      .tab();
    cy.get("#create").click();
    cy.findByRole("button", { name: /ok/i }).click();

    // logout
    cy.findByRole("button", {
      name: /account of current user/i,
    }).click();
    cy.findByRole("menuitem", {
      name: /logout/i,
    }).click();

    // login as other user, make sure gig exists
    cy.visit("http://localhost:3000");

    cy.findByRole("button", { name: /login/i }).click();
    cy.findByRole("textbox", { label: /email address/i }).type(INVITEE);
    cy.findByLabelText(/password/i).type("password");
    cy.findByRole("button", { name: /sign in/i }).click();
    cy.findByText(uuid).click();

    // accept gig
    cy.findByRole("button", { name: /accept/i }).click();
    cy.findByRole("button", { name: /ok/i }).click();

    // logout
    cy.findByRole("button", {
      name: /account of current user/i,
    }).click();
    cy.findByRole("menuitem", {
      name: /logout/i,
    }).click();
  });
});
