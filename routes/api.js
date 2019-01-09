const express = require('express');
const router = express.Router();
const dialogs = require('../resources/dialogs')
const db = require('mongoose');
const User = db.model('User');

router.get('/dialog', (req, res, next) => {
    res.json(dialogs);
});

router.get('/dialog/:id', async (req, res) => {
    const targetDialog = dialogs.filter(dialog => dialog.id === req.params.id)[0];
    if (targetDialog) return res.status(200).json(targetDialog)
    return res.status(404).json({msg: 'no dialog found'});
});

router.get('/user/:id', (req, res) => {
    User.findOne({
        userId: req.params.id
    }).then(existingUser => {
        if (existingUser) {
            res.status(200).json(existingUser);
        } else {
            res.status(200).json({'msg': 'no such user'});
        }
    }).catch(err => console.log(err));
});

router.post('/user', (req, res) => {
    User.findOne({
        userId: req.body.userId
    }).then(existingUser => {
        if (existingUser) {
            res.status(200).json({msg: 'existing user'});
        } else {
            console.log('register a new user');
            User.create(req.body).then(result => res.status(200).json(result));
        }
    }).catch(err => console.log(err));
});

router.put('/user/:id', (req, res) => {
    const { currentDialog, currentStepCount } = req.body;
    User.findOne({
        userId: req.params.id
    }).then(existingUser => {
        if (existingUser) {
            User.updateOne({
                currentDialog: currentDialog,
                currentStepCount: currentStepCount
            }).then(result => res.status(200).json(result));
        } else {
            User.create(req.body).then(result => res.status(200).json(result));
        }
    }).catch(err => console.log(err));
});

router.patch('/user/:id/prompt', (req, res) => {
    User.findOne({
        userId: req.params.id
    }).then(existingUser => {
        if (existingUser) {
            User.updateOne({
                prompt: {
                    ...existingUser._doc.prompt,
                    ...req.body
                }
            }).then(result => res.status(200).json(result));
        }
    }).catch(err => console.log(err));
});

module.exports = router;