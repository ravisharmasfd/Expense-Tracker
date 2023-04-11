const Razorpay = require('razorpay');
const { payKeyId, payKeySecret } = require('../config/env');
const Order = require('../models/order');

const rzr = new Razorpay({
  key_id: payKeyId,
  key_secret: payKeySecret,
});
const createOrder = async (req, res) => {
    try {
      const user = req.user;
        rzr.orders.create({amount:3000,currency:"INR"},(error,order)=>{
            if(error){
                console.log(error);
                res.status(500).send(error);
                }
                else{
                    user.createOrder({orderId:order.id,status:'pending'}).then(()=>{
                        res.status(200).json({order , key_id : payKeyId});
                    })
                }
        })
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } 
const completeOrder =  async (req, res) => {
    try {
        const {orderId, payKeyId } = req.body;
        const odr = await Order.findOne({where:{orderId}});
        odr.orderId = orderId;
        odr.status = 'success'
        odr.save();
        req.user.premium = true;
        req.user.save();
        res.json({message:'success'})
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
 module.exports ={
    createOrder,
    completeOrder
 }