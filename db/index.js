const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dbName = process.env.DB_NAME || 'oyori';
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/';

const User = new Schema({
    name: String,
    location: String,
    userId: String,
    currentDialog: String,
    currentStepCount: Number,
    prompt: Schema.Types.Mixed
});

console.log(`Mongo URL : ${mongoUrl}${dbName}`);

mongoose.model('User', User);
mongoose.connect(mongoUrl, {
    dbName: dbName,
    useNewUrlParser: true,
    keepAlive: true
})
.catch(err => console.log(err));