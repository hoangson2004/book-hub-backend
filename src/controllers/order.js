const orderService = require('../services/order');

exports.createOrder = async (req, res) => {
    const { userId, items, totalAmount, depositAmount, rentalAmount, paymentMethod, dueDate } = req.body;

    try {
        const order = await orderService.createOrder({ userId, items, totalAmount, depositAmount, rentalAmount, paymentMethod, dueDate });
        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => { //admin
    const { orderId, status } = req.body;

    try {
        const updatedOrder = await orderService.updateOrderStatus(orderId, status);
        res.status(200).json({ message: 'Order status updated', order: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllOrders = async (req, res) => { //admin
    try {
        const orders = await orderService.getAllOrders();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOrderByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const orders = await orderService.getOrderByUserId(userId);
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.cancelOrder = async (req, res) => {
    const { orderId } = req.body;
    try {
        const updatedOrder = await orderService.updateOrderStatus(orderId, 'Cancelled');
        res.status(200).json({ message: 'Cancel order successfully', order: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
