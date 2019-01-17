const greeting = [
    "hello",
    "hi",
    "hey",
    "greeting",
    "meet you",
    "morning",
    "good evening",
    "nice day",
    "how are you",
    "こん",
    "ハロー",
    "はろー",
    "元気",
    "や",
    "よ",
    "やっほー",
    "ヤッホー",
    "はじめまし",
];

const please = [
    'よろしく',
    'よろ'
]

const none = [
    "nothing",
    "bored",
    "いいね",
    "何でもない",
    "疲れ"
];

const yes = [
    'yes',
    'そだね',
    'よね'
];

const no = [
    'no',
    'stop'
];

const cancel = [
    "cancel",
    "やめる",
    "ストップ",
    "すとっぷ",
    "キャンセル",
    "きゃんせる",
    "止めて"
];

const navigation = [
    "what can",
    "function",
    "feature",
    "menu",
    "メニュー",
    "教えて",
    "何か",
    "できる",
    "help",
    "ナビ"
]

const card = [
    "card",
    "MTG",
    "マジック",
    "カード"
];

const search = [
    "search",
    "探",
    "見つけたい",
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

const allIntents = [ greeting, none, yes, no, cancel, navigation, card, search, cardShop, faceRecognition ] ;

module.exports = { greeting, none, yes, no, cancel, navigation, card, search, cardShop, faceRecognition, allIntents };