const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  goodsId: {
    type: Number,
    required: true,
    unique: true
  },
  quantity: {
    type: Number,
    required: true,
  }
});

const Cart = mongoose.model('Cart', cartSchema);  
module.exports = Cart;
