const { composeTextResponse } = require('../../clientHelper');
const { dialogConfig } = require('./config');
const initialStep = dialogConfig.initialStep;

function Dialog (id, name, steps) {
    this.id = id;
    this.name = name;
    this.steps = steps;
    this.currentStep = 0;
    this.initialStep = initialStep;
};

Dialog.prototype.start = function(){
    if (this.currentStep === initialStep){
        return composeTextResponse(this.steps ? this.steps[initialStep].prompt: dialogConfig.noStepPromptMsg);
    } else {
        this.currentStep += 1;
        return composeTextResponse(this.steps ? this.steps[this.currentStep].prompt : dialogConfig.noStepPromptMsg);
    }
}

Dialog.prototype.cancel = function(){
    this.currentStep = initialStep;
    return composeTextResponse(dialogConfig.cancelDialogMsg);
}

module.exports = Dialog;