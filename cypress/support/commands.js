// const { cy } = require("@faker-js/faker");
import loc from "./locators";
import LoginPage from "../pages/LoginPage";

Cypress.Commands.add("selecionarDataIda", (range = 3) => {
  cy.get('td[data-handler="selectDay"] a').then(($days) => {
    const proximosDias = $days.slice(0, range);
    const randomIndex = Math.floor(Math.random() * proximosDias.length);
    cy.wrap(proximosDias[randomIndex]).click({ force: true });
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

// Cypress.Commands.add("selecionarAssentoAleatorio1", () => {
//   const tentarSelecao = () => {
//     cy.log("🔎 Buscando assentos livres...");

//     // 1. Busca assentos disponíveis (não ocupados e não selecionados)
//     return cy
//       .get('button.outer-seat[id^="seat-"]:not(:has(.occupied-seat)):not(.selected-seat)', { timeout: 90000 })
//       .should("be.visible")
//       .then(($seats) => {
//         const ids = $seats.toArray().map((el) => el.id);
//         const randomId = ids[Math.floor(Math.random() * ids.length)];

//         cy.log(`🎯 Tentando assento: ${randomId}`);

//         // 2. Tenta o clique
//         cy.get(`#${randomId}`)
//           .scrollIntoView({ offset: { top: -150 } })
//           .click({ force: true });

//         // 3. Checagem de erro do servidor (espera a resposta)
//         cy.wait(2500);

//         return cy.get("body").then(($body) => {
//           // Identifica se o alerta de indisponível apareceu
//           const alerta = $body.find('#alert-overlay:visible, article:contains("indisponível"):visible');

//           if (alerta.length > 0) {
//             cy.log("❌ Assento indisponível, tentando outro...");

//             // Clica no fechar (usando o ID que vimos no seu print)
//             cy.get("#close-alert-overlay").click({ force: true });

//             cy.wait(1500);
//             // RECURSÃO: Tenta novamente a função interna
//             return tentarSelecao();
//           } else {
//             cy.log("✔️ Assento OK.");
//             // AQUI ESTÁ O AJUSTE: Não clicamos no #btn-proceed aqui dentro.
//             // O comando apenas garante que o assento foi selecionado sem erro.
//           }
//         });
//       });
//   };

//   tentarSelecao();
// });

// Cypress.Commands.add("selecionarAssentoAleatorio2", () => {
//   const tentarSelecionar = () => {
//     // 1. Busca assentos que não estão ocupados visualmente
//     cy.get('button.outer-seat[id^="seat-"]:not(:has(.occupied-seat))', { timeout: 90000 })
//       .should("be.visible")
//       .then(($seats) => {
//         const ids = $seats.toArray().map((el) => el.id);
//         const randomId = ids[Math.floor(Math.random() * ids.length)];

//         cy.log(`Tentando assento: ${randomId}`);

//         // 2. Tenta clicar no assento sorteado
//         cy.get(`#${randomId}`).scrollIntoView().click({ force: true });

//         // 3. Checa se o alerta de erro apareceu
//         cy.wait(1000); // Pequena espera para o alerta processar
//         cy.get("body").then(($body) => {
//           if ($body.find('#alert-overlay[style*="display: block"]').length > 0) {
//             cy.log("Assento indisponível no servidor! Tentando outro...");

//             // Clica no botão "Fechar" do alerta (baseado no seu HTML)
//             cy.get("#close-alert-overlay").contains("Fechar").click({ force: true });

//             // Recursividade: Chama a função novamente para tentar outro assento
//             tentarSelecionar();
//           } else {
//             cy.log("Assento selecionado com sucesso.");
//           }
//         });
//       });
//   };

// Inicia a tentativa
//   tentarSelecionar();

//   // 4. VALIDAÇÃO FINAL
//   cy.get("#btn-proceed", { timeout: 90000 }).should("be.visible").and("not.be.disabled");
// });

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

// Cypress.Commands.add("selecionarPassagemAleatoria", () => {
//   // 1. Buscamos os botões de compra que estão dentro de containers disponíveis (.available)
//   // Isso exclui automaticamente qualquer botão que esteja na div .unavailable (esgotados)
//   cy.get('.available button[data-js="buy-ticket"]:not([disabled])', { timeout: 90000 })
//     .should("be.visible")
//     .then(($buttons) => {
//       const total = $buttons.length;

//       if (total === 0) {
//         throw new Error("Nenhuma passagem disponível encontrada!");
//       }

//       // 2. Sorteia o índice
//       const randomIndex = Math.floor(Math.random() * total);

//       // 3. Seleção Robusta: Buscamos o botão novamente pelo índice para evitar o erro de "disappeared"
//       cy.get('.available button[data-js="buy-ticket"]:not([disabled])', { timeout: 90000 }).eq(randomIndex).scrollIntoView().click({ force: true });

//       cy.log(`Sucesso! Selecionada a opção ${randomIndex + 1} de ${total} passagens disponíveis.`);
//     });
// });

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

      // --- LÓGICA DO MODAL "FIQUE ATENTO" ---
      // Aumentamos para 3s para garantir que o erro de 'servicesList' não ocorra
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

// Cypress.Commands.add("selecionarPassagemAleatoriaNovo", () => {
//   cy.contains("ESCOLHER PASSAGENS", { timeout: 90000 }).should("be.visible");
//   cy.log("⏳ Aguardando estabilização da página de ofertas...");

//   // 1. Validação de carregamento: Espera o esqueleto da página sumir
//   // ou a lista de ofertas ter pelo menos um item disponível REAL
//   cy.get('li[data-js^="offer-element-"]', { timeout: 90000 }).should("be.visible");

//   // O "pulo do gato": Esperar um pequeno respiro para o JS da Cometa atachar os eventos nos botões
//   cy.wait(1000);

//   // 2. Buscamos as ofertas disponíveis
//   cy.get('li[data-js^="offer-element-"]:has(.available)', { timeout: 90000 })
//     .should("exist")
//     .invoke("show")
//     .then(($ofertas) => {
//       const ofertasValidas = $ofertas.filter((i, el) => {
//         const $card = Cypress.$(el);

//         // 1. Verifica se o texto do card ou do cabeçalho contém "WEMOBI"
//         // (Geralmente há uma classe ou imagem com a marca wemobi no topo do card)
//         const eWemobi = $card.text().toUpperCase().includes("WEMOBI");

//         // 2. Mantém suas validações originais que já funcionam
//         const textoClasse = $card.find('[data-js^="classtype_"]').text().toUpperCase();
//         const temBotaoAtivo = $card.find('button[data-js="buy-ticket"]:not([disabled])').length > 0;

//         // Retorna TRUE apenas se for Wemobi, NÃO for Cama e tiver botão clicável
//         return eWemobi && !textoClasse.includes("CAMA") && temBotaoAtivo;
//       });

//       const total = ofertasValidas.length;
//       if (total === 0) throw new Error("Nenhuma passagem exclusiva da WEMOBI encontrada para esta rota!");

//       // 3. Sorteio
//       const randomIndex = Math.floor(Math.random() * total);
//       const escolha = ofertasValidas[randomIndex];
//       const $btnCompra = Cypress.$(escolha).find('button[data-js="buy-ticket"]', { timeout: 90000 });

//       cy.log(`🎰 Sorteada opção ${randomIndex + 1} de ${total}`);

//       // 4. Clique Seguro: Antes de clicar, garantimos que o botão está estável
//       cy.wait(500);
//       cy.wrap($btnCompra)
//         .parents(".available")
//         .invoke("show") // 1. mostra o pai primeiro
//         .end()
//         .wrap($btnCompra)
//         .invoke("show") // 2. mostra o botão
//         .scrollIntoView({ offset: { top: -150 } })
//         .should("exist")
//         .and("not.be.disabled")
//         .click({ force: true });
//       // cy.wrap($btnCompra)
//       //   .scrollIntoView({ offset: { top: -150 } })
//       //   .should('be.visible')
//       //   .should('exist')
//       //   .invoke('show')
//       //   .and('not.be.disabled')
//       //   .click({ force: true });

//       // --- LÓGICA DO MODAL "FIQUE ATENTO" ---
//       // Aumentamos para 3s para garantir que o erro de 'servicesList' não ocorra
//       cy.wait(3000);

//       cy.get("body").then(($body) => {
//         if ($body.find('[data-js="button-agree"]').is(":visible")) {
//           cy.log("⚠️ Confirmando modal de madrugada...");
//           cy.get('[data-js="button-agree"]').click({ force: true });

//           cy.wait(3000);
//           cy.url().then((urlAtual) => {
//             if (urlAtual.includes("/disponibilidade")) {
//               // Tenta o clique de novo se o modal apenas fechou e não avançou
//               cy.wrap($btnCompra).click({ force: true }).parent();
//             }
//           });
//         }
//       });
//     });
// });

// Cypress.Commands.add("selecionarPassagemAleatoriaVolta", () => {
//   cy.contains("ESCOLHER PASSAGENS", { timeout: 90000 }).should("be.visible");
//   cy.log("⏳ Aguardando estabilização da página de ofertas...");

//   // 1. Validação de carregamento: Espera o esqueleto da página sumir
//   // ou a lista de ofertas ter pelo menos um item disponível REAL
//   cy.get('li[data-js^="offer-element-"]', { timeout: 90000 }).should("be.visible");

//   // O "pulo do gato": Esperar um pequeno respiro para o JS da Cometa atachar os eventos nos botões
//   cy.wait(3000);

//   // 2. Buscamos as ofertas disponíveis
//   cy.get('li[data-js^="offer-element-"]:has(.available)', { timeout: 90000 }).then(($ofertas) => {
//     // Filtramos (removendo CAMA)
//     const ofertasValidas = $ofertas.filter((i, el) => {
//       const textoClasse = Cypress.$(el).find('[data-js^="classtype_"]').text().toUpperCase();
//       const temBotaoAtivo = Cypress.$(el).find('button[data-js="buy-ticket"]:not([disabled])').length > 0;
//       return !textoClasse.includes("CAMA") && temBotaoAtivo;
//     });

//     const total = ofertasValidas.length;
//     if (total === 0) throw new Error("Nenhuma passagem válida encontrada!");

//     // 3. Sorteio
//     const randomIndex = Math.floor(Math.random() * total);
//     const escolha = ofertasValidas[randomIndex];
//     const $btnCompra = Cypress.$(escolha).find('button[data-js="buy-ticket"]');

//     cy.log(`🎰 Sorteada opção ${randomIndex + 1} de ${total}`);

//     // 4. Clique Seguro: Antes de clicar, garantimos que o botão está estável
//     cy.wrap($btnCompra)
//       .scrollIntoView({ offset: { top: -150 } })
//       .should("be.visible")
//       .should("exist")
//       .invoke("show")
//       .and("not.be.disabled")
//       .click({ force: true });

//     // --- LÓGICA DO MODAL "FIQUE ATENTO" ---
//     // Aumentamos para 3s para garantir que o erro de 'servicesList' não ocorra
//     cy.wait(3000);

//     cy.get("body").then(($body) => {
//       if ($body.find('[data-js="button-agree"]').is(":visible")) {
//         cy.log("⚠️ Confirmando modal de madrugada...");
//         cy.get('[data-js="button-agree"]').click({ force: true });

//         cy.wait(3000);
//         cy.url().then((urlAtual) => {
//           if (urlAtual.includes("/disponibilidade")) {
//             // Tenta o clique de novo se o modal apenas fechou e não avançou
//             cy.wrap($btnCompra).click({ force: true }).parent();
//           }
//         });
//       }
//     });
//   });
// });

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

// Cypress.Commands.add('fecharModalCupom', () => {
//    cy.get('#header-navbar > :nth-child(5)').then(($el) => {
//   if ($el.length > 0) {
//     cy.wrap($el).invoke('remove')
//   }
// });
//   });

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
  // cy.get(loc.CHECK_PASSAGEIRO, { timeout: 90000 }).click({ force: true });
  // cy.get(loc.WEMOBI_AVANCAR_PASSAGEIRO).should("be.visible").and("not.be.disabled").click();
  cy.wait(3000);
  cy.get("body").then(($body) => {
    if ($body.find(".col-lg-8 > .label-offer > .cmp-text > :nth-child(2)").length > 0 && $body.find(".col-lg-8 > .label-offer > .cmp-text > :nth-child(2)").is(":visible")) {
      cy.log("⚠️ Modal de upgrade detectado — fechando...");
      cy.get("#modal-upsell-buy-ticket-button").click({ force: true });
      // cy.get("#modal-upsell-buy-ticket-button").should("not.exist");
    } else {
      cy.log("✅ Sem modal de upgrade");
    }
    cy.get(loc.CHECK_PASSAGEIRO, { timeout: 90000 }).click({ force: true });
    cy.get(loc.WEMOBI_AVANCAR_PASSAGEIRO).should("be.visible").and("not.be.disabled").click();
    //  cy.get("#reservation-seat-0").click().log("Selecionando assento");
    // cy.get('[data-value="random-seat"]').click();
    // cy.get("#seat-reservation-v2-button-proceed").should("be.visible").and("not.be.disabled").click();
    cy.log("✅ Sem modal de upgrade, indo para a tela checkout");
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
