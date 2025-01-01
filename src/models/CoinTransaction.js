const mongoose = require('mongoose');
const { Schema } = mongoose;

const coinTransactionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
  amount: { type: Number, required: true }, 
  type: { type: String, enum: ['Deposit', 'Withdraw'], required: true }, 
  status: { type: String, enum: ['Pending', 'Success', 'Failed'], default: 'Pending' },
  transactionId: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now }, 
  updatedAt: { type: Date, default: Date.now },
});

coinTransactionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const CoinTransaction = mongoose.model('CoinTransaction', coinTransactionSchema);

module.exports = CoinTransaction;
