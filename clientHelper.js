const mtgApi = require('./services/mtgApi');

const composeTextResponse = (texts) => {
    if (Array.isArray(texts)) {
      return texts.map(message => ({ type: 'text', text: message }));
    }
    return { type: 'text', text: texts }
};

const composeRichReplyForMtgApi = (card) => {
    if (!card) return { type: 'text', text: 'ごめん、有力なカード候補が見つかりません…' };
    return {
      type: 'template',
      altText: card.name,
      template: {
        type: 'buttons',
        //thumbnailImageUrl: card.imageUrl,
        title: card.name,
        text: card.name,
        actions: [{
            type: 'uri',
            label: 'Open on Wisdom Guild',
            uri: mtgApi.formatInfoUrl(card.name)
          }]
      }}
  };

const composeStickerResponse = (packageId, stickerId) => {
    return packageId & stickerId ? { packageId: packageId, stickerId: stickerId } : { packageId: '11539', stickerId: '52114115' };
}

const reply = (client, token, messages) => {
    return client.replyMessage(token, messages);
};

const push = (client, token, messages) => {
    return client.pushMessage(token, messages);
};

module.exports = {
    composeTextResponse,
    composeStickerResponse,
    composeRichReplyForMtgApi,
    reply,
    push
}