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

const composeRichReplyForShop = (shop) => {
    if (!shop) return { type: 'text', text: 'すみません、ショップを見つからなかったです…' };
    return {
        type: 'template',
        altText: shop.name,
        template: {
            type: 'buttons',
            title: shop.name,
            text: shop.vicinity + ' : ' +  shop.opening_hours.open_now ? '営業中' : '営業時間外',
            actions: [{
                type: 'uri',
                label: 'Google Map',
                uri: `https://www.google.com/maps/search/?api=1&query=shop&query_place_id=${shop.place_id}`
            }]
        }
    }
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
    composeRichReplyForShop,
    reply,
    push
}