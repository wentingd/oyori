const mtg= [{
    "id": "1",
    "name": "mtgCardFinder",
    "steps": [
        {
            "id": "1",
            "prompt": "カードの名前は分かっていますか? 分かっていたら教えてください。",
            "nextStep": "2"
        },
        {
            "id": "2",
            "prompt": "カードのタイプ知っていますか? e.g. creature, instant",
            "nextStep": "3"
        },
        {
            "id": "3",
            "prompt": "カードのルールテキストから何か自由文字を入れてください。ヒント：lordでしたらそのまま入力してください",
            "nextStep": ""
        }
    ]
},{
    "id": "2",
    "name": "mtgShopFinder",
    "steps": [
        {
            "id": "1",
            "prompt": "所在地のロケーション情報を送ってくださいね",
            "nextStep": ""
        }
    ]
}]

module.exports = mtg;