const { guard, getDados } = require('../lib/sheets');
module.exports = guard(() => getDados());
