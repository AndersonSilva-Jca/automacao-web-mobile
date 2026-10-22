// const { cy } = require("@faker-js/faker");
import loc from "./locators";
import LoginPage from "../pages/LoginPage";
// import cypress from "cypress";

Cypress.Commands.add("selecionarDataIda", (range = 8) => {
  cy.get('td[data-handler="selectDay"] a').then(($days) => {
    // Se houver menos de 2 dias disponíveis no mês atual
    if ($days.length < 4) {
      // Avança para o próximo mês
      cy.get("[data-handler='next']").click({ force: true });

      // Busca os dias do novo mês e seleciona aleatoriamente
      cy.get('td[data-handler="selectDay"] a').then(($newDays) => {
        const proximosDias = $newDays.slice(1, range);
        const randomIndex = Math.floor(Math.random() * proximosDias.length);
        cy.wrap(proximosDias[randomIndex]).click({ force: true });
      });
    } else {
      // Mantém o comportamento padrão no mês atual
      const proximosDias = $days.slice(3, range);
      const randomIndex = Math.floor(Math.random() * proximosDias.length);
      cy.wrap(proximosDias[randomIndex]).click({ force: true });
    }
  });
});

Cypress.Commands.add("SelecionarDataParaCupom", (range = 15) => {
  cy.get('td[data-handler="selectDay"] a').then(($days) => {
    // Se houver menos de 2 dias disponíveis no mês atual
    if ($days.length < 11) {
      // Avança para o próximo mês
      cy.get("[data-handler='next']").click({ force: true });

      // Busca os dias do novo mês e seleciona aleatoriamente
      cy.get('td[data-handler="selectDay"] a').then(($newDays) => {
        const proximosDias = $newDays.slice(6, range);
        const randomIndex = Math.floor(Math.random() * proximosDias.length);
        cy.wrap(proximosDias[randomIndex]).click({ force: true });
      });
    } else {
      // Mantém o comportamento padrão no mês atual
      const proximosDias = $days.slice(6, range);
      const randomIndex = Math.floor(Math.random() * proximosDias.length);
      cy.wrap(proximosDias[randomIndex]).click({ force: true });
    }
  });
});

Cypress.Commands.add("selecionarDataWemobi", (range = 5) => {
  cy.get('td[data-handler="selectDay"] a').then(($days) => {
    // Se houver menos de 2 dias disponíveis no mês atual
    if ($days.length < 4) {
      // Avança para o próximo mês
      cy.get("[data-handler='next']").click({ force: true });

      // Busca os dias do novo mês e seleciona aleatoriamente
      cy.get('td[data-handler="selectDay"] a').then(($newDays) => {
        const proximosDias = $newDays.slice(0, range);
        const randomIndex = Math.floor(Math.random() * proximosDias.length);
        cy.wrap(proximosDias[randomIndex]).click({ force: true });
      });
    } else {
      // Mantém o comportamento padrão no mês atual
      const proximosDias = $days.slice(3, range);
      const randomIndex = Math.floor(Math.random() * proximosDias.length);
      cy.wrap(proximosDias[randomIndex]).click({ force: true });
    }
  });
});

// Cypress.Commands.add("selecionarDataIda", (range = 3) => {
//   cy.get('td[data-handler="selectDay"] a').then(($days) => {
//     const proximosDias = $days.slice(0, range);
//     const randomIndex = Math.floor(Math.random() * proximosDias.length);
//     cy.wrap(proximosDias[randomIndex]).click({ force: true });
//   });
// });

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

Cypress.Commands.add("selecionarAssentoTotem", (limiteMaximo) => {
  // @param {number} limiteMaximo

  const seletorAssentoDinamico = 'div[data-select="false"][class*="assento-disponivel"].opacity-100';
  cy.log("Buscando assentos disponíveis (não ocupados e clicáveis)...");

  cy.get(seletorAssentoDinamico)
    // .not(elementoIgnorado)
    .should("be.visible")
    .then(($assentos) => {
      const assentosFiltrados = limiteMaximo ? $assentos.slice(0, limiteMaximo) : $assentos;
      cy.wait(500);
      const totalDisponivel = assentosFiltrados.length;
      expect(totalDisponivel, "Nenhum assento disponível/clicável foi encontrado na tela").to.be.greaterThan(0);

      cy.wait(500);
      // Gera um índice randômico entre 0 e (total - 1)
      const indiceSorteado = Math.floor(Math.random() * totalDisponivel);

      // Log para visualização no painel lateral do Cypress
      cy.log(`🎲 Assento clicável sorteado: ${indiceSorteado + 1} de ${totalDisponivel} livres no mapa.`);

      // Clica no assento sorteado
      cy.wrap(assentosFiltrados).eq(indiceSorteado).click({ force: true });
      cy.wait(500);
    });
});

Cypress.Commands.add("validarPrecoSaidaResumo", () => {
  const precoEntradaPix = Cypress.env("precoEntradaPix");
  const precoEntradaCartao = Cypress.env("precoEntradaCartao");

  if (precoEntradaPix === undefined || precoEntradaCartao === undefined) {
    throw new Error("❌ ERRO: Os preços de entrada (Pix/Cartão) não foram capturados corretamente nas etapas anteriores!");
  }

  // Captura os valores de saída na tela final de resumo/pagamento
  cy.get(".cart-price-int")
    .eq(0)
    .invoke("text")
    .then((intPixSaida) => {
      cy.get(".cart-price-dec")
        .eq(0)
        .invoke("text")
        .then((decPixSaida) => {
          const precoSaidaPix = parseFloat(`${intPixSaida.trim()}${decPixSaida.trim()}`.replace(",", "."));

          cy.get(".cart-price-int")
            .eq(1)
            .invoke("text")
            .then((intCardSaida) => {
              cy.get(".cart-price-dec")
                .eq(1)
                .invoke("text")
                .then((decCardSaida) => {
                  const precoSaidaCartao = parseFloat(`${intCardSaida.trim()}${decCardSaida.trim()}`.replace(",", "."));

                  // Logs no Terminal e Painel
                  console.log(`[TERMINAL] 🏁 SAÍDA PIX: R$ ${precoSaidaPix} | ENTRADA PIX: R$ ${precoEntradaPix}`);
                  console.log(`[TERMINAL] 🏁 SAÍDA CARTÃO: R$ ${precoSaidaCartao} | ENTRADA CARTÃO: R$ ${precoEntradaCartao}`);

                  cy.log(`🏁 [SAÍDA PIX] R$ ${precoSaidaPix} | [ENTRADA PIX] R$ ${precoEntradaPix}`);
                  cy.log(`🏁 [SAÍDA CARTÃO] R$ ${precoSaidaCartao} | [ENTRADA CARTÃO] R$ ${precoEntradaCartao}`);

                  // Validações independentes para Pix e Cartão
                  expect(precoSaidaPix, `Divergência no preço PIX! Entrada: ${precoEntradaPix} vs Saída: ${precoSaidaPix}`).to.eq(precoEntradaPix);
                  expect(precoSaidaCartao, `Divergência no preço Cartão! Entrada: ${precoEntradaCartao} vs Saída: ${precoSaidaCartao}`).to.eq(precoEntradaCartao);

                  cy.log(`✅ Preços de PIX e Cartão conferidos e idênticos com sucesso!`);
                });
            });
        });
    });
});

