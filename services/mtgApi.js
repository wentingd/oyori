const request = require('request-promise');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const mtgApiUri = process.env.MTG_API_BASE_URI;

const getFirstCardWithParam = async (param) => {
    let result = await request({ uri: mtgApiUri + param, json: true })
        .then(response => response.cards[0] ? response.cards[0].name : '')
        .catch(err => console.log(err));
    if (!result) return '';
    return result;
}

const getCardRecommendation = async (msgText) => {
  const keywords = msgText.split(' ');
  let type = keywords[0];
  let text = keywords[1];
  if (text && text.indexOf('lord') > -1) {
      text = 'other,you,control,get,+1';
  }
  let recommendation = await getFirstCardWithParam('cards?type=' + type + '&text=' + text);
  if (!recommendation) return '';
  return recommendation;
}

const formatInfoUrl = (cardName) => {
  let parameterizedCardName = cardName.replace(/ +/g, "+")
  return 'http://wonder.wisdom-guild.net/price/' + parameterizedCardName;
}

module.exports = { getCardRecommendation, formatInfoUrl };
