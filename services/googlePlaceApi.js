const request = require('request-promise-native');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const apiUri = process.env.GOOGLE_PLACE_API_URI;
const apiKey = process.env.GOOGLE_PLACE_API_KEY;

const getShopNearby = async (location) => {
    const param = `nearbysearch/json?input=${location.latitude},${location.longitude}&radius=1500&keyword=card&key=` + apiKey;
    console.log(apiUri+param)
    const result = await request({uri: apiUri + param, json: true })
        .then(response => response)
        .catch(err => console.log(err));
    if (!result) return '';
    return result;
}

module.exports = { getShopNearby };