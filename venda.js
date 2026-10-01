const { randomUUID } = require('crypto');
const { guard, append, removeWhere, getDados } = require('../lib/sheets');

module.exports = guard(async req => {
  if (req.method === 'DELETE') {
    await removeWhere('Vendas', 0, req.query.id);
    await removeWhere('Pagamentos', 1, req.query.id);
    return getDados();
  }
  if (req.method !== 'POST') throw new Error('Método inválido');
  const v = req.body || {};
  const itens = (v.itens || []).filter(i => i.nome && i.qtd > 0 && i.preco >= 0);
  if (!v.cliente || !itens.length) throw new Error('Dados inválidos');
  const total = Math.round(itens.reduce((s, i) => s + i.qtd * i.preco, 0) * 100) / 100;
  const id = randomUUID();
  await append('Vendas', [id, v.data, v.cliente, v.telefone || '', JSON.stringify(itens), total]);
  if (v.entrada > 0) await append('Pagamentos', [randomUUID(), id, v.data, v.entrada, 'Entrada']);
  return getDados();
});
