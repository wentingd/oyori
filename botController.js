
const { detectUserLang, guessIntentWithLang, generateRandomGreetings, generateWeatherGreeting } = require('./resources/nlp');
const { mainMenu } = require('./resources/reply/quickReply');
const { composeTextResponse, composeStickerResponse, composeRichReplyForShop } = require('./clientHelper');
const { Dialog, DialogService } = require('./resources/DialogManager');
const googlePlaceApi = require('./services/googlePlaceApi');
const mtgCardFinderDialog = require('./resources/dialogs/mtgCardFinder');
const mtgShopFinderDialog = require('./resources/dialogs/mtgShopFinder');

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
  const contents = await DialogService.getDialogById(dialogId);
  const dialog = new Dialog(contents);
  return await dialog.init(userId, dialogId, userText);
};

const cancelDialogById = async (userId, dialogId) => {
  const contents = await DialogService.getDialogById(dialogId);
  const dialog = new Dialog(contents);
  return await dialog.cancel(userId, dialogId);
};

const returnToCurrentDialog = async (userId, dialogId, currentStepCount, userText, prompt) => {
  const contents = await DialogService.getDialogById(dialogId);
  // TODO: find a way to get finalReplyHandler by dialog ID
  const { finalReplyHandler } = dialogId === '1' ? mtgCardFinderDialog : {};
  const dialog = new Dialog(contents, finalReplyHandler);
  return await dialog.continue(userId, dialogId, currentStepCount, userText, prompt);
};

const handleLocation = async (message, source) => {
  const { userId } = source;
  const { currentDialog } = await DialogService.getCurrentDialog(userId);
  if (currentDialog === '2'){
    const recommendations = await googlePlaceApi.getShopNearby(message);
    if (recommendations) {
      return recommendations.map(place => composeRichReplyForShop(place));
    } else {
      return composeTextResponse('残念、この近くショップを見つからなかったです...')
    }
  } else {
    return composeTextResponse('もしかして、カードショップを探したい?それなら"menu"って入力してみて!')
  };
}

const handleImage = (message, source) => {
  return composeTextResponse('I wonder what picture is this?');
}

const handleUnknown = (message, source) => {
  return composeTextResponse('このタイプのメッセージはまだ読み取れないんです><');
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