Cypress.Commands.add("selecionarAssentoAleatorioCometa", () => {
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

  // Clica para expandir os detalhes se necessário
  cy.get('[style="background: #FFFFFF;; box-shadow: undefined;-webkit-box-shadow: undefined;-moz-box-shadow: undefined;; border-radius: undefinedpx;"] > .origin-destination > .show-more-details-container > .trip-details-container > .trip-details-show-passenger > .passenger-division > .passenger-division__toggle').should("be.visible").click({ force: true });

  // 💰 CAPTURA DO PREÇO NO PIX E NO CARTÃO NA TELA DE ASSENTOS (Resumo lateral)
  // Usamos os seletores específicos baseados na estrutura do PIX e Cartão da sua sidebar
  cy.get('.passenger-card__price-pix, [data-bind="pricePix"], .cart-passenger-list')
    .first()
    .within(() => {
      // Captura valor Pix
      cy.get(".cart-price-int")
        .first()
        .invoke("text")
        .then((intPix) => {
          cy.get(".cart-price-dec")
            .first()
            .invoke("text")
            .then((decPix) => {
              const precoPix = parseFloat(`${intPix.trim()}${decPix.trim()}`.replace(",", "."));
              Cypress.env("precoEntradaPix", precoPix);
              console.log(`[TERMINAL CYPRESS] 🎯 PREÇO ENTRADA PIX: R$ ${precoPix}`);
              cy.log(`🎯 [PREÇO ENTRADA PIX] R$ ${precoPix}`);
            });
        });

      // Captura valor Cartão (geralmente logo abaixo do Pix)
      cy.get(".cart-price-int")
        .eq(1)
        .invoke("text")
        .then((intCard) => {
          cy.get(".cart-price-dec")
            .eq(1)
            .invoke("text")
            .then((decCard) => {
              const precoCard = parseFloat(`${intCard.trim()}${decCard.trim()}`.replace(",", "."));
              Cypress.env("precoEntradaCartao", precoCard);
              console.log(`[TERMINAL CYPRESS] 🎯 PREÇO ENTRADA CARTÃO: R$ ${precoCard}`);
              cy.log(`🎯 [PREÇO ENTRADA CARTÃO] R$ ${precoCard}`);
            });
        });
    });

  // Clica para avançar
  cy.get("#btn-proceed").click({ force: true });
});

// Cypress.Commands.add("selecionarAssentoAleatorio", () => {
//   cy.get('button.outer-seat[id^="seat-"]:not(:has(.occupied-seat))', { timeout: 90000 })
//     .should("be.visible")
//     .then(($seats) => {
//       const ids = $seats.map((i, el) => el.id).get();
//       const randomId = ids[Math.floor(Math.random() * ids.length)];

//       cy.wrap(randomId).as("idSorteado");
//     });

//   cy.get("@idSorteado").then((id) => {
//     cy.get(`#${id}`).scrollIntoView().should("be.visible").click({ force: true });
//   });

//   cy.get("#btn-proceed", { timeout: 90000 }).should("be.visible").and("not.be.disabled");

//   // Clica para expandir os detalhes do passageiro no resumo da tela de assentos
//   cy.get('[style="background: #FFFFFF;; box-shadow: undefined;-webkit-box-shadow: undefined;-moz-box-shadow: undefined;; border-radius: undefinedpx;"] > .origin-destination > .show-more-details-container > .trip-details-container > .trip-details-show-passenger > .passenger-division').click();

//   // Valida e captura o preço inicial direto do card do passageiro expandido
//   cy.get('[style="background: #FFFFFF;; box-shadow: undefined;-webkit-box-shadow: undefined;-moz-box-shadow: undefined;; border-radius: undefinedpx;"] > .origin-destination > .show-more-details-container > .trip-details-container > .trip-details-show-passenger > .cart-passenger-list > ul > .passenger-card')
//     .should("be.visible")
//     .within(() => {
//       cy.get(".cart-price-int")
//         .invoke("text")
//         .then((intText) => {
//           cy.get(".cart-price-dec")
//             .invoke("text")
//             .then((decText) => {
//               const precoEntradaStr = `${intText.trim()}${decText.trim()}`.replace(",", ".");
//               const precoEntrada = parseFloat(precoEntradaStr);

//               // Salva globalmente para comparar no checkout/saída
//               Cypress.env("precoEntradaPassagem", precoEntrada);

