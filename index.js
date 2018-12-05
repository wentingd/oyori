'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const app = express();

if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
};

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new line.Client(config);

app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => {
        res.status(200).send(result);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).end();
    });
});

app.get('/', (req, res) => {
    res.send('Hello oyori');
});

function handleEvent(event) {
    let reply = { type: 'text' };
    if (!event) {
        return Promise.resolve(null);
    }
    client.replyMessage(event.replyToken, constructReplyMessage(event.type));
}

function constructReplyMessage(type){
    console.log(type);
    switch (type) {
        case 'text':
            return { ...reply, text: event.message.text };
            break;
        case 'image':
            return { ...reply, text: 'これは誰なんだろう?' };
            break;
        case 'video':
            return { ...reply, text: 'すみません、動くものはまだ…' };
            break;
        default:
            return { ...reply, text: 'まだ知らないコンテンツですね。' };
    }
}

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});