# 🌸 Minha Loja - Gestão de Vendas e Pagamentos

Aplicativo web leve e moderno para gestão de vendas, controle de clientes e pagamentos, integrado com o **Google Sheets** como banco de dados e pronto para deploy na **Vercel**.

---

## 🎨 Funcionalidades

- **Interface Moderna & Responsiva**: Design clean em tons de rosa, adaptado para smartphones e desktops (PWA/Mobile-first).
- **Indicadores Rápidos (KPIs)**: Total vendido, valor recebido, saldo a receber e quantidade de clientes devendo.
- **Gestão de Vendas**: Cadastro simplificado de vendas com múltiplos produtos e cálculo de total em tempo real.
- **Controle de Pagamentos**: Registro de entradas, parcelas e quitação via Pix, Dinheiro ou Cartão.
- **Busca e Filtros Avançados**: Filtre rapidamente por nome do cliente ou status da venda (Todos, Pendentes ou Quitados).
- **Segurança**: Proteção de acesso com senha personalizada (`APP_PASSWORD`).
- **Google Sheets como Backend**: Todos os dados são sincronizados em uma planilha do Google Drive.

---

## 📊 1. Configurando a Planilha no Google Sheets

1. Acesse o [Google Sheets](https://sheets.google.com) e crie uma **Nova Planilha em Branco**.
2. Dê um nome para a planilha (ex: `Minha Loja - Dados`).
3. Crie duas abas (guias) na parte inferior exatamente com os seguintes nomes e cabeçalhos na primeira linha:

#### Aba 1: `Vendas`
| A (id) | B (data) | C (cliente) | D (telefone) | E (itens) | F (total) |
|---|---|---|---|---|---|
| id | data | cliente | telefone | itens | total |

*A primeira linha deve ter os nomes exatamente como acima: `id`, `data`, `cliente`, `telefone`, `itens`, `total`.*

#### Aba 2: `Pagamentos`
| A (id) | B (vendaId) | C (data) | D (valor) | E (forma) |
|---|---|---|---|---|
| id | vendaId | data | valor | forma |

*A primeira linha deve ter os nomes exatamente como acima: `id`, `vendaId`, `data`, `valor`, `forma`.*

4. **Copie o ID da Planilha**:
   O ID da planilha fica na URL do seu navegador, entre `/d/` e `/edit`:
   ```text
   https://docs.google.com/spreadsheets/d/SEU_ID_DA_PLANILHA_AQUI/edit
   ```

---

## 🔑 2. Criando a Chave do Google Sheets (Service Account)

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/).
2. Crie um novo projeto (ou selecione um projeto existente).
3. No menu lateral, vá em **APIs e Serviços > Biblioteca**.
4. Procure por **Google Sheets API** e clique em **Ativar**.
5. Vá em **APIs e Serviços > Credenciais**.
6. Clique em **+ Criar Credenciais** e selecione **Conta de Serviço (Service Account)**.
7. Preencha um nome (ex: `loja-vendas-bot`) e clique em **Criar e Continuar** (pode pular os passos opcionais).
8. Clique na conta de serviço recém-criada, vá até a aba **Chaves (Keys)**.
9. Clique em **Adicionar Chave > Criar nova chave**, escolha o formato **JSON** e clique em **Criar**. O download do arquivo JSON da chave será feito no seu computador.
10. **Importante**: Abra a chave JSON baixada e copie o e-mail do campo `client_email` (ex: `loja-vendas-bot@seu-projeto.iam.gserviceaccount.com`).
11. Abra sua planilha do Google Sheets, clique no botão **Compartilhar** (canto superior direito) e cole o e-mail da conta de serviço dando permissão de **Editor**.

---

## 🚀 3. Configurando e Fazendo Deploy na Vercel

1. Faça o fork ou envie este repositório para a sua conta do **GitHub**.
2. Acesse a [Vercel](https://vercel.com/) e clique em **Add New > Project**.
3. Importe o repositório do seu GitHub.
4. Na seção **Environment Variables** (Variáveis de Ambiente), adicione as seguintes variáveis:

| Variável | Descrição / Valor |
|---|---|
| `SHEET_ID` | O ID da sua planilha extraído da URL do Google Sheets. |
| `APP_PASSWORD` | A senha que você usará para acessar o aplicativo web. |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Todo o conteúdo do arquivo JSON da chave baixado, em **uma única linha**. |

> 💡 **Dica para a variável `GOOGLE_SERVICE_ACCOUNT_JSON`**: Abra o arquivo `.json` no VS Code ou bloco de notas, remova as quebras de linha deixando tudo em uma só linha, ou cole diretamente o JSON completo na caixa da Vercel.

5. Clique em **Deploy**. A Vercel construirá o projeto e fornecerá o link público do seu aplicativo!

---

## 💻 4. Executando Localmente (Opcional)

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/loja-vendas.git
   cd loja-vendas
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie um arquivo `.env` baseado no `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Preencha as variáveis `GOOGLE_SERVICE_ACCOUNT_JSON`, `SHEET_ID` e `APP_PASSWORD`.

4. Para testar as Serverless Functions localmente com a Vercel CLI:
   ```bash
   npx vercel dev
   ```

---

## 📱 Como Usar o Aplicativo

1. Ao abrir o aplicativo pela primeira vez, será solicitada a **Senha de Acesso** (`APP_PASSWORD`).
2. **Resumo**: Veja os números gerais de vendas, recebimentos, valores em aberto e quem está devendo.
3. **Nova Venda**: Preencha o nome do cliente, telefone, adicione os produtos/preços e selecione se houve pagamento de entrada.
4. **Pagamentos**: Acompanhe todas as vendas, pesquise por clientes, filtre por vendas pendentes/quitadas e registre novos pagamentos facilmente!
