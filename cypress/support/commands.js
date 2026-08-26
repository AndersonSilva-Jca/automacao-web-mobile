// const { cy } = require("@faker-js/faker");
import loc from "./locators";
import LoginPage from "../pages/LoginPage";

Cypress.Commands.add("selecionarDataIda", (range = 3) => {
  cy.get('td[data-handler="selectDay"] a').then(($days) => {
    const proximosDias = $days.slice(1, range);
    const randomIndex = Math.floor(Math.random() * proximosDias.length);
    cy.wrap(proximosDias[randomIndex]).click({ force: true });
  });
});

Cypress.Commands.add("selecionarDataIdaTotem", (range = 5) => {
  cy.get(".whitespace-nowrap").click();
  cy.get(".react-calendar__navigation__label__labelText").should("be.visible");
  cy.get(".react-calendar__month-view__days").then(($days) => {
    const proximosDias = $days.slice(0, range);
    const randomIndex = Math.floor(Math.random() * proximosDias.length);
    cy.wrap(proximosDias[randomIndex]).click({ force: true });
  });
});

Cypress.Commands.add("SelecionarAssentoTotem", (range = 3) => {
  cy.get(":nth-child(3) > :nth-child(1) > .bg-\[url\('\/assets\/bus\/assento-disponivel\.svg'\)\] > span").then(($ofertas) => {
    const passagensAleatorias = $ofertas.slice(0, range);
    const randomIndex = Math.floor(Math.random() * passagensAleatorias.length);
    cy.wrap(passagensAleatorias[randomIndex]).click({ force: true });
  });
});

Cypress.Commands.add("selecionarDataVolta", (range = 6) => {
  cy.get('td[data-handler="selectDay"] a').then(($days) => {
    const proximosDias = $days.slice(0, range);
    const randomIndex = Math.floor(Math.random() * proximosDias.length);
    cy.wrap(proximosDias[randomIndex]).click({ force: true });
  });
});

Cypress.Commands.add("selecionarCidadeAleatoria", (campo) => {
  const selector = campo === "origem" ? "#input-departure" : "#input-destination";

  cy.get(selector).click({ force: true });

  cy.get(".ui-autocomplete .ui-menu-item .location-title")
    .filter(':not(:contains("Usar minha localização"))') // Ignora o item de GPS
    .then(($options) => {
      const randomIndex = Math.floor(Math.random() * $options.length);
      const cidadeEscolhida = $options[randomIndex].innerText;

      cy.log(`Sorteado para ${campo}: ${cidadeEscolhida}`);

      cy.wrap($options[randomIndex]).click();
    });
});

Cypress.Commands.add("selecionarAssentoAleatorioWemobi", () => {
  cy.get('button.outer-seat[id^="seat-"]:not(:has(.occuped))', { timeout: 90000 })
    .should("be.visible")
    .then(($seats) => {
      const ids = $seats.map((i, el) => el.id).get();
      const randomId = ids[Math.floor(Math.random() * ids.length)];

      cy.wrap(randomId).as("idSorteado");
    });
  cy.get("@idSorteado").then((id) => {
    cy.get(`#${id}`).scrollIntoView().should("be.visible").click({ force: true });
  });
  cy.get("#seat-reservation-v2-button-proceed").should("be.visible").log("Assento selecionado");
  cy.get("#seat-reservation-v2-button-proceed", { timeout: 90000 }).should("be.visible").and("not.be.disabled").click();
});

Cypress.Commands.add("selecionarAssentoAleatorioODP", () => {
  cy.get('button.outer-seat[id^="seat-"]:not(:has(.occuped))', { timeout: 90000 })
    .should("be.visible")
    .then(($seats) => {
      const ids = $seats.map((i, el) => el.id).get();
      const randomId = ids[Math.floor(Math.random() * ids.length)];

      cy.wrap(randomId).as("idSorteado");
    });
  cy.get("@idSorteado").then((id) => {
    cy.get(`#${id}`).scrollIntoView().should("be.visible").click({ force: true });
  });
  cy.get(".row > .btn-footer").should("be.visible").log("Assento selecionado");
  cy.get(".row > .btn-footer", { timeout: 90000 }).should("be.visible").and("not.be.disabled").click();
});

// cypress/support/commands.js

