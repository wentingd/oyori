const weatherApi = require('../../services/weatherApi');
const natural = require('natural');
const tokenizerEn = new natural.WordTokenizer();
const tokenizerJa = new natural.TokenizerJa();
const { greeting, none, yes, no, cancel, navigation, card, search, cardShop, faceRecognition, allIntents } = require('./intent');

const detectUserLang = (text) => {
    const tokens = tokenizerEn.tokenize(text);
    return tokens.length < 1 ? 'ja' : 'en';
}

const guessIntentWithLang = (text, lang) => {
    if (lang === 'en') {
        return guessIntentFromTokens(tokenizerEn.tokenize(text));
    }
    if (lang === 'ja') {
        return guessIntentFromTokens(tokenizerJa.tokenize(text));
    }
    return '';
}

const guessIntentFromTokens = (tokens) => {
    let topIntent = '';
    if (tokens.some(intent => navigation.includes(intent))){ topIntent = 'navigation';}
    if (tokens.some(intent => cancel.includes(intent))){ topIntent = 'cancel';}
    if (tokens.some(intent => greeting.includes(intent))){ topIntent = 'greeting'; }
    if (tokens.some(intent => card.includes(intent)) && tokens.some(intent => search.includes(intent))){ topIntent = 'card search'; }
    if (tokens.some(intent => cardShop.includes(intent)) && tokens.some(intent => search.includes(intent))){ topIntent = 'shop search'; }
    if (tokens.some(intent => faceRecognition.includes(intent))){ topIntent = 'face recognition'; }
    if (tokens.some(intent => yes.includes(intent))){ topIntent = 'yes'; }
    if (tokens.some(intent => no.includes(intent))){ topIntent = 'no'; }
    if (tokens.some(intent => none.includes(intent))){ topIntent = 'none'; }
    console.log(`Tokenized input :: ${ tokens }`)
    console.log(`Identified intent :: ${ topIntent }`);
    return topIntent;
}

const guessIntentFromPlainText = (text) => {
    let identified = [];
    allIntents.forEach(intent => {
        if (text.includes(intent)){
            identified.push(intent);
        }
    })
    console.log(identified);
    return identified ? identified[0] : '';
};


const generateWeatherGreeting = async() => {
    const tokyo = '1850147';
    const temp = await weatherApi.getWeatherByCityId(tokyo).then(res => res.main.temp);
    const weatherGreeting = temp > 20 ? (temp < 27 ? 'よい天気ですね。遠出でもしたいね': '暑苦しい日はちょっと苦手ですが、海の中に生きててよかったです :)') : '今日の東京は寒いです...お茶でも飲みたいなー';
    return weatherGreeting;
}

const generateRandomGreetings = () => {
    const normalGreetings = [
        'やっほー',
        'こんにちわー',
        'まだ会えて嬉しいね。',
    ];
    const randomized = Math.floor(Math.random() * Math.floor(3));
    return normalGreetings[randomized];
}


module.exports = { guessIntentFromTokens, guessIntentFromPlainText, guessIntentWithLang, detectUserLang, generateRandomGreetings, generateWeatherGreeting };