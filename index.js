'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const request = require('request-promise');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mtgApi = require('./services/mtgApi');
const faceApi = require('./services/faceApi');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new line.Client(config);

const app = express();

app.use(morgan('tiny'));
// avoid using bodyParser on bot routes
app.use('/mock', bodyParser.json());

app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

app.post('/mock', (req, res) => {
    const events = [req.body.message];
    Promise
        .all(events.map(mtgApi.getCardRecommendation))
        .then(result => {
            res.status(200).send(result)
        })
        .catch(err => res.status(500).send('error'))
});

function handleEvent(event) {
  if (event.type !== 'message') {
    return Promise.resolve(null);
  }
  return getReplyByMsgType(event.message)
    .then(reply => {
      client.replyMessage(event.replyToken, reply)
    })
    .catch(err => {console.error('Err in handleEvent :: ' + err);})
}

const getReplyByMsgType = async (message) => {
  switch (message.type) {
      case 'text':
          return await handleReply(message.text);
          break;
      case 'image':
          return { type: 'text', text: 'I wonder what picture is this?' };
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
};

const handleReply = async (msgText) => {
  if (msgText.indexOf('http') > -1) {
    let personGuess = await faceApi.recognizeFaceFromUrl(msgText);
    return composeSimpleReply(personGuess);
  }
  let cardGuess = await mtgApi.getCardRecommendation(msgText);
  return composeRichReplyForMtgApi(cardGuess);
};

const composeSimpleReply = (replyText) => {
  return { type: 'text', text: replyText }
}

const composeRichReplyForMtgApi = (cardName) => {
  if (!cardName) return 'Sorry, nothing was found...'
  return [{
    "type": "template",
    "altText": cardName,
    "template": {
      "type": "buttons",
      "title": cardName,
      "text": cardName,
      "actions": [
        {
          "type": "uri",
          "label": "Open on Wisdom Guild",
          "uri": mtgApi.formatInfoUrl(cardName)
        }]
    }}]
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
