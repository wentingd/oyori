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

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(logger('dev'));

console.log(lineConfig.channelAccessToken);
console.log(lineConfig.channelSecret);

app.post('/webhook', line.middleware(lineConfig), (req, res, next) => {
    console.log(req.body);
    res.statusCode(200);
});

app.get('/ping', function(request, response) {
    response.send('pong!');
});

app.listen(process.env.PORT || 8080, function() {
    console.log('Node app is running on port :: ' + process.env.PORT || 8080);
});