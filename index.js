'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const request = require('request-promise');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { handleText, handleAudio, handleImage, handleSticker, handleVideo, handleLocation } = require('./controllers/ResponseController');

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
    .then(result => res.end())
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

/* Sample req.body for testing mock
{
	"type": "message",
	"message": { "type": "text", "text": "bye" },
	"replyToken": "1111111"
}
*/
app.post('/mock', (req, res) => {
  const events = req.body;
  Promise
    .all(events.map(event => handleEvent(event)))
    .then(result => res.status(200).send(result))
    .catch(err => res.status(500).send('error'))
});

const replyText = (client, token, texts) => {
  console.log('prepare to reply : ' + JSON.stringify(texts))
  // texts = Array.isArray(texts) ? texts : [texts];
  // return client.replyMessage(
  //   token,
  //   texts.map((text) => ({ type: 'text', text }))
  // );
  return client.replyMessage(
    token,
    texts
  );
};

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
          return replyText(client, event.replyToken, await handleText(message, event.source));
          break;
        case 'image':
          return replyText(client, event.replyToken, await handleImage(message, event.source));
          break;
        case 'video':
          return replyText(client, event.replyToken, await handleVideo(message, event.source));
          break;
        case 'audio':
          return replyText(client, event.replyToken, await handleAudio(message, event.source));
          break;
        case 'location':
          return replyText(client, event.replyToken, await handleLocation(message, event.source));
          break;
        case 'sticker':
          return replyText(client, event.replyToken, await handleSticker(message, event.source));
          break;
        default:
          throw new Error(`Unknown message: ${JSON.stringify(message)}`);
          break;
      }
    // case 'follow':
    //   return replyText(event.replyToken, 'Got followed event');
    // case 'unfollow':
    //   return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);
    // case 'join':
    //   return replyText(event.replyToken, `Joined ${event.source.type}`);
    // case 'leave':
    //   return console.log(`Left: ${JSON.stringify(event)}`);
    // case 'postback':
    //   let data = event.postback.data;
    //   if (data === 'DATE' || data === 'TIME' || data === 'DATETIME') {
    //     data += `(${JSON.stringify(event.postback.params)})`;
    //   }
    //   return replyText(event.replyToken, `Got postback: ${data}`);
    // case 'beacon':
    //   return replyText(event.replyToken, `Got beacon: ${event.beacon.hwid}`);
    default:
      throw new Error(`Unknown event type: ${JSON.stringify(eventType)}`);
  }
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
