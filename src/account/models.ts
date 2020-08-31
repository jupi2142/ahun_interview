import mongoose, {Schema, Document} from 'mongoose';

interface IAccount extends Document {
  uid: string;
  phoneNumber: string;
  disabled: boolean;
}

const accountSchema : Schema = new Schema({
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

export const Account = mongoose.model<IAccount>('Account', accountSchema);
