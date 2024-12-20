const mongoose = require('mongoose');
const { Schema } = mongoose;

const overdueOrderSchema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true }, 
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
  overdueDays: { type: Number, required: true }, 
  totalPenalty: { type: Number, required: true },
});

const OverdueOrder = mongoose.model('OverdueOrder', overdueOrderSchema);

module.exports = OverdueOrder;
