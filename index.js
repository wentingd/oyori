// const express = require('express');
// const app = express();

// const line = require("@line/bot-sdk");

// if (process.env.NODE_ENV !== 'production'){
//     require('dotenv').config();
// };

// const lineConfig = {
//     channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
//     channelSecret: process.env.LINE_CHANNEL_SECRET
// };

// const client = new line.Client(lineConfig);

// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());
// app.use(logger('dev'));

// app.post('/webhook', line.middleware(lineConfig), (req, res, next) => {
//     Promise
//         .all(req.body.events.map(handleEvent))
//         .then((result) => res.json(result))
//         .catch((err) => {
//             console.error(err);
//             res.status(500).end();
//         });
// });

// function handleEvent(event) {
//     if (event.type !== 'message' || event.message.type !== 'text') {
//         return Promise.resolve(null);
//     }
//     const echo = { type: 'text', text: event.message.text };
//     return client.replyMessage(event.replyToken, echo);
// }

// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`listening on ${port}`);
// });

'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const app = express();

if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
};

// create LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new line.Client(config);

app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => {
        console.log(result);
        res.status(200).send(result);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).end();
    });
});

app.get('/ping', (req,res) => {
    response.send('pong!');
});

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }
  const echo = { type: 'text', text: event.message.text };
  return client.replyMessage(event.replyToken, echo);
}

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});