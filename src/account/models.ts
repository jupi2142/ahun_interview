import mongoose, {Schema, Document} from 'mongoose';

interface IAccount extends Document {
  uid: string;
  phoneNumber: string;
  disabled?: boolean;
}

const accountSchema: Schema = new Schema({
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
});

// Not using methods and statics because TypeScript has poor support
export async function getOrCreateFromUserRecord(userRecord: any) {
  var account = await Account.findOne({uid: userRecord.uid});
  if(account == null){
    account = await Account.create({
      uid: userRecord.uid,
      phoneNumber: userRecord.phoneNumber,
    });
  }
  return account;

};

// Not using methods and statics because TypeScript has poor support
export async function getOrCreateUserForAccount(account: IAccount){
  var user = await mongoose.model('User').findOne({account: account});
  return user || await mongoose.model('User').create({account: account});
}

export const Account = mongoose.model<IAccount>('Account', accountSchema);
