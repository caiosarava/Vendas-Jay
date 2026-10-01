const { randomUUID } = require('crypto');
const { guard, append, removeWhere, updateWhere, getDados } = require('../lib/sheets');

module.exports = guard(async req => {
  if (req.method === 'DELETE') {
    await removeWhere('Vendas', 0, req.query.id);
    await removeWhere('Pagamentos', 1, req.query.id);
    return getDados();
  }

  if (req.method === 'PUT') {
    const v = req.body || {};
    if (!v.id) throw new Error('ID da venda não informado');
    const itens = (v.itens || []).filter(i => i.nome && i.qtd > 0 && i.preco >= 0);
    if (!v.cliente || !itens.length) throw new Error('Dados inválidos');
    const total = Math.round(itens.reduce((s, i) => s + i.qtd * i.preco, 0) * 100) / 100;
    await updateWhere('Vendas', 0, v.id, [v.id, v.data || new Date().toISOString().slice(0, 10), v.cliente, v.telefone || '', JSON.stringify(itens), total]);
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
