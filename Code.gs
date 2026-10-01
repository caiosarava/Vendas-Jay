// Backend: usa uma planilha "Controle de Vendas" no seu Drive como banco de dados.
// A planilha é criada automaticamente na primeira execução.
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Minha Loja')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function db_() {
  const p = PropertiesService.getScriptProperties();
  const id = p.getProperty('SSID');
  if (id) return SpreadsheetApp.openById(id);
  const ss = SpreadsheetApp.create('Controle de Vendas');
  p.setProperty('SSID', ss.getId());
  const v = ss.getSheets()[0];
  v.setName('Vendas');
  v.appendRow(['id', 'data', 'cliente', 'telefone', 'itens', 'total']);
  ss.insertSheet('Pagamentos').appendRow(['id', 'vendaId', 'data', 'valor', 'forma']);
  return ss;
}

function rows_(nome) {
  const v = db_().getSheetByName(nome).getDataRange().getValues();
  const h = v.shift();
  return v.map(r => Object.fromEntries(h.map((k, i) => [k,
    r[i] instanceof Date ? Utilities.formatDate(r[i], 'America/Sao_Paulo', 'yyyy-MM-dd') : r[i]])));
}

function getDados() {
  const pg = rows_('Pagamentos');
  return rows_('Vendas').map(v => ({
    ...v,
    itens: JSON.parse(v.itens),
    pagamentos: pg.filter(p => p.vendaId == v.id)
  }));
}

function salvarVenda(v) {
  const id = Utilities.getUuid();
  const ss = db_();
  ss.getSheetByName('Vendas').appendRow([id, v.data, v.cliente, "'" + v.telefone, JSON.stringify(v.itens), v.total]);
  if (v.entrada > 0) ss.getSheetByName('Pagamentos').appendRow([Utilities.getUuid(), id, v.data, v.entrada, 'Entrada']);
  return getDados();
}

function salvarPagamento(p) {
  db_().getSheetByName('Pagamentos').appendRow([Utilities.getUuid(), p.vendaId, p.data, p.valor, p.forma]);
  return getDados();
}

function excluirVenda(id) {
  const ss = db_();
  ['Vendas', 'Pagamentos'].forEach((n, k) => {
    const s = ss.getSheetByName(n), v = s.getDataRange().getValues();
    for (let i = v.length - 1; i > 0; i--) if (v[i][k] == id) s.deleteRow(i + 1);
  });
  return getDados();
}
