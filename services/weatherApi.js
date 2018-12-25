const request = require('request-promise');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const weatherApiUri = process.env.OPEN_WEATHER_API_URI;
const weatherApiKey = process.env.OPEN_WEATHER_API_KEY;

const getWeatherByCityId = async (cityId) => {
    const param = 'weather?id=' + cityId + '&units=metric' + '&appid=' + weatherApiKey;
    const result = await request({uri: weatherApiUri + param, json: true })
        .then(response => response)
        .catch(err => console.log(err));
    if (!result) return '';
    return result;
}

module.exports = { getWeatherByCityId };