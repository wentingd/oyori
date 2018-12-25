const mainMenu = {
  "type": "text",
  "text": "何をしてあそぼうか？",
  "quickReply": {
    "items": [
      {
        "type": "action",
        "imageUrl": "https://mtg-jp.com/assets/images/common/card_placeholder.jpg",
        "action": {
          "type": "message",
          "label": "MTGのカードを探したい",
          "text": "Magic The Gathering"
        }
      },
      {
        "type": "action",
        "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSx199eQvqMyLj-BWXQIMe-2-6QLKRk6p83Wdww9U_rWlJUn0F2",
        "action": {
          "type": "message",
          "label": "顔認識をしたい",
          "text": "アウトレイジ"
        }
      }
    ]
  }
}

module.exports = { mainMenu };