Cypress.Commands.add("selecionarAssentoTotem", (limiteMaximo) => {
  // @param {number} limiteMaximo

  const seletorAssentoDinamico = 'div[data-select="false"][class*="assento-disponivel"].opacity-100';
  cy.log("Buscando assentos disponíveis (não ocupados e clicáveis)...");

  // const seletorAssentoDisponivel = "[class*='assento-disponivel']";
  // const elementoIgnorado = ":nth-child(2) > :nth-child(1) > [class*='assento-disponivel']";
  cy.get(seletorAssentoDinamico)
    // .not(elementoIgnorado)
    .should("be.visible")
    .then(($assentos) => {
      const assentosFiltrados = limiteMaximo ? $assentos.slice(0, limiteMaximo) : $assentos;

      const totalDisponivel = assentosFiltrados.length;
      expect(totalDisponivel, "Nenhum assento disponível/clicável foi encontrado na tela").to.be.greaterThan(0);

      // Gera um índice randômico entre 0 e (total - 1)
      const indiceSorteado = Math.floor(Math.random() * totalDisponivel);

      // Log para visualização no painel lateral do Cypress
      cy.log(`🎲 Assento clicável sorteado: ${indiceSorteado + 1} de ${totalDisponivel} livres no mapa.`);

      // Clica no assento sorteado
      cy.wrap(assentosFiltrados).eq(indiceSorteado).click({ force: true });
    });
});

Cypress.Commands.add("selecionarAssentoAleatorio", () => {
  cy.get('button.outer-seat[id^="seat-"]:not(:has(.occupied-seat))', { timeout: 90000 })
    .should("be.visible")
    .then(($seats) => {
      const ids = $seats.map((i, el) => el.id).get();
      const randomId = ids[Math.floor(Math.random() * ids.length)];

      cy.wrap(randomId).as("idSorteado");
    });
  cy.get("@idSorteado").then((id) => {
    cy.get(`#${id}`).scrollIntoView().should("be.visible").click({ force: true });
  });

  cy.get("#btn-proceed", { timeout: 90000 }).should("be.visible").and("not.be.disabled");
});

Cypress.Commands.add("selecionarDoisAssentosAleatorios", () => {
  const selecionar = (tentativas = 0) => {
    if (tentativas > 3) throw new Error("Falha após 3 tentativas.");

    cy.log("⏳ Aguardando mapa...");
    cy.wait(2000);

    cy.get('button.outer-seat[id^="seat-"]:not(:has(.occupied-seat))', { timeout: 90000 })
      .should("be.visible")
      .should("exist")
      .invoke("show")
      .then(($seats) => {
        const ids = $seats.map((i, el) => el.id).get();
        const shuffled = ids.sort(() => 0.5 - Math.random());
        const escolhidos = [shuffled[0], shuffled[1]];

        escolhidos.forEach((id) => {
          cy.get(`#${id}`)
            .scrollIntoView({ offset: { top: -150 } })
            .click()
            .trigger("change");
          cy.wait(1000);
        });
        cy.log("✅ Assentos selecionados no mapa.");
      });
  };

  selecionar();
});

Cypress.Commands.add("selecionarPassagemMelhorPreco", () => {
  // 1. Localizamos o selo de "Melhor preço do dia"
  cy.get(".cheaper-price.active", { timeout: 90000 })
    .should("be.visible")
    .parents(".available") // Sobe até o container da passagem
    .find('button[data-js="buy-ticket"]:not([disabled])', { timeout: 90000 }) // Busca o botão dentro desse container
    .first()
    .scrollIntoView()
    .click({ force: true });

  cy.log("Passagem com o melhor preço do dia selecionada!");
});

Cypress.Commands.add("aceitarTermosSeExistirem", () => {
  cy.get("body").then(($body) => {
    const botao = $body.find(".button-agree");

    if (botao.length > 0) {
      cy.log("Modal detectado. Tentando fechar...");

      cy.wrap(botao).click({ force: true });

      cy.log("Modal de confirmação aceito.");
    } else {
      cy.log("Modal de confirmação não encontrado. Seguindo...");
    }
  });
});

