'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { handleText, handleAudio, handleImage, handleSticker, handleVideo, handleLocation } = require('./controllers/MessageController');
const { reply, push } = require('./clientHelper');

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

app.get('/callback', (req, res) => res.end(`I'm listening. Please access with POST.`));

// webhook callback
app.post('/callback', line.middleware(config), (req, res) => {
  if (req.body.destination) {
    console.log("Destination User ID: " + req.body.destination);
  }
  if (!Array.isArray(req.body.events)) {
    return res.status(500).end();
  }
  Promise.all(req.body.events.map(handleEvent))
    .then(() => res.end())
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

/* Sample events can be found at test/mock */
app.post('/mock', (req, res) => {
  const { events } = req.body;
  Promise
    .all(events.map(handleEvent))
    .then(() => res.end())
    .catch(err => {
      console.log(err)
      res.status(500).send('error')
    })
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
        case 'image':
          return reply(client, event.replyToken, await handleImage(message, event.source));
          break;
        case 'video':
          return reply(client, event.replyToken, await handleVideo(message, event.source));
          break;
        case 'audio':
          return reply(client, event.replyToken, await handleAudio(message, event.source));
          break;
        case 'location':
          return reply(client, event.replyToken, await handleLocation(message, event.source));
          break;
        case 'sticker':
          return reply(client, event.replyToken, await handleSticker(message, event.source));
          break;
        default:
          throw new Error(`Unknown message: ${JSON.stringify(message)}`);
          break;
      }
    // case 'follow':
    //   return reply(client, event.replyToken, 'Got followed event');
    // case 'unfollow':
    //   return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);
    // case 'join':
    //   return reply(client, event.replyToken, `Joined ${event.source.type}`);
    // case 'leave':
    //   return console.log(`Left: ${JSON.stringify(event)}`);
    // case 'postback':
    //   let data = event.postback.data;
    //   if (data === 'DATE' || data === 'TIME' || data === 'DATETIME') {
    //     data += `(${JSON.stringify(event.postback.params)})`;
    //   }
    //   return reply(client, event.replyToken, `Got postback: ${data}`);
    // case 'beacon':
    //   return reply(client, event.replyToken, `Got beacon: ${event.beacon.hwid}`);
    default:
      throw new Error(`Unknown event type: ${JSON.stringify(eventType)}`);
  }
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
