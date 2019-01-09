const mtgCardFinder = require('./mtgCardFinder');
const faceRecognition = require('./faceRecognition');

module.exports = [
    ...mtgCardFinder,
    ...faceRecognition
]