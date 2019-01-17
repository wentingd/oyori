const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoConnectionString = process.env.MONGO_CONNECTION_STRING || 'mongodb://localhost:27017/oyori';

const User = new Schema({
    name: String,
    location: String,
    userId: String,
    currentDialog: String,
    currentStepCount: Number,
    prompt: Schema.Types.Mixed
});

mongoose.model('User', User);
mongoose.connect(mongoConnectionString, {
    useNewUrlParser: true,
    keepAlive: true
})
.then(() => console.log(`Connected to Mongo at : ${mongoConnectionString}`))
.catch(err => console.log(err));
