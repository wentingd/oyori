const mtgApi = require('../services/mtgApi');
const faceApi = require('../services/faceApi');
const baseURL = process.env.BASE_URL;
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

const handleText = async (message, source) => {
    const buttonsImageURL = `${baseURL}/static/buttons/1040.jpg`;
    switch (message.text) {
      case 'profile':
        if (source.userId) {
          return client.getProfile(source.userId)
            .then((profile) => composeTextResponse([
              `Display name: ${profile.displayName}`,
              `Status message: ${profile.statusMessage}`,
            ]));
        } else {
          return composeTextResponse('Bot can\'t use profile API without user ID');
        }
      case 'buttons':
        return {
            type: 'template',
            altText: 'Buttons alt text',
            template: {
              type: 'buttons',
              thumbnailImageUrl: buttonsImageURL,
              title: 'My button sample',
              text: 'Hello, my button',
              actions: [
                { label: 'Go to line.me', type: 'uri', uri: 'https://line.me' },
                { label: 'Say hello1', type: 'postback', data: 'hello こんにちは' },
                { label: '言 hello2', type: 'postback', data: 'hello こんにちは', text: 'hello こんにちは' },
                { label: 'Say message', type: 'message', text: 'Rice=米' },
              ],
            },
          };
      case 'confirm':
        return {
            type: 'template',
            altText: 'Confirm alt text',
            template: {
              type: 'confirm',
              text: 'Do it?',
              actions: [
                { label: 'Yes', type: 'message', text: 'Yes!' },
                { label: 'No', type: 'message', text: 'No!' },
              ],
            },
          }
      case 'carousel':
        return {
            type: 'template',
            altText: 'Carousel alt text',
            template: {
              type: 'carousel',
              columns: [
                {
                  thumbnailImageUrl: buttonsImageURL,
                  title: 'hoge',
                  text: 'fuga',
                  actions: [
                    { label: 'Go to line.me', type: 'uri', uri: 'https://line.me' },
                    { label: 'Say hello1', type: 'postback', data: 'hello こんにちは' },
                  ],
                },
                {
                  thumbnailImageUrl: buttonsImageURL,
                  title: 'hoge',
                  text: 'fuga',
                  actions: [
                    { label: '言 hello2', type: 'postback', data: 'hello こんにちは', text: 'hello こんにちは' },
                    { label: 'Say message', type: 'message', text: 'Rice=米' },
                  ],
                },
              ],
            },
          }
      case 'image carousel':
        return {
            type: 'template',
            altText: 'Image carousel alt text',
            template: {
              type: 'image_carousel',
              columns: [
                {
                  imageUrl: buttonsImageURL,
                  action: { label: 'Go to LINE', type: 'uri', uri: 'https://line.me' },
                },
                {
                  imageUrl: buttonsImageURL,
                  action: { label: 'Say hello1', type: 'postback', data: 'hello こんにちは' },
                },
                {
                  imageUrl: buttonsImageURL,
                  action: { label: 'Say message', type: 'message', text: 'Rice=米' },
                },
                {
                  imageUrl: buttonsImageURL,
                  action: {
                    label: 'datetime',
                    type: 'datetimepicker',
                    data: 'DATETIME',
                    mode: 'datetime',
                  },
                },
              ]
            },
          }
      case 'datetime':
        return {
            type: 'template',
            altText: 'Datetime pickers alt text',
            template: {
              type: 'buttons',
              text: 'Select date / time !',
              actions: [
                { type: 'datetimepicker', label: 'date', data: 'DATE', mode: 'date' },
                { type: 'datetimepicker', label: 'time', data: 'TIME', mode: 'time' },
                { type: 'datetimepicker', label: 'datetime', data: 'DATETIME', mode: 'datetime' },
              ],
            },
          }
      case 'imagemap':
        return {
            type: 'imagemap',
            baseUrl: `${baseURL}/static/rich`,
            altText: 'Imagemap alt text',
            baseSize: { width: 1040, height: 1040 },
            actions: [
              { area: { x: 0, y: 0, width: 520, height: 520 }, type: 'uri', linkUri: 'https://store.line.me/family/manga/en' },
              { area: { x: 520, y: 0, width: 520, height: 520 }, type: 'uri', linkUri: 'https://store.line.me/family/music/en' },
              { area: { x: 0, y: 520, width: 520, height: 520 }, type: 'uri', linkUri: 'https://store.line.me/family/play/en' },
              { area: { x: 520, y: 520, width: 520, height: 520 }, type: 'message', text: 'URANAI!' },
            ],
            video: {
              originalContentUrl: `${baseURL}/static/imagemap/video.mp4`,
              previewImageUrl: `${baseURL}/static/imagemap/preview.jpg`,
              area: {
                x: 280,
                y: 385,
                width: 480,
                height: 270,
              },
              externalLink: {
                linkUri: 'https://line.me',
                label: 'LINE'
              }
            },
          }
    //   case 'bye':
    //     switch (source.type) {
    //       case 'user':
    //         return replyText(replyToken, 'Bot can\'t leave from 1:1 chat');
    //       case 'group':
    //         return replyText(replyToken, 'Leaving group')
    //           .then(() => client.leaveGroup(source.groupId));
    //       case 'room':
    //         return replyText(replyToken, 'Leaving room')
    //           .then(() => client.leaveRoom(source.roomId));
    //     }
      default:
        console.log(`[ResponseController.handleText] return with case default`);
        return await getDefaultReply(message);
    }
}

const getDefaultReply = async (message) => {
  const { text } = message;
  const tokens = tokenizer.tokenize(text);
  console.log('tokenized :: ' + tokens);
  if (text.indexOf('http') > -1) {
      const personGuess = await faceApi.recognizeFaceFromUrl(text);
      return composeTextResponse(personGuess);
  }
  const cardGuesses = await mtgApi.getCardRecommendations(text);
  return cardGuesses.map(card => composeRichReplyForMtgApi(card));
};

const composeTextResponse = (textContent) => {
  return { type: 'text', text: textContent }
};

const composeRichReplyForMtgApi = (card) => {
  if (!card) return { type: 'text', text: 'ごめん、有力なカード候補が見つかりません…' };
  return {
    type: 'template',
    altText: card.name,
    template: {
      type: 'buttons',
      thumbnailImageUrl: card.imageUrl,
      title: card.name,
      text: card.name,
      actions: [
        {
          type: 'uri',
          label: 'Open on Wisdom Guild',
          uri: mtgApi.formatInfoUrl(card.name)
        }]
    }}
};

const handleImage = (message, source) => {
  return composeTextResponse('I wonder what picture is this?');
}

const handleVideo = (message, source) => {
  return composeTextResponse('わ、面白い！');
}

const handleAudio = (message, source) => {
  return composeTextResponse('嬉しいけど、音声はまだ聞き取れないです><');
}

const handleLocation = (message, source) => {
  return composeTextResponse('今そこにいるんですね。ちょっと待ってくださいー');
}

const handleSticker = (message, source) => {
  return { type: 'sticker', packageId: '11539', stickerId: '52114115' }
}

module.exports = {
  handleText,
  handleAudio,
  handleImage,
  handleLocation,
  handleSticker,
  handleVideo
};