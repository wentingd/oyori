'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request-promise');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

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

app.post('/dev', (req, res) => {
    let reply = constructReplyMessage('text', req.body.message);
    res.status(200).send(reply);
});

function handleEvent(event) {
    let reply = { type: 'text' };
    if (!event.type || event.type !== 'message') {
        return Promise.resolve(null);
    } else {
        client.replyMessage(event.replyToken, constructReplyMessage(event.message.type, event.message.text));
    }   
}

const constructReplyMessage = (msgType, msgText) => {
    switch (msgType) {
        case 'text':
            return { type: 'text', text: giveRecommendation(msgText) };
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

const giveRecommendation = (msgText) => {
    const keywords = msgText.split(' ');
    let type = keywords[0];
    let text = keywords[1];
    if (text.indexOf('lord') > -1) {
        text = 'other,you,control,get,+1';
    }
    return fetchResultFromApi('cards?type=' + type + '&text=' + text).then(result => result);
}

const fetchResultFromApi = async (param) => {
    const mtgApiUri = process.env.MTG_API_BASE_URI;
    const recommendation = await request({ uri: mtgApiUri + param, json: true })
        .then(response => response.cards ? response.cards[0].name : '')
        .catch(err => '');
    return recommendation;
}

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});