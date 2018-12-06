const request = require('request-promise');

require('dotenv').config();

const apiBaseUri = process.env.AZURE_FACE_API_URI;
const groupName = process.env.GROUP_NAME;

const makeRequest = (options) => {
    return request({
      headers: {
        'content-type': 'application/json',
        'Ocp-Apim-Subscription-Key': process.env.AZURE_FACE_API_KEY1
        },
      json: true,
      ...options
    })
    .then(response => {
      return response;
    })
    .catch(err => {
      return err;
    });
};

const detectFace = (imgUrl) => {
    let options = {
      method: 'POST',
      uri: apiBaseUri + 'detect?returnFaceId=true',
      body: {
        url: imgUrl
      }
    }
    return makeRequest(options).then(response => validateResponse(response));
}

const identifyFace = (groupId, faceId) => {
    let options = {
      method: 'POST',
      uri: apiBaseUri + 'identify',
      body: {
        'faceIds': [faceId],
        'personGroupId': groupId,
        'maxNumOfCandidatesReturned': 1
      }
    }
    return makeRequest(options).then(response => validateResponse(response));
}
  
const getPerson = (groupId, faceId) => {
    let options = {
        method: 'GET',
        uri: apiBaseUri + 'persongroups/' + groupId + '/persons/' + faceId,
    }
    return makeRequest(options).then(response => validateResponse(response));
}

const recognizeFaceFromUrl = async (imgUrl) => {
    await detectFace(imgUrl)
    .then(result => result[0].faceId)
    .then(detectedFaceId => {
        return identifyFace(groupName, detectedFaceId)
        .then(result => result[0].candidates[0].personId)
    })
    .then(identifiedFaceId => {
        return getPerson(groupName, identifiedFaceId)
        .then(result => result.name)
    })
    .catch(err => console.log(err));
};

module.exports = { recognizeFaceFromUrl };