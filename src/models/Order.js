const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }, // Giá của sách
    }
  ],
  totalAmount: { type: Number, required: true }, // Tổng tiền (tiền cọc + tiền thuê)
  depositAmount: { type: Number, required: true }, // Tiền cọc
  rentalAmount: { type: Number, required: true }, // Tiền thuê
  paymentMethod: { type: String, enum: ['Coin', 'Cash'], default: 'Coin' },
  status: { 
    type: String, 
    enum: ['Pending', 'Processing', 'Completed', 'Cancelled', 'Overdue'], 
    default: 'Pending' 
  },
  dueDate: { type: Date, required: true }, // Ngày hết hạn (trả sách)
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