//               // Logs exibidos no painel do Cypress e no terminal Node.js
//               console.log(`[TERMINAL CYPRESS] 🎯 PREÇO DE ENTRADA (NO ASSENTO): R$ ${precoEntrada}`);
//               cy.log(`🎯 [PREÇO ENTRADA] R$ ${precoEntrada}`);
//             });
//         });
//     });
// });

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
  // cy.get('[style="background: #FFFFFF;; box-shadow: undefined;-webkit-box-shadow: undefined;-moz-box-shadow: undefined;; border-radius: undefinedpx;"] > .origin-destination > .show-more-details-container > .trip-details-container > .trip-details-show-passenger > .passenger-division').click();
  // cy.get('[style="background: #FFFFFF;; box-shadow: undefined;-webkit-box-shadow: undefined;-moz-box-shadow: undefined;; border-radius: undefinedpx;"] > .origin-destination > .show-more-details-container > .trip-details-container > .trip-details-show-passenger > .cart-passenger-list > ul > .passenger-card > .passenger-card__row > .passenger-card__price > .passenger-card__price-pix').should("be.visible");
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

          cy.wait(2000);
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
  cy.get(".container-max-width-1400 > :nth-child(4)").should("be.visible");
  cy.contains("ESCOLHER PASSAGENS", { timeout: 90000 }).should("be.visible");
  cy.log("⏳ Aguardando estabilização da página de ofertas...");

  cy.get("li.list-companies-item", { timeout: 90000 }).should("be.visible");

  // 1. VERIFICAÇÃO INICIAL GLOBAL: Procura se o bug do template (R\$$price$decimal) está visível na página atual
  cy.get("body").then(($body) => {
    const textoPagina = $body.text();
    const temErroTemplateGlobal = textoPagina.includes("$price") || textoPagina.includes("$decimal");
    if (temErroTemplateGlobal) {
      cy.log("⚠️ Bug de template (R$$price$decimal) detetado na data atual. Avançando um dia no calendário...");

      // Clica no seletor para avançar um dia
      cy.get(":nth-child(5) > .prev-date").should("be.visible").click({ force: true });

      // Aguarda os novos resultados carregarem após a mudança de dia
      cy.wait(4000);
    } else {
      cy.log("✅ Nenhum erro de template global detetado na data atual.");
    }
  });

  // 2. LOGICA ORIGINAL DA WEMOBI (Mantida exatamente como você pediu, limpa e intacta)
  cy.get("li.list-companies-item")
    .filter((_, el) => {
      return Cypress.$(el).find('button[data-offer-marketplace-text="Experiência wemobi"]').length > 0;
    })
    .then(($empresasWemobi) => {
      // Falha o teste se não houver nenhuma empresa com a Experiência wemobi na página atual
      if ($empresasWemobi.length === 0) {
        throw new Error("❌ Teste interrompido: Nenhuma passagem 'Experiência wemobi' foi encontrada!");
      }

      // Extrai as ofertas válidas contidas APENAS nos cards da Experiência wemobi
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

      // Sorteia uma oferta entre as válidas
      const randomIndex = Math.floor(Math.random() * total);
      const escolha = ofertasValidas[randomIndex];
      const $btnCompra = Cypress.$(escolha).find('button[data-js="buy-ticket"]');

      cy.log(`🎰 Sorteada opção Experiência wemobi ${randomIndex + 1} de ${total}`);

      cy.wait(500);
      cy.wrap($btnCompra)
        .parents(".available")
        .invoke("show")
        .wrap($btnCompra)
        .invoke("show")
        .scrollIntoView({ offset: { top: -150 } })
        .should("exist")
        .and("not.be.disabled")
        .click({ force: true });

      cy.wait(3000);

      // Trata o modal da madrugada caso apareça
      cy.get("body").then(($bodyModal) => {
        if ($bodyModal.find('[data-js="button-agree"]').is(":visible")) {
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

Cypress.Commands.add("selecionarPassagemAleatoria", () => {
  cy.contains("ESCOLHER PASSAGENS", { timeout: 90000 }).should("be.visible");
  cy.log("⏳ Aguardando estabilização da página de ofertas...");
  // cy.wait(1000);
  // cy.scrollTo("bottom");
  // cy.wait(1000);
  // cy.scrollTo("bottom");

  cy.get('li[data-js^="offer-element-"]', { timeout: 90000 }).should("be.visible");

  cy.wait(1000);

  cy.get('li[data-js^="offer-element-"]:has(.available)', { timeout: 90000 })
    .should("exist")
    .invoke("show")
    .then(($ofertas) => {
      const ofertasValidas = $ofertas.filter((i, el) => {
        const $oferta = Cypress.$(el);

        const textoClasse = $oferta.find('[data-js^="classtype"]').text().toUpperCase();

        const textoOferta = $oferta.text();

        const temBotaoAtivo = $oferta.find('button[data-js="buy-ticket"]:not([disabled])').length > 0;

        const temPrecoInvalido = textoOferta.includes("R$$price$decimal").log("❌ Preço inválido detectado, ignorando o R$$price$decimal...");

        return !textoClasse.includes("CAMA") && temBotaoAtivo && !temPrecoInvalido;
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

        .wrap($btnCompra)
        .invoke("show")
        .scrollIntoView({ offset: { top: -150 } })
        .should("exist")
        .and("not.be.disabled")
        .click({ force: true });

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

Cypress.Commands.add("selecionarPassagemAleatoriaExpressoSul", () => {
  cy.contains("ESCOLHER PASSAGENS", { timeout: 90000 }).should("be.visible");
  cy.log("⏳ Aguardando estabilização da página de ofertas...");

  cy.get('li[data-js^="offer-element-"]', { timeout: 90000 }).should("be.visible");

  cy.wait(1000);

  cy.get('li[data-js^="offer-element-"]:has(.available)', { timeout: 90000 })
    .should("exist")
    .invoke("show")
    .then(($ofertas) => {
      const ofertasValidas = $ofertas.filter((i, el) => {
        const $oferta = Cypress.$(el);

        // 1. Tipo da classe (filtra CAMA)
        const textoClasse = $oferta.find('[data-js^="classtype"]').text().toUpperCase();

        // 2. Botão de compra ativo
        const temBotaoAtivo = $oferta.find('button[data-js="buy-ticket"]:not([disabled])').length > 0;

        // 3. Validação do Preço Renderizado:
        // Verifica se existe o elemento de preço e se ele NÃO possui as tags de template brutas
        const $spanPreco = $oferta.find('[data-js="priceLabel"]');
        const textoPrecoLabel = $spanPreco.length > 0 ? $spanPreco.text() : "";

        // Se o span tiver a string '$price', significa que o JS da página ainda não aplicou o valor real
        const estaQuebrado = textoPrecoLabel.includes("$price");

        return !textoClasse.includes("CAMA") && temBotaoAtivo && !estaQuebrado;
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

        .wrap($btnCompra)
        .invoke("show")
        .scrollIntoView({ offset: { top: -150 } })
        .should("exist")
        .and("not.be.disabled")
        .click({ force: true });

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
        const $oferta = Cypress.$(el);

        // 1. Tipo da classe (filtra CAMA)
        const textoClasse = $oferta.find('[data-js^="classtype"]').text().toUpperCase();

        // 2. Botão de compra ativo
        const temBotaoAtivo = $oferta.find('button[data-js="buy-ticket"]:not([disabled])').length > 0;

        // 3. Validação do Preço Renderizado
        const $spanPreco = $oferta.find('[data-js="priceLabel"]');
        const textoPrecoLabel = $spanPreco.length > 0 ? $spanPreco.text() : "";
        const estaQuebrado = textoPrecoLabel.includes("$price");

        // 4. Validação da Empresa / Operadora (Ignora a Cometa)
        const $imgEmpresa = $oferta.find('.managed-by img[data-js="imgCompany"]');
        const altEmpresa = ($imgEmpresa.attr("alt") || "").toLowerCase();
        const srcEmpresa = ($imgEmpresa.attr("src") || "").toLowerCase();

        // Verifica se a passagem é operada pela Cometa
        const eCometa = altEmpresa.includes("cometa") || srcEmpresa.includes("cometa");

        // Retorna TRUE apenas se NÃO for Cometa
        return !textoClasse.includes("CAMA") && temBotaoAtivo && !estaQuebrado && !eCometa;
      });

      const total = ofertasValidas.length;
      if (total === 0) throw new Error("Nenhuma passagem válida encontrada (todas as ofertas eram Cometa ou indisponíveis)!");

      const randomIndex = Math.floor(Math.random() * total);
      const escolha = ofertasValidas[randomIndex];
      const $btnCompra = Cypress.$(escolha).find('button[data-js="buy-ticket"]', { timeout: 90000 });

      cy.log(`🎰 Sorteada opção ${randomIndex + 1} de ${total} (Excluindo Cometa)`);

      cy.wait(500);
      cy.wrap($btnCompra)
        .parents(".available")
        .invoke("show")

        .wrap($btnCompra)
        .invoke("show")
        .scrollIntoView({ offset: { top: -150 } })
        .should("exist")
        .and("not.be.disabled")
        .click({ force: true });

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

Cypress.Commands.add("selecionarPassagemAleatoriaRR", () => {
  cy.contains("ESCOLHER PASSAGENS", { timeout: 90000 }).should("be.visible");
  cy.log("⏳ Aguardando estabilização da página de ofertas...");

  cy.get('li[data-js^="offer-element-"]', { timeout: 90000 }).should("be.visible");

  cy.wait(1000);

  cy.get('li[data-js^="offer-element-"]:has(.available)', { timeout: 90000 })
    .should("exist")
    .invoke("show")
    .then(($ofertas) => {
      const ofertasValidas = $ofertas.filter((i, el) => {
        const $oferta = Cypress.$(el);

        // 1. Tipo da classe (filtra CAMA)
        const textoClasse = $oferta.find('[data-js^="classtype"]').text().toUpperCase();

        // 2. Botão de compra ativo
        const temBotaoAtivo = $oferta.find('button[data-js="buy-ticket"]:not([disabled])').length > 0;

        // 3. Validação do Preço Renderizado
        const $spanPreco = $oferta.find('[data-js="priceLabel"]');
        const textoPrecoLabel = $spanPreco.length > 0 ? $spanPreco.text() : "";
        const estaQuebrado = textoPrecoLabel.includes("$price");

        // 4. Validação da Empresa / Operadora (Ignora a Cometa)
        const $imgEmpresa = $oferta.find('.managed-by img[data-js="imgCompany"]');
        const altEmpresa = ($imgEmpresa.attr("alt") || "").toLowerCase();
        const srcEmpresa = ($imgEmpresa.attr("src") || "").toLowerCase();

        // Verifica se a passagem é operada pela Cometa
        const eCometa = altEmpresa.includes("cometa") || srcEmpresa.includes("cometa");

        // Retorna TRUE apenas se NÃO for Cometa
        return !textoClasse.includes("CAMA") && temBotaoAtivo && !estaQuebrado && !eCometa;
      });

      const total = ofertasValidas.length;
      if (total === 0) throw new Error("Nenhuma passagem válida encontrada (todas as ofertas eram Cometa ou indisponíveis)!");

      const randomIndex = Math.floor(Math.random() * total);
      const escolha = ofertasValidas[randomIndex];
      const $btnCompra = Cypress.$(escolha).find('button[data-js="buy-ticket"]', { timeout: 90000 });

      cy.log(`🎰 Sorteada opção ${randomIndex + 1} de ${total} (Excluindo Cometa)`);

      cy.wait(500);
      cy.wrap($btnCompra)
        .parents(".available")
        .invoke("show")

        .wrap($btnCompra)
        .invoke("show")
        .scrollIntoView({ offset: { top: -150 } })
        .should("exist")
        .and("not.be.disabled")
        .click({ force: true });

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
  cy.get("body").then(($body) => {
    if ($body.find(".QSIWebResponsiveDialog-Layout1-SI_a5XuRtOQsuZ5iTA_content").length > 0 && $body.find(".QSIWebResponsiveDialog-Layout1-SI_a5XuRtOQsuZ5iTA_content").is(":visible")) {
      cy.log("⚠️ Modal detectado — fechando...");
      cy.get(".QSIWebResponsiveDialog-Layout1-SI_a5XuRtOQsuZ5iTA_close-btn").click({ force: true });
      cy.get(".QSIWebResponsiveDialog-Layout1-SI_a5XuRtOQsuZ5iTA_content").should("not.exist");
    } else {
      cy.log("✅ Sem modal na tela");
    }
  });
});

Cypress.Commands.add("fecharModalUpgradePoltrona", () => {
  cy.get("body").then(($body) => {
    if ($body.find("#modal-upsel").length > 0 && $body.find("#modal-upsel").is(":visible")) {
      cy.log("⚠️ Modal de upgrade detectado — fechando...");
      cy.get("#modal-upsel", { timeout: 90000 }).should("be.visible");
      cy.get("#close-modal-upsel").click({ force: true });
    } else {
      cy.log("✅ Sem modal de upgrade");
    }
  });
});

Cypress.Commands.add("fecharModalUpgradePoltronaUTP", () => {
  cy.wait(3000);
  cy.get("body").then(($body) => {
    if ($body.find(".modal-upsell-v2-header").length > 0 && $body.find(".modal-upsell-v2-header").is(":visible")) {
      cy.log("⚠️ Modal de upgrade detectado — fechando...");
      cy.get(".modal-upsell-v2-header__close > .jca-ico-close").click({ force: true });
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

Cypress.Commands.add("limpezaTotal", () => {
  // 1. Limpa a trindade básica
  cy.clearAllCookies();
  cy.clearAllLocalStorage();
  cy.clearAllSessionStorage();

  // 2. Limpa cache de rede via protocolo do Chrome
  Cypress.automation("remote:debugger:protocol", {
    command: "Network.clearBrowserCache",
  });

  // 3. Remove Service Workers apenas se a página permitir
  cy.window({ log: false }).then((win) => {
    try {
      // Evita o erro InvalidStateError ignorando páginas about:blank
      if ("serviceWorker" in win.navigator && win.location.protocol !== "about:") {
        win.navigator.serviceWorker
          .getRegistrations()
          .then((registrations) => {
            registrations.forEach((registration) => registration.unregister());
          })
          .catch(() => {
            // Se o navegador bloquear a promessa, ignora silenciosamente
          });
      }
    } catch (e) {
      // Ignora falhas síncronas de permissão
    }
  });

  // 4. Limpa IndexedDB apenas se a página permitir
  cy.window({ log: false }).then((win) => {
    try {
      if (win.indexedDB && win.location.protocol !== "about:") {
        win.indexedDB
          .databases()
          .then((dbs) => {
            dbs.forEach((db) => win.indexedDB.deleteDatabase(db.name));
          })
          .catch(() => {});
      }
    } catch (e) {}
  });
});

Cypress.Commands.add("selecionarTopRotaCometa", () => {
  const topRotas = [
    {
      origem: "São Paulo (Rod. Tietê) (SP)",
      origemXpath: '//*[@id="São-Paulo-(Rod.-Tietê)-(SP)"]/p[1]',
      destino: "Belo Horizonte - Terminal Rodoviário (MG)",
      destinoXpath: '//*[@id="Belo-Horizonte---Terminal-Rodoviário-(MG)"]/p[1]',
    },
    {
      origem: "Belo Horizonte - Terminal Rodoviário (MG)",
      origemXpath: '//*[@id="Belo-Horizonte---Terminal-Rodoviário-(MG)"]/p[1]',
      destino: "São Paulo (Rod. Tietê) (SP)",
      destinoXpath: '//*[@id="São-Paulo-(Rod.-Tietê)-(SP)"]/p[1]',
    },
    {
      origem: "São Paulo (Rod. Barra Funda) (SP)",
      origemXpath: '//*[@id="São-Paulo-(Rod.-Barra-Funda)-(SP)"]/p[1]',
      destino: "São José do Rio Preto (Rodoviária) (SP)",
      destinoXpath: '//*[@id="São-José-do-Rio-Preto-(Rodoviária)-(SP)"]/p[1]',
    },
    {
      origem: "São José do Rio Preto (Rodoviária) (SP)",
      origemXpath: '//*[@id="São-José-do-Rio-Preto-(Rodoviária)-(SP)"]/p[1]',
      destino: "São Paulo (Rod. Barra Funda) (SP)",
      destinoXpath: '//*[@id="São-Paulo-(Rod.-Barra-Funda)-(SP)"]/p[1]',
    },
    {
      origem: "Curitiba (PR)",
      origemXpath: '//*[@id="Curitiba-(PR)"]/p[1]',
      destino: "São Paulo (Rod. Tietê) (SP)",
      destinoXpath: '//*[@id="São-Paulo-(Rod.-Tietê)-(SP)"]/p[1]',
    },
  ];

  const indiceSorteado = Cypress._.random(0, topRotas.length - 1);
  const rotaEscolhida = topRotas[indiceSorteado];

  cy.log(`🎲 **Rota Sorteada:** ${rotaEscolhida.origem} -> ${rotaEscolhida.destino}`);

  cy.get("#input-departure").click().type(rotaEscolhida.origem, { delay: 100 }).should("exist").invoke("show");

  cy.xpath(rotaEscolhida.origemXpath).click({ force: true });

  cy.get("#input-destination").click().type(rotaEscolhida.destino, { delay: 100 }).should("exist").invoke("show");

  // cy.xpath(rotaEscolhida.destinoXpath).click({ force: true });
  cy.xpath(rotaEscolhida.destinoXpath).then(($elementos) => {
    if ($elementos.length > 1) {
      cy.wrap($elementos).eq(1).click({ force: true });
    } else {
      cy.wrap($elementos).click({ force: true });
    }
  });

  // Retorna o objeto sorteado para o teste caso precise
  // return cy.wrap(rotaEscolhida);
});

Cypress.Commands.add("selecionarTopRotaODP", () => {
  const topRotas = [
    {
      origem: "Rio De Janeiro - Rodoviária Novo Rio (RJ)",
      origemXpath: '//*[@id="Rio-De-Janeiro---Rodoviária-Novo-Rio-(RJ)"]/p[1]',
      destino: "São Paulo - Rodoviária Tietê (SP)",
      destinoXpath: '//*[@id="São-Paulo---Rodoviária-Tietê-(SP)"]/p[1]',
    },
    // {
    //   origem: "São Paulo - Rodoviária Tietê (SP)",
    //   origemXpath: '//*[@id="São-Paulo---Rodoviária-Tietê-(SP)"]/p[1]',
    //   destino: "Rio De Janeiro - Rodoviária Novo Rio (RJ)",
    //   destinoXpath: '//*[@id="Rio-De-Janeiro---Rodoviária-Novo-Rio-(RJ)"]/p[1]',
    // },
    {
      origem: "Rio De Janeiro - Rodoviária Novo Rio (RJ)",
      origemXpath: '//*[@id="Rio-De-Janeiro---Rodoviária-Novo-Rio-(RJ)"]/p[1]',
      destino: "Belo Horizonte - Terminal Rodoviário (MG)",
      destinoXpath: '//*[@id="Belo-Horizonte---Terminal-Rodoviário-(MG)"]/p[1]',
    },
    {
      origem: "Belo Horizonte - Terminal Rodoviário (MG)",
      origemXpath: '//*[@id="Belo-Horizonte---Terminal-Rodoviário-(MG)"]/p[1]',
      destino: "Rio De Janeiro - Rodoviária Novo Rio (RJ)",
      destinoXpath: '//*[@id="Rio-De-Janeiro---Rodoviária-Novo-Rio-(RJ)"]/p[1]',
    },
    // {
    //   origem: "Florianópolis - Rodoviária Rita Maria (SC)",
    //   origemXpath: '//*[@id="Florianópolis---Rodoviária-Rita-Maria-(SC)"]/p[1]',
    //   destino: "São Paulo - Rodoviária Tietê (SP)",
    //   destinoXpath: '//*[@id="São-Paulo---Rodoviária-Tietê-(SP)"]/p[1]',
    // },
  ];

  const indiceSorteado = Cypress._.random(0, topRotas.length - 1);
  const rotaEscolhida = topRotas[indiceSorteado];

  cy.log(`🎲 **Rota Sorteada:** ${rotaEscolhida.origem} -> ${rotaEscolhida.destino}`);

  cy.get("#input-departure").click().type(rotaEscolhida.origem, { delay: 100 });

  cy.xpath(rotaEscolhida.origemXpath).click();

  cy.get("#input-destination").click({ force: true }).type(rotaEscolhida.destino, { delay: 150 });

  // cy.xpath(rotaEscolhida.destinoXpath).eq(1).click();
  cy.xpath(rotaEscolhida.destinoXpath).then(($elementos) => {
    if ($elementos.length > 1) {
      cy.wrap($elementos).eq(1).click({ force: true });
    } else {
      cy.wrap($elementos).click({ force: true });
    }
  });
  // Retorna o objeto sorteado para o teste caso precise
  // return cy.wrap(rotaEscolhida);
});

Cypress.Commands.add("selecionarTopRotaWemobiExp", () => {
  cy.wait(1000); // Pequena pausa para garantir que a página carregou corretamente
  const topRotas = [
    {
      origem: "Rio De Janeiro - Todos (RJ)",
      origemXpath: '//*[@id="Rio-de-Janeiro---Todos-(RJ)"]/p[1]',
      destino: "São Paulo - Todos (SP)",
      destinoXpath: '//*[@id="São-Paulo---Todos-(SP)"]/p[1]',
    },
    {
      origem: "São Paulo - Todos (SP)",
      origemXpath: '//*[@id="São-Paulo---Todos-(SP)"]/p[1]',
      destino: "Rio De Janeiro - Todos (RJ)",
      destinoXpath: '//*[@id="Rio-de-Janeiro---Todos-(RJ)"]/p[1]',
    },
  ];

  const indiceSorteado = Cypress._.random(0, topRotas.length - 1);
  const rotaEscolhida = topRotas[indiceSorteado];

  cy.log(`🎲 **Rota Sorteada:** ${rotaEscolhida.origem} -> ${rotaEscolhida.destino}`);

  cy.get("#input-departure").click().type(rotaEscolhida.origem, { delay: 100 }).should("exist").invoke("show");

  cy.xpath(rotaEscolhida.origemXpath).click({ force: true });

  cy.get("#input-destination").click().type(rotaEscolhida.destino, { delay: 100 }).should("exist").invoke("show");

  // cy.xpath(rotaEscolhida.destinoXpath).click({ force: true });
  cy.xpath(rotaEscolhida.destinoXpath).then(($elementos) => {
    if ($elementos.length > 1) {
      cy.wrap($elementos).eq(1).should("be.visible").click({ force: true });
    } else {
      cy.wrap($elementos).should("be.visible").click({ force: true });
    }
  });
  // Retorna o objeto sorteado para o teste caso precise
  // return cy.wrap(rotaEscolhida);
});

Cypress.Commands.add("selecionarTopRotaWemobi", () => {
  cy.wait(1000); // Pequena pausa para garantir que a página carregou corretamente
  const topRotas = [
    // {
    //   origem: "Rio De Janeiro - Rodoviária Novo Rio (RJ)",
    //   origemXpath: '//*[@id="Rio-De-Janeiro---Rodoviária-Novo-Rio-(RJ)"]/p[1]',
    //   destino: "São Paulo - Rodoviária Tietê (SP)",
    //   destinoXpath: '//*[@id="São-Paulo---Rodoviária-Tietê-(SP)"]/p[1]',
    // },
    // {
    //   origem: "São Paulo - Rodoviária Tietê (SP)",
    //   origemXpath: '//*[@id="São-Paulo---Rodoviária-Tietê-(SP)"]/p[1]',
    //   destino: "Rio De Janeiro - Rodoviária Novo Rio (RJ)",
    //   destinoXpath: '//*[@id="Rio-De-Janeiro---Rodoviária-Novo-Rio-(RJ)"]/p[1]',
    // },
    {
      origem: "São Paulo - Rodoviária Tietê (SP)",
      origemXpath: '//*[@id="São-Paulo---Rodoviária-Tietê-(SP)"]/p[1]',
      destino: "Belo Horizonte - Terminal Rodoviário (MG)",
      destinoXpath: '//*[@id="Belo-Horizonte---Terminal-Rodoviário-(MG)"]/p[1]',
    },
    {
      origem: "Belo Horizonte - Terminal Rodoviário (MG)",
      origemXpath: '//*[@id="Belo-Horizonte---Terminal-Rodoviário-(MG)"]/p[1]',
      destino: "São Paulo - Rodoviária Tietê (SP)",
      destinoXpath: '//*[@id="São-Paulo---Rodoviária-Tietê-(SP)"]/p[1]',
    },
    {
      origem: "São Paulo - Rodoviária Barra Funda (SP)",
      origemXpath: '//*[@id="São-Paulo---Rodoviária-Barra-Funda-(SP)"]/p[1]',
      destino: "Maringa (PR)",
      destinoXpath: '//*[@id="Maringa-(PR)"]/p[1]',
    },
  ];

  const indiceSorteado = Cypress._.random(0, topRotas.length - 1);
  const rotaEscolhida = topRotas[indiceSorteado];

  cy.log(`🎲 **Rota Sorteada:** ${rotaEscolhida.origem} -> ${rotaEscolhida.destino}`);

  cy.get("#input-departure").click({ force: true }).type(rotaEscolhida.origem, { delay: 100 }).should("exist").invoke("show");

  cy.xpath(rotaEscolhida.origemXpath).click({ force: true });

  cy.get("#input-destination").click({ force: true }).type(rotaEscolhida.destino, { delay: 100 }).should("exist").invoke("show");

  cy.xpath(rotaEscolhida.destinoXpath).then(($elementos) => {
    if ($elementos.length > 1) {
      cy.wrap($elementos).eq(1).click({ force: true });
    } else {
      cy.wrap($elementos).click({ force: true });
    }
  });

  // Retorna o objeto sorteado para o teste caso precise
  // return cy.wrap(rotaEscolhida);
});

Cypress.Commands.add("selecionarTopRotasGiro", () => {
  cy.wait(1000);
  const topRotas = [
    {
      origem: "Rio De Janeiro - Rodoviária Novo Rio (RJ)",
      origemXpath: '//*[@id="Rio-De-Janeiro---Rodoviária-Novo-Rio-(RJ)"]/p[1]',
      destino: "São Paulo - Rodoviária Tietê (SP)",
      destinoXpath: '//*[@id="São-Paulo---Rodoviária-Tietê-(SP)"]/p[1]',
    },
    {
      origem: "São Paulo - Rodoviária Tietê (SP)",
      origemXpath: '//*[@id="São-Paulo---Rodoviária-Tietê-(SP)"]/p[1]',
      destino: "Rio De Janeiro - Rodoviária Novo Rio (RJ)",
      destinoXpath: '//*[@id="Rio-De-Janeiro---Rodoviária-Novo-Rio-(RJ)"]/p[1]',
    },
    {
      origem: "Rio De Janeiro - Rodoviária Novo Rio (RJ)",
      origemXpath: '//*[@id="Rio-De-Janeiro---Rodoviária-Novo-Rio-(RJ)"]/p[1]',
      destino: "Campos Dos Goytacazes - Shopping Estrada (RJ)",
      destinoXpath: '//*[@id="Campos-Dos-Goytacazes---Shopping-Estrada-(RJ)"]/p[1]',
    },
    {
      origem: "Campos Dos Goytacazes - Shopping Estrada (RJ)",
      origemXpath: '//*[@id="Campos-Dos-Goytacazes---Shopping-Estrada-(RJ)"]/p[1]',
      destino: "Rio De Janeiro - Rodoviária Novo Rio (RJ)",
      destinoXpath: '//*[@id="Rio-De-Janeiro---Rodoviária-Novo-Rio-(RJ)"]/p[1]',
    },
    {
      origem: "São Paulo - Rodoviária Tietê (SP)",
      origemXpath: '//*[@id="São-Paulo---Rodoviária-Tietê-(SP)"]/p[1]',
      destino: "Ribeirão Preto - Terminal Rodoviário (SP)",
      destinoXpath: '//*[@id="Ribeirão-Preto---Terminal-Rodoviário-(SP)"]/p[1]',
    },
  ];

  const indiceSorteado = Cypress._.random(0, topRotas.length - 1);
  const rotaEscolhida = topRotas[indiceSorteado];

  cy.log(`🎲 **Rota Sorteada:** ${rotaEscolhida.origem} -> ${rotaEscolhida.destino}`);

  cy.get("#input-departure").click({ force: true }).type(rotaEscolhida.origem, { delay: 100 });

  cy.xpath(rotaEscolhida.origemXpath).click({ force: true });

  cy.get("#input-destination").click({ force: true }).type(rotaEscolhida.destino, { delay: 100 });
  // cy.xpath(rotaEscolhida.destinoXpath).eq(1).click();

  cy.xpath(rotaEscolhida.destinoXpath).then(($elementos) => {
    if ($elementos.length > 1) {
      cy.wrap($elementos).eq(1).click({ force: true });
    } else {
      cy.wrap($elementos).click({ force: true });
    }
  });

  // Retorna o objeto sorteado para o teste caso precise
  // return cy.wrap(rotaEscolhida);
});

Cypress.Commands.add("selecionarTopRotas1001", () => {
  cy.wait(1000);
  const topRotas = [
    {
      origem: "Rio de Janeiro (Novo Rio) (RJ)",
      origemXpath: '//*[@id="Rio-de-Janeiro-(Novo-Rio)-(RJ)"]/p[1]',
      destino: "Campos dos Goy. (S.Estrada) (RJ)",
      destinoXpath: '//*[@id="Campos-dos-Goy.-(S.Estrada)-(RJ)"]/p[1]',
    },
    {
      origem: "Campos dos Goy. (S.Estrada) (RJ)",
      origemXpath: '//*[@id="Campos-dos-Goy.-(S.Estrada)-(RJ)"]/p[1]',
      destino: "Rio de Janeiro (Novo Rio) (RJ)",
      destinoXpath: '//*[@id="Rio-de-Janeiro-(Novo-Rio)-(RJ)"]/p[1]',
    },
    {
      origem: "Rio de Janeiro (Novo Rio) (RJ)",
      origemXpath: '//*[@id="Rio-de-Janeiro-(Novo-Rio)-(RJ)"]/p[1]',
      destino: "Macaé (RJ)",
      destinoXpath: '//*[@id="Macaé-(RJ)"]/p[1]',
    },
    {
      origem: "Macaé (RJ)",
      origemXpath: '//*[@id="Macaé-(RJ)"]/p[1]',
      destino: "Rio de Janeiro (Novo Rio) (RJ)",
      destinoXpath: '//*[@id="Rio-de-Janeiro-(Novo-Rio)-(RJ)"]/p[1]',
    },
    {
      origem: "Rio de Janeiro (Novo Rio) (RJ)",
      origemXpath: '//*[@id="Rio-de-Janeiro-(Novo-Rio)-(RJ)"]/p[1]',
      destino: "São Paulo (Rod. Tietê) (SP)",
      destinoXpath: '//*[@id="São-Paulo-(Rod.-Tietê)-(SP)"]/p[1]',
    },
  ];

  const indiceSorteado = Cypress._.random(0, topRotas.length - 1);
  const rotaEscolhida = topRotas[indiceSorteado];

  cy.log(`🎲 **Rota Sorteada:** ${rotaEscolhida.origem} -> ${rotaEscolhida.destino}`);

  cy.get("#input-departure").click({ force: true }).type(rotaEscolhida.origem, { delay: 100 }).should("exist").invoke("show");

  cy.xpath(rotaEscolhida.origemXpath).click({ force: true });

  cy.get("#input-destination").click({ force: true }).type(rotaEscolhida.destino, { delay: 100 }).should("exist").invoke("show");

  cy.xpath(rotaEscolhida.destinoXpath).then(($elementos) => {
    if ($elementos.length > 1) {
      cy.wrap($elementos).eq(1).click({ force: true });
    } else {
      cy.wrap($elementos).click({ force: true });
    }
  });
});

Cypress.Commands.add("selecionarTopRotasExpressoSul", () => {
  cy.wait(1000);
  const topRotas = [
    {
      origem: "Rio de Janeiro (Novo Rio) (RJ)",
      origemXpath: '//*[@id="Rio-de-Janeiro-(Novo-Rio)-(RJ)"]/p[1]',
      destino: "Campos dos Goy. (S.Estrada) (RJ)",
      destinoXpath: '//*[@id="Campos-dos-Goy.-(S.Estrada)-(RJ)"]/p[1]',
    },
    {
      origem: "Campos dos Goy. (S.Estrada) (RJ)",
      origemXpath: '//*[@id="Campos-dos-Goy.-(S.Estrada)-(RJ)"]/p[1]',
      destino: "Rio de Janeiro (Novo Rio) (RJ)",
      destinoXpath: '//*[@id="Rio-de-Janeiro-(Novo-Rio)-(RJ)"]/p[1]',
    },
    {
      origem: "Rio de Janeiro (Novo Rio) (RJ)",
      origemXpath: '//*[@id="Rio-de-Janeiro-(Novo-Rio)-(RJ)"]/p[1]',
      destino: "Macaé (RJ)",
      destinoXpath: '//*[@id="Macaé-(RJ)"]/p[1]',
    },
    {
      origem: "Macaé (RJ)",
      origemXpath: '//*[@id="Macaé-(RJ)"]/p[1]',
      destino: "Rio de Janeiro (Novo Rio) (RJ)",
      destinoXpath: '//*[@id="Rio-de-Janeiro-(Novo-Rio)-(RJ)"]/p[1]',
    },
    {
      origem: "Rio de Janeiro (Novo Rio) (RJ)",
      origemXpath: '//*[@id="Rio-de-Janeiro-(Novo-Rio)-(RJ)"]/p[1]',
      destino: "São Paulo (Rod. Tietê) (SP)",
      destinoXpath: '//*[@id="São-Paulo-(Rod.-Tietê)-(SP)"]/p[1]',
    },
  ];

  const indiceSorteado = Cypress._.random(0, topRotas.length - 1);
  const rotaEscolhida = topRotas[indiceSorteado];

  cy.log(`🎲 **Rota Sorteada:** ${rotaEscolhida.origem} -> ${rotaEscolhida.destino}`);

  cy.get("#input-departure").click({ force: true }).type(rotaEscolhida.origem, { delay: 100 }).should("exist").invoke("show");

  cy.xpath(rotaEscolhida.origemXpath).click({ force: true });

  cy.get("#input-destination").click({ force: true }).type(rotaEscolhida.destino, { delay: 100 }).should("exist").invoke("show");

  // cy.xpath(rotaEscolhida.destinoXpath).eq(0).click({ force: true });
  cy.xpath(rotaEscolhida.destinoXpath).then(($elementos) => {
    if ($elementos.length > 1) {
      cy.wrap($elementos).eq(1).click({ force: true });
    } else {
      cy.wrap($elementos).click({ force: true });
    }
  });
});

Cypress.Commands.add("selecionarTopRotasCatarinense", () => {
  cy.wait(1000);
  const topRotas = [
    {
      origem: "Florianópolis (SC)",
      origemXpath: '//*[@id="Florianópolis-(SC)"]/p[1]',
      destino: "São Paulo (Rod. Tietê) (SP)",
      destinoXpath: '//*[@id="São-Paulo-(Rod.-Tietê)-(SP)"]/p[1]',
    },
    {
      origem: "São Paulo (Rod. Tietê) (SP)",
      origemXpath: '//*[@id="São-Paulo-(Rod.-Tietê)-(SP)"]/p[1]',
      destino: "Florianópolis (SC)",
      destinoXpath: '//*[@id="Florianópolis-(SC)"]/p[1]',
    },
    {
      origem: "Foz do Iguaçu (PR)",
      origemXpath: '//*[@id="Foz-do-Iguaçu-(PR)"]/p[1]',
      destino: "Curitiba (PR)",
      destinoXpath: '//*[@id="Curitiba-(PR)"]/p[1]',
    },
    {
      origem: "Curitiba (PR)",
      origemXpath: '//*[@id="Curitiba-(PR)"]/p[1]',
      destino: "Foz do Iguaçu (PR)",
      destinoXpath: '//*[@id="Foz-do-Iguaçu-(PR)"]/p[1]',
    },
    {
      origem: "Florianópolis (SC)",
      origemXpath: '//*[@id="Florianópolis-(SC)"]/p[1]',
      destino: "Curitiba (PR)",
      destinoXpath: '//*[@id="Curitiba-(PR)"]/p[1]',
    },
  ];

  const indiceSorteado = Cypress._.random(0, topRotas.length - 1);
  const rotaEscolhida = topRotas[indiceSorteado];

  cy.log(`🎲 **Rota Sorteada:** ${rotaEscolhida.origem} -> ${rotaEscolhida.destino}`);

  cy.get("#input-departure").click({ force: true }).type(rotaEscolhida.origem, { delay: 100 }).should("exist").invoke("show");

  cy.xpath(rotaEscolhida.origemXpath).click({ force: true });

  cy.get("#input-destination").click({ force: true }).type(rotaEscolhida.destino, { delay: 200 }).should("exist").invoke("show");

  // Tratamento dinâmico: evita quebras de índice escolhendo com segurança se houver 1 ou mais elementos
  cy.xpath(rotaEscolhida.destinoXpath).then(($elementos) => {
    if ($elementos.length > 1) {
      cy.wrap($elementos).eq(1).click({ force: true });
    } else {
      cy.wrap($elementos).click({ force: true });
    }
  });
});

Cypress.Commands.add("selecionarTopRotasRapidoRibeirao", () => {
  cy.wait(1000);
  const topRotas = [
    // {
    //   origem: " São Paulo (Rod. Tietê) (SP) ",
    //   origemXpath: '//*[@id="São-Paulo-(Rod.-Tietê)-(SP)"]/p[1]',
    //   destino: " Ribeirão Preto (SP) ",
    //   destinoXpath: '//*[@id="Ribeirão-Preto-(SP)"]/p[1]',
    // },
    // {
    //   origem: " Ribeirão Preto (SP) ",
    //   origemXpath: '//*[@id="Ribeirão-Preto-(SP)"]/p[1]',
    //   destino: " São Paulo (Rod. Tietê) (SP) ",
    //   destinoXpath: '//*[@id="São-Paulo-(Rod.-Tietê)-(SP)"]/p[1]',
    // },
    {
      origem: " Ribeirão Preto (Mini Rodoviária) (SP) ",
      origemXpath: '//*[@id="Ribeirão-Preto-(Mini-Rodoviária)-(SP)"]/p[1]',
      destino: " São Paulo (Rod. Tietê) (SP) ",
      destinoXpath: '//*[@id="São-Paulo-(Rod.-Tietê)-(SP)"]/p[1]',
    },
    {
      origem: " São Paulo (Rod. Tietê) (SP) ",
      origemXpath: '//*[@id="São-Paulo-(Rod.-Tietê)-(SP)"]/p[1]',
      destino: " Ribeirão Preto (Mini Rodoviária) (SP) ",
      destinoXpath: '//*[@id="Ribeirão-Preto-(Mini-Rodoviária)-(SP)"]/p[1]',
    },
    {
      origem: " São Paulo (Rod. Tietê) (SP) ",
      origemXpath: '//*[@id="São-Paulo-(Rod.-Tietê)-(SP)"]/p[1]',
      destino: "Sertãozinho (SP)",
      destinoXpath: '//*[@id="Sertãozinho-(SP)"]/p[1]',
    },
  ];

  const indiceSorteado = Cypress._.random(0, topRotas.length - 1);
  const rotaEscolhida = topRotas[indiceSorteado];

  cy.log(`🎲 **Rota Sorteada:** ${rotaEscolhida.origem} -> ${rotaEscolhida.destino}`);

  cy.get("#input-departure").click({ force: true }).type(rotaEscolhida.origem, { delay: 100 }).should("exist").invoke("show");

  cy.xpath(rotaEscolhida.origemXpath).click({ force: true });

  cy.get("#input-destination").click({ force: true }).type(rotaEscolhida.destino, { delay: 200 }).should("exist").invoke("show");

  // Tratamento dinâmico: evita quebras de índice escolhendo com segurança se houver 1 ou mais elementos
  cy.xpath(rotaEscolhida.destinoXpath).then(($elementos) => {
    if ($elementos.length > 1) {
      cy.wrap($elementos).eq(1).click({ force: true });
    } else {
      cy.wrap($elementos).click({ force: true });
    }
  });
});
