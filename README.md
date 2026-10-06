# 🌸 Minha Loja - Gestão de Vendas, Estoque e Custos

Aplicativo web leve e moderno para gestão de vendas, controle de clientes, controle de estoque, custos fixos e apuração de lucro líquido, integrado com o **Google Sheets** como banco de dados e pronto para deploy na **Vercel**.

---

## 🎨 Funcionalidades

- **Interface Moderna & Responsiva**: Design clean em tons de rosa, adaptado para smartphones e desktops (PWA/Mobile-first).
- **Indicadores Rápidos (KPIs) & Lucro Líquido**:
  - Total Vendido
  - Custo das Mercadorias Vendidas (CMV)
  - Custos Fixos
  - **Lucro Líquido** (Total Vendido - (Custo Mercadoria + Custos Fixos))
  - Valor Recebido, Saldo a Receber e Clientes Devendo.
- **Gestão de Vendas**: Cadastro e edição simplificada de vendas com múltiplos produtos e cálculo automático.
- **Controle de Pagamentos**: Registro de entradas, parcelas e quitação via Pix, Dinheiro ou Cartão.
- **Controle de Custos Fixos (💸 Custos)**: Cadastro e acompanhamento de gastos operacionais (combustível, passagens, luz, etc).
- **Controle de Estoque (📦 Estoque)**: Cadastro de produtos com preço de custo, quantidade em estoque e preço de venda.
- **Busca e Filtros Avançados**: Filtre por nome do cliente ou status da venda (Todos, Pendentes ou Quitados). Clique no cliente devedor no resumo para abrir seus pagamentos diretamente.
- **Segurança**: Proteção de acesso com senha personalizada (`APP_PASSWORD`).

---

## 📊 1. Configurando a Planilha no Google Sheets

1. Acesse o [Google Sheets](https://sheets.google.com) e crie uma **Nova Planilha em Branco**.
2. Dê um nome para a planilha (ex: `Minha Loja - Dados`).
3. Crie **4 abas (guias)** na parte inferior exatamente com os seguintes nomes e cabeçalhos na primeira linha:

#### Aba 1: `Vendas`
| A (id) | B (data) | C (cliente) | D (telefone) | E (itens) | F (total) |
|---|---|---|---|---|---|
| id | data | cliente | telefone | itens | total |

#### Aba 2: `Pagamentos`
| A (id) | B (vendaId) | C (data) | D (valor) | E (forma) |
|---|---|---|---|---|
| id | vendaId | data | valor | forma |

#### Aba 3: `Custos`
| A (id) | B (descricao) | C (valor) |
|---|---|---|
| id | descricao | valor |

#### Aba 4: `Estoque`
| A (id) | B (nome) | C (precoCusto) | D (qtdEstoque) | E (precoVenda) |
|---|---|---|---|---|
| id | nome | precoCusto | qtdEstoque | precoVenda |

*A primeira linha de cada aba deve conter exatamente os cabeçalhos em minúsculo mostrados acima.*

4. **Copie o ID da Planilha**:
   O ID da planilha fica na URL do seu navegador, entre `/d/` e `/edit`:
   ```text
   https://docs.google.com/spreadsheets/d/SEU_ID_DA_PLANILHA_AQUI/edit
   ```

---

## 🔑 2. Criando a Chave do Google Sheets (Service Account)

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/).
2. Crie um novo projeto (ou selecione um existente).
3. No menu lateral, vá em **APIs e Serviços > Biblioteca**.
4. Procure por **Google Sheets API** e clique em **Ativar**.
5. Vá em **APIs e Serviços > Credenciais**.
6. Clique em **+ Criar Credenciais** e selecione **Conta de Serviço (Service Account)**.
7. Preencha um nome (ex: `loja-vendas-bot`) e clique em **Criar e Continuar**.
8. Clique na conta de serviço recém-criada, vá até a aba **Chaves (Keys)**.
9. Clique em **Adicionar Chave > Criar nova chave**, escolha o formato **JSON** e clique em **Criar**. O download do arquivo JSON da chave será feito no seu computador.
10. **Importante**: Abra a chave JSON baixada e copie o e-mail do campo `client_email` (ex: `loja-vendas-bot@seu-projeto.iam.gserviceaccount.com`).
11. Abra sua planilha do Google Sheets, clique no botão **Compartilhar** (canto superior direito) e cole o e-mail da conta de serviço dando permissão de **Editor**.

---

## 🚀 3. Configurando e Fazendo Deploy na Vercel

1. Envie o código deste repositório para o seu **GitHub**.
2. Acesse a [Vercel](https://vercel.com/) e importe o repositório.
3. Na seção **Environment Variables** (Variáveis de Ambiente), adicione:

| Variável | Descrição / Valor |
|---|---|
| `SHEET_ID` | O ID da sua planilha extraído da URL do Google Sheets. |
| `APP_PASSWORD` | A senha que você usará para acessar o aplicativo web. |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | O conteúdo completo do arquivo JSON da chave da conta de serviço, em **uma única linha**. |

4. Clique em **Deploy**.

---

## 💻 4. Executando Localmente (Opcional)

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Crie um arquivo `.env` baseado no `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Execute localmente com Vercel CLI:
   ```bash
   npx vercel dev
   ```
