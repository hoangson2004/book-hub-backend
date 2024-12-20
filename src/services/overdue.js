const OverdueOrder = require('../models/OverdueOrder');
const Order = require('../models/Order');

exports.createOverdueOrder = async ({ userId, items, totalAmount, paymentMethod, dueDate }) => {
    try {
        const order = new Order({
            userId,
            items,
            totalAmount,
            paymentMethod,
            dueDate,
        });

        await order.save();
        return order;
    } catch (error) {
        throw new Error('Error creating order: ' + error.message);
    }
};

// Tính tiền phạt cho đơn hàng quá hạn
exports.calculateAndUpdateOverdue = async (order) => {
    const overdueDays = this.calculateOverdueDays(order.dueDate);
    if (overdueDays > 0) {
        // Tiền phạt sẽ trừ từ tiền cọc
        const penaltyAmount = order.depositAmount * 0.05 * overdueDays; // Phạt 5% tiền cọc mỗi ngày quá hạn
        
        let overdueOrder = await OverdueOrder.findOne({ orderId: order._id });
        
        if (!overdueOrder) {
            // Tạo mới OverdueOrder nếu chưa có
            overdueOrder = new OverdueOrder({
                orderId: order._id,
                userId: order.userId,
                overdueDays,
                totalPenalty: penaltyAmount,
            });
            await overdueOrder.save();
        } else {
            // Cập nhật tiền phạt nếu đã có
            overdueOrder.totalPenalty += penaltyAmount;
            overdueOrder.overdueDays = overdueDays;
            await overdueOrder.save();
        }
        
        // Trừ tiền cọc trong Order sau khi tính phạt
        order.depositAmount -= penaltyAmount;
        if (order.depositAmount < 0) {
            order.depositAmount = 0; // Nếu tiền cọc âm, đặt về 0
        }

        await order.save();
    }
};

// Tính số ngày quá hạn
exports.calculateOverdueDays = (dueDate) => {
    const today = new Date();
    const diffTime = today - new Date(dueDate);
    return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24))); // Tính số ngày quá hạn
};
