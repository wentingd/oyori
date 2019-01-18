const contents = [{
    "id": "1",
    "name": "mtgCardFinder",
    "steps": [
        {
            "step": "0",
            "type": "prompt",
            "message": "カードの英語の名前は分かっていますか? 分かっていたら教えてください。",
            "promptId": "cardName"
        },
        {
            "step": "1",
            "type": "prompt",
            "message": "カードのタイプ知っていますか? 以下から選んでくださいね：creature, instant, socery, enchantment...",
            "promptId": "cardType"
        },
        {
            "step": "2",
            "type": "prompt",
            "message": "カードのサブタイプ知っていますか? たとえばクリーチャーなら'spirit'とか、クリーチャーの種類を入れてね",
            "promptId": "cardSubType"
        },
        {
            "step": "3",
            "type": "prompt",
            "message": "カードのルールテキストから何か自由文字を入れてください。ヒント：lordでしたらそのまま入力してください",
            "promptId": "cardRuleText"
        }
    ]
}]

const finalReplyHandler = async (cardParams) => {
    const { composeRichReplyForMtgApi } = require('../../clientHelper');
    const { getCardByName, getCardByTypeAndRule } = require('../../services/mtgApi');
    const { cardName, cardType, cardSubType, cardRuleText } = cardParams || {};
    let cardGuesses = [];
    if (cardName) {
        cardGuesses = await getCardByName(cardName);
    } else {
        cardGuesses = await getCardByTypeAndRule(cardSubType, cardRuleText || cardType, 1);
    }
    return cardGuesses.map(card => composeRichReplyForMtgApi(card));
};

module.exports = { contents, finalReplyHandler };