const mongoose = require('mongoose');
const mongoDB = 'mongodb://localhost/Livros';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
module.exports = mongoose;