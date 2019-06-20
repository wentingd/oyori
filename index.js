'use strict';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
};

const line = require('@line/bot-sdk');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const db = require('./db');
const routes = require('./routes')
const { handleText, handleLocation, handleImage, handleSticker, handleUnknown } = require('./botController');
const { reply } = require('./clientHelper');

const lineConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
}
const client = new line.Client(lineConfig);

const app = express();

app.use(helmet());
app.use(morgan('tiny'));
// use bodyParser only for non-bot routes
app.use('/api', bodyParser.json());
app.use('/', routes);

// webhook callback
app.get('/callback', (req, res) => res.end(`I'm listening. Please access with POST.`));

app.post('/callback', line.middleware(lineConfig), (req, res) => {
  if (req.body.destination) {
    console.log("[index.js] Destination ID: " + req.body.destination);
  }
  if (!Array.isArray(req.body.events)) {
    return res.status(500).end();
  }
  Promise.all(req.body.events.map(handleEvent))
    .then(() => res.end())
    .catch((err) => {
      console.error(err.message);
      res.status(500).end();
    });
});

async function handleEvent(event) {
  if (event.replyToken && event.replyToken.match(/^(.)\1*$/)) {
    console.log("Test hook recieved: " + JSON.stringify(event.message));
  }
  const eventType = event.type;
  switch (event.type) {
    case 'message':
      const { message } = event;
      switch (message.type) {
        case 'text':
          return reply(client, event.replyToken, await handleText(message, event.source));
          break;
        case 'location':
          return reply(client, event.replyToken, await handleLocation(message, event.source));
          break;
        case 'image':
          return reply(client, event.replyToken, await handleImage(message, event.source));
          break;
        case 'sticker':
          return reply(client, event.replyToken, await handleSticker(message, event.source));
          break;
        default:
          return reply(client, evnet.replyToken, handleUnknown(message, event.source))
          break;
      }
    case 'follow':
      return reply(client, event.replyToken, 'Got followed event');
    case 'unfollow':
      return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);
    case 'join':
      return reply(client, event.replyToken, `Joined ${event.source.type}`);
    case 'leave':
      return console.log(`Left: ${JSON.stringify(event)}`);
    case 'postback':
      let data = event.postback.data;
      if (data === 'DATE' || data === 'TIME' || data === 'DATETIME') {
        data += `(${JSON.stringify(event.postback.params)})`;
      }
      return reply(client, event.replyToken, `Got postback: ${data}`);
    case 'beacon':
      return reply(client, event.replyToken, `Got beacon: ${event.beacon.hwid}`);
    default:
      throw new Error(`Unknown event type: ${JSON.stringify(eventType)}`);
  }
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
