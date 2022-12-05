const express = require("express");
const router = express.Router();

const Goods = require('../schemas/goods.js');
const Cart = require("../schemas/cart");

router.get('/goods', async (req, res) => {
    const goods = await Goods.find({});

    if(goods.length === 0){
      res.status(400).json({
        "message" : "상품 목록 조회 실패",
      })
    }else{
    res.json(goods);
    }
})

router.get('/goods/:goodsId', async (req, res) => {
    const goods = await Goods.find({});
    const {goodsId} = req.params;
    
    let result = null;
    for(const good of goods){
      if(Number(goodsId) === good.goodsId){
        result = good;
      }
    }

    if(result === null){
      res.status(400).json({
        "result" : "없음",
      })
    }
    else{
      res.status(200).json({"detail": result});
    }
})

router.post("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;
  const { quantity } = req.body;

  const existsCarts = await Cart.find({ goodsId: Number(goodsId) });
  if (existsCarts.length) {
    return res.json({ 
      success: false, 
      errorMessage: "이미 장바구니에 존재하는 상품입니다." });
  }

  await Cart.create({ goodsId: Number(goodsId), quantity: quantity });

  res.json({ result: "success" });
});

router.put("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;
  const { quantity } = req.body;

  if (quantity < 1) {
    res.status(400).json({ errorMessage: "수량은 1 이상이어야 합니다." });
    return;
  }

  const existsCarts = await Cart.find({ goodsId: Number(goodsId) });
  if (existsCarts.length) {
    await Cart.updateOne({ goodsId: Number(goodsId) }, { $set: { quantity } });
  }

  res.json({ success: true });
});

router.delete("/goods/:goodsId/cart", async (req, res) => {
  const {goodsId} = req.params;

  const existsCarts = await Cart.find({goodsId});
  if(existsCarts.length){
    await Cart.deleteOne({goodsId});
  }
  res.json({result:"success"});
})

router.post("/goods", async (req, res) => {
  const {goodsId, name, thumbnailUrl, category, price} = req.body;

  const goods = await Goods.find({goodsId});
  
  if(goods.length){
    return res.status(400).json({
      success:false,
      errorMessage:"이미 존재하는 GoodsId입니다."
    });
  }
  
  const createdGoods = await Goods.create({goodsId, name, thumbnailUrl, category, price});

  res.json({goods : createdGoods});

})


router.get("/goods/cart", async(req, res) => {
  const carts = await Cart.find({});
  // [
  //  {goodsId, quantity}
  // ];
  const goodsIds = carts.map((cart) => {
      return cart.goodsId;
  })

  const goods = await Goods.find({goodsId: goodsIds});

  const results = carts.map((cart) => {
      return {
          "qunatity": cart.quantity,
          "goods": goods.find((item) => item.goodsId === cart.goodsId),
      }
  })

  res.json({
      "carts": results,
  })
})


module.exports = router;