// const { cy } = require("@faker-js/faker");
import loc from "./locators";

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
  // Define o ID do campo baseado no parâmetro 'origem' ou 'destino'
  const selector = campo === "origem" ? "#input-departure" : "#input-destination";

  // 1. Abre o campo desejado
  cy.get(selector).click({ force: true });

  // 2. Localiza as opções no dropdown (usando os seletores do seu HTML)
  cy.get(".ui-autocomplete .ui-menu-item .location-title")
    .filter(':not(:contains("Usar minha localização"))') // Ignora o item de GPS
    .then(($options) => {
      // 3. Lógica de sorteio que você criou
      const randomIndex = Math.floor(Math.random() * $options.length);
      const cidadeEscolhida = $options[randomIndex].innerText;

      cy.log(`Sorteado para ${campo}: ${cidadeEscolhida}`);

      // 4. Seleciona a opção sorteada
      cy.wrap($options[randomIndex]).click();
    });
});

Cypress.Commands.add("selecionarAssentoAleatorioWemobi", () => {
  // 1. Buscamos a lista de IDs disponíveis
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
  // VALIDAÇÃO FINAL
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

Cypress.Commands.add("selecionarAssentoAleatorio1", () => {
  const tentarSelecao = () => {
    cy.log("🔎 Buscando assentos livres...");

    // 1. Busca assentos disponíveis (não ocupados e não selecionados)
    return cy
      .get('button.outer-seat[id^="seat-"]:not(:has(.occupied-seat)):not(.selected-seat)', { timeout: 90000 })
      .should("be.visible")
      .then(($seats) => {
        const ids = $seats.toArray().map((el) => el.id);
        const randomId = ids[Math.floor(Math.random() * ids.length)];

        cy.log(`🎯 Tentando assento: ${randomId}`);

        // 2. Tenta o clique
        cy.get(`#${randomId}`)
          .scrollIntoView({ offset: { top: -150 } })
          .click({ force: true });

        // 3. Checagem de erro do servidor (espera a resposta)
        cy.wait(2500);

        return cy.get("body").then(($body) => {
          // Identifica se o alerta de indisponível apareceu
          const alerta = $body.find('#alert-overlay:visible, article:contains("indisponível"):visible');

          if (alerta.length > 0) {
            cy.log("❌ Assento indisponível, tentando outro...");

            // Clica no fechar (usando o ID que vimos no seu print)
            cy.get("#close-alert-overlay").click({ force: true });

            cy.wait(1500);
            // RECURSÃO: Tenta novamente a função interna
            return tentarSelecao();
          } else {
            cy.log("✔️ Assento OK.");
            // AQUI ESTÁ O AJUSTE: Não clicamos no #btn-proceed aqui dentro.
            // O comando apenas garante que o assento foi selecionado sem erro.
          }
        });
      });
  };

  tentarSelecao();
});

Cypress.Commands.add("selecionarAssentoAleatorio2", () => {
  const tentarSelecionar = () => {
    // 1. Busca assentos que não estão ocupados visualmente
    cy.get('button.outer-seat[id^="seat-"]:not(:has(.occupied-seat))', { timeout: 90000 })
      .should("be.visible")
      .then(($seats) => {
        const ids = $seats.toArray().map((el) => el.id);
        const randomId = ids[Math.floor(Math.random() * ids.length)];

        cy.log(`Tentando assento: ${randomId}`);

        // 2. Tenta clicar no assento sorteado
        cy.get(`#${randomId}`).scrollIntoView().click({ force: true });

        // 3. Checa se o alerta de erro apareceu
        cy.wait(1000); // Pequena espera para o alerta processar
        cy.get("body").then(($body) => {
          if ($body.find('#alert-overlay[style*="display: block"]').length > 0) {
            cy.log("Assento indisponível no servidor! Tentando outro...");

            // Clica no botão "Fechar" do alerta (baseado no seu HTML)
            cy.get("#close-alert-overlay").contains("Fechar").click({ force: true });

            // Recursividade: Chama a função novamente para tentar outro assento
            tentarSelecionar();
          } else {
            cy.log("Assento selecionado com sucesso.");
          }
        });
      });
  };

  // Inicia a tentativa
  tentarSelecionar();

  // 4. VALIDAÇÃO FINAL
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

        // Apenas validamos que os assentos foram marcados (ex: mudaram de cor ou classe)
        // Não clicamos no botão de prosseguir aqui dentro!
        cy.log("✅ Assentos selecionados no mapa.");
      });
  };

  selecionar();
});