Cypress.Commands.add("selecionarPassagemSemExperienciaWemobi", () => {
  cy.contains("ESCOLHER PASSAGENS", { timeout: 90000 }).should("be.visible");
  cy.log("⏳ Aguardando estabilização da página de ofertas...");

  cy.get("li.list-companies-item", { timeout: 90000 }).should("be.visible");

  cy.wait(1000);
  cy.scrollTo("bottom");
  cy.wait(1000);

  // 1. Filtra APENAS os cards de empresas que NÃO contêm a "Experiência wemobi"
  cy.get("li.list-companies-item")
    .filter((_, el) => {
      const temWemobi = Cypress.$(el).find('button[data-offer-marketplace-text="Experiência wemobi"]').length > 0;
      return !temWemobi; // Retorna apenas se NÃO for Experiência wemobi
    })
    .then(($empresasOutras) => {
      // Falha o teste se só existirem passagens com a Experiência wemobi
      if ($empresasOutras.length === 0) {
        throw new Error("❌ Teste interrompido: Apenas passagens 'Experiência wemobi' estão disponíveis!");
      }

      // 2. Extrai as ofertas válidas das outras empresas
      const ofertasValidas = [];

      $empresasOutras.each((_, empresaEl) => {
        const ofertas = Cypress.$(empresaEl).find('li[data-js^="offer-element-"]:has(.available)');

        ofertas.each((_, ofertaEl) => {
          const textoClasse = Cypress.$(ofertaEl).find('[data-js^="classtype"]').text().toUpperCase();
          const temBotaoAtivo = Cypress.$(ofertaEl).find('button[data-js="buy-ticket"]:not([disabled])').length > 0;

          if (!textoClasse.includes("CAMA") && temBotaoAtivo) {
            ofertasValidas.push(ofertaEl);
          }
        });
      });

      const total = ofertasValidas.length;
      if (total === 0) throw new Error("❌ Nenhuma oferta válida (não-CAMA e com botão ativo) encontrada fora da Experiência wemobi!");

      // 3. Sorteia uma oferta entre as empresas tradicionais/parceiras
      const randomIndex = Math.floor(Math.random() * total);
      const escolha = ofertasValidas[randomIndex];
      const $btnCompra = Cypress.$(escolha).find('button[data-js="buy-ticket"]');

      cy.log(`🎰 Sorteada opção tradicional/parceira ${randomIndex + 1} de ${total}`);

      cy.wait(500);
      cy.wrap($btnCompra)
        .parents(".available")
        .invoke("show")
        .end()
        .wrap($btnCompra)
        .invoke("show")
        .scrollIntoView({ offset: { top: -150 } })
        .should("exist")
        .and("not.be.disabled")
        .click({ force: true });

      cy.wait(3000);

      // 4. Trata o modal da madrugada
      cy.get("body").then(($body) => {
        if ($body.find('[data-js="button-agree"]').is(":visible")) {
          cy.log("⚠️ Confirmando modal de madrugada...");
          cy.get('[data-js="button-agree"]').click({ force: true });

          cy.wait(3000);
          cy.url().then((urlAtual) => {
            if (urlAtual.includes("/disponibilidade")) {
              cy.wrap($btnCompra).click({ force: true });
            }
          });
        }
      });
    });
});

Cypress.Commands.add("selecionarPassagemExperienciaWemobi", () => {
  cy.contains("ESCOLHER PASSAGENS", { timeout: 90000 }).should("be.visible");
  cy.log("⏳ Aguardando estabilização da página de ofertas...");

  cy.get("li.list-companies-item", { timeout: 90000 }).should("be.visible");

  cy.wait(1000);

  // 1. Busca os cards de empresas que contêm o marcador "Experiência wemobi"
  cy.get("li.list-companies-item")
    .filter((_, el) => {
      return Cypress.$(el).find('button[data-offer-marketplace-text="Experiência wemobi"]').length > 0;
    })
    .then(($empresasWemobi) => {
      // Falha o teste se não houver nenhuma empresa com a Experiência wemobi
      if ($empresasWemobi.length === 0) {
        throw new Error("❌ Teste interrompido: Nenhuma passagem 'Experiência wemobi' foi encontrada!");
      }

      // 2. Extrai as ofertas válidas contidas APENAS nos cards da Experiência wemobi
      const ofertasValidas = [];

      $empresasWemobi.each((_, empresaEl) => {
        const ofertas = Cypress.$(empresaEl).find('li[data-js^="offer-element-"]:has(.available)');

        ofertas.each((_, ofertaEl) => {
          const textoClasse = Cypress.$(ofertaEl).find('[data-js^="classtype"]').text().toUpperCase();
          const temBotaoAtivo = Cypress.$(ofertaEl).find('button[data-js="buy-ticket"]:not([disabled])').length > 0;

          if (!textoClasse.includes("CAMA") && temBotaoAtivo) {
            ofertasValidas.push(ofertaEl);
          }
        });
      });

      const total = ofertasValidas.length;
      if (total === 0) throw new Error("❌ Nenhuma oferta válida (não-CAMA e com botão ativo) encontrada na Experiência wemobi!");

      // 3. Sorteia uma oferta entre as válidas
      const randomIndex = Math.floor(Math.random() * total);
      const escolha = ofertasValidas[randomIndex];
      const $btnCompra = Cypress.$(escolha).find('button[data-js="buy-ticket"]');

      cy.log(`🎰 Sorteada opção Experiência wemobi ${randomIndex + 1} de ${total}`);

      cy.wait(500);
      cy.wrap($btnCompra)
        .parents(".available")
        .invoke("show")
        .end()
        .wrap($btnCompra)
        .invoke("show")
        .scrollIntoView({ offset: { top: -150 } })
        .should("exist")
        .and("not.be.disabled")
        .click({ force: true });

      cy.wait(3000);

      // 4. Trata o modal da madrugada caso apareça
      cy.get("body").then(($body) => {
        if ($body.find('[data-js="button-agree"]').is(":visible")) {
          cy.log("⚠️ Confirmando modal de madrugada...");
          cy.get('[data-js="button-agree"]').click({ force: true });

          cy.wait(3000);
          cy.url().then((urlAtual) => {
            if (urlAtual.includes("/disponibilidade")) {
              cy.wrap($btnCompra).click({ force: true });
            }
          });
        }
      });
    });
});

