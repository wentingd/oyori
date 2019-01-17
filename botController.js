
const { detectUserLang, guessIntentWithLang, generateRandomGreetings, generateWeatherGreeting } = require('./resources/nlp');
const { mainMenu } = require('./resources/reply/quickReply');
const { composeTextResponse, composeStickerResponse } = require('./clientHelper');
const { Dialog, DialogService } = require('./resources/DialogManager');

const handleText = async (message, source) => {
  const { text } = message;
  const { userId } = source;
  const topIntent = guessIntentWithLang(text, detectUserLang(text));
  if (source.type !== 'user'){
    return composeTextResponse('すみません、グループチャットでの対話はまだ苦手です...')
  };
  // first check if there is an ongoing dialog
  const { currentDialog, currentStepCount, prompt } = await DialogService.getCurrentDialog(userId) || {};
  if (!currentDialog){
    switch (topIntent) {
      case 'navigation':
        return mainMenu;
        break;
      case 'greeting':
        return composeTextResponse([generateRandomGreetings(), await generateWeatherGreeting()]);
        break;
      case 'yes':
        return composeTextResponse('同じ意見で嬉しいです :)');
        break;
      case 'no':
        return composeTextResponse('そっかー');
        break;
      case 'card search':
        return await subscribeToDialogById(source.userId, '1', text);
        break;
      case 'shop search':
        return await subscribeToDialogById(source.userId, '2', text);
        break;
      case 'face recognition':
        return await subscribeToDialogById(source.userId, '3', text);
        break;
      default:
        return [composeTextResponse('ごめんなさい、今のをよく理解できなかった...'), mainMenu];
        break;
    }
  };
  console.log(`Existing dialog detected. Dialog ID is ${currentDialog}`)
  if (topIntent === 'cancel'){
    return await cancelDialogById(userId, currentDialog);
  } else {
    return await returnToCurrentDialog(userId, currentDialog, currentStepCount, text, prompt);
  }
}

const subscribeToDialogById = async (userId, dialogId, userText) => {
  const dialogContents = await DialogService.getDialogById(dialogId);
  const dialog = new Dialog(dialogContents);
  return await dialog.init(userId, dialogId, userText);
};

const cancelDialogById = async (userId, dialogId) => {
  const dialogContents = await DialogService.getDialogById(dialogId);
  const dialog = new Dialog(dialogContents);
  return await dialog.cancel(userId, dialogId);
};

const returnToCurrentDialog = async (userId, dialogId, currentStepCount, userText, prompt) => {
  const dialogContents = await DialogService.getDialogById(dialogId);
  const dialog = new Dialog(dialogContents);
  return await dialog.continue(userId, dialogId, currentStepCount, userText, prompt);
};

const handleLocation = async (message, source) => {
  const { userId } = source;
  const { currentDialog } = await DialogService.getCurrentDialog(userId);
  if (currentDialog === '2'){
    const recommendations = await googlePlaceApi.getShopNearby(message);
    console.log(recommendations)
    return composeTextResponse('wip');
  } else {
    return composeTextResponse('うん?どうしたんですか?')
  };
}

const handleImage = (message, source) => {
  return composeTextResponse('I wonder what picture is this?');
}

const handleUnknown = (message, source) => {
  return composeTextResponse('嬉しいけど、このタイプのメッセージはまだ読み取れないんです><');
}

const handleSticker = (message, source) => {
  return composeStickerResponse();
}

module.exports = {
  handleText,
  handleLocation,
  handleImage,
  handleSticker,
  handleUnknown
};