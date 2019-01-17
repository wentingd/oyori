const mtgCardFinder = require('./mtgCardFinder');
const mtgShopFinder = require('./mtgShopFinder');
const faceRecognition = require('./faceRecognition');

module.exports = [
    ...mtgCardFinder,
    ...mtgShopFinder,
    ...faceRecognition
]