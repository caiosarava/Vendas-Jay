const { randomUUID } = require('crypto');
const { guard, append, removeWhere, updateWhere, getDados } = require('../lib/sheets');

module.exports = guard(async req => {
  if (req.method === 'DELETE') {
    await removeWhere('Estoque', 0, req.query.id);
    return getDados();
  }

  if (req.method === 'PUT') {
    const e = req.body || {};
    if (!e.id || !e.nome) throw new Error('Dados inválidos');
    await updateWhere('Estoque', 0, e.id, [
      e.id,
      e.nome,
      +e.precoCusto || 0,
      +e.qtdEstoque || 0,
      +e.precoVenda || 0
    ]);
    return getDados();
  }

  if (req.method !== 'POST') throw new Error('Método inválido');
  const e = req.body || {};
  if (!e.nome) throw new Error('Nome do item é obrigatório');
  const id = randomUUID();
  await append('Estoque', [
    id,
    e.nome,
    +e.precoCusto || 0,
    +e.qtdEstoque || 0,
    +e.precoVenda || 0
  ]);
  return getDados();
});
