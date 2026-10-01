const { GoogleAuth } = require('google-auth-library');

let auth;
const client = () => auth || (auth = new GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
}));

const call = async (path, method = 'GET', data) =>
  (await client().request({
    url: `https://sheets.googleapis.com/v4/spreadsheets/${process.env.SHEET_ID}${path}`,
    method, data
  })).data;

async function rows(tab) {
  const [h, ...v] = (await call(`/values/${tab}!A:Z?valueRenderOption=UNFORMATTED_VALUE`)).values || [[]];
  return v.map(r => Object.fromEntries(h.map((k, i) => [k, r[i] ?? ''])));
}

const append = (tab, row) =>
  call(`/values/${tab}!A:A:append?valueInputOption=RAW`, 'POST', { values: [row] });

async function removeWhere(tab, col, id) {
  const vals = (await call(`/values/${tab}!A:Z`)).values || [];
  const meta = await call('?fields=sheets.properties');
  const sheetId = meta.sheets.find(s => s.properties.title === tab).properties.sheetId;
  const requests = [];
  for (let i = vals.length - 1; i > 0; i--)
    if (vals[i][col] === id)
      requests.push({ deleteDimension: { range: { sheetId, dimension: 'ROWS', startIndex: i, endIndex: i + 1 } } });
  if (requests.length) await call(':batchUpdate', 'POST', { requests });
}

async function getDados() {
  const [vendas, pgs] = await Promise.all([rows('Vendas'), rows('Pagamentos')]);
  return vendas.map(v => ({
    ...v,
    itens: JSON.parse(v.itens),
    pagamentos: pgs.filter(p => p.vendaId === v.id)
  }));
}

// Exige o header x-app-key igual a APP_PASSWORD e padroniza erros em JSON
const guard = fn => async (req, res) => {
  if (!process.env.APP_PASSWORD || req.headers['x-app-key'] !== process.env.APP_PASSWORD)
    return res.status(401).json({ erro: 'Senha incorreta' });
  try { res.status(200).json(await fn(req)); }
  catch (e) { console.error(e); res.status(500).json({ erro: e.message }); }
};

module.exports = { append, removeWhere, getDados, guard };
