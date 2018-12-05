const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const async = require('async');
const logger = require('morgan');
const line = require("@line/bot-sdk");

if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
};

const lineConfig = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET
};

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(logger('dev'));

app.post('/webhook', line.middleware(lineConfig), (req, res, next) => {
    res.status(200).json('success');
    console.log(req.body);
});

// app.post('/webhook', line.middleware(lineConfig), (req, res, next) => {
//     res.sendStatus(200);
//     let events_processed = [];

//     req.body.events.forEach((event) => {
//         if (event.type == "message" && event.message.type == "text"){
//             if (event.message.text == "こんにちは"){
//                 events_processed.push(bot.replyMessage(event.replyToken, {
//                     type: "text",
//                     text: "これはこれは"
//                 }));
//             }
//         }
//     });
//     Promise.all(events_processed).then(
//         (response) => {
//             console.log(`${response.length} event(s) processed.`);
//         }
//     );
// });

app.get('/ping', function(request, response) {
    response.send('pong!');
});

app.listen(process.env.PORT || 8080, function() {
    console.log('Node app is running on port :: ' + process.env.PORT || 8080);
});