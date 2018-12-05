const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const logger = require('morgan');
const line = require("@line/bot-sdk");

if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
};

const lineConfig = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET
};

const client = new line.Client(lineConfig);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(logger('dev'));

app.post('/webhook', line.middleware(lineConfig), (req, res, next) => {
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result))
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });
});

function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }
    const echo = { type: 'text', text: event.message.text };
    return client.replyMessage(event.replyToken, echo);
}

app.get('/ping', function(request, response) {
    response.send('pong!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});