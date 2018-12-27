const express = require('express');
const router = express.Router();
const dialogs = require('./dialogs')

router.get('/dialog', (req, res, next) => {
    res.json(dialogs);
});

router.get('/dialog/:id', (req, res, next) => {
    const dialogId = req.params.id;
    const targetDialog = dialogs.filter(dialog => dialog.id = dialogId)[0];
    res.json(targetDialog);
});

module.exports = router;