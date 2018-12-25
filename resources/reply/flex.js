const hello = {
  "type": "flex",
  "altText": "はじめまして :)",
  "contents": {
    "type": "bubble",
    "header": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "text",
          "text": "最近の私です。"
        }
      ]
    },
    "hero": {
      "type": "image",
      "url": "http://www.tmd.ac.jp/dent/oan2/Joho/select/2015/image/12h.jpg"
    },
    "body": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "text",
          "text": "カードのタイプ+何かひとつキーワードを投げると、MTGカードのtop5を教えてあげる"
        }
      ]
    }
  }
}

module.exports = { hello };