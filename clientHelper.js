const reply = (client, token, messages) => {
    return client.replyMessage(token, messages);
};

const push = (client, token, messages) => {
    return client.pushMessage(token, messages);
}

module.exports = {
    reply,
    push
}