const request = require('request-promise');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const mtgApiUri = process.env.MTG_API_BASE_URI;

const getCardsWithParam = async (param, limit) => {
    limit = limit ? parseInt(limit) : 5;
    const result = await request({ uri: mtgApiUri + param, json: true })
        .then(response => response.cards.length > 0 ? response.cards.slice(0,limit) : '')
        .catch(err => console.log(err));
    if (!result) return '';
    return result;
}

const getCardRecommendations = async (type, ruleText, limit) => {
    ruleText = ruleText ? translateKeywordToRuleText(ruleText): '';
    const recommendations = await getCardsWithParam('cards?type=' + type + '&text=' + ruleText, limit);
    if (!recommendations) return [''];
    return recommendations;
}

const translateKeywordToRuleText = (keyword) => {
    return keyword.indexOf('lord') > -1 ? 'other,you,control,get,+1' : keyword;
}

const formatInfoUrl = (cardName) => {
    const parameterizedCardName = cardName.replace(/ +/g, "+")
    return 'http://wonder.wisdom-guild.net/price/' + parameterizedCardName;
}

module.exports = { getCardRecommendations, formatInfoUrl };
