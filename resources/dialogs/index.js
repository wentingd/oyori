const userProfile = require('./userProfile');
const mtgCardFinder = require('./mtgCardFinder');
const mtgShopFinder = require('./mtgShopFinder');
const faceRecognition = require('./faceRecognition');

module.exports = [
    ...userProfile.contents,
    ...mtgCardFinder.contents,
    ...mtgShopFinder.contents,
    ...faceRecognition.contents
]