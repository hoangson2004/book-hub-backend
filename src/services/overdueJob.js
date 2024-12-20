const cron = require('node-cron');
const OverdueOrder = require('../models/OverdueOrder');
const Order = require('../models/Order');
const { calculateOverdueDays } = require('../services/overdue'); 

cron.schedule('0 0 * * *', async () => {
  console.log('Running daily overdue penalty calculation...');

  const orders = await Order.find({ status: 'Overdue' });

  for (const order of orders) {
    const overdueDays = calculateOverdueDays(order.dueDate);

    if (overdueDays > 0) {
      const penaltyAmount = order.depositAmount * 0.05 * overdueDays; 

      let overdueOrder = await OverdueOrder.findOne({ orderId: order._id });

      if (!overdueOrder) {
        overdueOrder = new OverdueOrder({
          orderId: order._id,
          userId: order.userId,
          overdueDays,
          totalPenalty: penaltyAmount,
        });
        await overdueOrder.save();
      } else {
        overdueOrder.totalPenalty += penaltyAmount;
        overdueOrder.overdueDays = overdueDays;
        await overdueOrder.save();
      }


      await order.save(); 

      console.log(`Overdue penalty calculated for Order ID: ${order._id}, Penalty: ${penaltyAmount}`);
    }
  }
});

