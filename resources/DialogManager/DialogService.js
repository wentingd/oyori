if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  };

const request = require('request-promise-native');
const baseUrl = process.env.BASE_URL;

const getCurrentDialog = (userId) => {
    return getFromApi('/api/user/' + userId).catch(err => console.log(err));
};

const initDialog = async (userId, dialogId) => {
    const user = await getFromApi('/api/user/' + userId);
    const userData = {
        userId: userId,
        currentDialog: dialogId,
        currentStepCount: 1
    };
    if (user) {
        return putToApi ('/api/user/' + userId, userData)
    } else {
        return postToApi('/api/user', userData);
    };
};

const updateDialog = (userId, newDialog) => {
    return putToApi('/api/user/' + userId, newDialog).catch(err => console.log(err));
};

const updatePrompt = (userId, promptId, userInput) => {
    let newPrompt = {};
    newPrompt[promptId] = userInput;
    return patchToApi('/api/user/' + userId + '/prompt', newPrompt).catch(err => console.log(err));
};

const getDialogById = (dialogId) => {
    return getFromApi('/api/dialog/' + dialogId).catch(err => console.log(err));
}

const getFromApi = (action) => {
    const options = {
        method: 'GET',
        uri: baseUrl + action,
        json: true,
        //resolveWithFullResponse: true
    };
    return request(options);
};

const putToApi = (action, body) => {
    const options = {
        method: 'PUT',
        uri: baseUrl + action,
        body: body,
        json: true,
        //resolveWithFullResponse: true
    };
    return request(options);
};

const patchToApi = (action, body) => {
    const options = {
        method: 'PATCH',
        uri: baseUrl + action,
        body: body,
        json: true,
        //resolveWithFullResponse: true
    };
    return request(options);
};

const postToApi = (action, body) => {
    const options = {
        method: 'POST',
        uri: baseUrl + action,
        body: body,
        json: true,
        //resolveWithFullResponse: true
    };
    return request(options);
}

module.exports = {
    initDialog,
    getCurrentDialog,
    updateDialog,
    updatePrompt,
    getDialogById
}