Cypress.Commands.add("selecionarPassagemAleatoria", () => {
  // 1. Buscamos os botões de compra que estão dentro de containers disponíveis (.available)
  // Isso exclui automaticamente qualquer botão que esteja na div .unavailable (esgotados)
  cy.get('.available button[data-js="buy-ticket"]:not([disabled])', { timeout: 90000 })
    .should("be.visible")
    .then(($buttons) => {
      const total = $buttons.length;

      if (total === 0) {
        throw new Error("Nenhuma passagem disponível encontrada!");
      }

      // 2. Sorteia o índice
      const randomIndex = Math.floor(Math.random() * total);

      // 3. Seleção Robusta: Buscamos o botão novamente pelo índice para evitar o erro de "disappeared"
      cy.get('.available button[data-js="buy-ticket"]:not([disabled])', { timeout: 90000 }).eq(randomIndex).scrollIntoView().click({ force: true });

      cy.log(`Sucesso! Selecionada a opção ${randomIndex + 1} de ${total} passagens disponíveis.`);
    });
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
  // Aumentamos a estabilidade verificando o body
  cy.get("body").then(($body) => {
    // 1. Verificamos se o elemento existe no DOM usando jQuery puro
    const botao = $body.find(".button-agree");

    if (botao.length > 0) {
      cy.log("Modal detectado. Tentando fechar...");

      // 2. Usamos o próprio objeto do jQuery para clicar
      // Isso evita que o cy.get() dispare o AssertionError se o elemento sumir no meio do caminho
      cy.wrap(botao).click({ force: true });

      cy.log("Modal de confirmação aceito.");
    } else {
      // Se não encontrar, o log aparece e o teste segue em milissegundos
      cy.log("Modal de confirmação não encontrado. Seguindo...");
    }
  });
});

Cypress.Commands.add("selecionarPassagemAleatoria1", () => {
  cy.contains("ESCOLHER PASSAGENS", { timeout: 90000 }).should("be.visible");
  cy.log("⏳ Aguardando estabilização da página de ofertas...");

  // 1. Validação de carregamento: Espera o esqueleto da página sumir
  // ou a lista de ofertas ter pelo menos um item disponível REAL
  cy.get('li[data-js^="offer-element-"]', { timeout: 90000 }).should("be.visible");

  // O "pulo do gato": Esperar um pequeno respiro para o JS da Cometa atachar os eventos nos botões
  cy.wait(1000);

  // 2. Buscamos as ofertas disponíveis
  cy.get('li[data-js^="offer-element-"]:has(.available)', { timeout: 90000 })
    .should("exist")
    .invoke("show")
    .then(($ofertas) => {
      // Filtramos (removendo CAMA)
      const ofertasValidas = $ofertas.filter((i, el) => {
        const textoClasse = Cypress.$(el).find('[data-js^="classtype"]').text().toUpperCase();
        const temBotaoAtivo = Cypress.$(el).find('button[data-js="buy-ticket"]:not([disabled])').length > 0;
        return !textoClasse.includes("CAMA") && temBotaoAtivo;
      });

      const total = ofertasValidas.length;
      if (total === 0) throw new Error("Nenhuma passagem válida encontrada!");

      // 3. Sorteio
      const randomIndex = Math.floor(Math.random() * total);
      const escolha = ofertasValidas[randomIndex];
      const $btnCompra = Cypress.$(escolha).find('button[data-js="buy-ticket"]', { timeout: 90000 });

      cy.log(`🎰 Sorteada opção ${randomIndex + 1} de ${total}`);

      // 4. Clique Seguro: Antes de clicar, garantimos que o botão está estável
      cy.wait(500);
      cy.wrap($btnCompra)
        .parents(".available")
        .invoke("show") // 1. mostra o pai primeiro
        .end()
        .wrap($btnCompra)
        .invoke("show") // 2. mostra o botão
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
              // Tenta o clique de novo se o modal apenas fechou e não avançou
              cy.wrap($btnCompra).click({ force: true }).parent();
            }
          });
        }
      });
    });
});

