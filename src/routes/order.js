const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/getall', orderController.getAllOrders); //ad

router.get('/user/:userId', orderController.getOrderByUserId); //ad

router.get('/list', authMiddleware, orderController.getListOrder);

router.get('/:orderId',authMiddleware, orderController.getOrderByOrderId);


router.post('/create',authMiddleware, orderController.createOrder);

router.put('/update', orderController.updateOrderStatus); //ad

router.put('/cancel',authMiddleware, orderController.cancelOrder);

module.exports = router;
