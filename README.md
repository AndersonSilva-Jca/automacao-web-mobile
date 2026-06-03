# 🧪 Automação E2E — Grupo JCA

> Suíte de testes automatizados End-to-End para os sites web/mobile do Grupo JCA, executados em ambiente de **produção** com Cypress, e testes Mobile com Robot Framework + Appium.

---

## ⚠️ Aviso Importante — Testes em Produção

> Os testes desta suíte são executados diretamente no ambiente de **produção**. Por isso:
>
> - Nunca utilize dados reais de clientes
> - Use sempre contas e dados exclusivos para automação (QA)
> - Evite testes que gerem compras ou pagamentos sem controle
> - Monitore os testes para não impactar a experiência do usuário real

---

## 📁 Estrutura do Projeto

```
AUTOMACAO/
│
├── 📁 .github/
│   └── 📁 workflows/
│       ├── ci_e2e_1.yml
│       ├── ci_e2e_2.yml
│       ├── ci_e2e_3.yml
│       ├── ci_e2e_4.yml
│       ├── ci_e2e_5.yml
│       ├── ci_links_cards.yml
│       └── regressão.yml
│
├── 📁 .vscode/
│
├── 📁 app/                     # Testes Mobile — Robot Framework + Appium
│   ├── 📁 appGiro/
│   │   ├── 📁 resources/
│   │   │   ├── base.resource
│   │   │   ├── GeradorDataIda.py
│   │   │   └── GeradorDataVolta.py
│   │   ├── busca_passagens.robot
│   │   └── login.robot
│   ├── 📁 appWemobi/
│   │   ├── 📁 resources/
│   │   │   ├── base.resource
│   │   │   ├── GeradorDataIda.py
│   │   │   └── GeradorDataVolta.py
│   │   ├── busca_passagens.robot
│   │   └── login.robot
│   └── 📁 logs/
│       ├── 📁 giro/
│       └── 📁 wemobi/
│
├── 📁 cypress/                 # Testes Web — Cypress E2E
│   ├── 📁 downloads/
│   ├── 📁 e2e/
│   │   ├── 📁 00_smoke/
│   │   │   ├── 01_utp_busca_passagens.cy.js
│   │   │   ├── 02_giro_wemobi_busca_passagens.cy.js
│   │   │   └── teste_compra.cy.js
│   │   ├── 📁 00_utp/
│   │   ├── 📁 01_autenticacao/
│   │   │   ├── login.cy.js
│   │   │   └── conta_giro.cy.js
│   │   ├── 📁 02_clube_giro/
│   │   ├── 📁 03_links_header/
│   │   │   └── links_header.cy.js
│   │   ├── 📁 04_ofertas_promocoes/
│   │   │   └── promo_cards.cy.js
│   │   ├── 📁 05_link_conexao/
│   │   │   └── link_conexao.cy.js
│   │   ├── 📁 06_cards_duvidas_frequentes/
│   │   │   └── duvidas_frequentes.cy.js
│   │   └── 📁 07_links_footer/
│   │       ├── validar_links.cy.js
│   │       └── regressao.cy.js
│   ├── 📁 fixtures/
│   │   ├── documento.pdf
│   │   └── example.json
│   ├── 📁 reports/
│   ├── 📁 support/
│   │   ├── commands.js
│   │   ├── e2e.js
│   │   └── locators.js
│   └── 📁 videos/
│
├── 📁 node_modules/
├── .env
├── .gitattributes
├── .gitignore
├── cypress.config.js
├── cypress.env.json
├── package-lock.json
├── package.json
├── README.md
└── requirements.txt            # Dependências Robot Framework
```

---

## 🗂️ Módulos de Teste — Web (Cypress)

| Pasta                         | Descrição                                    | Tipo      |
| ----------------------------- | -------------------------------------------- | --------- |
| `00_smoke`                    | Sanidade geral — busca de passagens e compra | Smoke     |
| `01_autenticacao`             | Login                                        | Funcional |
| `02_clube_giro`               | Funcionalidades do Clube Giro                | Funcional |
| `03_links_header`             | Validação de links do cabeçalho              | Funcional |
| `04_ofertas_promocoes`        | Cards de promoções e ofertas                 | Funcional |
| `05_link_conexao`             | Links de conexão e integrações               | Funcional |
| `06_cards_duvidas_frequentes` | FAQ e dúvidas frequentes                     | Funcional |
| `07_links_footer`             | Links do rodapé                              | Funcional |
| `Regressão.cy.js`             | Regressão                                    | Regressão |

> ⚠️ **Não implementado ainda:** Cupons, finalização de compra com PIX e cartão de crédito, remarcação e cancelamento.