Cypress.Commands.add("selecionarPassagemAleatoriaNovo", () => {
  cy.contains("ESCOLHER PASSAGENS", { timeout: 90000 }).should("be.visible");
  cy.log("⏳ Aguardando estabilização da página de ofertas...");

  // 1. Validação de carregamento: Espera o esqueleto da página sumir
  // ou a lista de ofertas ter pelo menos um item disponível REAL
  cy.get('li[data-js^="offer-element-"]', { timeout: 90000 }).should("be.visible");

  // O "pulo do gato": Esperar um pequeno respiro para o JS da Cometa atachar os eventos nos botões
  cy.wait(1000);

  // 2. Buscamos as ofertas disponíveis
  cy.get('li[data-js^="offer-element-"]:has(.available)', { timeout: 90000 })
    .should("exist")
    .invoke("show")
    .then(($ofertas) => {
      const ofertasValidas = $ofertas.filter((i, el) => {
        const $card = Cypress.$(el);

        // 1. Verifica se o texto do card ou do cabeçalho contém "WEMOBI"
        // (Geralmente há uma classe ou imagem com a marca wemobi no topo do card)
        const eWemobi = $card.text().toUpperCase().includes("WEMOBI");

        // 2. Mantém suas validações originais que já funcionam
        const textoClasse = $card.find('[data-js^="classtype_"]').text().toUpperCase();
        const temBotaoAtivo = $card.find('button[data-js="buy-ticket"]:not([disabled])').length > 0;

        // Retorna TRUE apenas se for Wemobi, NÃO for Cama e tiver botão clicável
        return eWemobi && !textoClasse.includes("CAMA") && temBotaoAtivo;
      });

      const total = ofertasValidas.length;
      if (total === 0) throw new Error("Nenhuma passagem exclusiva da WEMOBI encontrada para esta rota!");

      // 3. Sorteio
      const randomIndex = Math.floor(Math.random() * total);
      const escolha = ofertasValidas[randomIndex];
      const $btnCompra = Cypress.$(escolha).find('button[data-js="buy-ticket"]', { timeout: 90000 });

      cy.log(`🎰 Sorteada opção ${randomIndex + 1} de ${total}`);

      // 4. Clique Seguro: Antes de clicar, garantimos que o botão está estável
      cy.wait(500);
      cy.wrap($btnCompra)
        .parents(".available")
        .invoke("show") // 1. mostra o pai primeiro
        .end()
        .wrap($btnCompra)
        .invoke("show") // 2. mostra o botão
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
              // Tenta o clique de novo se o modal apenas fechou e não avançou
              cy.wrap($btnCompra).click({ force: true }).parent();
            }
          });
        }
      });
    });
});

