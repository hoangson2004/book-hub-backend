const orderService = require('../services/order');

exports.createOrder = async (req, res) => {
    const { items, totalAmount, depositAmount, rentalAmount, paymentMethod, dueDate } = req.body;
    const userId = req.user.userId;
    try {
        const order = await orderService.createOrder({ userId, items, totalAmount, depositAmount, rentalAmount, paymentMethod, dueDate });
        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOrderByUserId = async (req, res) => { //ad
    const { userId } = req.params;
    try {
        const orders = await orderService.getOrderByUserId(userId);
        res.status(200).json(orders);
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

exports.getOrderByOrderId = async(req, res) => {
    const userId = req.user.userId;
    const orderId = req.params.orderId;
    try {
        const order = await orderService.getOrderByOrderId(userId,orderId);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getListOrder = async(req, res) => {
    const userId = req.user.userId;
    try {
        const listOrder = await orderService.getListOrder(userId);
        res.status(200).json(listOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.cancelOrder = async (req, res) => {
    const { orderId } = req.body;
    try {
        const updatedOrder = await orderService.updateOrderStatus(orderId, 'Cancelled');
        res.status(200).json({ message: 'Cancel order successfully', order: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
