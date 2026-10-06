const { randomUUID } = require('crypto');
const { guard, append, removeWhere, updateWhere, getDados } = require('../lib/sheets');

module.exports = guard(async req => {
  if (req.method === 'DELETE') {
    await removeWhere('Custos', 0, req.query.id);
    return getDados();
  }

  if (req.method === 'PUT') {
    const c = req.body || {};
    if (!c.id || !c.descricao || !(c.valor >= 0)) throw new Error('Dados inválidos');
    await updateWhere('Custos', 0, c.id, [c.id, c.descricao, c.valor]);
    return getDados();
  }

  if (req.method !== 'POST') throw new Error('Método inválido');
  const c = req.body || {};
  if (!c.descricao || !(c.valor >= 0)) throw new Error('Dados inválidos');
  const id = randomUUID();
  await append('Custos', [id, c.descricao, c.valor]);
  return getDados();
});
