

const composeTextResponse = (texts) => {
    if (Array.isArray(texts)) {
      return texts.map(message => ({ type: 'text', text: message }));
    }
    return { type: 'text', text: texts }
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
    reply,
    push
}