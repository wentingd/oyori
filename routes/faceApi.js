const recognizeFaceFromUrl = () => {
    detectFace('https://pbs.twimg.com/profile_images/752241396/takeshimeigen_400x400.jpg')
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
}