Cypress.Commands.add("selecionarPassagemAleatoria1", () => {
  cy.contains("ESCOLHER PASSAGENS", { timeout: 90000 }).should("be.visible");
  cy.log("⏳ Aguardando estabilização da página de ofertas...");

  cy.get('li[data-js^="offer-element-"]', { timeout: 90000 }).should("be.visible");

  cy.wait(1000);

  cy.get('li[data-js^="offer-element-"]:has(.available)', { timeout: 90000 })
    .should("exist")
    .invoke("show")
    .then(($ofertas) => {
      const ofertasValidas = $ofertas.filter((i, el) => {
        const textoClasse = Cypress.$(el).find('[data-js^="classtype"]').text().toUpperCase();
        const temBotaoAtivo = Cypress.$(el).find('button[data-js="buy-ticket"]:not([disabled])').length > 0;
        return !textoClasse.includes("CAMA") && temBotaoAtivo;
      });

      const total = ofertasValidas.length;
      if (total === 0) throw new Error("Nenhuma passagem válida encontrada!");

      const randomIndex = Math.floor(Math.random() * total);
      const escolha = ofertasValidas[randomIndex];
      const $btnCompra = Cypress.$(escolha).find('button[data-js="buy-ticket"]', { timeout: 90000 });

      cy.log(`🎰 Sorteada opção ${randomIndex + 1} de ${total}`);

      cy.wait(500);
      cy.wrap($btnCompra)
        .parents(".available")
        .invoke("show")
        .end()
        .wrap($btnCompra)
        .invoke("show")
        .scrollIntoView({ offset: { top: -150 } })
        .should("exist")
        .and("not.be.disabled")
        .click({ force: true });
      // cy.wrap($btnCompra)
      //   .scrollIntoView({ offset: { top: -150 } })
      //   .should('be.visible')
      //   .should('exist')
      //   .invoke('show')
      //   .and('not.be.disabled')
      //   .click({ force: true });
      // Aumentei para 3s para garantir que o erro de 'servicesList' não ocorra
      cy.wait(3000);

      cy.get("body").then(($body) => {
        if ($body.find('[data-js="button-agree"]').is(":visible")) {
          cy.log("⚠️ Confirmando modal de madrugada...");
          cy.get('[data-js="button-agree"]').click({ force: true });

          cy.wait(3000);
          cy.url().then((urlAtual) => {
            if (urlAtual.includes("/disponibilidade")) {
              cy.wrap($btnCompra).click({ force: true }).parent();
            }
          });
        }
      });
    });
});

Cypress.Commands.add("selecionarDataCompra", (range = 1) => {
  cy.get("#input-date-buy").then(($days) => {
    const proximosDias = $days.slice(0, range);
    const randomIndex = Math.floor(Math.random() * proximosDias.length);
    cy.wrap(proximosDias[randomIndex]).click({ force: true });
  });
});

Cypress.Commands.add("selecionarDataViagem", (range = 5) => {
  cy.get("#input-date-trip").then(($days) => {
    const proximosDias = $days.slice(0, range);
    const randomIndex = Math.floor(Math.random() * proximosDias.length);
    cy.wrap(proximosDias[randomIndex]).click({ force: true });
  });
});

Cypress.Commands.add("fecharModalCupom", () => {
  cy.get("#header-navbar > :nth-child(5)").then(($el) => {
    if ($el.length > 0) {
      cy.wrap($el).invoke("remove");
    }
  });
});

