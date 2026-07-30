import loc from "../support/locators";

class LoginPage {
  // UTP
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

  // OUTLET DE PASSANGENS
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

  // CLUBE GIRO

  giroModalLogin() {
    cy.get(loc.GIRO_BOTAO_LOGIN).should("be.visible").click();
  }

  giroAssertAcesse() {
    cy.get(loc.ACESSE_GIRO).should("contain", "Acesse o Giro");
  }
  giroPreencherUsuario() {
    cy.get(loc.USUARIO).should("be.visible").type("andynho1987@gmail.com", { delay: 50 });
  }
  giroPreencherSenha() {
    cy.env(["senha"]).then((env) => {
      cy.get(loc.SENHA).should("be.visible").type(env.senha, { log: false }, { delay: 100 });
    });
  }
  giroConfirmarLogin() {
    cy.get(loc.GIRO_BOTAO_ENTRAR).click();
  }
  preencher2FA() {
    cy.get("body").then(($body) => {
      const temModal2FA = $body.find(loc.GIRO_INPUT_VISIBLE).length > 0;
      if (temModal2FA) {
        cy.log("🔐 Modal 2FA detectado e visível – buscando código no e-mail...");
        cy.wait(5000);
        cy.task("buscarCodigo2FAGmail").then((codigo2FA) => {
          expect(codigo2FA).to.not.be.null;
          cy.get(loc.GIRO_INPUT_2FA).focus().clear({ force: true }).type(codigo2FA, { force: true, delay: 80 });
          cy.get(loc.GIRO_BOTAO_MODAL_2FA).should("not.be.disabled").click();
        });
      } else {
        cy.log("✅ Login direto – Modal 2FA está oculto (display: none).");
      }
    });
    cy.fecharModalGiro();
  }
  giroLogadoComSucesso() {
    cy.get(loc.MENSAGEM_LOGADO).should("contain", "ANDERSON");
  }
}
export default new LoginPage();
