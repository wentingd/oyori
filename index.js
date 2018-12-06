// 'use strict';

// const line = require('@line/bot-sdk');
// const express = require('express');
// const bodyParser = require('body-parser');
// const request = require('request-promise');
// const morgan = require('morgan');
// const app = express();

// if (process.env.NODE_ENV !== 'production'){
//     require('dotenv').config();
// };
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

// app.post('/callback', line.middleware(config), (req, res) => {
//   Promise
//     .all(req.body.events.map(handleEvent))
//     .then((result) => res.status(200).json(result))
//     .catch((err) => {
//       console.error(err);
//       res.status(500).end();
//     });
// });

// app.post('/mock/text', (req, res) => {
//     const events = [{type: 'message', message: { type: 'text', text: req.body.message}}];
//     Promise
//         .all(events.map(handleEvent))
//         .then(result => {
//             res.status(200).send(result.data.messages)
//         })
//         .catch(err => res.status(500).send('error'))
// });

// function handleEvent(event) {
//   if (event.type !== 'message') {
//     return Promise.resolve(null);
//   }
//   const reply = { type: 'text', text: event.message.text };
//   return client.replyMessage(event.replyToken, reply);
// //   constructReplyMessage(event.message.type, event.message.text)
// //     .then(reply => {
// //         console.log(reply)
// //         client.replyMessage(event.replyToken, reply)
// //     })
// //     .catch(err => {console.log(err)})
// }

// const constructReplyMessage = async (msgType, msgText) => {
//     console.log('constructreply ::' + msgText)
//     switch (msgType) {
//         case 'text':
//             return { type: 'text', text: await giveRecommendation(msgText) };
//             break;
//         case 'image':
//             return { type: 'text', text: 'これは何の写真なんだろう?' };
//             break;
//         case 'sticker':
//             return { type: 'sticker', packageId: '11539', stickerId: '52114115' };
//             break;
//         case 'video':
//             return { type: 'text', text: 'すみません、動くものはまだよくわからないのです...' };
//             break;
//         default:
//             return { type: 'text', text: '私がまだ知らない何かですね。' };
//     }
// }

// const giveRecommendation = async (msgText) => {
//     console.log('constructreply ::' + msgText)
//     const keywords = msgText.split(' ');
//     let type = keywords[0];
//     let text = keywords[1];
//     if (text.indexOf('lord') > -1) {
//         text = 'other,you,control,get,+1';
//     }
//     return await getFirstCardWithParam('cards?type=' + type + '&text=' + text);
// }

// const getFirstCardWithParam = async (param) => {
//     console.log('constructreply ::' + param)
//     const mtgApiUri = process.env.MTG_API_BASE_URI;
//     return await request({ uri: mtgApiUri + param, json: true }).then(response => response.cards ? response.cards[0].name : '')
// }

// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//     console.log(`listening on ${port}`);
// });

'use strict';

const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // create a echoing text message
  const echo = { type: 'text', text: event.message.text };

  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
