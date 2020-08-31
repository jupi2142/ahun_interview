var mongoose = require('mongoose');

var accountSchema = new mongoose.Schema({
  uid: {
    type: String,
    match: /^\w{28}$/,
    index: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    match: /^\+\d{12}$/,
    index: true,
    unique: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  /* userId: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: 'User',
  }, */
});

export var Account = mongoose.model('Account', accountSchema);