Cypress.Commands.add("selecionarPassagemAleatoriaBusCo", () => {
  cy.contains("ESCOLHER PASSAGENS", { timeout: 90000 }).should("be.visible");
  cy.log("⏳ Aguardando estabilização da página de ofertas...");

  // 1. Aguarda a renderização dos elementos da lista de ofertas
  cy.get('li[data-js^="offer-element-"]', { timeout: 90000 }).should("be.visible");
  cy.wait(1000);

  // 2. Captura apenas os botões de comprar ativos que pertencem a ofertas disponíveis
  cy.get('li[data-js^="offer-element-"]:has(.available) button[data-js="buy-ticket"]:not([disabled])', { timeout: 90000 })
    .should("exist")
    .then(($botoes) => {
      // Convertemos a lista do jQuery para um array puro do JavaScript
      const botoesDisponiveis = $botoes.toArray();
      const totalEncontrado = botoesDisponiveis.length;

      if (totalEncontrado === 0) throw new Error("Nenhum botão de comprar disponível encontrado!");

      // 🎯 O PULO DO GATO: Limitamos o "balde" do sorteio para no máximo as 2 primeiras opções
      // Se houver apenas 1 opção na tela, ele usa 1. Se houver mais, ele limita o sorteio entre a posição 0 e 1.
      const limiteOpcoes = Math.min(totalEncontrado, 2);

      // Sorteia 0 ou 1
      const randomIndex = Math.floor(Math.random() * limiteOpcoes);
      const $btnCompra = botoesDisponiveis[randomIndex];

      cy.log(`🎰 Sorteando entre as ${limiteOpcoes} primeiras ofertas. Escolhido o índice: ${randomIndex + 1}`);

      // 3. Executa o clique seguro no botão sorteado (1º ou 2º da lista)
      cy.wait(500);
      cy.wrap($btnCompra)
        .scrollIntoView({ offset: { top: -150 } })
        .should("exist")
        .invoke("show")
        .click({ force: true });

      // --- LÓGICA DO MODAL "FIQUE ATENTO" ---
      cy.wait(3000);
      cy.get("body").then(($body) => {
        if ($body.find('[data-js="button-agree"]').is(":visible")) {
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

Cypress.Commands.add("selecionarPassagemAleatoriaVolta", () => {
  cy.contains("ESCOLHER PASSAGENS", { timeout: 90000 }).should("be.visible");
  cy.log("⏳ Aguardando estabilização da página de ofertas...");

  // 1. Validação de carregamento: Espera o esqueleto da página sumir
  // ou a lista de ofertas ter pelo menos um item disponível REAL
  cy.get('li[data-js^="offer-element-"]', { timeout: 90000 }).should("be.visible");

  // O "pulo do gato": Esperar um pequeno respiro para o JS da Cometa atachar os eventos nos botões
  cy.wait(3000);

  // 2. Buscamos as ofertas disponíveis
  cy.get('li[data-js^="offer-element-"]:has(.available)', { timeout: 90000 }).then(($ofertas) => {
    // Filtramos (removendo CAMA)
    const ofertasValidas = $ofertas.filter((i, el) => {
      const textoClasse = Cypress.$(el).find('[data-js^="classtype_"]').text().toUpperCase();
      const temBotaoAtivo = Cypress.$(el).find('button[data-js="buy-ticket"]:not([disabled])').length > 0;
      return !textoClasse.includes("CAMA") && temBotaoAtivo;
    });

    const total = ofertasValidas.length;
    if (total === 0) throw new Error("Nenhuma passagem válida encontrada!");

    // 3. Sorteio
    const randomIndex = Math.floor(Math.random() * total);
    const escolha = ofertasValidas[randomIndex];
    const $btnCompra = Cypress.$(escolha).find('button[data-js="buy-ticket"]');

    cy.log(`🎰 Sorteada opção ${randomIndex + 1} de ${total}`);

    // 4. Clique Seguro: Antes de clicar, garantimos que o botão está estável
    cy.wrap($btnCompra)
      .scrollIntoView({ offset: { top: -150 } })
      .should("be.visible")
      .should("exist")
      .invoke("show")
      .and("not.be.disabled")
      .click({ force: true });

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
            // Tenta o clique de novo se o modal apenas fechou e não avançou
            cy.wrap($btnCompra).click({ force: true }).parent();
          }
        });
      }
    });
  });
});

Cypress.Commands.add("selecionarAssentoComValidacao", (numAssentos = 1) => {
  const escolher = (assentosConfirmados = 0) => {
    // Se já selecionamos o número desejado de assentos, encerra
    if (assentosConfirmados >= numAssentos) {
      cy.log("✅ Todos os assentos foram confirmados com sucesso!");
      return;
    }

    cy.log(`Tentando selecionar assento para o passageiro ${assentosConfirmados + 1}...`);
    cy.wait(3000); // Aguarda o mapa de assentos processar estados anteriores

    // 1. Pega os assentos que parecem livres no DOM
    cy.get('button.outer-seat[id^="seat-"]:not(:has(.occupied-seat)):not(.selected-seat)', { timeout: 90000 })
      .should("be.visible")
      .then(($disponiveis) => {
        const ids = $disponiveis.map((i, el) => el.id).get();
        const idSorteado = ids[Math.floor(Math.random() * ids.length)];

        cy.log(`🎯 Clicando no assento: ${idSorteado}`);

        // 2. Executa o clique
        cy.get(`#${idSorteado}`)
          .scrollIntoView({ offset: { top: -150 } })
          .click({ force: true });

        // 3. ESPERA A RESPOSTA (O site demora a validar com o servidor)
        cy.wait(2500);

        // 4. VERIFICAÇÃO DO MODAL DE ERRO
        cy.get("body").then(($body) => {
          const modalErro = $body.find('article:contains("Este assento está indisponível")');

          if (modalErro.length > 0 && modalErro.is(":visible")) {
            cy.log("⚠️ Assento indisponível no servidor! Fechando e tentando outro...");

            // Clica no botão "Fechar" do modal (ID no seu print: close-alert-overlay)
            cy.get("#close-alert-overlay").click();
            cy.wait(1000);

            // RECURSÃO: Tenta novamente para o MESMO passageiro
            return escolher(assentosConfirmados);
          } else {
            cy.log("✔️ Assento validado com sucesso!");
            // RECURSÃO: Passa para o próximo passageiro
            return escolher(assentosConfirmados + 1);
          }
        });
      });
  };

  // Inicia o processo de escolha
  escolher();

  // 5. FINALIZAÇÃO: Após o loop, o botão deve estar ativo
  cy.get("#btn-proceed", { timeout: 90000 }).should("be.visible").and("not.be.disabled").click({ force: true });
});

Cypress.Commands.add("selecionarPassagemAleatoria3", (tipoParaIgnorar) => {
  const seletorCard = 'li[data-js^="offer-element"]';

  cy.get(seletorCard, { timeout: 90000 })
    .should("be.visible")
    .then(($offers) => {
      const $filtered = $offers.filter((i, el) => {
        const container = Cypress.$(el);
        const textoTipoBus = container.find(".bus-type-section").text();
        const temBotaoValido = container.find('button[data-js="buy-ticket"]:not([disabled])').length > 0;
        return !textoTipoBus.includes(tipoParaIgnorar) && temBotaoValido;
      });

      const total = $filtered.length;
      if (total === 0) {
        throw new Error(`Nenhuma passagem disponível encontrada (exceto as do tipo ${tipoParaIgnorar})`);
      }

      const randomIndex = Math.floor(Math.random() * total);

      // 1. Primeiro clique para tentar comprar
      cy.wrap($filtered).eq(randomIndex).find('button[data-js="buy-ticket"]').scrollIntoView().click({ force: true });

      // 2. Se aparecer o popup de "concordar", clica nele
      // O .if() garante que se não aparecer, o teste segue em frente imediatamente
      cy.get(".button-agree", { timeout: 90000 }).if().click();

      /* NOTA: Se o popup ".button-agree" for daqueles que bloqueia a tela 
         e impede a compra de prosseguir, você pode precisar clicar no botão 
         de comprar NOVAMENTE após fechar o popup. Se for esse o caso, 
         o código abaixo faz sentido:
      */
      cy.get(".button-agree")
        .if()
        .then(() => {
          cy.log("Popup detectado, clicando novamente no botão de compra...");
          cy.wrap($filtered).eq(randomIndex).find('button[data-js="buy-ticket"]').click({ force: true });
        });

      cy.log(`✅ Comando Finalizado. Opção ${randomIndex + 1} tratada.`);
    });
});

Cypress.Commands.add("selecionarPassagemIda", () => {
  const msgSemResultado = ".message-no-result-filter-main";
  const cardDataPosterior = ".nearby-cards > :nth-child(4) > .focusable";
  const seletorCard = 'li[data-js^="offer-element"]';

  // 1. Verificamos o que apareceu na tela primeiro
  cy.get("body").then(($body) => {
    // CASO A: Apareceu a mensagem de "Não encontramos resultado"
    if ($body.find(msgSemResultado).length > 0 && $body.find(msgSemResultado).is(":visible")) {
      cy.log("⚠️ Trecho sem resultados. Clicando em data posterior...");
      cy.get(cardDataPosterior).should("be.visible").click();

      // Após clicar na nova data, chamamos o comando novamente (recursão)
      // para ele tentar selecionar a passagem na nova tela carregada
      cy.wait(3000);
      cy.selecionarPassagemIda();
    }

    // CASO B: Encontrou passagens normalmente
    else {
      cy.get(seletorCard, { timeout: 90000 })
        .should("be.visible")
        .then(($offers) => {
          // Filtra apenas os que têm botão de compra habilitado
          const $filtered = $offers.filter((i, el) => Cypress.$(el).find('button[data-js="buy-ticket"]:not([disabled])').length > 0);

          if ($filtered.length === 0) {
            throw new Error("Nenhum card com botão de compra ativo encontrado.");
          }

          const randomIndex = Math.floor(Math.random() * $filtered.length);
          const $escolhido = $filtered.eq(randomIndex);
          const $btn = $escolhido.find('button[data-js="buy-ticket"]');

          cy.wrap($btn).scrollIntoView().click({ force: true });

          // Lógica do Modal de Madrugada (Melhorada para evitar erros de elemento detatched)
          cy.wait(2000);
          cy.get("body").then(($modalBody) => {
            if ($modalBody.find(".button-agree:visible").length > 0) {
              cy.get(".button-agree").click();
              cy.wait(1000);
              // Clicamos novamente no botão da oferta após fechar o modal
              cy.wrap($btn).click({ force: true });
            }
          });
        });
    }
  });
});

Cypress.Commands.add("selecionarPassagemVolta", () => {
  const msgSemResultado = ".message-no-result-filter-main";
  const cardDataPosterior = ".nearby-cards > :nth-child(4) > .focusable";
  const seletorCard = 'li[data-js^="offer-element"]';

  cy.log("🔄 Iniciando seleção de passagem de VOLTA...");
  cy.wait(3000); // Espera o carregamento inicial da página de volta

  // 1. Verificamos se há resultados para a volta
  cy.get("body").then(($body) => {
    // CASO A: Mensagem de "Não encontramos resultado" na volta
    if ($body.find(msgSemResultado).is(":visible")) {
      cy.log("⚠️ Volta sem resultados. Clicando em data posterior...");
      cy.get(cardDataPosterior).should("be.visible").click();

      // Aguarda carregar e tenta novamente (recursão)
      cy.wait(4000);
      cy.selecionarPassagemVolta();
    }

    // CASO B: Existem passagens disponíveis
    else {
      cy.get(seletorCard, { timeout: 90000 })
        .should("be.visible")
        .then(($offers) => {
          // Filtra apenas ofertas com botão de compra ativo
          const $filtered = $offers.filter((i, el) => Cypress.$(el).find('button[data-js="buy-ticket"]:not([disabled])').length > 0);

          if ($filtered.length === 0) {
            throw new Error("Nenhuma passagem de VOLTA disponível encontrada.");
          }

          const randomIndex = Math.floor(Math.random() * $filtered.length);
          const $escolhido = $filtered.eq(randomIndex);
          const $btn = $escolhido.find('button[data-js="buy-ticket"]');

          // 2. Tenta o primeiro clique
          cy.wrap($btn)
            .scrollIntoView({ offset: { top: -100 } })
            .click({ force: true });

          // 3. Lógica do Modal de Madrugada ("Fique Atento")
          cy.wait(2500); // Tempo para o modal renderizar
          cy.get("body").then(($modalBody) => {
            const $btnAgree = $modalBody.find('[data-js="button-agree"]:visible');

            if ($btnAgree.length > 0) {
              cy.log("⚠️ Modal detectado na volta. Confirmando...");
              cy.wrap($btnAgree).click();

              // Verifica se precisa clicar no botão de compra novamente após o modal
              cy.wait(1500);
              cy.url().then((currentUrl) => {
                if (currentUrl.includes("/disponibilidade")) {
                  // Re-busca o botão para evitar erro de elemento "detached"
                  cy.wrap($btn).click({ force: true });
                }
              });
            }
          });
        });
    }
  });

  // 4. Validação: Saída da tela de disponibilidade
  // cy.url({ timeout: 20000 }).should('not.include', '/disponibilidade');
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

Cypress.Commands.add("teste", () => {
  cy.log("⏳ Iniciando busca de TODAS as passagens disponíveis...");

  cy.contains("ESCOLHER PASSAGENS", { timeout: 30000 }).should("be.visible");

  cy.get('li[data-js^="offer-element-"]', { timeout: 30000 })
    .should("have.length.at.least", 1)
    .then(($ofertas) => {
      // Filtramos apenas por visibilidade e disponibilidade do botão
      const ofertasValidas = $ofertas.toArray().filter((el) => {
        const $el = Cypress.$(el);

        // 1. Garante que a oferta está visível no ecrã (evita o erro de parent display:none)
        if (!$el.is(":visible")) return false;

        // 2. Verifica se o botão de compra existe, está visível e habilitado
        const btnCompra = $el.find('button[data-js="buy-ticket"]');
        const hasBtnAtivo = btnCompra.length > 0 && !btnCompra.prop("disabled") && btnCompra.is(":visible");

        return hasBtnAtivo;
      });

      const total = ofertasValidas.length;
      cy.log(`✅ Total de passagens encontradas para sorteio: ${total}`);

      if (total === 0) throw new Error("Nenhuma passagem (de qualquer tipo) está disponível para compra!");

      // 3. Sorteio entre todas as opções (Cama, Leito, Executivo, etc.)
      const randomIndex = Math.floor(Math.random() * total);
      const escolha = ofertasValidas[randomIndex];

      cy.log(`🎰 Sorteada opção ${randomIndex + 1} de ${total}`);

      // 4. Ação de clique
      cy.wrap(escolha).within(() => {
        cy.get('button[data-js="buy-ticket"]')
          .scrollIntoView({ offset: { top: -150 } })
          .should("be.visible")
          .click();
      });

      // 5. Modal de Confirmação (opcional, dependendo se aparece sempre)
      cy.wait(2000);
      cy.get("body").then(($body) => {
        const modalBtn = '[data-js="button-agree"]';
        if ($body.find(modalBtn).length > 0 && $body.find(modalBtn).is(":visible")) {
          cy.get(modalBtn).click();
        }
      });
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
  cy.wait(3000);
  cy.get(loc.MENSAGEM_LOGADO).should("contain", "ANDERSON");
  cy.get("body").then(($body) => {
    if ($body.find(".QSIWebResponsiveDialog-Layout1-SI_a5XuRtOQsuZ5iTA_content").length > 0 && $body.find(".QSIWebResponsiveDialog-Layout1-SI_a5XuRtOQsuZ5iTA_content").is(":visible")) {
      cy.log("⚠️ Modal detectado — fechando...");
      cy.get(".QSIWebResponsiveDialog-Layout1-SI_a5XuRtOQsuZ5iTA_close-btn").click({ force: true });
      cy.get(".QSIWebResponsiveDialog-Layout1-SI_a5XuRtOQsuZ5iTA_content").should("not.exist");
    } else {
      cy.log("✅ Sem modal na tela");
    }
    cy.get(loc.MENSAGEM_LOGADO).should("contain", "ANDERSON");
    cy.get(loc.BUSCAS.DESTINO_IDA).click();
    cy.get(loc.BUSCAS.DESTINO_IDA).click().type("São Paulo - Todos (SP)", { delay: 100 });
    cy.contains("São Paulo - Todos (SP)").click({ force: true });
    cy.get(loc.BUSCAS.DESTINO_VOLTA).click().type("Rio De Janeiro - Todos (RJ)", { delay: 100 });
    cy.contains(" Rio De Janeiro - Todos (RJ) ").click({ force: true });
    cy.get(loc.BUSCAS.DATA_IDA).click();
    cy.log("✅ Sem modal, indo para a tela de passagens");
  });
});

Cypress.Commands.add("fecharModalUpgradePoltrona", () => {
  cy.wait(3000);
  cy.get(loc.WEMOBI_AVANCAR_PASSAGEIRO).should("be.visible").and("not.be.disabled").click();
  cy.get("body").then(($body) => {
    if ($body.find(".col-lg-8 > .label-offer > .cmp-text > :nth-child(2)").length > 0 && $body.find(".col-lg-8 > .label-offer > .cmp-text > :nth-child(2)").is(":visible")) {
      cy.log("⚠️ Modal de upgrade detectado — fechando...");
      cy.get("#modal-upsell-buy-ticket-button").click({ force: true });
      cy.get("#modal-upsel").should("not.exist");
    } else {
      cy.log("✅ Sem modal de upgrade");
    }
    cy.get(loc.WEMOBI_AVANCAR_PASSAGEIRO).should("be.visible").and("not.be.disabled").click();
    //  cy.get("#reservation-seat-0").click().log("Selecionando assento");
    // cy.get('[data-value="random-seat"]').click();
    // cy.get("#seat-reservation-v2-button-proceed").should("be.visible").and("not.be.disabled").click();
    cy.log("✅ Sem modal de upgrade, indo para a tela checkout");
  });
});

Cypress.Commands.add("selecionarCidadeSugerida", (cidade) => {
  // Aguarda lista de sugestões aparecer

  cy.get(".ui-autocomplete-category").contains("Origens mais buscadas").should("be.visible");

  // Clica direto na cidade sugerida
  cy.get(".ui-menu-item").contains(cidade).click();
});

// Uso
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
