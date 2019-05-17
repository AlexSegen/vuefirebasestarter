const { Toastme } = require('toastmejs')

const config = { positionY: 'bottom', positionX: 'center', theme: 'dark'};

var notification = new Toastme(config);

module.exports = notification