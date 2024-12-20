const OverdueOrder = require('../models/OverdueOrder');
const Order = require('../models/Order');

exports.createOverdueOrder = async (order) => {
    try {
        const overdueDays = this.calculateOverdueDays(order.dueDate);
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
        }
    } catch (error) {
        throw new Error('Error creating overdue order: ' + error.message);
    }
};

exports.calculateOverdueDays = (dueDate) => {
    const today = new Date();
    const diffTime = today - new Date(dueDate);
    return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24))); 
};
