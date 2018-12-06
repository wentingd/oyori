// 'use strict';

// const line = require('@line/bot-sdk');
// const express = require('express');
// const bodyParser = require('body-parser');
// const request = require('request-promise');
// const morgan = require('morgan');
// const app = express();

// const config = {
//   channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
//   channelSecret: process.env.LINE_CHANNEL_SECRET,
// };

// const client = new line.Client(config);

// app.use(morgan('tiny'));
// app.use(bodyParser.urlencoded({
//     extended: true
// }));
// app.use(bodyParser.json());

// app.post('/mock/text', (req, res) => {
//     const events = [{type: 'message', message: { type: 'text', text: req.body.message}}];
//     Promise
//         .all(events.map(handleEvent))
//         .then(result => {
//             res.status(200).send(result.data.messages)
//         })
//         .catch(err => res.status(500).send('error'))
// });


'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request-promise');
const morgan = require('morgan');

if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
};
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new line.Client(config);

const app = express();

app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }
  return constructReplyMessage(event.message.type, event.message.text)
    .then(reply => {
        console.log(reply)
        client.replyMessage(event.replyToken, reply)
    })
    .catch(err => {console.log(err)})
}

const constructReplyMessage = async (msgType, msgText) => {
    switch (msgType) {
        case 'text':
            return { type: 'text', text: await giveRecommendation(msgText) };
            break;
        case 'image':
            return { type: 'text', text: 'これは何の写真なんだろう?' };
            break;
        case 'sticker':
            return { type: 'sticker', packageId: '11539', stickerId: '52114115' };
            break;
        case 'video':
            return { type: 'text', text: 'すみません、動くものはまだよくわからないのです...' };
            break;
        default:
            return { type: 'text', text: '私がまだ知らない何かですね。' };
    }
}

const giveRecommendation = async (msgText) => {
    const keywords = msgText.split(' ');
    let type = keywords[0];
    let text = keywords[1];
    if (text.indexOf('lord') > -1) {
        text = 'other,you,control,get,+1';
    }
    let recommendation = await getFirstCardWithParam('cards?type=' + type + '&text=' + text);
    if (!recommendation) return 'sorry, no result was found'
    return recommendation;
}

const getFirstCardWithParam = async (param) => {
    const mtgApiUri = process.env.MTG_API_BASE_URI;
    return await request({ uri: mtgApiUri + param, json: true }).then(response => response.cards[0] ? response.cards[0].name : '')
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
