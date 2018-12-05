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

app.get('/', function(request, response) {
    response.send('Hello World!');
});

app.post('/webhook', line.middleware(lineConfig), (req, res, next) => {
    res.status(200);
    console.log(req.body);
});

// app.post('/callback', function(req, res){

//   async.waterfall([
//       // ぐるなびAPI
//       function(callback) {

//           const json = req.body;

//           // 受信テキスト
//           const search_place = json['result'][0]['content']['text'];
//           const search_place_array = search_place.split("\n");

//           //検索キーワード
//           const gnavi_keyword = "";
//           if(search_place_array.length == 2){
//               const keyword_array = search_place_array[1].split("、");
//               gnavi_keyword = keyword_array.join();
//           }

//           // ぐるなびAPI レストラン検索API
//           const gnavi_url = 'http://api.gnavi.co.jp/RestSearchAPI/20150630/';
//           // ぐるなび リクエストパラメータの設定
//           const gnavi_query = {
//               "keyid":"<ぐるなびのアクセスキー>",
//               "format": "json",
//               "address": search_place_array[0],
//               "hit_per_page": 1,
//               "freeword": gnavi_keyword,
//               "freeword_condition": 2
//           };
//           const gnavi_options = {
//               url: gnavi_url,
//               headers : {'Content-Type' : 'application/json; charset=UTF-8'},
//               qs: gnavi_query,
//               json: true
//           };

//           // 検索結果をオブジェクト化
//           const search_result = {};

//           request.get(gnavi_options, function (error, response, body) {
//               if (!error && response.statusCode == 200) {
//                   if('error' in body){
//                       console.log("検索エラー" + JSON.stringify(body));
//                       return;
//                   }

//                   // 店名
//                   if('name' in body.rest){
//                       search_result['name'] = body.rest.name;
//                   }
//                   // 画像
//                   if('image_url' in body.rest){
//                       search_result['shop_image1'] = body.rest.image_url.shop_image1;
//                   }
//                   // 住所
//                   if('address' in body.rest){
//                       search_result['address'] = body.rest.address;
//                   }
//                   // 緯度
//                   if('latitude' in body.rest){
//                       search_result['latitude'] = body.rest.latitude;
//                   }
//                   // 経度
//                   if('longitude' in body.rest){
//                       search_result['longitude'] = body.rest.longitude;
//                   }
//                   // 営業時間
//                   if('opentime' in body.rest){
//                       search_result['opentime'] = body.rest.opentime;
//                   }

//                   callback(null, json, search_result);

//               } else {
//                   console.log('error: '+ response.statusCode);
//               }
//           });

//       },
//   ],

//   // LINE BOT
//   function(err, json, search_result) {
//       if(err){
//           return;
//       }

//       //ヘッダーを定義
//       const headers = {
//           'Content-Type' : 'application/json; charset=UTF-8',
//           'X-Line-ChannelID' : '<Your Channel ID>',
//           'X-Line-ChannelSecret' : '<Your Channel Secret>',
//           'X-Line-Trusted-User-With-ACL' : '<Your MID>'
//       };

//       // 送信相手の設定（配列）
//       const to_array = [];
//       to_array.push(json['result'][0]['content']['from']);


//       // 送信データ作成
//       const data = {
//           'to': to_array,
//           'toChannel': 1383378250, //固定
//           'eventType':'140177271400161403', //固定
//           "content": {
//               "messageNotified": 0,
//               "messages": [
//                   // テキスト
//                   {
//                       "contentType": 1,
//                       "text": 'こちらはいかがですか？\n【お店】' + search_result['name'] + '\n【営業時間】' + search_result['opentime'],
//                   },
//                   // 画像
//                   {
//                       "contentType": 2,
//                       "originalContentUrl": search_result['shop_image1'],
//                       "previewImageUrl": search_result['shop_image1']
//                   },
//                   // 位置情報
//                   {
//                       "contentType":7,
//                       "text": search_result['name'],
//                       "location":{
//                           "title": search_result['address'],
//                           "latitude": Number(search_result['latitude']),
//                           "longitude": Number(search_result['longitude'])
//                       }
//                   }
//               ]
//           }
//       };

//       //オプションを定義
//       const options = {
//           url: 'https://trialbot-api.line.me/v1/events',
//           proxy : process.env.FIXIE_URL,
//           headers: headers,
//           json: true,
//           body: data
//       };

//       request.post(options, function (error, response, body) {
//           if (!error && response.statusCode == 200) {
//               console.log(body);
//           } else {
//               console.log('error: '+ JSON.stringify(response));
//           }
//       });

//   });

// });

app.listen(process.env.PORT || 8080, function() {
    console.log('Node app is running on port :: ' + process.env.PORT || 8080);
});