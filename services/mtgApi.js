const request = require('request-promise');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const mtgApiUri = process.env.MTG_API_BASE_URI;

const getCardNamesWithParam = async (param) => {
    console.log(param)
    const result = await request({ uri: mtgApiUri + param, json: true })
        .then(response => response.cards.length > 0 ? response.cards.map(card => card.name).slice(0,5) : '')
        .catch(err => console.log(err));
    if (!result) return '';
    return result;
}

const getCardRecommendations = async (userInput) => {
    let type = '';
    let ruleText = '';
    const keywords = userInput.split(' ');
    if (keywords.length > 1){
        type = keywords[0];
        ruleText = keywords[1].indexOf('lord') > -1 ? 'other,you,control,get,+1' : keywords[1];
    } else {
        type = keywords[0];
        ruleText = '';
    }
    const recommendations = await getCardNamesWithParam('cards?type=' + type + '&text=' + ruleText);
    if (!recommendations) return '';
    return recommendations;
}

const formatInfoUrl = (cardName) => {
    const parameterizedCardName = cardName.replace(/ +/g, "+")
    return 'http://wonder.wisdom-guild.net/price/' + parameterizedCardName;
}

module.exports = { getCardRecommendations, formatInfoUrl };
