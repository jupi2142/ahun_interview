var mongoose = require('mongoose');

var accountSchema = new mongoose.Schema({});

var Account = mongoose.model('Account', accountSchema);

exports.Account = Account;