Cypress.Commands.add("fecharModalOutlet", () => {
  cy.get(".QSIWebResponsiveDialog-Layout1-SI_5q1nvjK5caHM6p0_content").then(($el) => {
    if ($el.length > 0) {
      cy.wrap($el).invoke("remove");
    }
  });
});

Cypress.Commands.add("fecharModalGiro", () => {
  cy.wait(1000);
  // cy.get(loc.MENSAGEM_LOGADO).should("contain", "ANDERSON");
  cy.get("body").then(($body) => {
    if ($body.find(".QSIWebResponsiveDialog-Layout1-SI_a5XuRtOQsuZ5iTA_content").length > 0 && $body.find(".QSIWebResponsiveDialog-Layout1-SI_a5XuRtOQsuZ5iTA_content").is(":visible")) {
      cy.log("⚠️ Modal detectado — fechando...");
      cy.get(".QSIWebResponsiveDialog-Layout1-SI_a5XuRtOQsuZ5iTA_close-btn").click({ force: true });
      cy.get(".QSIWebResponsiveDialog-Layout1-SI_a5XuRtOQsuZ5iTA_content").should("not.exist");
    } else {
      cy.log("✅ Sem modal na tela");
    }
    // cy.get(loc.MENSAGEM_LOGADO).should("contain", "ANDERSON");
    // cy.get(loc.BUSCAS.DESTINO_IDA).click();
    // cy.get(loc.BUSCAS.DESTINO_IDA).click().type("São Paulo - Todos (SP)", { delay: 100 });
    // cy.contains("São Paulo - Todos (SP)").click({ force: true });
    // cy.get(loc.BUSCAS.DESTINO_VOLTA).click().type("Rio De Janeiro - Todos (RJ)", { delay: 100 });
    // cy.contains(" Rio De Janeiro - Todos (RJ) ").click({ force: true });
    // cy.get(loc.BUSCAS.DATA_IDA).click();
    // cy.log("✅ Sem modal, indo para a tela de passagens");
  });
});

Cypress.Commands.add("fecharModalUpgradePoltrona", () => {
  cy.wait(3000);
  cy.get("body").then(($body) => {
    if ($body.find(".col-lg-8 > .label-offer > .cmp-text > :nth-child(2)").length > 0 && $body.find(".col-lg-8 > .label-offer > .cmp-text > :nth-child(2)").is(":visible")) {
      cy.log("⚠️ Modal de upgrade detectado — fechando...");
      cy.get("#modal-upsell-buy-ticket-button").click({ force: true });
      // cy.get("#modal-upsell-buy-ticket-button").should("not.exist");
    } else {
      cy.log("✅ Sem modal de upgrade");
    }
  });
});

Cypress.Commands.add("selecionarCidadeSugerida", (cidade) => {
  cy.get(".ui-autocomplete-category").contains("Origens mais buscadas").should("be.visible");

  cy.get(".ui-menu-item").contains(cidade).click();
});

// cy.selecionarCidadeSugerida("São Paulo - Rodoviária Tietê (SP)");
// cy.selecionarCidadeSugerida("Curitiba - Terminal Rodoviário (PR)");

Cypress.Commands.add("selecionarPeriodoEstadia", (diasDeEstadia = 3) => {
  // 1. Busca apenas os botões de dia que estão habilitados para clique
  cy.get('tbody.rdp-tbody button[name="day"]:not([disabled])').then(($botoesValidos) => {
    // Garantir que temos dias suficientes no calendário para a estadia
    const limiteMaximo = $botoesValidos.length - diasDeEstadia;

    // 2. Sorteia o índice do dia de Check-in (Ida)
    const indiceCheckIn = Math.floor(Math.random() * limiteMaximo);

    // 3. Define o índice do dia de Check-out (Volta) baseado no intervalo
    const indiceCheckOut = indiceCheckIn + diasDeEstadia;

    // 4. Clica no Check-in (Ida)
    cy.wrap($botoesValidos[indiceCheckIn]).click({ force: true });

    // Pequena pausa técnica opcional para o calendário processar o primeiro clique
    cy.wait(500);

    // 5. Clica no Check-out (Volta)
    cy.wrap($botoesValidos[indiceCheckOut]).click({ force: true });

    // Exibe no log do Cypress os dias clicados para conferência
    const diaIda = $botoesValidos[indiceCheckIn].textContent.trim();
    const diaVolta = $botoesValidos[indiceCheckOut].textContent.trim();
    cy.log(`📅 Período Selecionado: Dia ${diaIda} até Dia ${diaVolta} (${diasDeEstadia} noites)`);
  });
});
