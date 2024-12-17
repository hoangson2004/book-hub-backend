const mongoose = require('mongoose');
const { Schema } = mongoose;

const coinSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
  balance: { type: Number, default: 0 }, 
  updatedAt: { type: Date, default: Date.now },
});

coinSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Coin = mongoose.model('Coin', coinSchema);

module.exports = Coin;
