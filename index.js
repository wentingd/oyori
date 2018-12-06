'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const request = require('request-promise');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mtgApi = require('./services/mtgApi');

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
  return constructReplyMessage(event.message.type, event.message.text)
    .then(reply => {
        console.log(reply)
        client.replyMessage(event.replyToken, reply);
    })
    .catch(err => {console.error('Err in handleEvent :: ' + err);})
}

const constructReplyMessage = async (msgType, msgText) => {
    switch (msgType) {
        case 'text':
            return { type: 'text', text: await mtgApi.getCardRecommendation(msgText) };
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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
