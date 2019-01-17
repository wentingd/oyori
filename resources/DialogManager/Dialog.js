const { composeTextResponse } = require('../../clientHelper');
const { dialogConfig } = require('./config');
const DialogService = require('./DialogService');
// refactor this later
const { guessIntentWithLang } = require('../nlp');
const mtgApi = require('../../services/mtgApi');
const { composeRichReplyForMtgApi } = require('../../clientHelper');

function Dialog (dialogBody) {
    this.steps = dialogBody.steps;
};

Dialog.prototype.init = async function(userId, dialogId, userText){
    console.log(`[Dialog] At step 0 in dialog with ${this.steps.length} steps`);
    const currentStep = this.steps[0];
    await DialogService.initDialog(userId, dialogId);
    return composeTextResponse(currentStep.message);
};

Dialog.prototype.continue = async function(userId, dialogId, currentStepCount, userText, prompt){
    console.log(`[Dialog] At step ${currentStepCount} in dialog with ${this.steps.length} steps`);
    const currentStep = this.steps[parseInt(currentStepCount)];
    const lastStep = this.steps[parseInt(currentStepCount)-1];
    //update userText into prompt if lastStep was a prompt
    if (lastStep.type === 'prompt') await updatePrompt(userId, lastStep, userText);

    //end Dialog
    if (currentStepCount >= this.steps.length) {
        await DialogService.updateDialog(userId, {
            currentDialog: '',
            currentStepCount: 0,
        });
        return await cardSearchResult(prompt);
    }
    //if not end, increment & continue
    await DialogService.updateDialog(userId, {
        currentDialog: dialogId,
        currentStepCount: currentStepCount + 1
    });
    return composeTextResponse(currentStep.message);
};

Dialog.prototype.cancel = async function(userId, dialogId){
    const result = await DialogService.initDialog(userId, '');
    return composeTextResponse(dialogConfig.cancelDialogMsg);
};

const updatePrompt = async (userId, step, userText) => {
    const topIntent = guessIntentWithLang(userText);
    const { promptId } = step;
    if (topIntent === 'no' ) {
        console.log('here')
        await DialogService.updatePrompt(userId, promptId, '');
        return;
    };
    await DialogService.updatePrompt(userId, promptId, userText);
    return;
}

// refactor this later
const cardSearchResult = async (cardParams) => {
    const { cardName, cardType, cardSubType, cardRuleText } = cardParams || {};
    let cardGuesses = [];
    if (cardName) {
        cardGuesses = await mtgApi.getCardByName(cardName);
    } else {
        cardGuesses = await mtgApi.getCardByTypeAndRule(cardSubType, cardRuleText, 1);
    }
    return cardGuesses.map(card => composeRichReplyForMtgApi(card));
};

module.exports = Dialog;