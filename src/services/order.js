const moment = require('moment');
const Order = require('../models/Order');
const OverdueService = require('./overdue');
const Coin = require('../models/Coin');
const { getBookById } = require('./book');

exports.getAllOrders = async () => { 
    try {
        const orders = await Order.find()
            .populate('userId', 'name email')
            .populate('items.bookId', 'title author');
        return orders;
    } catch (error) {
        throw new Error('Error fetching orders: ' + error.message);
    }
};

exports.getOrderByUserId = async (userId) => { 
    try {
        const orders = await Order.find({ userId })
            .populate('userId', 'name email')
            .populate('items.bookId', 'title author');
        return orders;
    } catch (error) {
        throw new Error('Error fetching orders by userId: ' + error.message);
    }
};

exports.getListOrder = async (userId) => {
    try {
        const orders = await Order.find({ userId }).select('_id status updatedAt'); 

        if (!orders || orders.length === 0) {
            throw new Error('No orders found');
        }
        return orders.map(order => ({
            orderId: order._id,
            status: order.status,
            updatedAt: order.updatedAt,
        }));
    } catch (error) {
        throw new Error('Error retrieving orders: ' + error.message);
    }
};

exports.getOrderByOrderId = async (userId, orderId) => {
  try {
    const order = await Order.findOne({ _id: orderId, userId });
    
    if (!order) {
      throw new Error('Order not found');
    }
    return order; 
  } catch (error) {
    throw new Error('Error retrieving order: ' + error.message);
  }
};


exports.createOrder = async ({ userId, items, paymentMethod, dueDate }) => {
    try {
        let totalDepositAmount = 0;
        let totalRentalAmount = 0;

        const itemDetails = await Promise.all(
            items.map(async (item) => {
                const book = await getBookById(item.bookId); 
                if (!book) {
                    throw new Error(`Book with id ${item.bookId} not found`);
                }

                const depositForItem = book.price * item.quantity;
                totalDepositAmount += depositForItem;

                const nowDate = moment();
                const dueDateMoment = moment(dueDate);

                const daysDifference = Math.floor(dueDateMoment.diff(nowDate, 'days', true)); 
                if (daysDifference <= 0) {
                    throw new Error(`Due date must be in the future. Invalid due date: ${dueDate}`);
                }

                const rentalForItem = book.price * 0.02 * daysDifference * item.quantity;
                totalRentalAmount += rentalForItem;

                return {
                    bookId: item.bookId,
                    quantity: item.quantity,
                    price: book.price,
                    depositForItem,
                    rentalForItem,
                };
            })
        );

        const totalAmount = totalDepositAmount + totalRentalAmount;

        let coin = await Coin.findOne({ userId });
        if (coin.balance < totalAmount) {
            throw new Error('Insufficient coin balance');
        }

        coin.balance -= totalAmount;
        await coin.save();

        const order = new Order({
            userId,
            items: itemDetails,
            totalAmount,
            depositAmount: totalDepositAmount,
            rentalAmount: totalRentalAmount,
            paymentMethod,
            status: 'Pending',
            dueDate,
        });

        await order.save();
        return order;
    } catch (error) {
        throw new Error('Error creating order: ' + error.message);
    }
};


exports.updateOrderStatus = async (orderId, status) => {
    try {
        const order = await Order.findById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        switch (status) {
            case 'Processing':
                if (order.status === 'Pending') {
                    order.status = 'Processing';
                    await order.save();
                    break;
                }
                throw new Error('Invalid status transition');

            case 'Completed':
                if (order.status === 'Processing') {
                    order.status = 'Completed';
                    await order.save();
                    break;
                }
                throw new Error('Invalid status transition');

            case 'Overdue':
                if (order.status === 'Completed') {
                    await OverdueService.createOverdueOrder(order);
                    order.status = 'Overdue';
                    await order.save();
                    break;
                }
                throw new Error('Invalid status transition');

            case 'Cancelled':
                if (order.status === 'Pending' || order.status === 'Processing') {

                    const coin = await Coin.findOne({ userId: order.userId });
                    if (!coin) {
                        throw new Error('Coin account not found for the user');
                    }

                    coin.balance += order.totalAmount;
                    await coin.save(); 
                    order.status = 'Cancelled';
                    await order.save();
                    break;
                }
                throw new Error('Invalid status transition');

            default:
                throw new Error('Unknown status');
        }

        return order;
    } catch (error) {
        throw new Error('Error updating order status: ' + error.message);
    }
};
