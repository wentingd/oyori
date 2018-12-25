const request = require('request-promise');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const apiBaseUri = process.env.AZURE_FACE_API_URI;
const groupName = process.env.AZURE_PERSON_GROUP_NAME;

const makeRequest = (options) => {
  return request({
    headers: {
      'content-type': 'application/json',
      'Ocp-Apim-Subscription-Key': process.env.AZURE_FACE_API_KEY1
      },
    json: true,
    ...options
  })
  .then(response => response)
  .catch(err => handleErr(err));
};

const handleErr = (errResponse) => {
  if (errResponse.error.error) {
    let { code, message } = errResponse.error.error;
    let finalMessage = '';
    switch (code) {
      case 'InvalidImage':
        finalMessage = 'Hey that is an invalide image. Sure you are not sending us the page?';
        break;
      default:
        finalMessage = message;
        break;
    }
    throw Error(finalMessage);
  }
  throw Error('Somehow, something went wrong but we dont know how...');
};

const formatErrMessage = (err) => {
  return err.message;
};

const formatGuessMessage = (guess) => {
  if (!guess.name) return 'Sorry, I know this face but cant remember the name...wanna help me out?'
  return 'This must be ' + guess.name.replace(/ +/g, "") + ', am I right?';
};

const detectFace = async (imgUrl) => {
  let options = {
    method: 'POST',
    uri: apiBaseUri + 'detect?returnFaceId=true',
    body: {
      url: imgUrl
    }
  }
  let result = await makeRequest(options);
  return result;
};

const identifyFace = async (groupId, faceId) => {
  let options = {
    method: 'POST',
    uri: apiBaseUri + 'identify',
    body: {
      'faceIds': [faceId],
      'personGroupId': groupId,
      'maxNumOfCandidatesReturned': 1
    }
  }
  let result = await makeRequest(options);
  return result;
};

const getPerson = async (groupId, faceId) => {
  let options = {
      method: 'GET',
      uri: apiBaseUri + 'persongroups/' + groupId + '/persons/' + faceId,
  }
  let result = await makeRequest(options);
  return result;
};

const recognizeFaceFromUrl = async (imgUrl) => {
  try {
    let detected = await detectFace(imgUrl);
    if (detected.length <= 0) {
      throw new Error('You must be playing with me. This is not a face right :)')
    }
    let identified = await identifyFace(groupName, detected[0].faceId);
    if (identified.length <= 0 || identified[0].candidates.length <= 0) {
      throw new Error('This is someone new to me. Wanna tell me about it more?')
    }
    let guess = await getPerson(groupName, identified[0].candidates[0].personId);
    return formatGuessMessage(guess);
  } catch (err) {
    return formatErrMessage(err);
  }
};

module.exports = { recognizeFaceFromUrl };
