const reply = (client, token, messages) => {
    return client.replyMessage(token, messages);
};

module.exports = {
    reply
}