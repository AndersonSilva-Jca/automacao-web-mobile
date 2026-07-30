import loc from "../support/locators";

class LoginPage {
  abrirModalLogin() {
    cy.get(loc.HEADER_BOTAO_LOGIN).click();
  }
  preencherUsuario() {
    cy.env(["login1"]).then((env) => {
      cy.get(loc.USUARIO).type(env.login1);
    });
  }
  PreencherSenha() {
    cy.env(["senha1"]).then((env) => {
      cy.get(loc.SENHA).type(env.senha1, { log: false });
    });
  }
  confirmarLogin() {
    cy.get(loc.BOTAO_LOGIN).click({ force: true });
  }

  logadoComSucesso() {
    cy.get(loc.MENSAGEM_LOGADO).should("contain", "Olá");
  }
  odpModalLogin() {
    cy.get(loc.ODP_BOTAO_LOGIN).click();
  }
  odpPreencherUsuario() {
    cy.env(["login"]).then((env) => {
      cy.get(loc.USUARIO).type(env.login);
    });
  }
  odpPreencherSenha() {
    cy.env(["senha"]).then((env) => {
      cy.get(loc.SENHA).type(env.senha, { log: false });
    });
  }
  odpConfirmarLogin() {
    cy.get(loc.ODP_BOTAO_LOGAR).click();
  }
  odpLogadoComSucesso() {
    cy.get(loc.MENSAGEM_LOGADO).should("contain", "Olá");
  }
}
export default new LoginPage();
