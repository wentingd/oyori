const request = require('request-promise');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const mtgApiUri = process.env.MTG_API_BASE_URI;
const defaultLimit = 1;

const getCardsWithParam = async (param, limit) => {
    limit = limit ? parseInt(limit) : defaultLimit;
    const result = await request({ uri: mtgApiUri + param, json: true })
        .then(response => response.cards.length > 0 ? response.cards.slice(0,limit) : '')
        .catch(err => console.log(err));
    if (!result) return '';
    return result;
}

const getCardByName = async(cardName, lang, limit) => {
    const fullParam = lang ? `cards?name=${cardName}&language=${lang}` : `cards?name=${cardName}`;
    const recommendations = await getCardsWithParam(fullParam, limit);
    if (!recommendations) return [''];
    return recommendations
}

const getCardByTypeAndRule = async (type, ruleText, limit) => {
    ruleText = ruleText ? translateKeywordToRuleText(ruleText): '';
    const fullParam = ruleText ? `cards?type=${type}` : `cards?type=${type}&text=${ruleText}`;
    const recommendations = await getCardsWithParam(fullParam, limit);
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

module.exports = { getCardByName, getCardByTypeAndRule, formatInfoUrl };
