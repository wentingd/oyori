const greeting = [
    "hello",
    "hi",
    "hey",
    "greeting",
    "meet you",
    "morning",
    "good evening",
    "nice day",
    "こんにちわ",
    "こんばんわ",
    "ハロー",
    "はろー"
];

const none = [
    "nothing",
    "none",
    "wow",
    "bored",
    "no"
];

const cancel = [
    "cancel",
    "やめる",
    "ストップ"
];

const navigation = [
    "what can",
    "function",
    "feature",
    "menu",
    "メニュー",
    "できる",
    "help"
]

const card = [
    "card",
    "MTG",
    "マジックのカード",
    "MTGのカード"
];

const search = [
    "search",
    "探したい",
    "サーチ"
];

const cardShop = [
    "shop",
    "カードショップ"
];

const faceRecognition = [
    "face",
    "outrage",
    "アウトレイジ",
    "顔認識",
    "顔"
];

const guessTopIntent = (tokens) => {
    if (tokens.some(intent => navigation.includes(intent))){
        console.log('intent: navigation');
        return 'navigation';
    }
    if (tokens.some(intent => cancel.includes(intent))){
        console.log('intent: cancel');
        return 'cancel';
    }
    if (tokens.some(intent => greeting.includes(intent))){
        console.log('intent: greeting');
        return 'greeting';
    }
    if (tokens.some(intent => card.includes(intent)) && tokens.some(intent => search.includes(intent))){
        console.log('intent: mtg card search');
        return 'card search';
    }
    if (tokens.some(intent => cardShop.includes(intent)) && tokens.some(intent => search.includes(intent))){
        console.log('intent: card shop');
        return 'shop search';
    }
    if (tokens.some(intent => faceRecognition.includes(intent))){
        console.log('intent: face rec');
        return 'face recognition';
    }
    console.log(tokens)
    console.log('no intent detected');
}

module.exports = { guessTopIntent };