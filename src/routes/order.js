const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order');
router.get('/getall', orderController.getAllOrders);

router.get('/:userId', orderController.getOrderByUserId);

router.post('/create', orderController.createOrder);

router.put('/update', orderController.updateOrderStatus);

module.exports = router;
