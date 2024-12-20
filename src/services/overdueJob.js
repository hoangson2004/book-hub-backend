const cron = require('node-cron');
const OverdueOrder = require('../models/OverdueOrder');
const Order = require('../models/Order');

// Cron job tính tiền phạt cho các đơn hàng quá hạn mỗi ngày
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily overdue penalty calculation...');

  // Lấy tất cả các đơn hàng có trạng thái "Completed"
  const orders = await Order.find({ status: 'Completed' });

  for (const order of orders) {
    // Tính số ngày quá hạn từ ngày đến hạn
    const overdueDays = calculateOverdueDays(order.dueDate);

    // Nếu số ngày quá hạn lớn hơn 0, tiến hành tính phạt
    if (overdueDays > 0) {
      const penaltyAmount = order.depositAmount * 0.05 * overdueDays; // Phạt 5% tiền cọc mỗi ngày quá hạn
      
      // Kiểm tra xem đã có OverdueOrder cho đơn hàng này chưa
      let overdueOrder = await OverdueOrder.findOne({ orderId: order._id });

      if (!overdueOrder) {
        console.log(`No overdue order found for Order ID: ${order._id}. Skipping penalty calculation.`);
        continue;  // Nếu không có OverdueOrder, bỏ qua
      }

      // Cập nhật tiền phạt và số ngày quá hạn
      const updatedOverdueOrder = await OverdueOrder.findOneAndUpdate(
        { orderId: order._id },
        { 
          $inc: { totalPenalty: penaltyAmount },  // Cộng thêm tiền phạt vào
          overdueDays: overdueDays               // Cập nhật số ngày quá hạn
        },
        { new: true }  // Trả về bản ghi đã được cập nhật
      );

      // Kiểm tra nếu việc cập nhật thành công
      if (updatedOverdueOrder) {
        // In ra thông báo đã tính tiền phạt
        console.log(`Overdue penalty calculated for Order ID: ${order._id}, Penalty: ${penaltyAmount}`);
      }
    }
  }
});

// Tính số ngày quá hạn
const calculateOverdueDays = (dueDate) => {
  const today = new Date();
  const diffTime = today - new Date(dueDate);

  // Tính số ngày quá hạn, nếu không quá hạn thì trả về 0
  return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24))); // Tính số ngày quá hạn
};
