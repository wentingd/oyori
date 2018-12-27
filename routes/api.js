const express = require('express');
const router = express.Router();
const dialogs = require('../resources/dialogs')
const db = require('mongoose');
const User = db.model('User');

router.get('/dialog', (req, res, next) => {
    res.json(dialogs);
});

router.get('/dialog/:id', async (req, res, next) => {
    const dialogId = req.params.id;
    const targetDialog = dialogs.filter(dialog => dialog.id = dialogId)[0];
    res.json(targetDialog);
});

router.post('/user', (req, res) => {
    User.findOne({
        destinationId: req.body.destinationId
    }).then(existingUser => {
        if (existingUser) {
            res.json({msg: 'existing user'});
        } else {
            User.create(req.body).then(result => res.json(result));
        }
    }).catch(err => console.log(err));
});

router.put('/user/conversation', (req, res) => {
    User.findOne({
        destinationId: req.body.destinationId
    }).then(existingUser => {
        if (existingUser) {
            User.updateOne({
                currentDialog: req.body.currentDialog,
                currentStep: req.body.currentStep
            }).then(result => res.json(result));
        } else {
            User.create(req.body).then(result => res.json(result));
        }
    }).catch(err => console.log(err));
});

module.exports = router;