---

## 📱 Módulos de Teste — Mobile (Robot Framework)

| App       | Arquivo                 | Descrição                    |
| --------- | ----------------------- | ---------------------------- |
| appGiro   | `login.robot`           | Login no app Clube Giro      |
| appGiro   | `busca_passagens.robot` | Busca e seleção de passagens |
| appWemobi | `login.robot`           | Login no app Wemobi          |
| appWemobi | `busca_passagens.robot` | Busca e seleção de passagens |

---

## 🛠️ Pré-requisitos

| Ferramenta      | Versão mínima |
| --------------- | ------------- |
| Node.js         | 18+           |
| npm             | 9+            |
| Cypress         | 13+           |
| Python          | 3.10+         |
| Robot Framework | 6+            |
| Appium          | 2+            |
| Android SDK     | API 33+       |

---

## ⚙️ Instalação

```bash
# 1. Clonar o repositório
git clone https://github.com/seu-usuario/automacao.git
cd automacao

# 2. Instalar dependências Web
npm install

# 3. Instalar dependências Mobile
pip install -r requirements.txt

# 4. Instalar Appium e driver Android
npm install -g appium
appium driver install uiautomator2
```

---

## 🔐 Variáveis de Ambiente

Configure o arquivo `.env` na raiz:

```env

```

> O `cypress.env.json` guarda variáveis sensíveis e **não deve ser commitado**.

---

## ▶️ Como Executar — Web

```bash
# Interface visual
npx cypress open

# Todos os testes
npx cypress run

# Por módulo
npx cypress run --spec "cypress/e2e/00_smoke/**"
npx cypress run --spec "cypress/e2e/01_autenticacao/**"
npx cypress run --spec "cypress/e2e/07_links_footer/**"

# Com browser específico
npx cypress run --browser chrome
npx cypress run --browser firefox
```

---

## ▶️ Como Executar — Mobile

```bash
# Iniciar Appium (terminal separado)
appium

# Login Giro
robot -d app/logs/giro app/appGiro/login.robot

# Busca Giro
robot -d app/logs/giro app/appGiro/busca_passagens.robot

# Login Wemobi
robot -d app/logs/wemobi app/appWemobi/login.robot

# Busca Wemobi
robot -d app/logs/wemobi app/appWemobi/busca_passagens.robot

# Rodar tudo em sequência
robot -d app/logs/giro app/appGiro/ && robot -d app/logs/wemobi app/appWemobi/
```

---

## 🚦 Pipeline CI/CD — GitHub Actions

Os workflows rodam automaticamente via **Self-Hosted Runner**.

| Workflow             | Descrição          |
| -------------------- | ------------------ |
| `ci_e2e_1.yml`       | Suite E2E batch 1  |
| `ci_e2e_2.yml`       | Suite E2E batch 2  |
| `ci_e2e_3.yml`       | Suite E2E batch 3  |
| `ci_e2e_4.yml`       | Suite E2E batch 4  |
| `ci_e2e_5.yml`       | Suite E2E batch 5  |
| `ci_links_cards.yml` | Links e cards      |
| `regressao.yml`      | Regressão completa |

---

## 📊 Relatórios

```
cypress/reports/        # Relatórios HTML Cypress
cypress/videos/         # Gravações das execuções
cypress/downloads/      # Arquivos baixados nos testes
app/logs/giro/          # Logs Robot — appGiro
app/logs/wemobi/        # Logs Robot — appWemobi
```

---

## 📋 Boas Práticas

- ✅ Cada teste deve ser **independente**
- ✅ Usar `cy.intercept()` para monitorar APIs
- ✅ Preferir seletores `data-cy` a classes CSS
- ✅ Sempre validar o **estado final**
- ✅ Smoke tests devem rodar em menos de **2 minutos**
- ❌ Nunca usar `cy.wait()` com tempo fixo sem justificativa
- ❌ Nunca hardcodar credenciais no código

---

## 🐛 Troubleshooting

| Erro                         | Solução                               |
| ---------------------------- | ------------------------------------- |
| `Cannot find module cypress` | Rodar `npm install`                   |
| `No application is open`     | Verificar se Appium está rodando      |
| `socket hang up`             | Reiniciar ADB e Appium                |
| Timeout em elementos         | Aumentar `defaultCommandTimeout`      |
| Emulador offline             | `adb kill-server && adb start-server` |

---

## 👤 Responsável

**Anderson Silva dos Santos** — Automation Engineer
`anderson.ssantos@jcatlm.com.br`

---

## 📄 Licença

Uso interno — Grupo JCA © 2026
