const { randomUUID } = require('crypto');
const { guard, append, getDados } = require('../lib/sheets');

module.exports = guard(async req => {
  if (req.method !== 'POST') throw new Error('Método inválido');
  const p = req.body || {};
  if (!p.vendaId || !(p.valor > 0)) throw new Error('Dados inválidos');
  await append('Pagamentos', [randomUUID(), p.vendaId, p.data, p.valor, p.forma || '']);
  return getDados();
});
