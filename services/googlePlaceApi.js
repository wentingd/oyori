const request = require('request-promise-native');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const apiUri = process.env.GOOGLE_PLACE_API_URI;
const apiKey = process.env.GOOGLE_PLACE_API_KEY;

const getShopNearby = async (location) => {
    const param = `nearbysearch/json?location=${location.latitude},${location.longitude}&radius=1500&keyword=trading,card,magic&type=store&key=${apiKey}`;
    console.log('param :: ' + param);
    const results = await request({uri: apiUri + param, json: true })
        .then(response => response.results)
        .catch(err => console.log(err));
    if (results.length <= 0) return '';
    return results;
}

module.exports = { getShopNearby };